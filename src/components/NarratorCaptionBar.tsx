import React, { useEffect, useState } from 'react';
import { narrator, SubtitleEvent } from '../utils/narrator';
import { sound } from '../utils/audio';

interface NarratorCaptionBarProps {
  currentStageIndex: number;
  onNavigateStage: (stageIndex: number) => void;
  isDemoActive: boolean;
  onToggleDemo: () => void;
  onOpenDossier: () => void;
}

export const NarratorCaptionBar: React.FC<NarratorCaptionBarProps> = () => {
  const [subtitleData, setSubtitleData] = useState<SubtitleEvent>({
    text: '',
    stageIndex: 0,
    beatIndex: 0,
    totalBeats: 4,
    isJoke: false,
  });

  // Connect subtitle events and audio cues
  useEffect(() => {
    narrator.setSubtitleCallback((event: SubtitleEvent | string) => {
      if (typeof event === 'string') {
        setSubtitleData((prev) => ({ ...prev, text: event }));
      } else {
        setSubtitleData(event);
      }
    });

    narrator.setBeatStartCallback((isJoke) => {
      if (isJoke) {
        sound.play('laugh');
      } else {
        sound.play('bass'); // Heavy sub-bass rumble accompanying each masculine phrase
      }
    });
  }, []);

  if (!subtitleData.text) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[min(92vw,780px)] pointer-events-none select-none text-center">
      {/* Pure, cinematic, floating subtitle */}
      <div className="inline-block px-6 py-2.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)] transition-all duration-300">
        <p className="text-sm sm:text-base font-sans font-medium tracking-wide text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {subtitleData.isJoke ? (
            <span className="text-amber-300 italic font-medium">
              &ldquo;{subtitleData.text}&rdquo;
            </span>
          ) : (
            <span>&ldquo;{subtitleData.text}&rdquo;</span>
          )}
        </p>
      </div>
    </div>
  );
};
