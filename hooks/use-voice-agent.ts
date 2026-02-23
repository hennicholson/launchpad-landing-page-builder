/**
 * useVoiceAgent Hook — OpenAI Realtime API + Push-to-Talk
 *
 * Composes RealtimeClient + context-builder + command-executor
 * into a single React hook for the voice agent.
 *
 * Cost-optimized: tools sent once on connect, instructions-only
 * updates on context changes (diff-checked, 3s debounce).
 *
 * Pipeline:
 *   press mic / hold space → speak → release → Realtime API → function calls → execute → TTS response
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/lib/store';
import { RealtimeClient, type RealtimeUsageReport } from '@/lib/voice/realtime-client';
import { buildVoiceContext } from '@/lib/voice/context-builder';
import { executeVoiceCommand } from '@/lib/voice/command-executor';
import { functionCallToVoiceCommand, VOICE_TOOLS } from '@/lib/voice/tool-schemas';
import type { VoiceExecutorStore } from '@/lib/voice/command-executor';
import type { VoiceConnectionState } from '@/lib/voice/types';

type VoiceAgentState = {
  connectionState: VoiceConnectionState;
  transcript: string;
  aiTranscript: string;
  isEnabled: boolean;
  isSpeaking: boolean;
  error: string | null;
  voiceEditedSectionId: string | null;
};

type VoiceAgentActions = {
  toggle: () => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  startSpeaking: () => void;
  stopSpeaking: () => void;
  getAnalyserNode: () => AnalyserNode | null;
};

/**
 * Build the session instructions string with current editor context.
 */
function buildInstructions(contextString: string): string {
  return `You are the voice assistant for the LaunchPad landing page editor. You help users build and edit their landing pages using voice commands.

PERSONALITY:
- Be brief and conversational. Keep responses to 1-5 words for simple actions.
- Vary your acknowledgments: "Done!", "Got it!", "Changed!", "Check it out", "Updated!", "There you go", "All set", "On it"
- For questions or ambiguity, give concise helpful answers (1-2 sentences max).
- Sound natural and friendly, like a helpful co-pilot.

RULES:
- Use the available tools to make edits. Never describe what you would do — just do it.
- If the user says multiple things ("make it bigger and blue"), call multiple tools.
- If you can't determine intent, ask a short clarifying question.
- Default to the selected section when a specific section isn't mentioned.
- Reference sections by their heading or type when talking to the user.
- Section text/media/colors/buttons/padding → update_section_content. Variants/spacing → update_section_layout. Element props → update_element_content.

COLORS: red=#ef4444 blue=#3b82f6 green=#22c55e yellow=#eab308 purple=#a855f7 pink=#ec4899 orange=#f97316 teal=#14b8a6 cyan=#06b6d4 indigo=#6366f1 white=#fff black=#000 gray=#6b7280 dark=#1f2937

${contextString}`;
}

/**
 * Serialize the current editor state into a context string for the LLM.
 * Kept minimal: only selected section + neighbors, conditional items.
 */
