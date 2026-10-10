import React, { useEffect, useRef, useCallback } from 'react';
import { PROSPECTUS_CONTENT } from '../data/prospectus';
import { generateSeatPixels } from '../utils/pixelSeat';

interface WorldCanvasProps {
  progress: number; // 0.00 to 1.00 smoothed
  activeMarker: string | null;
  onSelectMarker?: (id: string | null) => void;
  hoveredFund: string | null;
  onHoverFund?: (fundId: string | null) => void;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  color: string;
}

interface SeatGalaxyNode {
  x: number;
  y: number;
  z: number;
  fundIndex: number; // 0 to 4, or 5 for Seat 0
  id: number;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  progress,
  activeMarker,
  onSelectMarker,
  hoveredFund,
  onHoverFund,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Seat Pixel Cache
  const seatImageRef = useRef<HTMLCanvasElement | null>(null);

  // Precomputed 4,001 seats galaxy coordinates
  const galaxySeatsRef = useRef<SeatGalaxyNode[]>([]);
  // Ambient floating background particles
  const particlesRef = useRef<Particle[]>([]);

  // Mouse interaction coordinates
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Initialize Seat Pixel texture & 4,001 seat galaxy
  useEffect(() => {
    // 1. Render base seat to offscreen canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = 64;
    offscreen.height = 64;
    const octx = offscreen.getContext('2d');
    if (octx) {
      const pixels = generateSeatPixels(0, 'bogle');
      const imgData = octx.createImageData(64, 64);
      for (let i = 0; i < pixels.length; i++) {
        imgData.data[i] = pixels[i];
      }
      octx.putImageData(imgData, 0, 0);
      seatImageRef.current = offscreen;
    }

    // 2. Generate 4,001 seats arranged in 5 clusters of 800 + Seat 0
    const nodes: SeatGalaxyNode[] = [];
    const fundCount = 5;
    const seatsPerFund = 800;

    // Cluster angles for 5 funds
    for (let f = 0; f < fundCount; f++) {
      const fundBaseAngle = (f / fundCount) * Math.PI * 2 - Math.PI / 2;
      const clusterDist = 480;
      const cx = Math.cos(fundBaseAngle) * clusterDist;
      const cy = Math.sin(fundBaseAngle) * clusterDist;

      for (let s = 0; s < seatsPerFund; s++) {
        // Spiral disk distribution within each cluster
        const radius = Math.sqrt((s + 1) / seatsPerFund) * 170;
        const theta = s * 2.39996; // Golden angle
        const nx = cx + Math.cos(theta) * radius + (Math.random() - 0.5) * 8;
        const ny = cy + Math.sin(theta) * radius + (Math.random() - 0.5) * 8;
        const nz = (Math.random() - 0.5) * 60;

        nodes.push({
          x: nx,
          y: ny,
          z: nz,
          fundIndex: f,
          id: f * seatsPerFund + s + 1,
        });
      }
    }

    // Seat 0 at origin
    nodes.push({
      x: 0,
      y: 0,
      z: 0,
      fundIndex: 5, // Seat 0
      id: 0,
    });

    galaxySeatsRef.current = nodes;

    // 3. Stardust particles
    const parts: Particle[] = [];
    const count = 350;
    for (let i = 0; i < count; i++) {
      parts.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        z: Math.random() * 1200 - 300,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.6 + 0.1,
        color: Math.random() > 0.85 ? '#f59e0b' : '#94a3b8',
      });
    }
    particlesRef.current = parts;
  }, []);

  // Track mouse coordinates for hover interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Click handler to select markers or fund clusters
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Check click on Seat markers during Seat phase (0.07 to 0.20)
    if (progress >= 0.07 && progress <= 0.20) {
      const markers = PROSPECTUS_CONTENT.seat.markers;
      const seatDisplayWidth = Math.min(width * 0.72, 340);
      const startX = width / 2 - seatDisplayWidth / 2;
      const startY = height / 2 - seatDisplayWidth / 2;

      for (const m of markers) {
        const markerX = startX + (m.x / 100) * seatDisplayWidth;
        const markerY = startY + (m.y / 100) * seatDisplayWidth;
        const d = Math.hypot(mx - markerX, my - markerY);
        if (d < 24) {
          onSelectMarker?.(activeMarker === m.id ? null : m.id);
          return;
        }
      }
    }
  };

  // Main high-performance render loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Dark void background
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const p = progress;

    // Subtle background coordinate grid that zooms with camera
    const gridScale = Math.max(16, 40 * (1 + (p * 4) % 1));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const offX = (centerX) % gridScale;
    const offY = (centerY) % gridScale;
    for (let x = offX; x < width; x += gridScale) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = offY; y < height; y += gridScale) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Subtle stardust floating particles with depth perspective
    const parts = particlesRef.current;
    for (let i = 0; i < parts.length; i++) {
      const pt = parts[i];
      // Virtual camera z translation based on scroll progress
      const camZ = p * 1200;
      const relZ = ((pt.z - camZ) % 1200 + 1200) % 1200 + 50;
      const fov = 400 / relZ;
      const sx = centerX + pt.x * fov;
      const sy = centerY + pt.y * fov;

      if (sx >= 0 && sx <= width && sy >= 0 && sy <= height && relZ > 10) {
        const radius = Math.max(0.4, pt.size * fov * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.min(0.6, pt.alpha * (relZ / 1200));
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // =========================================================================
    // SPATIAL JOURNEY LAYERS
    // =========================================================================

    // --- LEVEL 00: THE VOID (0.00 -> 0.07) ---
    // Single tiny luminous pixel at the origin that grows as scroll begins
    if (p < 0.12) {
      const voidFade = Math.max(0, 1 - (p - 0.00) / 0.10);
      const pixelSize = Math.max(3, 4 + p * 320); // starts 4px, zooms smoothly

      // Luminous center pulse
      const glowGrad = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, pixelSize * 3
      );
      glowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.8)');
      glowGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.25)');
      glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pixelSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central pixel square
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        centerX - pixelSize / 2,
        centerY - pixelSize / 2,
        pixelSize,
        pixelSize
      );

      // Coordinate crosshair reticle
      if (p < 0.04) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 24, centerY);
        ctx.lineTo(centerX + 24, centerY);
        ctx.moveTo(centerX, centerY - 24);
        ctx.lineTo(centerX, centerY + 24);
        ctx.stroke();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText('[ 0, 0 ] ON-CHAIN SEED', centerX, centerY + 34);
      }
    }

    // --- LEVEL 01 & 02: THE SEAT & ON-CHAIN ART (0.05 -> 0.26) ---
    if (p >= 0.05 && p <= 0.26) {
      // Smooth scale calculation: transitions from tiny pixel up to full screen & into individual pixels
      const t = (p - 0.05) / 0.18; // 0 to 1
      const seatScale = Math.pow(2.2, t * 5.5) * 1.4; // smooth exponential zoom
      const seatSize = Math.min(width * 0.82, 340) * (0.1 + t * 0.9);
      const alpha = Math.min(1, Math.max(0, (p - 0.05) / 0.03)) * (p > 0.23 ? Math.max(0, 1 - (p - 0.23) / 0.03) : 1);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(centerX, centerY);

      // Draw the 64x64 Seat portrait
      if (seatImageRef.current) {
        ctx.imageSmoothingEnabled = false;
        const currentW = Math.min(width * 0.72, 320) * (p > 0.15 ? (1 + (p - 0.15) * 4) : 1);
        const currentH = currentW;

        // Draw shadow/frame
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(-currentW / 2 - 4, -currentH / 2 - 4, currentW + 8, currentH + 8);

        ctx.drawImage(
          seatImageRef.current,
          -currentW / 2,
          -currentH / 2,
          currentW,
          currentH
        );

        // Frame border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-currentW / 2, -currentH / 2, currentW, currentH);

        // If in LEVEL 02 (Zoom into pixels 0.15 -> 0.23): Draw phosphor pixel grid lines
        if (p >= 0.14) {
          const gridAlpha = Math.min(0.35, (p - 0.14) / 0.04);
          ctx.strokeStyle = `rgba(255, 255, 255, ${gridAlpha})`;
          ctx.lineWidth = 0.5;
          const step = currentW / 64;
          ctx.beginPath();
          for (let i = 0; i <= 64; i += 4) {
            ctx.moveTo(-currentW / 2 + i * step, -currentH / 2);
            ctx.lineTo(-currentW / 2 + i * step, currentH / 2);
            ctx.moveTo(-currentW / 2, -currentH / 2 + i * step);
            ctx.lineTo(currentW / 2, -currentH / 2 + i * step);
          }
          ctx.stroke();
        }

        // Spatial Interactive Markers (Level 01: 0.08 -> 0.16)
        if (p >= 0.08 && p <= 0.16) {
          const markers = PROSPECTUS_CONTENT.seat.markers;
          for (const m of markers) {
            const mx = -currentW / 2 + (m.x / 100) * currentW;
            const my = -currentH / 2 + (m.y / 100) * currentH;
            const isHovered = activeMarker === m.id;

            // Connector pin line to outer label
            const labelDx = mx > 0 ? 55 : -55;
            const labelDy = my > 0 ? 30 : -30;

            ctx.strokeStyle = isHovered ? '#f59e0b' : 'rgba(255, 255, 255, 0.35)';
            ctx.lineWidth = isHovered ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(mx + labelDx * 0.5, my + labelDy * 0.5);
            ctx.lineTo(mx + labelDx, my + labelDy);
            ctx.stroke();

            // Pin dot
            ctx.fillStyle = isHovered ? '#f59e0b' : '#ffffff';
            ctx.beginPath();
            ctx.arc(mx, my, isHovered ? 4.5 : 3, 0, Math.PI * 2);
            ctx.fill();

            // Marker label text
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillStyle = isHovered ? '#fbbf24' : '#e4e4e7';
            ctx.textAlign = labelDx > 0 ? 'left' : 'right';
            ctx.fillText(m.label, mx + labelDx + (labelDx > 0 ? 4 : -4), my + labelDy + 3);
          }
        }
      }

      ctx.restore();
    }

    // --- LEVEL 03: THE SEAT AS A SYSTEM (0.22 -> 0.30) ---
    if (p >= 0.22 && p <= 0.30) {
      const sysAlpha = Math.min(1, Math.max(0, (p - 0.22) / 0.02)) * (p > 0.28 ? Math.max(0, 1 - (p - 0.28) / 0.02) : 1);
      ctx.save();
      ctx.globalAlpha = sysAlpha;
      ctx.translate(centerX, centerY);

      // Central Seat Node
      ctx.fillStyle = '#18181f';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('SEAT', 0, 4);

      // 5 Orbiting Concepts
      const concepts = PROSPECTUS_CONTENT.systemComponents;
      const count = concepts.length;
      const radius = Math.min(width * 0.34, 175);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const nx = Math.cos(angle) * radius;
        const ny = Math.sin(angle) * radius;

        // Radiating energy filament
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        ctx.setLineDash([]);

        // Concept Node
        ctx.fillStyle = '#0f0f15';
        ctx.strokeStyle = i === 4 ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)'; // Highlight Briefcase
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(nx, ny, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f4f4f5';
        ctx.textAlign = 'center';
        ctx.fillText(concepts[i].title, nx, ny + 3);
      }

      ctx.restore();
    }

    // --- LEVEL 04: THE BRIEFCASE (0.29 -> 0.39) ---
    if (p >= 0.29 && p <= 0.39) {
      const briefAlpha = Math.min(1, Math.max(0, (p - 0.29) / 0.02)) * (p > 0.37 ? Math.max(0, 1 - (p - 0.37) / 0.02) : 1);
      const stageP = (p - 0.29) / 0.08; // 0 to 1 inside level 04

      ctx.save();
      ctx.globalAlpha = briefAlpha;
      ctx.translate(centerX, centerY);

      // Briefcase 3D isometric chest/vault
      const bw = Math.min(width * 0.55, 260);
      const bh = bw * 0.65;

      // Outer Vault Box
      ctx.fillStyle = '#131118';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
      ctx.fillRect(-bw / 2, -bh / 2, bw, bh);

      // Brass Handle on top
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-bw * 0.2, -bh / 2);
      ctx.lineTo(-bw * 0.2, -bh / 2 - 14);
      ctx.lineTo(bw * 0.2, -bh / 2 - 14);
      ctx.lineTo(bw * 0.2, -bh / 2);
      ctx.stroke();

      // Brass latches
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-bw * 0.35, -bh * 0.1, 12, 18);
      ctx.fillRect(bw * 0.35 - 12, -bh * 0.1, 12, 18);

      // Dividend counter display inside briefcase
      const simulatedDividends = Math.floor(Math.min(1, stageP * 1.5) * 48200);
      ctx.fillStyle = '#08080c';
      ctx.fillRect(-bw * 0.4, -bh * 0.35, bw * 0.8, 32);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-bw * 0.4, -bh * 0.35, bw * 0.8, 32);

      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'center';
      ctx.fillText(`+${simulatedDividends.toLocaleString()} $TMF`, 0, -bh * 0.35 + 21);

      // Transfer Pathway Animation: WALLET A -> SEAT -> WALLET B
      const transferY = bh / 2 + 55;
      const transferProgress = Math.min(1, Math.max(0, (stageP - 0.4) * 2));

      // Wallet A
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('WALLET A', -bw * 0.45, transferY);

      // Seat icon in middle
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('SEAT (WITH BRIEFCASE)', 0, transferY);

      // Wallet B
      ctx.fillStyle = transferProgress > 0.8 ? '#34d399' : '#94a3b8';
      ctx.fillText('WALLET B', bw * 0.45, transferY);

      // Connecting transfer arrow
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-bw * 0.3, transferY - 4);
      ctx.lineTo(bw * 0.3, transferY - 4);
      ctx.stroke();

      // Traveling briefcase token on arrow
      const tokenX = -bw * 0.3 + (bw * 0.6) * transferProgress;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(tokenX, transferY - 4, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // --- LEVEL 05: FIVE FUNDS (0.38 -> 0.47) ---
    if (p >= 0.38 && p <= 0.47) {
      const fundAlpha = Math.min(1, Math.max(0, (p - 0.38) / 0.02)) * (p > 0.45 ? Math.max(0, 1 - (p - 0.45) / 0.02) : 1);
      ctx.save();
      ctx.globalAlpha = fundAlpha;
      ctx.translate(centerX, centerY);

      const funds = PROSPECTUS_CONTENT.funds;
      const count = funds.length;
      const ringRadius = Math.min(width * 0.36, 190);

      // Center Genesis Core
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw 5 Fund Stations
      for (let i = 0; i < count; i++) {
        const fund = funds[i];
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const fx = Math.cos(angle) * ringRadius;
        const fy = Math.sin(angle) * ringRadius;
        const isSelected = hoveredFund === fund.id;

        // Beacon ring
        ctx.strokeStyle = fund.color;
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.fillStyle = isSelected ? '#151520' : '#0c0c12';
        ctx.beginPath();
        ctx.arc(fx, fy, isSelected ? 38 : 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 800 member constellation dots around fund
        for (let d = 0; d < 8; d++) {
          const dAngle = (d / 8) * Math.PI * 2;
          const dx = fx + Math.cos(dAngle) * (isSelected ? 48 : 38);
          const dy = fy + Math.sin(dAngle) * (isSelected ? 48 : 38);
          ctx.fillStyle = fund.color;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Fund name
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = fund.color;
        ctx.textAlign = 'center';
        ctx.fillText(fund.name, fx, fy + 4);

        // 800 Seats badge
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#71717a';
        ctx.fillText('800 SEATS', fx, fy + 16);
      }

      ctx.restore();
    }

    // --- LEVEL 06 & 07: WEEKLY VOTING & CONTINUATION (0.46 -> 0.60) ---
    if (p >= 0.46 && p <= 0.60) {
      const voteAlpha = Math.min(1, Math.max(0, (p - 0.46) / 0.02)) * (p > 0.58 ? Math.max(0, 1 - (p - 0.58) / 0.02) : 1);
      const isContinuation = p >= 0.53;

      ctx.save();
      ctx.globalAlpha = voteAlpha;
      ctx.translate(centerX, centerY);

      // 13-week cyclic timeline
      const totalWeeks = 13;
      const timelineWidth = Math.min(width * 0.8, 480);
      const step = timelineWidth / (totalWeeks - 1);
      const startX = -timelineWidth / 2;
      const currentWeekProgress = Math.min(13, Math.max(1, Math.floor(((p - 0.46) / 0.12) * 13) + 1));

      // Base timeline line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(-startX, 0);
      ctx.stroke();

      // Render weeks 1 to 13
      for (let w = 1; w <= totalWeeks; w++) {
        const wx = startX + (w - 1) * step;
        const isActive = w <= currentWeekProgress;
        const isW13 = w === 13;

        // Week node
        ctx.fillStyle = isW13 ? '#f59e0b' : isActive ? '#60a5fa' : '#27272a';
        ctx.beginPath();
        ctx.arc(wx, 0, isW13 ? 7 : isActive ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();

        if (isW13) {
          // Pulse halo for Week 13 Continuation
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(wx, 0, 14, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label
        if (w === 1 || w === 6 || w === 13 || w === currentWeekProgress) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = isW13 ? '#fbbf24' : isActive ? '#93c5fd' : '#71717a';
          ctx.textAlign = 'center';
          ctx.fillText(`WK ${w.toString().padStart(2, '0')}`, wx, 22);
        }
      }

      // Floating On-Chain Ballot Card
      const cardY = -70;
      ctx.fillStyle = '#111116';
      ctx.strokeStyle = isContinuation ? '#f59e0b' : '#3b82f6';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-120, cardY - 30, 240, 52);
      ctx.fillRect(-120, cardY - 30, 240, 52);

      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = isContinuation ? '#fbbf24' : '#60a5fa';
      ctx.textAlign = 'center';
      ctx.fillText(isContinuation ? 'WEEK 13: CONTINUATION VOTE' : `WEEK ${currentWeekProgress.toString().padStart(2, '0')} MEMBER BALLOT`, 0, cardY - 10);

      ctx.font = '9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(isContinuation ? 'Members vote whether fund continues' : 'Weekly investment policy consensus', 0, cardY + 8);

      ctx.restore();
    }

    // --- LEVEL 08: ENROLLMENT (0.60 -> 0.67) ---
    if (p >= 0.60 && p <= 0.67) {
      const enAlpha = Math.min(1, Math.max(0, (p - 0.60) / 0.02)) * (p > 0.65 ? Math.max(0, 1 - (p - 0.65) / 0.02) : 1);
      ctx.save();
      ctx.globalAlpha = enAlpha;
      ctx.translate(centerX, centerY);

      const splitProgress = Math.min(1, (p - 0.60) / 0.05);

      // Central Load Fee Token Beam
      const beamY = -50 + splitProgress * 30;

      // 50% Burned Branch (Left)
      const leftX = -120 * splitProgress;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(leftX, 60);
      ctx.stroke();

      ctx.fillStyle = '#181012';
      ctx.strokeStyle = '#ef4444';
      ctx.strokeRect(leftX - 45, 60, 90, 40);
      ctx.fillRect(leftX - 45, 60, 90, 40);

      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f87171';
      ctx.textAlign = 'center';
      ctx.fillText('50%', leftX, 78);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('BURNED', leftX, 92);

      // 50% Fund Branch (Right)
      const rightX = 120 * splitProgress;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(rightX, 60);
      ctx.stroke();

      ctx.fillStyle = '#0e1814';
      ctx.strokeStyle = '#34d399';
      ctx.strokeRect(rightX - 45, 60, 90, 40);
      ctx.fillRect(rightX - 45, 60, 90, 40);

      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'center';
      ctx.fillText('50%', rightX, 78);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('TO FUND', rightX, 92);

      // Central Entrance
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('FRONT-END LOAD IN $TMF', 0, -30);

      ctx.restore();
    }

    // --- LEVEL 09: OPEN MARKET (0.67 -> 0.74) ---
    if (p >= 0.67 && p <= 0.74) {
      const mktAlpha = Math.min(1, Math.max(0, (p - 0.67) / 0.02)) * (p > 0.72 ? Math.max(0, 1 - (p - 0.72) / 0.02) : 1);
      ctx.save();
      ctx.globalAlpha = mktAlpha;
      ctx.translate(centerX, centerY);

      // 3 Paths from Till
      const paths = PROSPECTUS_CONTENT.openMarket.paths;
      const colWidth = Math.min(width * 0.28, 120);

      for (let i = 0; i < paths.length; i++) {
        const item = paths[i];
        const px = (i - 1) * (colWidth + 20);

        // Path Card
        ctx.fillStyle = '#101016';
        ctx.strokeStyle = i === 2 ? '#f87171' : i === 1 ? '#60a5fa' : '#34d399';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px - colWidth / 2, -60, colWidth, 120);
        ctx.fillRect(px - colWidth / 2, -60, colWidth, 120);

        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, px, -35);

        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillStyle = i === 2 ? '#f87171' : '#fbbf24';
        ctx.fillText(item.price, px, 0);

        ctx.font = '8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#71717a';
        ctx.fillText(i === 2 ? 'Sell to Till' : 'Buy from Till', px, 35);
      }

      ctx.restore();
    }

    // --- LEVEL 10: $TMF TOKEN ALLOCATION (0.74 -> 0.81) ---
    if (p >= 0.74 && p <= 0.81) {
      const tokAlpha = Math.min(1, Math.max(0, (p - 0.74) / 0.02)) * (p > 0.79 ? Math.max(0, 1 - (p - 0.79) / 0.02) : 1);
      ctx.save();
      ctx.globalAlpha = tokAlpha;
      ctx.translate(centerX, centerY);

      // Total Supply Monolith
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      ctx.fillText('1,604,401,000 $TMF', 0, -50);

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText('MINTED ONCE · NO TEAM ALLOCATION', 0, -25);

      // Visual split into 4,001 pieces
      const streamP = Math.min(1, (p - 0.74) / 0.05);
      const pieceCount = 18;
      for (let i = 0; i < pieceCount; i++) {
        const angle = (i / pieceCount) * Math.PI * 2;
        const dist = 30 + streamP * 70;
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist + 30;

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText('401,000 $TMF PER SEAT', 0, 40);

      ctx.restore();
    }

    // --- LEVEL 11: M&A (MERGERS & ACQUISITIONS) (0.81 -> 0.87) ---
    if (p >= 0.81 && p <= 0.87) {
      const maAlpha = Math.min(1, Math.max(0, (p - 0.81) / 0.02)) * (p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.02) : 1);
      const fuseProgress = Math.min(1, (p - 0.81) / 0.04);

      ctx.save();
      ctx.globalAlpha = maAlpha;
      ctx.translate(centerX, centerY);

      // Two Seats moving toward each other
      const initialDist = 130;
      const currentDist = initialDist * (1 - fuseProgress);

      if (fuseProgress < 0.9) {
        // Seat 1
        ctx.fillStyle = '#14141d';
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(-currentDist, 0, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('SEAT A', -currentDist, 3);

        // Seat 2
        ctx.beginPath();
        ctx.arc(currentDist, 0, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillText('SEAT B', currentDist, 3);
      } else {
        // Consolidated Single Seat: CORNER OFFICE
        ctx.fillStyle = '#1f1609';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText('CORNER OFFICE', 0, 4);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#34d399';
        ctx.fillText('CHECKS TRANSFERRED', 0, 58);
      }

      ctx.restore();
    }

    // --- LEVEL 12: 4,001 SEATS GALAXY (0.87 -> 0.94) ---
    if (p >= 0.87 && p <= 0.94) {
      const galAlpha = Math.min(1, Math.max(0, (p - 0.87) / 0.015)) * (p > 0.925 ? Math.max(0, 1 - (p - 0.925) / 0.015) : 1);
      ctx.save();
      ctx.globalAlpha = galAlpha;
      ctx.translate(centerX, centerY);

      // Galaxy pull-out camera scale
      const zoomFactor = Math.min(1, (p - 0.87) / 0.04);
      const camScale = 0.35 + zoomFactor * 0.45;
      ctx.scale(camScale, camScale);

      const fundColors = ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa'];
      const nodes = galaxySeatsRef.current;

      // Draw 4,001 seats as instanced luminous particles
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isSeat0 = node.fundIndex === 5;
        const color = isSeat0 ? '#ffffff' : fundColors[node.fundIndex];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSeat0 ? 5 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5 Fund Cluster Labels
      const funds = PROSPECTUS_CONTENT.funds;
      for (let f = 0; f < 5; f++) {
        const angle = (f / 5) * Math.PI * 2 - Math.PI / 2;
        const lx = Math.cos(angle) * 580;
        const ly = Math.sin(angle) * 580;

        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.fillStyle = fundColors[f];
        ctx.textAlign = 'center';
        ctx.fillText(`${funds[f].name} [800]`, lx, ly);
      }

      // Seat 0 Chairman Center Label
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('SEAT 0 (CHAIRMAN)', 0, 22);

      ctx.restore();
    }

    // --- LEVEL 13: THE SYSTEM / SEAT CYCLE (0.93 -> 0.97) ---
    if (p >= 0.93 && p <= 0.97) {
      const sysAlpha = Math.min(1, Math.max(0, (p - 0.93) / 0.01)) * (p > 0.96 ? Math.max(0, 1 - (p - 0.96) / 0.01) : 1);
      ctx.save();
      ctx.globalAlpha = sysAlpha;
      ctx.translate(centerX, centerY);

      // Circular Loop of 6 stages
      const cycleSteps = PROSPECTUS_CONTENT.systemMap.steps;
      const count = cycleSteps.length;
      const radius = Math.min(width * 0.35, 170);

      // Flow circle ring
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < count; i++) {
        const stepAngle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const sx = Math.cos(stepAngle) * radius;
        const sy = Math.sin(stepAngle) * radius;

        // Step Circle
        ctx.fillStyle = '#101016';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(cycleSteps[i].label, sx, sy + 3);
      }

      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'center';
      ctx.fillText('THE SEAT CYCLE', 0, 4);

      ctx.restore();
    }

    // --- LEVEL 14: NOBODY HOLDS THE KEYS (0.965 -> 0.985) ---
    if (p >= 0.965 && p <= 0.985) {
      const noAlpha = Math.min(1, Math.max(0, (p - 0.965) / 0.006)) * (p > 0.98 ? Math.max(0, 1 - (p - 0.98) / 0.005) : 1);
      ctx.save();
      ctx.globalAlpha = noAlpha;
      ctx.translate(centerX, centerY);

      // 3 Architectural Monoliths
      const tenets = PROSPECTUS_CONTENT.nobodyHoldsTheKeys.tenets;
      const colW = Math.min(width * 0.26, 130);

      for (let i = 0; i < tenets.length; i++) {
        const item = tenets[i];
        const tx = (i - 1) * (colW + 18);

        ctx.fillStyle = '#09090e';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx - colW / 2, -50, colW, 100);
        ctx.fillRect(tx - colW / 2, -50, colW, 100);

        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText(item.title, tx, -15);

        ctx.font = '8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#a1a1aa';
        ctx.fillText(item.desc.substring(0, 20), tx, 15);
      }

      ctx.restore();
    }

    // --- FINAL LEVEL: THE MUTUAL FUN GRAND COSMOS (0.985 -> 1.00) ---
    if (p >= 0.985) {
      const finalAlpha = Math.min(1, (p - 0.985) / 0.008);
      ctx.save();
      ctx.globalAlpha = finalAlpha;
      ctx.translate(centerX, centerY);

      // Grand cosmic pull-back showing complete ecosystem ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Golden center star
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }, [progress, activeMarker, hoveredFund]);

  // Animation frame runner
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full block cursor-default"
      />
    </div>
  );
};
