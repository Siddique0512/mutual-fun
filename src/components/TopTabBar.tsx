import React from 'react';
import { ZOOM_STAGES } from './TrueInfiniteZoomCanvas';
import { sound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Pause,
  BookOpen,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface TopTabBarProps {
  currentStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
  isDemoActive: boolean;
  onToggleDemo: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  isMusicActive: boolean;
  onToggleMusic: () => void;
  isDossierOpen: boolean;
  onToggleDossier: () => void;
  onReset: () => void;
}

export const TopTabBar: React.FC<TopTabBarProps> = ({
  currentStageIndex,
  onSelectStage,
  isDemoActive,
  onToggleDemo,
  isVoiceActive,
  onToggleVoice,
  isMusicActive,
  onToggleMusic,
  isDossierOpen,
  onToggleDossier,
  onReset,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-auto select-none bg-[#07050a]/92 backdrop-blur-md border-b border-amber-500/25 px-3 py-2 sm:px-6 sm:py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand & Automatic Demo Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-xs shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
              THE MUTUAL FUN
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/30 rounded-xs">
              INFINITE SYSTEM
            </span>
          </div>

          {/* Automatic Demo Quick Toggle */}
          <button
            onClick={onToggleDemo}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border cursor-pointer transition-all rounded-xs ${
              isDemoActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
            title={isDemoActive ? 'Pause automatic demo' : 'Start automatic demo walkthrough'}
          >
            {isDemoActive ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-amber-400" />}
            <span className="font-semibold">{isDemoActive ? 'DEMO: AUTO-TOUR' : 'PLAY DEMO'}</span>
          </button>
        </div>

        {/* Five Interactive Stage Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 scrollbar-none font-mono text-xs">
          {ZOOM_STAGES.map((stage, idx) => {
            const isActive = currentStageIndex === idx;
            const shortTitles = [
              'PORTRAITS',
              'CHAIRS',
              'WEIRDOS',
              'BRIEFCASE',
              'TRAIT VAULT',
              'BOARDROOM',
              '5 FUNDS',
              'BALLOT',
              'WEEK 13',
              'COSMOS',
            ];
            const shortLabel = shortTitles[idx] || stage.num;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  onSelectStage(idx);
                  sound.play('warp');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 whitespace-nowrap border cursor-pointer transition-all rounded-xs ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-600'
                }`}
                title={`Jump to ${stage.title} & hear voice explanation`}
              >
                <span className={isActive ? 'text-black/80 font-bold' : 'text-amber-400/80'}>
                  {stage.num}
                </span>
                <span className="text-[11px] font-semibold">{shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Audio Toggles & Full Dossier Controls */}
        <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
          {/* Narrator Voice Toggle */}
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1 px-2 py-1.5 border cursor-pointer transition-colors rounded-xs ${
              isVoiceActive
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/50'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
            title={isVoiceActive ? 'Mute Narrator Voice' : 'Unmute Narrator Voice'}
          >
            {isVoiceActive ? <Mic className="w-3.5 h-3.5 text-amber-400" /> : <MicOff className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="hidden lg:inline">{isVoiceActive ? 'VOICE ON' : 'VOICE OFF'}</span>
          </button>

          {/* Soothing Soundtrack Toggle */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1 px-2 py-1.5 border cursor-pointer transition-colors rounded-xs ${
              isMusicActive
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
            title={isMusicActive ? 'Mute Soothing Ambient Music' : 'Unmute Soothing Ambient Music'}
          >
            {isMusicActive ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="hidden lg:inline">{isMusicActive ? 'MUSIC ON' : 'MUSIC OFF'}</span>
          </button>

          {/* Open Full Prospectus Dossier Button */}
          <button
            onClick={onToggleDossier}
            className={`flex items-center gap-1.5 px-3 py-1.5 border cursor-pointer transition-all rounded-xs ${
              isDossierOpen
                ? 'bg-amber-500 text-black font-bold border-amber-400'
                : 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-amber-400 hover:text-amber-300'
            }`}
            title="Open comprehensive Prospectus Dossier with all details"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">ALL INFO</span>
          </button>

          {/* Reset View */}
          <button
            onClick={onReset}
            className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white cursor-pointer transition-colors rounded-xs"
            title="Reset to Stage 01 Genesis"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
