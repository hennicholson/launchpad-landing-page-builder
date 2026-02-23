/**
 * OpenAI Realtime API Client (WebRTC)
 *
 * Connects to OpenAI's Realtime API via WebRTC for low-latency
 * bidirectional audio. Supports push-to-talk, function calling,
 * and audio playback through the browser.
 *
 * Architecture:
 *  - RTCPeerConnection handles audio transport (mic → OpenAI, OpenAI → speaker)
 *  - RTCDataChannel handles events (session config, function calls, etc.)
 *  - Push-to-talk: clear buffer on press, commit + response.create on release
 */

import type { VoiceConnectionState } from './types';
import type { RealtimeTool } from './tool-schemas';

const REALTIME_MODEL = 'gpt-realtime-mini';
const REALTIME_VOICE = 'verse';

// -- Types --

export type RealtimeUsageReport = {
  inputAudioTokens: number;
  outputAudioTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
  totalTokens: number;
};

export type RealtimeClientCallbacks = {
  onConnectionStateChange: (state: VoiceConnectionState) => void;
  onTranscriptDelta: (delta: string, isFinal: boolean) => void;
  onAudioTranscriptDelta: (delta: string) => void;
  onResponseAudioTranscript: (transcript: string) => void;
  onFunctionCall: (callId: string, name: string, args: Record<string, unknown>) => void;
  onUsageReport?: (usage: RealtimeUsageReport) => void;
  onError: (error: Error) => void;
};

// -- Client --

