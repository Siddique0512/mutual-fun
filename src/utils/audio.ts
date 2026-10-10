import { SoundEffectType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false; // Enabled so user can experience soothing tune
  private isMusicPlaying: boolean = false;
  
  // Ambient Music Nodes
  private musicGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private padGain: GainNode | null = null;
  private padOscs: OscillatorNode[] = [];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
      this.play('reveal');
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isMusicActive(): boolean {
    return this.isMusicPlaying && !this.isMuted;
  }

  /**
   * Generates a lush, relaxing, soothing ambient synthesizer music stream.
   * Plays soft tape-filtered chords and gentle starry arpeggios in C Major / A Minor Pentatonic.
   */
  public startMusic() {
    this.initContext();
    if (!this.ctx || this.isMuted || this.isMusicPlaying) return;

    try {
      this.isMusicPlaying = true;
      const now = this.ctx.currentTime;

      // Master music gain node with soft limiter
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.001, now);
      this.musicGain.gain.exponentialRampToValueAtTime(0.08, now + 3);

      const masterFilter = this.ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(650, now); // Warm, mellow tape cutoff
      masterFilter.Q.setValueAtTime(1.2, now);

      this.musicGain.connect(masterFilter);
      masterFilter.connect(this.ctx.destination);

      // Chords in progression: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
      const chordNotes = [
        [130.81, 164.81, 196.00, 246.94, 293.66], // C3, E3, G3, B3, D4
        [110.00, 146.83, 164.81, 220.00, 261.63], // A2, D3, E3, A3, C4
        [87.31, 130.81, 174.61, 220.00, 261.63],  // F2, C3, F3, A3, C4
        [98.00, 146.83, 196.00, 246.94, 293.66],  // G2, D3, G3, B3, D4
      ];

      // Arpeggiator scale notes (Pentatonic / Lydian)
      const arpHertz = [
        261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99
      ];

      let chordIndex = 0;

      // Continuous soothing Pad drone
      const updatePad = () => {
        if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;
        const currentChord = chordNotes[chordIndex % chordNotes.length];
        chordIndex++;

        // Stop old oscillators gracefully
        const oldOscs = [...this.padOscs];
        this.padOscs = [];
        const t = this.ctx.currentTime;

        oldOscs.forEach(o => {
          try {
            o.stop(t + 2.5);
          } catch {
            // ignore
          }
        });

        // Spawn new soft chord notes
        currentChord.slice(0, 3).forEach((freq) => {
          if (!this.ctx || !this.musicGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          // subtle warm chorus vibrato
          osc.frequency.linearRampToValueAtTime(freq * 1.002, t + 4);

          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.02, t + 2);
          g.gain.linearRampToValueAtTime(0.0001, t + 8);

          osc.connect(g);
          g.connect(this.musicGain);

          osc.start(t);
          this.padOscs.push(osc);
        });
      };

      // Gentle starry pluck arpeggios
      const playSoothingPluck = () => {
        if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;
        const t = this.ctx.currentTime;
        const randomFreq = arpHertz[Math.floor(Math.random() * arpHertz.length)];

        const osc = this.ctx.createOscillator();
        const pluckGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(randomFreq, t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(randomFreq * 1.2, t);
        filter.Q.setValueAtTime(3, t);

        pluckGain.gain.setValueAtTime(0.0001, t);
        pluckGain.gain.exponentialRampToValueAtTime(0.025, t + 0.05);
        pluckGain.gain.exponentialRampToValueAtTime(0.00001, t + 1.8);

        osc.connect(filter);
        filter.connect(pluckGain);
        pluckGain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 1.85);
      };

      // Initial chords
      updatePad();
      playSoothingPluck();

      // Loop intervals
      let stepCount = 0;
      this.musicInterval = window.setInterval(() => {
        stepCount++;
        if (stepCount % 8 === 0) {
          updatePad();
        }
        if (Math.random() > 0.35) {
          playSoothingPluck();
        }
      }, 700);

    } catch (e) {
      console.warn('Audio init deferred:', e);
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      } catch {
        // safe exit
      }
    }
    this.padOscs.forEach(o => {
      try {
        o.stop();
        o.disconnect();
      } catch {
        // ignore
      }
    });
    this.padOscs = [];
  }

  public play(type: SoundEffectType) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';

      if (type === 'tick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.035);
        filter.frequency.setValueAtTime(700, now);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'reveal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.2);
        filter.frequency.setValueAtTime(1000, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'warp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'bass' || type === 'boom') {
        // Deep cinema sub-bass drop (rumbling physical weight)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(36, now + 0.7);
        filter.frequency.setValueAtTime(260, now);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.75);
      } else if (type === 'laugh') {
        // Wry comedic high-hat / brass stinger
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(480, now + 0.08);
        osc.frequency.setValueAtTime(392, now + 0.16);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Audio playback safety
    }
  }
}

export const sound = new SoundEngine();
