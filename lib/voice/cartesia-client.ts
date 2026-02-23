/**
 * Cartesia Browser Client
 *
 * Uses the official @cartesia/cartesia-js SDK for STT (WebSocket)
 * and TTS (SSE streaming). Handles microphone capture via AudioWorklet.
 */

import { CartesiaClient } from '@cartesia/cartesia-js';
import type { VoiceConnectionState } from './types';

// -- Types --

export type CartesiaClientCallbacks = {
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onConnectionStateChange: (state: VoiceConnectionState) => void;
  onError: (error: Error) => void;
};

const STT_SAMPLE_RATE = 16000;
const TTS_SAMPLE_RATE = 24000;
const DEFAULT_VOICE_ID = '87748186-23bb-4158-a1eb-332911b0b708'; // Cartesia "Barbershop Man"

// PCM audio worklet processor code (inlined to avoid separate file)
const PCM_WORKLET_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    for (let i = 0; i < channelData.length; i++) {
      this.buffer[this.writeIndex++] = channelData[i];
      if (this.writeIndex >= this.bufferSize) {
        // Convert float32 to int16 PCM
        const pcm16 = new Int16Array(this.bufferSize);
        for (let j = 0; j < this.bufferSize; j++) {
          const s = Math.max(-1, Math.min(1, this.buffer[j]));
          pcm16[j] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
        this.buffer = new Float32Array(this.bufferSize);
        this.writeIndex = 0;
      }
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

export class CartesiaVoiceClient {
  private cartesia: CartesiaClient;
  private callbacks: CartesiaClientCallbacks;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private ttsAudioContext: AudioContext | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sttWs: any = null;
  private workletNode: AudioWorkletNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private currentState: VoiceConnectionState = 'disconnected';
  private isSpeaking = false;
  private ttsSourceNodes: AudioBufferSourceNode[] = [];
  private ttsScheduledTime = 0;

  constructor(apiKey: string, callbacks: CartesiaClientCallbacks) {
    this.cartesia = new CartesiaClient({ apiKey });
    this.callbacks = callbacks;
  }

  async connect(): Promise<void> {
    try {
      this.setState('connecting');

      // 1. Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: STT_SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 2. Create AudioContext for mic capture
      this.audioContext = new AudioContext({ sampleRate: STT_SAMPLE_RATE });

      // Create AnalyserNode for visualization
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Create source from mic
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyserNode);

      // 3. Register and create AudioWorklet for PCM conversion
      const workletBlob = new Blob([PCM_WORKLET_CODE], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(workletBlob);
      await this.audioContext.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);

      this.workletNode = new AudioWorkletNode(this.audioContext, 'pcm-processor');
      this.sourceNode.connect(this.workletNode);

      // 4. Create STT WebSocket via Cartesia SDK
      this.sttWs = this.cartesia.stt.websocket({
        model: 'ink-whisper',
        language: 'en',
        encoding: 'pcm_s16le',
        sampleRate: STT_SAMPLE_RATE,
        minVolume: 0.1,
        maxSilenceDurationSecs: 1.5,
      });

      // 5. Set up STT message handler
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.sttWs.onMessage((result: any) => {
        if (result.type === 'transcript') {
          const text = result.text || '';
          if (!text) return;

          if (result.isFinal) {
            this.callbacks.onFinalTranscript(text);
          } else {
            this.callbacks.onInterimTranscript(text);
          }
        } else if (result.type === 'error') {
          this.callbacks.onError(new Error(`STT: ${result.message || 'Unknown error'}`));
        }
      });

      // 6. Stream mic audio to STT via SDK
      this.workletNode.port.onmessage = (event: MessageEvent) => {
        if (this.sttWs) {
          this.sttWs.send(event.data as ArrayBuffer).catch((err: Error) => {
            console.error('[CartesiaVoiceClient] STT send error:', err);
          });
        }
      };

      // 7. Create separate AudioContext for TTS playback
      this.ttsAudioContext = new AudioContext({ sampleRate: TTS_SAMPLE_RATE });
      // Resume in case browser suspended it (needs user gesture — we're in a click handler)
      if (this.ttsAudioContext.state === 'suspended') {
        await this.ttsAudioContext.resume();
      }

      this.setState('connected');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.callbacks.onError(new Error('Microphone permission denied. Please allow microphone access.'));
      } else {
        this.callbacks.onError(error);
      }
      this.setState('error');
      this.disconnect();
    }
  }

  disconnect(): void {
    this.stopSpeaking();

    if (this.workletNode) {
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    this.analyserNode = null;

    // Disconnect STT via SDK
    if (this.sttWs) {
      try {
        this.sttWs.disconnect();
      } catch {
        // Already disconnected
      }
      this.sttWs = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.ttsAudioContext) {
      this.ttsAudioContext.close();
      this.ttsAudioContext = null;
    }

    this.setState('disconnected');
  }

  /**
   * Speak text using Cartesia TTS via SSE streaming.
   * Streams audio chunks for low time-to-first-byte (conversational feel).
   */
  async speak(text: string, voiceId?: string): Promise<void> {
    this.stopSpeaking();
    this.isSpeaking = true;
    this.setState('speaking');
    this.ttsScheduledTime = 0;

    // Resume TTS audio context if suspended
    if (this.ttsAudioContext?.state === 'suspended') {
      await this.ttsAudioContext.resume();
    }

    try {
      const stream = await this.cartesia.tts.sse({
        modelId: 'sonic',
        transcript: text,
        voice: {
          mode: 'id',
          id: voiceId ?? DEFAULT_VOICE_ID,
        },
        language: 'en',
        outputFormat: {
          container: 'raw',
          encoding: 'pcm_f32le',
          sampleRate: TTS_SAMPLE_RATE,
        },
      });

      for await (const chunk of stream) {
        if (!this.isSpeaking) break;

        if (chunk.type === 'chunk' && chunk.data) {
          this.playTTSChunk(chunk.data);
        } else if (chunk.type === 'done') {
          break;
        } else if (chunk.type === 'error') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.callbacks.onError(new Error(`TTS: ${(chunk as any).message || 'Unknown error'}`));
          break;
        }
      }

      // Wait for all scheduled audio to finish playing
      if (this.ttsAudioContext && this.ttsScheduledTime > this.ttsAudioContext.currentTime) {
        const remainingMs = (this.ttsScheduledTime - this.ttsAudioContext.currentTime) * 1000;
        await new Promise((resolve) => setTimeout(resolve, remainingMs + 50));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.callbacks.onError(error);
    } finally {
      this.isSpeaking = false;
      if (this.currentState === 'speaking') {
        this.setState('connected');
      }
    }
  }

  stopSpeaking(): void {
    this.isSpeaking = false;

    // Stop all scheduled audio sources
    for (const node of this.ttsSourceNodes) {
      try {
        node.stop();
      } catch {
        // Already stopped
      }
    }
    this.ttsSourceNodes = [];
    this.ttsScheduledTime = 0;

    if (this.currentState === 'speaking') {
      this.setState('connected');
    }
  }

  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  // -- Private Methods --

  private setState(state: VoiceConnectionState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      this.callbacks.onConnectionStateChange(state);
    }
  }

  private playTTSChunk(base64Data: string): void {
    if (!this.ttsAudioContext || !this.isSpeaking) return;

    // Decode base64 to Float32Array (pcm_f32le)
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const float32 = new Float32Array(bytes.buffer);

    // Create AudioBuffer
    const audioBuffer = this.ttsAudioContext.createBuffer(1, float32.length, TTS_SAMPLE_RATE);
    audioBuffer.copyToChannel(float32, 0);

    // Schedule playback — gapless by tracking scheduled end time
    const sourceNode = this.ttsAudioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.ttsAudioContext.destination);

    const currentTime = this.ttsAudioContext.currentTime;
    const startTime = Math.max(currentTime, this.ttsScheduledTime);
    sourceNode.start(startTime);
    this.ttsScheduledTime = startTime + audioBuffer.duration;

    this.ttsSourceNodes.push(sourceNode);

    // Clean up finished source nodes
    sourceNode.onended = () => {
      const idx = this.ttsSourceNodes.indexOf(sourceNode);
      if (idx !== -1) {
        this.ttsSourceNodes.splice(idx, 1);
      }
    };
  }
}
