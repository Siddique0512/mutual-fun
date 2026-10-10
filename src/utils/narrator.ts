// Web Speech Synthesis Narrator for The Mutual Fun cinematic tour
// Tuned for deep, heavy, charismatic, slow & vibrant delivery with jokes and interactive control

export interface NarrationBeat {
  text: string;
  isJoke?: boolean;
  pauseAfterMs?: number;
}

export const STAGE_NARRATION_BEATS: Record<number, NarrationBeat[]> = {
  0: [
    { text: "Welcome to The Mutual Fun. 4,001 seats, 64-by-64 pixels, stored entirely on-chain." },
    { text: "Each seat belongs to one of five funds. Framed stock certificates, briefcases on the floor, and pure algorithmic destiny." },
    { text: "Look at King Midas over there in pure gold. Word on Wall Street is, he tried paying his taxes in gold foil... the IRS audited his throne.", isJoke: true },
    { text: "Now, let's plunge right through Midas' golden throne into the Chair Ladder." },
  ],
  1: [
    { text: "The Chair Ladder. Eight tiers of corporate seating, from bottom-rung survival to sovereign luxury." },
    { text: "Thirty percent of you get the Intern's Folding Chair. Ergonomically certified to destroy your lumbar by Tuesday.", isJoke: true },
    { text: "Only thirty-seven lucky souls hold the Gilded Throne. Everyone else? Enjoy creaking your way through quarterly earnings." },
    { text: "Merge two seats in M&A, and you forge a Corner Office with a permanent ten percent dividend bonus. Now, look past the throne to The Weirdos." },
  ],
  2: [
    { text: "Meet the Weirdos. Fifteen percent of our shareholders aren't even human." },
    { text: "You've got ghosts, rogue A.I. quants, off-world consultants, and Barney... the Golden Retriever who made Partner." },
    { text: "People complained about nepotism with Barney, but frankly, his risk management beats every junior analyst we ever hired.", isJoke: true },
    { text: "Notice the leather briefcase resting beside Barney on the floor. Let's dive inside." },
  ],
  3: [
    { text: "The Briefcase. An autonomous ERC-6551 token-bound account owned directly by your seat." },
    { text: "Cashed dividends in TMF and wrapped Ether land right here. When you sell the seat, the briefcase and all its loot travel with it." },
    { text: "Cardinal rule: holding a seat earns zero until you enroll. That 50-50 load fee burns half your tokens forever. Nothing says love like voluntary deflation.", isJoke: true },
    { text: "See that glowing cryptographic ledger chip in the compartment? Let's zoom into its matrix." },
  ],
  4: [
    { text: "The Trait Vault. Exactly 114,367 bytes of raw bytecode sealed forever into the contract." },
    { text: "No IPFS links that break in six months. No Amazon Web Services bills. One hundred percent on-chain mathematics." },
    { text: "If the internet collapses tomorrow, cockroaches and these 4,001 portraits will be the only things left standing.", isJoke: true },
    { text: "Let's crack this SHA-256 seal lock and step inside the Boardroom." },
  ],
  5: [
    { text: "The Executive Boardroom. Where enrolled shareholders convene under cold neon to govern capital." },
    { text: "Every seat enrolled pays their fee to burn supply and fund direct treasury orders." },
    { text: "They call it decentralized consensus. Around here, that means five hundred traders arguing in a group chat until the market opens.", isJoke: true },
    { text: "Look at the central terminal glowing on the mahogany desk. Let's enter the Grand Council." },
  ],
  6: [
    { text: "The Grand Council Amphitheater. Argon, Bogle, Smaug, Midas, and Vladd." },
    { text: "Five funds that started identical with 800 seats each, now drifting apart through pure member democracy." },
    { text: "Bogle buys index funds and goes to sleep. Vladd is currently leveraged to the gills on red candles. Choose your poison.", isJoke: true },
    { text: "Center stage: the glowing voting podium. Let's step up to the Weekly Ballot." },
  ],
  7: [
    { text: "The Weekly Governance Console. Heavy mechanical keys where shareholders punch in their votes." },
    { text: "Your ballot weight scales with your chair. A folding chair gets one vote; an upgraded Corner Office swings two-point-two times power." },
    { text: "Democracy is great, but democracy with an executive armchair is significantly more persuasive.", isJoke: true },
    { text: "Notice the golden switchboard for the Week 13 Continuation Seal. Let's flip it." },
  ],
  8: [
    { text: "Week 13. The existential day of reckoning." },
    { text: "Every thirteen weeks, shareholders vote: do we continue, or do we pull the plug?" },
    { text: "If the fund fails the vote, it liquidates on the spot and the Till refunds everyone's ETH. Imagine if Wall Street hedge funds did that when they lost your money.", isJoke: true },
    { text: "Look through the clockwork iris aperture as it opens into deep space." },
  ],
  9: [
    { text: "The 4,001 Seats Cosmos. 1.6 billion TMF tokens orbiting in five galactic arms." },
    { text: "At the center floats Seat 0: The Chairman. Belongs to the building. Never for sale. Nobody holds the keys." },
    { text: "No CEO, no venture capital unlock cliffs, no rug-pull admin switch. Just cold, sovereign math. Stop trading alone.", isJoke: true },
    { text: "Let's dive into the Chairman's throne and loop right back to Genesis." },
  ],
};