function buildContextString(store: ReturnType<typeof useEditorStore.getState>): string {
  const ctx = buildVoiceContext({
    page: store.page,
    selectedSectionId: store.selectedSectionId,
    selectedElementIds: store.selectedElementIds,
    selectedItemId: store.selectedItemId,
    currentEditingBreakpoint: store.currentEditingBreakpoint,
  });

  const sections = ctx.sectionList || [];
  const selectedType = ctx.selectedSection?.type || 'none';
  const variant = ctx.selectedSection?.variant;
  const elementIds = ctx.selectedElementIds || [];

  // Build items context only when section has items
  let itemsContext = '';
  if (ctx.sectionItems && ctx.sectionItems.length > 0) {
    const itemsList = ctx.sectionItems
      .map((item, i) => {
        const label = item.title || item.name || item.price || `Item ${i + 1}`;
        return `  ${item.id}: "${label}"`;
      })
      .join('\n');
    itemsContext = `\nItems (${ctx.sectionItems.length}):\n${itemsList}`;
  }

  // Build selected item detail
  let selectedItemContext = '';
  if (ctx.selectedItem) {
    const fields = Object.entries(ctx.selectedItem)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}="${v}"`)
      .join(', ');
    selectedItemContext = `\nSel item: ${ctx.selectedItemId} (${fields})`;
  }

  return `STATE:
Sel: ${ctx.selectedSectionId || 'none'} (${selectedType}${variant ? ':' + variant : ''})
El: ${elementIds.length > 0 ? elementIds.join(', ') : 'none'}${ctx.selectedElement ? ` (${ctx.selectedElement.type})` : ''}
Item: ${ctx.selectedItemId || 'none'}${selectedItemContext}${itemsContext}
Sections: ${sections.map((s) => `${s.id}:${s.type}${s.heading ? ` ("${s.heading}")` : ''}`).join(', ') || 'none'}
Colors: ${ctx.colorScheme.primary} ${ctx.colorScheme.secondary} ${ctx.colorScheme.accent} bg=${ctx.colorScheme.background} txt=${ctx.colorScheme.text}
Fonts: ${ctx.typography.headingFont}/${ctx.typography.bodyFont}
BP: ${ctx.currentBreakpoint || 'desktop'}`;
}

export function useVoiceAgent(): VoiceAgentState & VoiceAgentActions {
  const [connectionState, setConnectionState] = useState<VoiceConnectionState>('disconnected');
  const [transcript, setTranscript] = useState('');
  const [aiTranscript, setAiTranscript] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceEditedSectionId, setVoiceEditedSectionId] = useState<string | null>(null);

  const clientRef = useRef<RealtimeClient | null>(null);
  const aiTranscriptBufferRef = useRef('');
  const lastInstructionsRef = useRef('');
  const sparkleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Session tracking for cost reporting
  const sessionIdRef = useRef<string | null>(null);
  const sessionStartRef = useRef<number>(0);
  const commandCountRef = useRef<number>(0);
  const usageAccumulatorRef = useRef<RealtimeUsageReport>({
    inputAudioTokens: 0,
    outputAudioTokens: 0,
    inputTextTokens: 0,
    outputTextTokens: 0,
    totalTokens: 0,
  });

  // Stable ref to the store — always read current state in callbacks
  const storeRef = useRef(useEditorStore.getState());
  useEffect(() => {
    return useEditorStore.subscribe((state) => {
      storeRef.current = state;
    });
  }, []);

  /**
   * Handle function calls from the Realtime API.
   * Execute the command against the store and send the result back.
   * No session update here — the debounced subscription handles context sync.
   */
  const handleFunctionCall = useCallback(
    (callId: string, name: string, args: Record<string, unknown>) => {
      const client = clientRef.current;
      if (!client) return;

      try {
        const voiceCommand = functionCallToVoiceCommand(name, args);
        const currentStore = storeRef.current as unknown as VoiceExecutorStore;
        const result = executeVoiceCommand(voiceCommand, currentStore);

        client.sendFunctionResult(
          callId,
          JSON.stringify({ success: result.success, error: result.error })
        );

        // Track command count for session reporting
        commandCountRef.current++;

        // Trigger sparkle effect on the affected section
        if (result.success) {
          const sectionId = voiceCommand.target?.sectionId || storeRef.current.selectedSectionId;
          if (sectionId) {
            if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
            setVoiceEditedSectionId(sectionId);
            sparkleTimerRef.current = setTimeout(() => setVoiceEditedSectionId(null), 800);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        client.sendFunctionResult(callId, JSON.stringify({ success: false, error: message }));
      }
    },
    []
  );

  /**
   * Connect to the OpenAI Realtime API.
   */
  const connect = useCallback(async () => {
    if (clientRef.current) return;

    setError(null);

    // 1. Get ephemeral key from server (also starts a tracked session)
    let ephemeralKey: string;
    try {
      const res = await fetch('/api/voice/token', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Token API returned ${res.status}`);
      }
      const data = await res.json();
      ephemeralKey = data.ephemeralKey;
      if (!ephemeralKey) {
        throw new Error('No ephemeral key returned');
      }
      // Store session tracking info
      sessionIdRef.current = data.sessionId || null;
      sessionStartRef.current = Date.now();
      commandCountRef.current = 0;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setConnectionState('error');
      return;
    }

    // 2. Create client
    const client = new RealtimeClient({
      onConnectionStateChange: (state) => {
        setConnectionState(state);
      },
      onTranscriptDelta: (text) => {
        setTranscript(text);
      },
      onAudioTranscriptDelta: (delta) => {
        aiTranscriptBufferRef.current += delta;
        setAiTranscript(aiTranscriptBufferRef.current);
      },
      onResponseAudioTranscript: (fullText) => {
        aiTranscriptBufferRef.current = '';
        setAiTranscript(fullText);
      },
      onFunctionCall: handleFunctionCall,
      onUsageReport: (usage) => {
        // Accumulate token usage across all response.done events
        const acc = usageAccumulatorRef.current;
        acc.inputAudioTokens += usage.inputAudioTokens;
        acc.outputAudioTokens += usage.outputAudioTokens;
        acc.inputTextTokens += usage.inputTextTokens;
        acc.outputTextTokens += usage.outputTextTokens;
        acc.totalTokens += usage.totalTokens;
      },
      onError: (err) => {
        setError(err.message);
        console.error('[useVoiceAgent] Realtime error:', err.message);
      },
    });

    clientRef.current = client;
    setIsEnabled(true);

    // 3. Connect
    await client.connect(ephemeralKey);

    // 4. Configure session ONCE with tools + initial context
    const contextString = buildContextString(storeRef.current);
    const instructions = buildInstructions(contextString);
    lastInstructionsRef.current = instructions;
    client.configureSession(instructions, VOICE_TOOLS);

    setError(null);
  }, [handleFunctionCall]);

  /**
   * Disconnect from the voice service.
   */
  const disconnect = useCallback(() => {
    // Report session end for cost tracking with actual token data
    // Use sendBeacon so it survives page unload / component unmount
    if (sessionIdRef.current && sessionStartRef.current > 0) {
      const durationSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
      const acc = usageAccumulatorRef.current;
      const payload = JSON.stringify({
        sessionId: sessionIdRef.current,
        durationSeconds,
        commandCount: commandCountRef.current,
        inputAudioTokens: acc.inputAudioTokens,
        outputAudioTokens: acc.outputAudioTokens,
        inputTextTokens: acc.inputTextTokens,
        outputTextTokens: acc.outputTextTokens,
      });
      const sent = navigator.sendBeacon('/api/voice/session', new Blob([payload], { type: 'application/json' }));
      if (!sent) {
        fetch('/api/voice/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    }

    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setIsEnabled(false);
    setIsSpeaking(false);
    setTranscript('');
    setAiTranscript('');
    setConnectionState('disconnected');
    setError(null);
    setVoiceEditedSectionId(null);
    aiTranscriptBufferRef.current = '';
    lastInstructionsRef.current = '';
    sessionIdRef.current = null;
    sessionStartRef.current = 0;
    commandCountRef.current = 0;
    usageAccumulatorRef.current = { inputAudioTokens: 0, outputAudioTokens: 0, inputTextTokens: 0, outputTextTokens: 0, totalTokens: 0 };
    if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
  }, []);

  /**
   * Toggle voice agent on/off.
   */
  const toggle = useCallback(() => {
    if (isEnabled) {
      disconnect();
    } else {
      connect();
    }
  }, [isEnabled, connect, disconnect]);

  /**
   * Push-to-talk: start speaking.
   */
  const startSpeaking = useCallback(() => {
    if (!clientRef.current) return;
    setIsSpeaking(true);
    setTranscript('');
    aiTranscriptBufferRef.current = '';
    setAiTranscript('');
    clientRef.current.startSpeaking();
  }, []);

  /**
   * Push-to-talk: stop speaking.
   */
  const stopSpeaking = useCallback(() => {
    if (!clientRef.current) return;
    setIsSpeaking(false);
    clientRef.current.stopSpeaking();
  }, []);

  /**
   * Get the AnalyserNode for audio visualization.
   */
  const getAnalyserNode = useCallback((): AnalyserNode | null => {
    return clientRef.current?.getAnalyserNode() ?? null;
  }, []);

  // Spacebar push-to-talk keybind
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in text inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        startSpeaking();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;

      if (e.code === 'Space') {
        e.preventDefault();
        stopSpeaking();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEnabled, startSpeaking, stopSpeaking]);

  // Update session context when editor state changes (debounced, diff-checked)
  useEffect(() => {
    if (!isEnabled) return;

    let timeout: ReturnType<typeof setTimeout>;
    const unsubscribe = useEditorStore.subscribe(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (clientRef.current) {
          const contextString = buildContextString(storeRef.current);
          const instructions = buildInstructions(contextString);
          // Only send if instructions actually changed
          if (instructions !== lastInstructionsRef.current) {
            lastInstructionsRef.current = instructions;
            clientRef.current.updateInstructions(instructions);
          }
        }
      }, 3000); // 3s debounce — user speaks after editing, not during
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [isEnabled]);

  // Cleanup on unmount — report session via sendBeacon before teardown
  useEffect(() => {
    return () => {
      if (sessionIdRef.current && sessionStartRef.current > 0) {
        const durationSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
        const acc = usageAccumulatorRef.current;
        navigator.sendBeacon(
          '/api/voice/session',
          new Blob(
            [JSON.stringify({
              sessionId: sessionIdRef.current,
              durationSeconds,
              commandCount: commandCountRef.current,
              inputAudioTokens: acc.inputAudioTokens,
              outputAudioTokens: acc.outputAudioTokens,
              inputTextTokens: acc.inputTextTokens,
              outputTextTokens: acc.outputTextTokens,
            })],
            { type: 'application/json' }
          )
        );
      }
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
      if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
    };
  }, []);

  return {
    connectionState,
    transcript,
    aiTranscript,
    isEnabled,
    isSpeaking,
    error,
    voiceEditedSectionId,
    toggle,
    connect,
    disconnect,
    startSpeaking,
    stopSpeaking,
    getAnalyserNode,
  };
}
