import React, { useEffect, useState } from 'react';
import { narrator, NARRATION_SCRIPTS } from '../utils/narrator';
import { ZOOM_STAGES } from './TrueInfiniteZoomCanvas';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Play, Pause, ChevronRight, ChevronLeft, Mic } from 'lucide-react';

interface NarratorControllerProps {
  currentStageIndex: number;
  onNavigateStage: (stageIndex: number) => void;
  isDemoActive: boolean;
  onToggleDemo: () => void;
}

export const NarratorController: React.FC<NarratorControllerProps> = ({
  currentStageIndex,
  onNavigateStage,
  isDemoActive,
  onToggleDemo,
}) => {
  const [subtitle, setSubtitle] = useState<string>('');
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  // Connect subtitle callback
  useEffect(() => {
    narrator.setSubtitleCallback((event: { text?: string } | string) => {
      setSubtitle(typeof event === 'string' ? event : (event.text || ''));
    });
  }, []);

  // Speak stage when entering new stage
  useEffect(() => {
    const text = NARRATION_SCRIPTS[currentStageIndex];
    if (text) {
      setSubtitle(text);
      narrator.speakStage(currentStageIndex, () => {
        // If automatic demo is active, advance to next stage after narrator finishes!
        if (isDemoActive) {
          setTimeout(() => {
            if (currentStageIndex < ZOOM_STAGES.length - 1) {
              onNavigateStage(currentStageIndex + 1);
            } else {
              // Loop back to Genesis
              onNavigateStage(0);
            }
          }, 1500);
        }
      });
    }
  }, [currentStageIndex, isDemoActive, onNavigateStage]);

  const toggleVoice = () => {
    const enabled = narrator.toggle();
    setIsVoiceMuted(!enabled);
    sound.play('click');
  };

  const currentStage = ZOOM_STAGES[currentStageIndex] || ZOOM_STAGES[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[min(94vw,840px)] pointer-events-auto select-none transition-all duration-300">
      {/* Cinematic Lower-Third Captions & Narrator Control Strip */}
      <div className="bg-[#070509]/92 backdrop-blur-xl border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden rounded-sm">
        {/* Narrator Top Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0d0912]/80 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Mic className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>NARRATOR:</span>
            </div>
            <span className="text-white font-semibold">
              {currentStage.num} · {currentStage.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle Automatic Demo */}
            <button
              onClick={onToggleDemo}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border cursor-pointer transition-colors ${
                isDemoActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
              title={isDemoActive ? 'Pause auto-guided walkthrough' : 'Resume auto-guided walkthrough'}
            >
              {isDemoActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isDemoActive ? 'DEMO: ACTIVE' : 'START DEMO'}</span>
            </button>

            {/* Toggle Voice Mute */}
            <button
              onClick={toggleVoice}
              className={`p-1.5 text-[11px] font-mono border cursor-pointer transition-colors ${
                !isVoiceMuted
                  ? 'bg-zinc-800 text-amber-300 border-zinc-600'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'
              }`}
              title={isVoiceMuted ? 'Unmute Narrator Voice' : 'Mute Narrator Voice'}
            >
              {!isVoiceMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Cinematic Subtitle Box (Unobtrusive lower-third text) */}
        <div className="px-5 py-3.5 text-xs sm:text-sm font-mono text-zinc-200 leading-relaxed min-h-[58px] flex items-center">
          <p className="animate-fade-in">
            &ldquo;{subtitle}&rdquo;
          </p>
        </div>

        {/* Quick Zoom Action Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-[#050307]/70 text-xs font-mono">
          <button
            onClick={() => {
              if (currentStageIndex > 0) onNavigateStage(currentStageIndex - 1);
              sound.play('warp');
            }}
            disabled={currentStageIndex === 0}
            className="flex items-center gap-1 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>

          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            SCROLL TO ZOOM FREELY · CLICK PORTAL TO ADVANCE
          </span>

          <button
            onClick={() => {
              if (currentStageIndex < ZOOM_STAGES.length - 1) {
                onNavigateStage(currentStageIndex + 1);
              } else {
                onNavigateStage(0);
              }
              sound.play('warp');
            }}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
          >
            <span>ZOOM IN: {currentStage.portal.targetObjectName || currentStage.portal.label}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