export type VoicePersona = 'deep_bass' | 'tycoon' | 'deadpan';

export const NARRATION_SCRIPTS: Record<number, string> = Object.fromEntries(
  Object.entries(STAGE_NARRATION_BEATS).map(([k, beats]) => [
    Number(k),
    beats.map((b) => b.text).join(' '),
  ])
);

export interface SubtitleEvent {
  text: string;
  stageIndex: number;
  beatIndex: number;
  totalBeats: number;
  isJoke: boolean;
}

class NarratorEngine {
  private isEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeStageIndex: number = 0;
  private activeBeatIndex: number = 0;
  private isSpeakingBeat: boolean = false;
  private beatTimeoutId: number | null = null;

  // Custom Voice Pitch & Rate settings
  private voicePitch: number = 0.48; // ULTRA DEEP HEAVY VOICE
  private voiceRate: number = 0.85;  // Slow, deliberate, captivating cadence
  private activePersona: VoicePersona = 'deep_bass';

  // Callbacks
  private onSubtitleCallback: ((event: SubtitleEvent) => void) | null = null;
  private onStageCompleteCallback: ((stageIndex: number) => void) | null = null;
  private onBeatStartCallback: ((isJoke: boolean) => void) | null = null;

  public setSubtitleCallback(cb: ((event: SubtitleEvent) => void) | ((text: string) => void)) {
    this.onSubtitleCallback = (event: SubtitleEvent) => {
      (cb as (arg: SubtitleEvent | string) => void)(event);
    };
  }

  public setStageCompleteCallback(cb: (stageIndex: number) => void) {
    this.onStageCompleteCallback = cb;
  }

  public setBeatStartCallback(cb: (isJoke: boolean) => void) {
    this.onBeatStartCallback = cb;
  }

  public setPersona(persona: VoicePersona) {
    this.activePersona = persona;
    if (persona === 'deep_bass') {
      this.voicePitch = 0.45;
      this.voiceRate = 0.82;
    } else if (persona === 'tycoon') {
      this.voicePitch = 0.52;
      this.voiceRate = 0.88;
    } else if (persona === 'deadpan') {
      this.voicePitch = 0.40;
      this.voiceRate = 0.78;
    }
  }

  public getPersona(): VoicePersona {
    return this.activePersona;
  }

  public setPitch(pitch: number) {
    this.voicePitch = Math.max(0.3, Math.min(1.0, pitch));
  }

