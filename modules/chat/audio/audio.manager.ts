import { decode, decodeAudioData } from "../../../core/utils";

class AudioManager {
  private ctx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Interrompe qualquer áudio que esteja sendo reproduzido no momento.
   */
  stopAll() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // Silencioso se já estiver parado
      }
      this.currentSource = null;
    }
  }

  async playSync(base64Audio: string): Promise<void> {
    // Cancela áudio anterior antes de iniciar o novo
    this.stopAll();

    try {
      const ctx = this.initCtx();
      const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      this.currentSource = source;
      
      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
        }
      };

      source.start(0);
    } catch (e) {
      console.error("Erro na reprodução sincronizada:", e);
    }
  }

  // Pre-warms the audio context to avoid first-play delay
  warmup() {
    this.initCtx();
  }
}

export const mimiAudio = new AudioManager();
