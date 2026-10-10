import React, { useState } from 'react';
import { ZOOM_STAGES, InfiniteZoomStage } from './TrueInfiniteZoomCanvas';
import { PixelCanvas } from './PixelCanvas';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import { sound } from '../utils/audio';

interface StageExplanationPanelProps {
  currentStageIndex: number;
  progress: number;
  onNavigateStage: (targetStageIndex: number) => void;
}

export const StageExplanationPanel: React.FC<StageExplanationPanelProps> = ({
  currentStageIndex,
  progress,
  onNavigateStage,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showPixelInspector, setShowPixelInspector] = useState(false);

  const stage: InfiniteZoomStage = ZOOM_STAGES[currentStageIndex] || ZOOM_STAGES[0];

  const handleNext = () => {
    onNavigateStage(currentStageIndex + 1);
    sound.play('warp');
  };

  const handlePrev = () => {
    onNavigateStage(currentStageIndex - 1);
    sound.play('warp');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[min(94vw,740px)] pointer-events-auto select-none transition-all duration-300">
      {/* Sleek, Unobtrusive Floating Controller */}
      <div className="bg-[#07070b]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden rounded-sm">
        {/* Main Control Strip */}
        <div className="flex items-center justify-between px-4 py-3 gap-3 text-xs font-mono">
          {/* Stage Marker */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-amber-400 font-bold">
              {stage.num} / 05
            </span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-white font-semibold tracking-wide hidden sm:inline">
              {stage.title}
            </span>
          </div>

          {/* Center Hint / Action */}
          <div className="flex items-center gap-2">
            {currentStageIndex === 0 && (
              <button
                onClick={() => {
                  setShowPixelInspector(!showPixelInspector);
                  sound.play('click');
                }}
                className={`flex items-center gap-1 px-2 py-1 text-[11px] border cursor-pointer transition-colors ${
                  showPixelInspector
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
                title="Inspect 64x64 on-chain portrait pixels"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden md:inline">64×64 MATRIX</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsDetailsOpen(!isDetailsOpen);
                sound.play('click');
              }}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-900/80 px-2 py-1 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
              title="Toggle text transcript"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>TRANSCRIPT</span>
              {isDetailsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>

          {/* Zoom In / Out Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={currentStageIndex === 0}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors"
              title="Zoom out to previous layer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">OUT</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 font-bold cursor-pointer transition-colors shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              title={`Zoom into ${stage.portal.targetObjectName || stage.portal.label}`}
            >
              <span>ZOOM IN: {stage.portal.targetObjectName || stage.portal.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional Expandable Pixel Matrix Inspector (Stage 1) */}
        {showPixelInspector && currentStageIndex === 0 && (
          <div className="p-4 bg-black/80 border-t border-zinc-800 text-center">
            <div className="text-[11px] font-mono text-zinc-400 mb-2">
              64×64 ON-CHAIN RESOLUTION · 11 UNIQUE CHARACTERS · CHAIR IS MAIN RARITY TRAIT
            </div>
            <PixelCanvas interactive={true} zoomLevel={4} />
          </div>
        )}

        {/* Optional Expandable Transcript Box */}
        {isDetailsOpen && (
          <div className="p-4 border-t border-white/10 bg-[#0a070e] text-xs font-mono space-y-2 max-h-48 overflow-y-auto">
            <div className="text-amber-400 font-bold">{stage.title}</div>
            <div className="text-zinc-300 leading-relaxed">{stage.summary}</div>
            <div className="text-[11px] text-zinc-500 pt-1">
              Scroll down or click the canvas to seamlessly zoom deeper through the target object into the next layer.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
