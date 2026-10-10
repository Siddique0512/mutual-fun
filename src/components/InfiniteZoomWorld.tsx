import React, { useEffect, useRef } from 'react';
import { INFINITE_ZOOM_LAYERS, PROSPECTUS_CONTENT } from '../data/prospectus';

interface InfiniteZoomWorldProps {
  progress: number; // 0.0 to 1.0
  activeMarker: string | null;
  onSelectMarker: (id: string | null) => void;
  hoveredFund: string | null;
  onHoverFund: (fundId: string | null) => void;
}

export const InfiniteZoomWorld: React.FC<InfiniteZoomWorldProps> = ({
  progress,
  activeMarker,
  onSelectMarker,
  hoveredFund,
  onHoverFund,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Map progress (0.0 to 1.0) across the 5 layers
  const layers = INFINITE_ZOOM_LAYERS;
  const numLayers = layers.length;
  // Total virtual depth index
  const virtualDepth = progress * (numLayers - 1);
  const currentLayerIdx = Math.min(numLayers - 2, Math.floor(virtualDepth));
  const localFraction = virtualDepth - currentLayerIdx; // 0.0 to 1.0

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#050507] select-none"
    >
      {/* Background ambient deep space star grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Render the infinite zoom image layers */}
      {layers.map((layer, idx) => {
        // Calculate relative depth distance from current camera
        const layerDepth = idx - virtualDepth; // negative = behind camera, positive = ahead of camera

        // Determine visibility window (only render layers within view range to maintain 60fps)
        if (layerDepth < -1.1 || layerDepth > 1.3) {
          return null;
        }

        // Exponential zoom scale factor (base scale multiplier of ~8x per layer)
        const zoomBase = 8.0;
        const currentScale = Math.pow(zoomBase, -layerDepth);

        // Opacity envelope:
        // As an image zooms past the camera (layerDepth < 0), it smoothly fades away
        // As an image approaches from the distance (layerDepth > 0), it smoothly fades in
        let opacity = 1;
        if (layerDepth < 0) {
          // fading out as camera enters portal
          opacity = Math.max(0, 1 + layerDepth * 1.5);
        } else if (layerDepth > 0.8) {
          // fading in from far distance
          opacity = Math.max(0, 1 - (layerDepth - 0.8) * 3);
        }

        // Transform origin tracks the portal point of the previous layer
        const originX = layer.portal.x * 100;
        const originY = layer.portal.y * 100;

        return (
          <div
            key={layer.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
            style={{
              opacity: Math.max(0, Math.min(1, opacity)),
              transform: `scale(${currentScale})`,
              transformOrigin: `${originX}% ${originY}%`,
              transition: 'none', // Handled via RAF lerp in App.tsx
            }}
          >
            {/* The Artwork Frame */}
            <div 
              className="relative w-[min(90vw,640px)] aspect-square border border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden bg-[#08080c]"
            >
              <img
                src={layer.image}
                alt={layer.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  imageRendering: 'auto',
                }}
              />

              {/* Luminous Portal Guide Ring (Visible when camera is approaching the portal) */}
              {idx < numLayers - 1 && layerDepth <= 0.6 && layerDepth >= -0.3 && (
                <div
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center animate-pulse"
                  style={{
                    left: `${originX}%`,
                    top: `${originY}%`,
                    width: '36px',
                    height: '36px',
                  }}
                >
                  <div className="w-full h-full rounded-full border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                  <div className="absolute text-[8px] font-mono text-amber-300 tracking-widest whitespace-nowrap -bottom-4 bg-black/80 px-1 border border-amber-500/30">
                    PORTAL
                  </div>
                </div>
              )}

              {/* Pixel Art Scanline & Vignette Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 70px rgba(0,0,0,0.85)',
                  background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%)',
                  backgroundSize: '100% 4px',
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Floating Interactive Canvas for Particles & Dynamic Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle coordinate crosshair in corner */}
        <div className="absolute top-18 left-6 text-[10px] font-mono text-zinc-500 tracking-wider">
          LAYER [{currentLayerIdx + 1}/{numLayers}] · ZOOM x{(Math.pow(8, virtualDepth)).toFixed(1)}
        </div>
      </div>
    </div>
  );
};
