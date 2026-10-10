import React, { useEffect, useRef, useState, useCallback } from 'react';
import { generateSeatPixels, PORTRAIT_TRAITS } from '../utils/pixelSeat';
import { sound } from '../utils/audio';

interface PixelCanvasProps {
  scale?: number;
  interactive?: boolean;
  activeFundId?: string;
  zoomLevel?: number; // 1 to 20
  onHoverPixel?: (pos: { x: number; y: number } | null) => void;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  interactive = true,
  activeFundId = 'bogle',
  zoomLevel = 1,
  onHoverPixel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);
  const rawPixelsRef = useRef<Uint8ClampedArray | null>(null);

  // Update raw pixel buffer when portrait index or fund changes
  useEffect(() => {
    rawPixelsRef.current = generateSeatPixels(portraitIndex, activeFundId);
  }, [portraitIndex, activeFundId]);

  // Render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rawPixelsRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Source 64x64 image data
    const imgData = ctx.createImageData(64, 64);
    const data = imgData.data;
    const raw = rawPixelsRef.current;

    for (let i = 0; i < raw.length; i++) {
      data[i] = raw[i];
    }

    // Apply interactive hover highlight if near mouse
    if (interactive && hoveredPixel) {
      const { x: hx, y: hy } = hoveredPixel;
      const radius = 3;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const px = hx + dx;
          const py = hy + dy;
          if (px >= 0 && px < 64 && py >= 0 && py < 64) {
            const dist = Math.hypot(dx, dy);
            if (dist <= radius) {
              const idx = (py * 64 + px) * 4;
              const intensity = (1 - dist / radius) * 120;
              data[idx] = Math.min(255, data[idx] + intensity);
              data[idx + 1] = Math.min(255, data[idx + 1] + intensity);
              data[idx + 2] = Math.min(255, data[idx + 2] + intensity);
            }
          }
        }
      }
    }

    // Draw buffer to temporary offscreen canvas, then stretch to display size
    ctx.putImageData(imgData, 0, 0);
  }, [interactive, hoveredPixel]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas, portraitIndex, activeFundId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const px = Math.floor((clientX / rect.width) * 64);
    const py = Math.floor((clientY / rect.height) * 64);

    if (px >= 0 && px < 64 && py >= 0 && py < 64) {
      if (!hoveredPixel || hoveredPixel.x !== px || hoveredPixel.y !== py) {
        setHoveredPixel({ x: px, y: py });
        onHoverPixel?.({ x: px, y: py });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPixel(null);
    onHoverPixel?.(null);
  };

  const handleNextTrait = () => {
    setPortraitIndex((prev) => (prev + 1) % PORTRAIT_TRAITS.length);
    sound.play('click');
  };

  const currentTrait = PORTRAIT_TRAITS[portraitIndex];

  return (
    <div className="relative flex flex-col items-center">
      {/* 64x64 Canvas with crisp nearest-neighbor rendering */}
      <div 
        className="relative overflow-hidden border border-[#2b2b36] shadow-2xl bg-[#09090d]"
        style={{
          width: 'min(78vw, 380px)',
          height: 'min(78vw, 380px)',
          imageRendering: 'pixelated',
        }}
      >
        <canvas
          ref={canvasRef}
          width={64}
          height={64}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Pixel grid overlay visible when zoomed in */}
        {zoomLevel > 3 && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: `${100 / 64}% ${100 / 64}%`,
            }}
          />
        )}

        {/* Corner coordinates HUD */}
        <div className="absolute top-2 left-2 text-[10px] font-mono tracking-widest text-zinc-400 bg-black/60 px-1.5 py-0.5 border border-white/10 backdrop-blur-sm pointer-events-none">
          {hoveredPixel ? `P(${hoveredPixel.x.toString().padStart(2, '0')}, ${hoveredPixel.y.toString().padStart(2, '0')})` : '64×64 ON-CHAIN'}
        </div>
      </div>

      {/* Trait selector bar when inspecting */}
      <div className="mt-3 flex items-center justify-between w-full max-w-[380px] px-1 text-xs font-mono">
        <button
          onClick={handleNextTrait}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 bg-[#14141a] px-2.5 py-1 border border-zinc-800 hover:border-zinc-700"
          title="Click to cycle portrait"
        >
          <span>TRAIT [{portraitIndex + 1}/11]:</span>
          <span className="text-amber-400 font-semibold">{currentTrait.name}</span>
        </button>

        <span className="text-zinc-500 text-[11px]">
          CHAIR: <strong className="text-zinc-300 font-normal">{currentTrait.chair}</strong>
        </span>
      </div>
    </div>
  );
};
