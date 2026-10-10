import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrueInfiniteZoomCanvas, ZOOM_STAGES } from './components/TrueInfiniteZoomCanvas';
import { TopTabBar } from './components/TopTabBar';
import { NarratorCaptionBar } from './components/NarratorCaptionBar';
import { ProspectusDossierDrawer } from './components/ProspectusDossierDrawer';
import { narrator } from './utils/narrator';
import { sound } from './utils/audio';

export default function App() {
  // Smooth continuous virtual progress (0.00 to 1.00)
  const [progress, setProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Active Stage Index (0 to 4)
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Automatic Demo active by default as requested!
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);

  // Audio toggles
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [isMusicActive, setIsMusicActive] = useState<boolean>(true);

  // Prospectus Dossier Drawer state
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Browser Autoplay unlocked state
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  // Demo auto-advance timer ref
  const demoTimerRef = useRef<number | null>(null);
  const lastSpokenStageRef = useRef<number>(-1);

  // Smooth jump to progress
  const handleJumpToProgress = useCallback((target: number) => {
    targetProgressRef.current = Math.min(1.0, Math.max(0.0, target));
  }, []);

  // Jump to specific zoom stage (0, 1, 2, 3, 4)
  const handleSelectStage = useCallback((stageIndex: number) => {
    const clamped = Math.max(0, Math.min(ZOOM_STAGES.length - 1, stageIndex));
    const targetP = clamped / (ZOOM_STAGES.length - 1);
    handleJumpToProgress(targetP);
    // When manually selecting a stage, speak that stage immediately
    narrator.speakStage(clamped);
  }, [handleJumpToProgress]);

  // Toggle automatic demo
  const handleToggleDemo = () => {
    setIsDemoActive((prev) => {
      const next = !prev;
      if (next) {
        // Resume demo from current stage
        narrator.speakStage(currentStageIndex);
      }
      return next;
    });
    sound.play('click');
  };

  // Toggle voice narration
  const handleToggleVoice = () => {
    const enabled = narrator.toggle();
    setIsVoiceActive(enabled);
    sound.play('click');
  };

  // Toggle soothing ambient music
  const handleToggleMusic = () => {
    const unmuted = sound.toggleMute();
    setIsMusicActive(unmuted);
  };

  // Reset to Stage 0
  const handleReset = () => {
    handleSelectStage(0);
    sound.play('warp');
  };

  // Unlock Audio on first user interaction
  const unlockAudio = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      if (isMusicActive) {
        sound.startMusic();
      }
      // Speak initial stage if not already speaking
      narrator.speakStage(currentStageIndex);
    }
  }, [audioUnlocked, isMusicActive, currentStageIndex]);

  useEffect(() => {
    const handleGesture = () => {
      unlockAudio();
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('wheel', handleGesture);
    };

    window.addEventListener('pointerdown', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('wheel', handleGesture);

    return () => {
      window.removeEventListener('pointerdown', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('wheel', handleGesture);
    };
  }, [unlockAudio]);

  // Smooth Interpolation Loop (RAF)
  useEffect(() => {
    let animId: number;

    const loop = () => {
      // Smooth damped lerp toward target progress
      const diff = targetProgressRef.current - currentProgressRef.current;
      const lerpSpeed = 0.08;
      currentProgressRef.current += diff * lerpSpeed;

      if (Math.abs(diff) < 0.0001) {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setProgress(p);

      // Determine current stage index based on progress
      const numStages = ZOOM_STAGES.length;
      const stageIdx = Math.min(numStages - 1, Math.floor(p * (numStages - 1) + 0.5));
      if (stageIdx !== currentStageIndex) {
        setCurrentStageIndex(stageIdx);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentStageIndex]);

  // Narrator speech trigger when stage changes
  useEffect(() => {
    if (currentStageIndex !== lastSpokenStageRef.current) {
      lastSpokenStageRef.current = currentStageIndex;

      // Speak stage narration
      narrator.speakStage(currentStageIndex, () => {
        // If automatic demo is active, advance to next stage after narration finishes!
        if (isDemoActive) {
          if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
          demoTimerRef.current = window.setTimeout(() => {
            const nextStage = (currentStageIndex + 1) % ZOOM_STAGES.length;
            const targetP = nextStage / (ZOOM_STAGES.length - 1);
            handleJumpToProgress(targetP);
            sound.play('warp');
          }, 1800);
        }
      });
    }
  }, [currentStageIndex, isDemoActive, handleJumpToProgress]);

  // Fallback timer for demo in case speech synthesis callback is delayed
  useEffect(() => {
    if (isDemoActive) {
      const fallbackTimer = window.setTimeout(() => {
        const nextStage = (currentStageIndex + 1) % ZOOM_STAGES.length;
        const targetP = nextStage / (ZOOM_STAGES.length - 1);
        handleJumpToProgress(targetP);
      }, 28000); // 28 second per-stage cruise fallback allowing all jokes and beats

      return () => clearTimeout(fallbackTimer);
    }
  }, [currentStageIndex, isDemoActive, handleJumpToProgress]);

  // Wheel input listener (allows user to zoom manually with mouse/trackpad)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      unlockAudio();

      const delta = e.deltaY * 0.0007;
      targetProgressRef.current = Math.min(
        1.0,
        Math.max(0.0, targetProgressRef.current + delta)
      );
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [unlockAudio]);

  // Touch gesture listener for mobile/tablet
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      unlockAudio();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const delta = deltaY * 0.0016;
      targetProgressRef.current = Math.min(
        1.0,
        Math.max(0.0, targetProgressRef.current + delta)
      );
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [unlockAudio]);

  // Keyboard navigation listener (Arrow keys, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        unlockAudio();
        targetProgressRef.current = Math.min(1.0, targetProgressRef.current + 0.05);
        sound.play('tick');
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        unlockAudio();
        targetProgressRef.current = Math.max(0.0, targetProgressRef.current - 0.05);
        sound.play('tick');
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleSelectStage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleSelectStage(ZOOM_STAGES.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlockAudio, handleSelectStage]);

  return (
    <div
      onClick={unlockAudio}
      className="relative w-screen h-screen overflow-hidden bg-[#050308] text-[#ededef]"
    >
      {/* 1. Master True Infinite Zoom Canvas (Completely unobstructed full-screen) */}
      <TrueInfiniteZoomCanvas
        progress={progress}
        onTargetProgressChange={handleJumpToProgress}
        onStageChange={setCurrentStageIndex}
      />

      {/* 2. Top Tab Navigation Bar (Tabs 01-05, demo toggle, audio toggles, dossier) */}
      <TopTabBar
        currentStageIndex={currentStageIndex}
        onSelectStage={handleSelectStage}
        isDemoActive={isDemoActive}
        onToggleDemo={handleToggleDemo}
        isVoiceActive={isVoiceActive}
        onToggleVoice={handleToggleVoice}
        isMusicActive={isMusicActive}
        onToggleMusic={handleToggleMusic}
        isDossierOpen={isDossierOpen}
        onToggleDossier={() => setIsDossierOpen(!isDossierOpen)}
        onReset={handleReset}
      />

      {/* 3. Bottom Subtitle & Narrator Lower-Third Strip (Unobtrusive) */}
      <NarratorCaptionBar
        currentStageIndex={currentStageIndex}
        onNavigateStage={handleSelectStage}
        isDemoActive={isDemoActive}
        onToggleDemo={handleToggleDemo}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 4. Comprehensive Prospectus Dossier Drawer (Slides in on demand with all info) */}
      <ProspectusDossierDrawer
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        currentStageIndex={currentStageIndex}
        onSelectStage={handleSelectStage}
      />



      {/* Subtle CRT scanline overlay */}
      <div className="scanline-overlay fixed inset-0 z-10 pointer-events-none opacity-30" />
    </div>
  );
}
