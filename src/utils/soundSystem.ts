/**
 * Warm, soft, strictly throttled Web Audio API synthesizer.
 * Zero rapid/continuous scroll ticking: every harmonic sound enforces a strict cooldown
 * and uses soft sine/triangle envelopes with gentle low-pass warmth.
 */

const SOUND_STORAGE_KEY = 'israa-portfolio-sound-enabled';

class PortfolioSoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = true;
  private unlocked = false;
  private listeners = new Set<(enabled: boolean) => void>();
  private lastPlayMap = new Map<string, number>();

  constructor() {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved === 'false') {
        this.enabled = false;
      }
    } catch {
      // Ignore storage errors
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));
    } catch {
      // Ignore storage errors
    }

    if (!next && this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    } else if (next) {
      this.unlock();
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.28, this.ctx.currentTime, 0.04);
      }
    }
    this.listeners.forEach((fn) => fn(next));
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public unlock(): void {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.enabled ? 0.28 : 0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended' && this.enabled) {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  private canPlay(key: string, cooldownMs = 260): boolean {
    if (!this.enabled) return false;
    if (!this.ctx || !this.masterGain || !this.unlocked) return false;
    if (this.ctx.state !== 'running') return false;

    const now = performance.now();
    const prev = this.lastPlayMap.get(key) ?? 0;
    if (now - prev < cooldownMs) return false;
    this.lastPlayMap.set(key, now);
    return true;
  }

  private playWarmBell(
    freq: number,
    duration = 0.5,
    options: { gain?: number; delay?: number; type?: OscillatorType } = {},
  ): void {
    if (!this.ctx || !this.masterGain || !this.enabled) return;
    const { gain = 0.14, delay = 0, type = 'sine' } = options;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(gain, now + 0.035);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  /** Warm two-note chime when lantern cord is pulled */
  public lanternPull(): void {
    this.unlock();
    if (!this.canPlay('lanternPull', 500)) return;
    this.playWarmBell(523.25, 0.55, { gain: 0.16, type: 'triangle' });
    this.playWarmBell(659.25, 0.85, { gain: 0.18, delay: 0.16 });
  }

  /** Very soft gentle keystroke whisper during Hero typewriter (strictly throttled >= 160ms) */
  public typewriterTick(): void {
    if (!this.canPlay('typewriter', 160)) return;
    const pitch = 540 + (Math.random() * 24 - 12);
    this.playWarmBell(pitch, 0.06, { gain: 0.04, type: 'sine' });
  }

  /** Soft harmonic pop when Hero finishes revealing / name lands */
  public nameLand(): void {
    if (!this.canPlay('nameLand', 600)) return;
    this.playWarmBell(587.33, 0.35, { gain: 0.11 });
    this.playWarmBell(880, 0.45, { gain: 0.08, delay: 0.08 });
  }

  /** Soft warm breeze swell when Journey wave rises */
  public waveRise(): void {
    if (!this.canPlay('waveRise', 1200)) return;
    this.playWarmBell(329.63, 0.65, { gain: 0.08 });
  }

  /** Gentle harmonic pluck per Journey beat */
  public journeyBeat(index: number): void {
    if (!this.canPlay(`journeyBeat-${index}`, 900)) return;
    const notes = [392.0, 440.0, 493.88];
    this.playWarmBell(notes[index % notes.length], 0.45, { gain: 0.1 });
  }

  /** Soft pen-on-paper swish for scratches (strictly once per stroke) */
  public scratchBurst(strokeIndex: number): void {
    if (!this.canPlay(`scratch-${strokeIndex}`, 900) || !this.ctx || !this.masterGain) return;
    const dur = 0.18;
    const now = this.ctx.currentTime;
    const sampleCount = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, sampleCount, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2100 + strokeIndex * 350, now);
    filter.Q.setValueAtTime(3.0, now);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.09, now + 0.025);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    src.start(now);
    src.stop(now + dur + 0.02);
  }

  /** Glass chime once per station entry */
  public stationBloom(stationIndex: number): void {
    if (!this.canPlay(`station-${stationIndex}`, 1100)) return;
    const scale = [523.25, 587.33, 659.25, 783.99];
    this.playWarmBell(scale[stationIndex % scale.length], 0.65, { gain: 0.12 });
  }

  /** Soft paper note unfold sound */
  public popupRustle(): void {
    if (!this.canPlay('popupRustle', 350)) return;
    this.playWarmBell(440, 0.25, { gain: 0.07 });
  }

  /** Soft marimba chord when glowing pieces shimmer into skills pocket */
  public piecePocket(stationIndex: number): void {
    if (!this.canPlay(`pocket-${stationIndex}`, 1000)) return;
    const base = [440, 493.88, 523.25, 587.33][stationIndex % 4];
    this.playWarmBell(base, 0.36, { gain: 0.09, type: 'triangle' });
    this.playWarmBell(base * 1.5, 0.42, { gain: 0.07, delay: 0.09 });
  }

  /** Ascending warm arpeggio when 4 pieces unite into my skills */
  public skillComplete(): void {
    if (!this.canPlay('skillComplete', 1400)) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, idx) => {
      this.playWarmBell(f, 0.55, { gain: 0.1, delay: idx * 0.09 });
    });
  }

  /** Soft shimmer when my skills burst reveals the skills slide */
  public burstShimmer(): void {
    if (!this.canPlay('burstShimmer', 1400)) return;
    this.playWarmBell(880, 0.65, { gain: 0.09 });
    this.playWarmBell(1174.66, 0.75, { gain: 0.07, delay: 0.1 });
  }

  /** Wooden thud once when books enter shelf */
  public bookThud(bookIndex: number): void {
    if (!this.canPlay(`book-${bookIndex}`, 450)) return;
    this.playWarmBell(150 - bookIndex * 8, 0.16, { gain: 0.12, type: 'triangle' });
  }

  /** Water chime when paper boat sails */
  public waterSail(): void {
    if (!this.canPlay('waterSail', 800)) return;
    this.playWarmBell(493.88, 0.55, { gain: 0.1 });
    this.playWarmBell(659.25, 0.65, { gain: 0.08, delay: 0.14 });
  }

  /** Crisp soft copy confirmation ping */
  public copyPing(): void {
    if (!this.canPlay('copyPing', 250)) return;
    this.playWarmBell(880, 0.2, { gain: 0.12 });
    this.playWarmBell(1174.66, 0.28, { gain: 0.1, delay: 0.07 });
  }
}

export const soundSystem = new PortfolioSoundSystem();