  public getPitch(): number {
    return this.voicePitch;
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public stop() {
    if (this.beatTimeoutId) {
      clearTimeout(this.beatTimeoutId);
      this.beatTimeoutId = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.isSpeakingBeat = false;
  }

  /**
   * Speak a specific stage from beat 0 sequentially with natural pauses
   */
  public speakStage(stageIdx: number, onComplete?: () => void) {
    this.stop();
    this.activeStageIndex = stageIdx;
    this.activeBeatIndex = 0;

    if (onComplete) {
      this.onStageCompleteCallback = onComplete;
    }

    this.speakCurrentBeat();
  }

  /**
   * Advance immediately to the next beat (or next stage if done)
   */
  public nextBeat() {
    this.stop();
    const beats = STAGE_NARRATION_BEATS[this.activeStageIndex] || [];
    if (this.activeBeatIndex < beats.length - 1) {
      this.activeBeatIndex++;
      this.speakCurrentBeat();
    } else {
      this.onStageCompleteCallback?.(this.activeStageIndex);
    }
  }

  /**
   * Go back to the previous beat
   */
  public prevBeat() {
    this.stop();
    if (this.activeBeatIndex > 0) {
      this.activeBeatIndex--;
      this.speakCurrentBeat();
    } else {
      this.speakCurrentBeat();
    }
  }

  /**
   * Jump straight to the joke beat for this stage
   */
  public tellJoke() {
    this.stop();
    const beats = STAGE_NARRATION_BEATS[this.activeStageIndex] || [];
    const jokeIdx = beats.findIndex((b) => b.isJoke);
    if (jokeIdx !== -1) {
      this.activeBeatIndex = jokeIdx;
    }
    this.speakCurrentBeat();
  }

  private speakCurrentBeat() {
    const beats = STAGE_NARRATION_BEATS[this.activeStageIndex] || [];
    if (this.activeBeatIndex >= beats.length) {
      this.onStageCompleteCallback?.(this.activeStageIndex);
      return;
    }

    const currentBeat = beats[this.activeBeatIndex];
    if (!currentBeat) return;

    // Trigger subtitle event
    this.onSubtitleCallback?.({
      text: currentBeat.text,
      stageIndex: this.activeStageIndex,
      beatIndex: this.activeBeatIndex,
      totalBeats: beats.length,
      isJoke: !!currentBeat.isJoke,
    });

    // Notify sound engine for sub-bass boom or comedic accent
    this.onBeatStartCallback?.(!!currentBeat.isJoke);

    if (!this.isEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Fallback timer if disabled
      this.beatTimeoutId = window.setTimeout(() => {
        this.nextBeat();
      }, 4500);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(currentBeat.text);

      // HEAVY, DEEP MALE SETTINGS
      utterance.pitch = this.voicePitch; // Heavy deep baritone
      utterance.rate = this.voiceRate;   // Slow, vibrant, steady, captivating
      utterance.volume = 1.0;

      // Select deep male voice from system
      const voices = window.speechSynthesis.getVoices();
      const femaleNames = [
        'samantha', 'victoria', 'zira', 'karen', 'moira', 'fiona',
        'tessa', 'veena', 'alice', 'kathy', 'susan', 'cynthia', 'agnes',
        'serena', 'yuna', 'kyoko', 'amira', 'ting-ting'
      ];

      const preferredMale = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        const isNotFemale = !femaleNames.some((f) => nameLower.includes(f));
        const isMaleNamed = (
          nameLower.includes('daniel') ||
          nameLower.includes('david') ||
          nameLower.includes('alex') ||
          nameLower.includes('george') ||
          nameLower.includes('fred') ||
          nameLower.includes('guy') ||
          nameLower.includes('oliver') ||
          nameLower.includes('arthur') ||
          nameLower.includes('male') ||
          nameLower.includes('bruce') ||
          nameLower.includes('junior')
        );
        return isNotFemale && isMaleNamed && v.lang.startsWith('en');
      }) || voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        return !femaleNames.some((f) => nameLower.includes(f)) && v.lang.startsWith('en');
      });

      if (preferredMale) {
        utterance.voice = preferredMale;
      }

      this.isSpeakingBeat = true;

      utterance.onend = () => {
        this.isSpeakingBeat = false;
        this.currentUtterance = null;

        // Natural vibrant pause between lines (750ms for normal, 1100ms after joke)
        const pause = currentBeat.isJoke ? 1200 : 800;
        this.beatTimeoutId = window.setTimeout(() => {
          this.nextBeat();
        }, pause);
      };

      utterance.onerror = () => {
        this.isSpeakingBeat = false;
        this.currentUtterance = null;
        this.beatTimeoutId = window.setTimeout(() => {
          this.nextBeat();
        }, 1000);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.beatTimeoutId = window.setTimeout(() => {
        this.nextBeat();
      }, 4500);
    }
  }

  public getActiveStage(): number {
    return this.activeStageIndex;
  }

  public getActiveBeat(): number {
    return this.activeBeatIndex;
  }
}

export const narrator = new NarratorEngine();
