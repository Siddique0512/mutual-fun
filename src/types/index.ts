export interface ProspectusFund {
  id: string;
  name: string;
  description: string;
  seats: number;
  color: string;
  accent: string;
}

export interface MarkerInfo {
  id: string;
  label: string;
  title: string;
  text: string;
  x: number;
  y: number;
}

export interface StageDefinition {
  id: string;
  num: string;
  title: string;
  range: [number, number]; // [startProgress, endProgress]
  kicker: string;
  headline: string;
  explanation: string;
  subtext?: string;
}

export type SoundEffectType = 'tick' | 'reveal' | 'chime' | 'warp' | 'click' | 'bass' | 'boom' | 'laugh';