export class RealtimeClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private mediaStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private analyserNode: AnalyserNode | null = null;
  private analyserContext: AudioContext | null = null;
  private callbacks: RealtimeClientCallbacks;
  private currentState: VoiceConnectionState = 'disconnected';
  private sessionReady = false;
  private pendingSessionUpdate: string | null = null;

  constructor(callbacks: RealtimeClientCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Connect to OpenAI Realtime API via WebRTC.
   * @param ephemeralKey - Short-lived token from /api/voice/token
   */
  async connect(ephemeralKey: string): Promise<void> {
    try {
      this.setState('connecting');

      // 1. Create RTCPeerConnection
      this.pc = new RTCPeerConnection();

      // 2. Set up remote audio playback (TTS from OpenAI)
      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;
      this.pc.ontrack = (event) => {
        if (this.audioElement) {
          this.audioElement.srcObject = event.streams[0];
        }
      };

      // 3. Get microphone audio
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Add mic track to peer connection
      const audioTrack = this.mediaStream.getTracks()[0];
      this.pc.addTrack(audioTrack, this.mediaStream);

      // 4. Create AnalyserNode for mic visualization
      this.analyserContext = new AudioContext();
      const source = this.analyserContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.analyserContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.8;
      source.connect(this.analyserNode);

      // 5. Create data channel for Realtime API events
      this.dc = this.pc.createDataChannel('oai-events');
      this.setupDataChannel(this.dc);

      // 6. SDP negotiation
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`,
        {
          method: 'POST',
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp',
          },
        }
      );

      if (!sdpResponse.ok) {
        const text = await sdpResponse.text().catch(() => '');
        throw new Error(`Realtime API SDP error: ${sdpResponse.status} ${text}`);
      }

      const answerSdp = await sdpResponse.text();
      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      // Connection established — session.update will be sent when data channel opens
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.callbacks.onError(
          new Error('Microphone permission denied. Please allow microphone access.')
        );
      } else {
        this.callbacks.onError(error);
      }
      this.setState('error');
      this.disconnect();
    }
  }

  /**
   * Disconnect and clean up all resources.
   */
  disconnect(): void {
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }

    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.audioElement) {
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    if (this.analyserContext) {
      this.analyserContext.close();
      this.analyserContext = null;
    }
    this.analyserNode = null;

    this.sessionReady = false;
    this.pendingSessionUpdate = null;
    this.setState('disconnected');
  }

  /**
   * Push-to-talk: user pressed the mic button.
   * Clears the audio buffer so only fresh speech is captured.
   */
  startSpeaking(): void {
    if (!this.dc || this.dc.readyState !== 'open') return;
    this.sendEvent({ type: 'input_audio_buffer.clear' });
    this.setState('listening');
  }

  /**
   * Push-to-talk: user released the mic button.
   * Commits the audio buffer and requests a response.
   */
  stopSpeaking(): void {
    if (!this.dc || this.dc.readyState !== 'open') return;
    this.sendEvent({ type: 'input_audio_buffer.commit' });
    this.sendEvent({ type: 'response.create' });
    this.setState('processing');
  }

  /**
   * Initial session configuration — called ONCE on connect.
   * Sends full config including tools (which never change during a session).
   */
  configureSession(instructions: string, tools: RealtimeTool[]): void {
    const event = JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions,
        voice: REALTIME_VOICE,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: null, // push-to-talk
        tools,
        tool_choice: 'auto',
      },
    });

    if (this.sessionReady && this.dc?.readyState === 'open') {
      this.dc.send(event);
    } else {
      // Queue for when data channel opens
      this.pendingSessionUpdate = event;
    }
  }

  /**
   * Update only the instructions (context). Does NOT re-send tools.
   * OpenAI's session.update does partial merges — omitted fields are preserved.
   */
  updateInstructions(instructions: string): void {
    const event = JSON.stringify({
      type: 'session.update',
      session: { instructions },
    });

    if (this.sessionReady && this.dc?.readyState === 'open') {
      this.dc.send(event);
    }
    // Don't queue instruction-only updates — latest context wins on next configureSession
  }

  /**
   * Send function call result back to the model and request continuation.
   */
  sendFunctionResult(callId: string, output: string): void {
    if (!this.dc || this.dc.readyState !== 'open') return;

    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output,
      },
    });
    this.sendEvent({ type: 'response.create' });
  }

  /**
   * Get the AnalyserNode for mic audio visualization.
   */
  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  // -- Private --

  private setState(state: VoiceConnectionState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      this.callbacks.onConnectionStateChange(state);
    }
  }

  private sendEvent(event: Record<string, unknown>): void {
    if (this.dc && this.dc.readyState === 'open') {
      this.dc.send(JSON.stringify(event));
    }
  }

  private setupDataChannel(dc: RTCDataChannel): void {
    dc.addEventListener('open', () => {
      this.sessionReady = true;
      this.setState('connected');

      // Send any queued session update
      if (this.pendingSessionUpdate) {
        dc.send(this.pendingSessionUpdate);
        this.pendingSessionUpdate = null;
      }
    });

    dc.addEventListener('close', () => {
      this.sessionReady = false;
      if (this.currentState !== 'disconnected') {
        this.setState('disconnected');
      }
    });

    dc.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleServerEvent(data);
      } catch {
        // Ignore non-JSON messages
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleServerEvent(event: any): void {
    switch (event.type) {
      case 'session.created':
        console.log('[RealtimeClient] Session created');
        break;

      case 'session.updated':
        console.log('[RealtimeClient] Session updated — tools:', event.session?.tools?.length ?? 0);
        break;

      case 'input_audio_buffer.speech_started':
        this.setState('listening');
        break;

      case 'input_audio_buffer.speech_stopped':
        break;

      case 'input_audio_buffer.committed':
        this.setState('processing');
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // User's speech transcribed
        if (event.transcript) {
          this.callbacks.onTranscriptDelta(event.transcript, true);
        }
        break;

      case 'response.audio_transcript.delta':
        // AI's speech text (streaming)
        if (event.delta) {
          this.callbacks.onAudioTranscriptDelta(event.delta);
        }
        break;

      case 'response.audio_transcript.done':
        // AI finished speaking — full transcript
        if (event.transcript) {
          this.callbacks.onResponseAudioTranscript(event.transcript);
        }
        break;

      case 'response.audio.delta':
        // Audio is playing via WebRTC — no manual handling needed
        break;

      case 'response.function_call_arguments.done':
        // Function call completed — execute it
        if (event.call_id && event.name) {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(event.arguments || '{}');
          } catch {
            args = {};
          }
          this.callbacks.onFunctionCall(event.call_id, event.name, args);
        }
        break;

      case 'response.done': {
        // Response complete — extract token usage for cost tracking
        if (this.currentState !== 'disconnected') {
          this.setState('connected');
        }
        const usage = event.response?.usage;
        if (usage && this.callbacks.onUsageReport) {
          this.callbacks.onUsageReport({
            inputAudioTokens: usage.input_token_details?.audio_tokens || 0,
            outputAudioTokens: usage.output_token_details?.audio_tokens || 0,
            inputTextTokens: usage.input_token_details?.text_tokens || 0,
            outputTextTokens: usage.output_token_details?.text_tokens || 0,
            totalTokens: usage.total_tokens || 0,
          });
        }
        break;
      }

      case 'response.output_item.done':
        // Individual output item done
        break;

      case 'error':
        this.callbacks.onError(
          new Error(event.error?.message || 'Realtime API error')
        );
        break;

      default:
        // Ignore other events (rate_limits.updated, response.created, etc.)
        break;
    }
  }
}
