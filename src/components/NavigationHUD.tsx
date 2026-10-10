import React from 'react';
import { STAGES } from '../data/prospectus';
import { ZOOM_STAGES } from './TrueInfiniteZoomCanvas';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, RotateCcw, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

interface NavigationHUDProps {
  progress: number;
  onJumpToProgress: (target: number) => void;
  isAutoplaying: boolean;
  onToggleAutoplay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  viewMode: 'art' | 'schematic';
  onToggleViewMode: () => void;
  tutorialMode: boolean;
  onToggleTutorialMode: () => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  progress,
  onJumpToProgress,
  isAutoplaying,
  onToggleAutoplay,
  isMuted,
  onToggleMute,
  viewMode,
  onToggleViewMode,
  tutorialMode,
  onToggleTutorialMode,
}) => {
  // Select active stages depending on view mode
  const activeList = viewMode === 'art' ? ZOOM_STAGES : STAGES;
  const currentStageIndex = viewMode === 'art'
    ? Math.min(ZOOM_STAGES.length - 1, Math.floor(progress * (ZOOM_STAGES.length - 0.999)))
    : STAGES.findIndex((s) => progress >= s.range[0] && progress < s.range[1]);

  const safeIdx = Math.max(0, currentStageIndex);
  const currentStage = activeList[safeIdx] || activeList[0];

  const handlePrevStage = () => {
    if (safeIdx > 0) {
      if (viewMode === 'art') {
        onJumpToProgress((safeIdx - 1) / (ZOOM_STAGES.length - 1));
      } else {
        const prev = STAGES[safeIdx - 1];
        onJumpToProgress(prev.range[0] + 0.005);
      }
      sound.play('warp');
    }
  };

  const handleNextStage = () => {
    if (safeIdx < activeList.length - 1) {
      if (viewMode === 'art') {
        onJumpToProgress((safeIdx + 1) / (ZOOM_STAGES.length - 1));
      } else {
        const next = STAGES[safeIdx + 1];
        onJumpToProgress(next.range[0] + 0.005);
      }
      sound.play('warp');
    }
  };

  const handleReset = () => {
    onJumpToProgress(0);
    sound.play('warp');
  };

  const pct = Math.floor(progress * 100);

  return (
    <>
      {/* Top Header Bar: Clean, minimalistic, strictly adhering to anti-slop rules */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-8 px-5 py-4 border-b border-white/5 bg-[#050507]/60 backdrop-blur-md">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-mono">
            THE MUTUAL FUN
          </span>
          <span className="text-zinc-600 hidden sm:inline">·</span>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            ZOOM INTO THE SYSTEM
          </span>
        </div>

        {/* Zone 2: Camera Depth Journey Marker */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-amber-400 font-bold">
            {currentStage.num}
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 tracking-wider">
            {currentStage.title}
          </span>
        </div>

        {/* Zone 3: Controls (Soothing Tune, Cinematic Autoplay, View Mode, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Soothing Music Tune Toggle */}
          <button
            onClick={onToggleMute}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
              !isMuted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                : 'bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={!isMuted ? 'Mute soothing tune' : 'Play soothing ambient synth music'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{!isMuted ? 'TUNE: ON' : 'TUNE: OFF'}</span>
          </button>

          {/* Autoplay / Cinematic Tour */}
          <button
            onClick={onToggleAutoplay}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
              isAutoplaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title={isAutoplaying ? 'Pause automatic camera glide' : 'Glide automatically for video capture'}
          >
            {isAutoplaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden md:inline">{isAutoplaying ? 'PAUSE' : 'CINEMATIC'}</span>
          </button>

          {/* POV Live Tutorial Toggle */}
          <button
            onClick={onToggleTutorialMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
              tutorialMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title="Toggle Live First-Person POV Tutorial mode"
          >
            <span>{tutorialMode ? 'POV SIM: ON' : 'POV SIM: OFF'}</span>
          </button>

          {/* View Mode Toggle: Infinite Art Zoom vs Schematic */}
          <button
            onClick={onToggleViewMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
              viewMode === 'art'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
            title="Switch between Infinite Art Zoom and Schematic Blueprint"
          >
            <span>{viewMode === 'art' ? 'ART ZOOM' : 'SCHEMATIC'}</span>
          </button>

          {/* Reset Journey */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer whitespace-nowrap"
            title="Reset to Genesis"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </header>

      {/* Floating Right Journey Track Scrubber */}
      <aside className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-1.5 py-3 px-1.5 bg-[#0a0a0f]/70 backdrop-blur-md border border-white/5 rounded-sm">
        <button
          onClick={handlePrevStage}
          disabled={currentStageIndex === 0}
          className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
          title="Previous Layer"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Vertical dots for active stages */}
        <div className="flex flex-col gap-1.5 py-2">
          {activeList.map((s, idx) => {
            const isCurrent = idx === safeIdx;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (viewMode === 'art') {
                    onJumpToProgress(idx / (ZOOM_STAGES.length - 1));
                  } else {
                    onJumpToProgress((s as typeof STAGES[0]).range[0] + 0.005);
                  }
                  sound.play('tick');
                }}
                className="group relative flex items-center justify-center p-0.5 cursor-pointer"
                title={`${s.num} · ${s.title}`}
              >
                <div
                  className={`w-1.5 transition-all ${
                    isCurrent
                      ? 'h-4 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                      : 'h-1.5 bg-zinc-700 group-hover:bg-zinc-400'
                  }`}
                />
                {/* Tooltip on hover */}
                <span className="absolute right-6 px-2 py-0.5 text-[10px] font-mono text-zinc-200 bg-zinc-900 border border-zinc-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {s.num} · {s.title}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextStage}
          disabled={currentStageIndex === STAGES.length - 1}
          className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer transition-colors"
          title="Next Layer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Bottom Percentage */}
        <div className="text-[10px] font-mono text-zinc-500 tabular-nums pt-1 border-t border-zinc-800/80">
          {pct.toString().padStart(2, '0')}%
        </div>
      </aside>

      {/* Bottom Subtle Status & Hint Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 border-t border-white/5 bg-[#050507]/40 backdrop-blur-sm text-[11px] font-mono text-zinc-500 pointer-events-none">
        <div className="flex items-center gap-2">
          <span>PROGRESS:</span>
          <span className="text-zinc-300 tabular-nums">{pct}%</span>
          <span className="text-zinc-700">|</span>
          <span>DEPTH:</span>
          <span className="text-zinc-300 tabular-nums">{(progress * 1000).toFixed(0)}m</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-zinc-500">
            SCROLL / DRAG / ARROW KEYS TO NAVIGATE
          </span>
          {progress < 0.05 && (
            <span className="text-amber-400/80 animate-pulse font-semibold">
              SCROLL ↓
            </span>
          )}
        </div>
      </footer>
    </>
  );
};
