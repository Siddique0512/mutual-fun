import React, { useEffect, useRef, useState, useCallback } from 'react';
import portraitsImg from '../assets/images/tmf_authentic_seat_portraits_1791587827673.jpg';
import chairsImg from '../assets/images/tmf_chair_ladder_1791586778906.jpg';
import weirdosImg from '../assets/images/tmf_weirdos_gallery_1791586794634.jpg';
import briefcaseImg from '../assets/images/tmf_character_briefcase_1791582346261.jpg';
import traitVaultImg from '../assets/images/tmf_trait_vault_matrix_1791586805880.jpg';
import boardroomImg from '../assets/images/tmf_boardroom_seats_1791582332763.jpg';
import councilImg from '../assets/images/tmf_five_funds_council_1791582358961.jpg';
import ballotImg from '../assets/images/tmf_voting_ballot_1791574624509.jpg';
import terminalImg from '../assets/images/tmf_voting_seal_terminal_1791582369895.jpg';
import cosmosImg from '../assets/images/tmf_cosmos_seat_zero_1791582381074.jpg';
import { sound } from '../utils/audio';

export interface SceneCallout {
  id: string;
  x: number; // 0.0 to 1.0 (relative to image width)
  y: number; // 0.0 to 1.0 (relative to image height)
  name: string;
  whatIsThis: string;
  aimAndVision: string;
  isPortal?: boolean;
}

export interface InfiniteZoomStage {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  portal: {
    x: number; // center X of surrounding physical object
    y: number; // center Y of surrounding physical object
    radius: number; // aperture radius relative to image width
    shape: 'circle' | 'vignette';
    targetObjectName: string;
    targetObjectRole: string;
    aimAndVision: string;
    label?: string;
    description?: string;
  };
  callouts: SceneCallout[];
  summary: string;
}

export const ZOOM_STAGES: InfiniteZoomStage[] = [
  {
    id: 'authentic_seat_portraits',
    num: '01',
    title: 'THE 4,001 SEAT PORTRAITS',
    subtitle: 'Stock Certificate Series · 64×64 Pixel Art Stored On-Chain',
    imageSrc: portraitsImg,
    portal: {
      x: 0.500, // King Midas in his radiant Gilded Throne in the center
      y: 0.665,
      radius: 0.12,
      shape: 'circle',
      targetObjectName: "KING MIDAS' GILDED THRONE",
      targetObjectRole: 'Rung 8: 37 Seats (0.92% rarity) · Apex voting power',
      aimAndVision: '4,001 on-chain portraits randomly assigned across 5 competing funds',
      label: "KING MIDAS' GILDED THRONE",
      description: 'Zooming into Gilded Throne on-chain pixel portrait',
    },
    callouts: [],
    summary: '4,001 on-chain portraits randomly assigned across 5 funds. Every seat includes an engraved certificate frame, a fund wall color, an 8-tier chair, a seated shareholder, and an on-chain Briefcase.',
  },
  {
    id: 'chair_ladder',
    num: '02',
    title: 'THE CHAIR LADDER & RARITY',
    subtitle: '8 Mintable Tiers · Folding Chair to Gilded Throne',
    imageSrc: chairsImg,
    portal: {
      x: 0.895, // The glowing Gilded Throne on the right
      y: 0.520,
      radius: 0.11,
      shape: 'circle',
      targetObjectName: 'THE GILDED THRONE & CORNER DESK',
      targetObjectRole: 'Rung 8: 37 Seats (0.92% rarity) · Apex voting power',
      aimAndVision: 'Mergers (M&A) forge Corner Offices with +10% permanent weight bonus',
    },
    callouts: [
      {
        id: 'folding_chair',
        x: 0.085,
        y: 0.550,
        name: "INTERN'S FOLDING CHAIR",
        whatIsThis: 'Rung 1 · 1,235 Seats (30.87%)',
        aimAndVision: 'Base voting power (1.00x weight)',
      },
      {
        id: 'bankers_chair',
        x: 0.315,
        y: 0.540,
        name: "GREEN BANKER'S CHAIR",
        whatIsThis: 'Rung 4 · 560 Seats (14.00%)',
        aimAndVision: 'Mid-tier executive governance representation',
      },
      {
        id: 'gilded_throne',
        x: 0.895,
        y: 0.520,
        name: 'THE GILDED THRONE',
        whatIsThis: 'Rung 8 · 37 Seats (0.92%)',
        aimAndVision: 'Apex dividend yield and supreme ballot weight',
        isPortal: true,
      },
    ],
    summary: 'The chair is the collection’s primary rarity trait. 8 kinds from Folding Chair (30.87%) to Gilded Throne (0.92%). Merging two seats permanently unlocks a Corner Office with +10% dividend weight.',
  },
  {
    id: 'weirdos_gallery',
    num: '03',
    title: 'THE WEIRDOS DEPARTMENT',
    subtitle: '~15% Non-Human Sitters (601 of 4,001 Seats)',
    imageSrc: weirdosImg,
    portal: {
      x: 0.088, // The Briefcase beside Barney on the floor
      y: 0.825,
      radius: 0.11,
      shape: 'circle',
      targetObjectName: "BARNEY'S BRIEFCASE (ON FLOOR)",
      targetObjectRole: 'ERC-6551 Token-Bound Account owned by Seat',
      aimAndVision: 'Cashed dividends land in the briefcase and transfer with the NFT',
    },
    callouts: [
      {
        id: 'dog_partner',
        x: 0.180,
        y: 0.520,
        name: 'BARNEY THE RETRIEVER',
        whatIsThis: 'Non-Human Partner · 93 Seats',
        aimAndVision: 'Made partner purely on performance and merit',
      },
      {
        id: 'analyst_ghost',
        x: 0.415,
        y: 0.490,
        name: "FIRED ANALYST'S GHOST",
        whatIsThis: 'Spectral Shareholder · 89 Seats',
        aimAndVision: 'Eternal algorithmic memory on the blockchain',
      },
      {
        id: 'barney_briefcase',
        x: 0.088,
        y: 0.825,
        name: "ON-CHAIN BRIEFCASE (ON FLOOR)",
        whatIsThis: 'ERC-6551 Token-Bound Account',
        aimAndVision: 'Holds cashed dividends: $TMF and ETH',
        isPortal: true,
      },
    ],
    summary: '601 of 4,001 sitters are non-human: Ghost, Robot Quant, Alien Consultant, and Barney the Golden Retriever. Every sitter carries an on-chain Briefcase on the floor.',
  },
  {
    id: 'briefcase_vault',
    num: '04',
    title: 'THE ON-CHAIN BRIEFCASE VAULT',
    subtitle: 'ERC-6551 Token-Bound Account',
    imageSrc: briefcaseImg,
    portal: {
      x: 0.505, // The glowing ledger microchip inside the open briefcase
      y: 0.590,
      radius: 0.12,
      shape: 'circle',
      targetObjectName: 'CRYPTOGRAPHIC LEDGER CHIP',
      targetObjectRole: 'On-chain Trait Vault & bytecode storage address',
      aimAndVision: '114,367 bytes of sealed art code stored entirely on-chain',
    },
    callouts: [
      {
        id: 'dividend_vault',
        x: 0.300,
        y: 0.480,
        name: 'DIVIDEND ACCUMULATOR',
        whatIsThis: 'Autonomous Multi-Token Balance',
        aimAndVision: 'Collects $TMF and ETH. Belongs to the Seat, not your wallet.',
      },
      {
        id: 'load_fee_gate',
        x: 0.720,
        y: 0.450,
        name: 'ENROLLMENT 50/50 LOAD',
        whatIsThis: 'Active Participation Fee',
        aimAndVision: '50% burned forever, 50% deployed to fund investments.',
      },
      {
        id: 'ledger_chip',
        x: 0.505,
        y: 0.590,
        name: 'CRYPTOGRAPHIC LEDGER CHIP',
        whatIsThis: 'On-Chain Art Vault Interface',
        aimAndVision: 'Direct pointer into raw contract bytecode',
        isPortal: true,
      },
    ],
    summary: 'The Briefcase is an ERC-6551 account owned by the Seat. Cashed dividends land in it ($TMF, WETH). When the Seat is sold, the Briefcase and all accumulated funds transfer automatically to the buyer.',
  },
  {
    id: 'trait_vault',
    num: '05',
    title: 'THE ON-CHAIN TRAIT VAULT',
    subtitle: '114,367 Bytes Sealed Art · 64×64 Pixel Grid',
    imageSrc: traitVaultImg,
    portal: {
      x: 0.495, // The central glowing contract lock icon at the bottom
      y: 0.835,
      radius: 0.10,
      shape: 'circle',
      targetObjectName: 'SHA256 CONTRACT SEAL LOCK',
      targetObjectRole: 'Immutable cryptographic lock of The Mutual Fun',
      aimAndVision: 'Unbreakable code architecture governing executive boardroom operations',
    },
    callouts: [
      {
        id: 'raw_bytecode',
        x: 0.760,
        y: 0.280,
        name: '114,367 RAW BYTES',
        whatIsThis: 'Zero IPFS / Zero AWS Storage',
        aimAndVision: 'Every trait stored as raw immutable bytes in contract vault.',
      },
      {
        id: 'pixel_matrix',
        x: 0.490,
        y: 0.480,
        name: '64×64 MICRO-PIXEL MATRIX',
        whatIsThis: '64 Colors · 157 Traits across 8 Layers',
        aimAndVision: 'Dynamic on-chain SVG renderer renders portrait on demand.',
      },
      {
        id: 'contract_lock',
        x: 0.495,
        y: 0.835,
        name: 'SHA256 CONTRACT SEAL',
        whatIsThis: 'Immutable Code Guarantee',
        aimAndVision: 'No admin keys. No upgrade proxies.',
        isPortal: true,
      },
    ],
    summary: 'Every trait is stored as raw bytes in the Trait Vault on-chain (114,367 bytes total). 64×64 pixels, 64 colors, 157 traits across 8 layers. 100% decentralized with no external servers.',
  },
  {
    id: 'boardroom_seats',
    num: '06',
    title: 'THE EXECUTIVE BOARDROOM',
    subtitle: 'Shareholder Assembly & Trading Desks',
    imageSrc: boardroomImg,
    portal: {
      x: 0.440, // Central executive character and trading terminal
      y: 0.540,
      radius: 0.10,
      shape: 'circle',
      targetObjectName: 'EXECUTIVE TRADING TERMINAL',
      targetObjectRole: 'Direct portal into Grand Council Amphitheater',
      aimAndVision: 'Shareholders unite to direct collective fund investments',
    },
    callouts: [
      {
        id: 'board_seat',
        x: 0.440,
        y: 0.540,
        name: 'EXECUTIVE SEAT',
        whatIsThis: 'Enrolled Shareholder in Tufted Leather',
        aimAndVision: 'Actively participating in governance ballots',
        isPortal: true,
      },
      {
        id: 'trading_console',
        x: 0.780,
        y: 0.620,
        name: 'MARKET ORDER BOOK',
        whatIsThis: 'Autonomous Portfolio Allocations',
        aimAndVision: 'Members vote weekly on asset buys and sales',
      },
    ],
    summary: 'In this executive boardroom, enrolled Seat holders execute member governance. Active enrollment is required to receive dividends, ensuring only participating shareholders reap yields.',
  },
  {
    id: 'council_hall',
    num: '07',
    title: 'GRAND COUNCIL OF FIVE FUNDS',
    subtitle: 'Argon · Bogle · Smaug · Midas · Vladd',
    imageSrc: councilImg,
    portal: {
      x: 0.500, // Central illuminated voting podium in the amphitheater
      y: 0.725,
      radius: 0.11,
      shape: 'circle',
      targetObjectName: 'CENTRAL GOVERNANCE PODIUM',
      targetObjectRole: 'Weekly ballot collection console',
      aimAndVision: 'Democratic member voting drives competitive fund divergence',
    },
    callouts: [
      {
        id: 'five_banners',
        x: 0.500,
        y: 0.180,
        name: 'FIVE FUND BANNERS',
        whatIsThis: 'Argon · Bogle · Smaug · Midas · Vladd',
        aimAndVision: 'Five funds begin identical with 800 seats, diverging via votes.',
      },
      {
        id: 'till_reserves',
        x: 0.200,
        y: 0.650,
        name: 'THE TILL LIQUIDITY',
        whatIsThis: 'Automated Buyback Mechanism',
        aimAndVision: 'Random buyback (401k + 8%), Sell to Till (401k - 8%).',
      },
      {
        id: 'podium_console',
        x: 0.500,
        y: 0.725,
        name: 'GOVERNANCE PODIUM',
        whatIsThis: 'Weekly Investment Ballot Interface',
        aimAndVision: 'Tallies chair-weighted votes from enrolled seats',
        isPortal: true,
      },
    ],
    summary: 'The Grand Council Hall houses the five funds. Each began identical with 800 seats, diverging through member votes. Instant liquidity is provided by the Till with fixed mathematical buyback spreads.',
  },
  {
    id: 'voting_ballot',
    num: '08',
    title: 'THE WEEKLY GOVERNANCE BALLOT',
    subtitle: 'Chair-Weighted Democratic Voting',
    imageSrc: ballotImg,
    portal: {
      x: 0.520, // Mechanical Week 13 Continuation Seal switchboard
      y: 0.450,
      radius: 0.12,
      shape: 'circle',
      targetObjectName: 'WEEK 13 CONTINUATION SWITCHBOARD',
      targetObjectRole: 'Quarterly existential vote trigger',
      aimAndVision: 'Members decide if fund continues or liquidates backing to Till',
    },
    callouts: [
      {
        id: 'voting_keys',
        x: 0.280,
        y: 0.650,
        name: 'MECHANICAL BALLOT KEYS',
        whatIsThis: 'Proposal Voting Controls',
        aimAndVision: 'Weighted by chair ladder rank (1.00x up to 2.20x).',
      },
      {
        id: 'continuation_stamp',
        x: 0.520,
        y: 0.450,
        name: 'CONTINUATION SEAL SWITCH',
        whatIsThis: 'Week 13 Existential Vote Gate',
        aimAndVision: 'Protects capital: funds that fail vote liquidate back to ETH.',
        isPortal: true,
      },
    ],
    summary: 'Every week, enrolled members vote on investment proposals, rebalances, and distributions. Voting weight is governed by the chair ladder: from 1.00x for folding chairs up to 2.20x for merged Corner Offices.',
  },
  {
    id: 'voting_seal_terminal',
    num: '09',
    title: 'WEEK 13 CONTINUATION & THE TILL',
    subtitle: 'Quarterly Survival Mandate & M&A Mergers',
    imageSrc: terminalImg,
    portal: {
      x: 0.550, // Golden clockwork iris aperture in terminal center
      y: 0.515,
      radius: 0.12,
      shape: 'circle',
      targetObjectName: 'GOLDEN CLOCKWORK IRIS APERTURE',
      targetObjectRole: 'Passage into the sovereign 4,001 Seats cosmos',
      aimAndVision: 'Gateway into the decentralized, ownerless blockchain galaxy',
    },
    callouts: [
      {
        id: 'week13_seal',
        x: 0.250,
        y: 0.480,
        name: 'WEEK 13 MANDATE',
        whatIsThis: 'Quarterly Fund Continuation Vote',
        aimAndVision: 'If vote passes, fund locks for next quarter. If fails, ETH returns.',
      },
      {
        id: 'corner_office_ma',
        x: 0.780,
        y: 0.480,
        name: 'M&A CORNER OFFICE',
        whatIsThis: 'Merger of Two Enrolled Seats',
        aimAndVision: 'Combines two seats + 10% bonus for eternal boosted dividends.',
      },
      {
        id: 'iris_aperture',
        x: 0.550,
        y: 0.515,
        name: 'CLOCKWORK IRIS APERTURE',
        whatIsThis: 'Cosmic Aperture Gateway',
        aimAndVision: 'Opens into the 4,001 Seats cosmos',
        isPortal: true,
      },
    ],
    summary: 'Every 13th week, shareholders vote on continuation. Poorly performing funds dissolve and return backing to shareholders. Mergers & Acquisitions combine two seats into a permanent Corner Office.',
  },
  {
    id: 'seats_cosmos',
    num: '10',
    title: '4,001 SEATS COSMOS & SEAT 0',
    subtitle: '1,604,401,000 $TMF · Stop Trading Alone',
    imageSrc: cosmosImg,
    portal: {
      x: 0.500, // Central golden Chairman Seat 0 floating in space
      y: 0.495,
      radius: 0.08,
      shape: 'circle',
      targetObjectName: 'CHAIRMAN SEAT 0 (THE BUILDING)',
      targetObjectRole: 'Recursive link looping back to Boardroom Genesis',
      aimAndVision: 'Seat 0 belongs to the building and is never for sale',
    },
    callouts: [
      {
        id: 'seat_zero',
        x: 0.500,
        y: 0.495,
        name: 'CHAIRMAN SEAT 0',
        whatIsThis: 'The Eternal Unowned Seat',
        aimAndVision: 'Belongs to the building. Nobody holds the keys.',
        isPortal: true,
      },
      {
        id: 'tokenomics',
        x: 0.250,
        y: 0.780,
        name: '1.604 BILLION $TMF',
        whatIsThis: '401,000 $TMF per Seat · Zero Team Allocation',
        aimAndVision: 'Fully minted at genesis. No inflation, no dev tax.',
      },
      {
        id: 'autonomous_code',
        x: 0.780,
        y: 0.780,
        name: 'STOP TRADING ALONE',
        whatIsThis: 'Ownerless Smart Contract Architecture',
        aimAndVision: 'No admin keys, no pause button, completely immutable.',
      },
    ],
    summary: '1,604,401,000 $TMF total supply. Minted once, zero team allocation. Seat 0 belongs to the building and is never for sale. Autonomous, immutable, ownerless. Stop trading alone.',
  },
];

interface TrueInfiniteZoomCanvasProps {
  progress: number; // 0.0 to 1.0 (continuous virtual journey)
  onTargetProgressChange: (target: number) => void;
  onStageChange?: (stageIndex: number) => void;
}

export const TrueInfiniteZoomCanvas: React.FC<TrueInfiniteZoomCanvasProps> = ({
  progress,
  onTargetProgressChange,
  onStageChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesReady, setImagesReady] = useState(false);

  // Preload all 10 high-resolution pixel art images
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    ZOOM_STAGES.forEach((stage, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = stage.imageSrc;
      img.onload = () => {
        loaded++;
        if (loaded === ZOOM_STAGES.length) {
          imagesRef.current = imgs;
          setImagesReady(true);
        }
      };
      img.onerror = () => {
        // Fallback gracefully if any single image fails
        loaded++;
        if (loaded === ZOOM_STAGES.length) {
          imagesRef.current = imgs;
          setImagesReady(true);
        }
      };
      imgs[idx] = img;
    });
  }, []);

  // Sync canvas size to display
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  // Main high-precision render loop
  useEffect(() => {
    if (!imagesReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      updateCanvasSize();
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050308';
      ctx.fillRect(0, 0, w, h);

      // Disable smoothing for sharp pixel art rendition
      ctx.imageSmoothingEnabled = false;

      const numStages = ZOOM_STAGES.length;
      // Clamped virtual progress
      const p = Math.max(0, Math.min(1.0, progress));

      // Calculate continuous stage progression
      const virtualStage = p * (numStages - 1);
      const stageIdx = Math.floor(virtualStage);
      const nextStageIdx = (stageIdx + 1) % numStages;
      const localF = virtualStage - stageIdx; // 0.0 to 1.0 within current stage

      onStageChange?.(stageIdx);

      const currentStage = ZOOM_STAGES[stageIdx];
      const nextStage = ZOOM_STAGES[nextStageIdx];
      const currentImg = imagesRef.current[stageIdx];
      const nextImg = imagesRef.current[nextStageIdx];

      if (!currentImg) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Smooth camera interpolation
      // As localF advances, camera translates and zooms into portal.x, portal.y
      // Max zoom scale before handing off to next stage
      const maxZoomScale = 14.0;
      // Exponential zoom curve for classic Mandelbrot infinite-zoom feel
      const scale = 1.0 + (maxZoomScale - 1.0) * Math.pow(localF, 2.4);

      // Camera focal point shifts from center (0.5, 0.5) directly to portal (x, y)
      const targetFocusX = currentStage.portal.x;
      const targetFocusY = currentStage.portal.y;
      const focusProgress = Math.min(1.0, localF * 1.25);
      const smoothFocus = 0.5 - 0.5 * Math.cos(Math.PI * focusProgress);

      const camFocusX = 0.5 + (targetFocusX - 0.5) * smoothFocus;
      const camFocusY = 0.5 + (targetFocusY - 0.5) * smoothFocus;

      // Base display dimensions (contain aspect ratio)
      const imgAspect = (currentImg.naturalWidth || 1) / (currentImg.naturalHeight || 1);
      const viewAspect = w / h;

      let baseW: number, baseH: number;
      if (viewAspect > imgAspect) {
        baseH = h;
        baseW = h * imgAspect;
      } else {
        baseW = w;
        baseH = w / imgAspect;
      }

      const drawW = baseW * scale;
      const drawH = baseH * scale;

      // Position so that (camFocusX, camFocusY) is anchored at screen center (w/2, h/2)
      const drawX = w * 0.5 - camFocusX * drawW;
      const drawY = h * 0.5 - camFocusY * drawH;

      // 1. Draw CURRENT stage base image
      ctx.drawImage(currentImg, drawX, drawY, drawW, drawH);

      // 2. SEAMLESS ORGANIC PORTAL TO NEXT OBJECT:
      // Only when zoom is sufficiently close (localF > 0.35) does the interior of the physical
      // object begin organically resolving the next scene.
      // This guarantees the scene NEVER looks like a fake rectangle pasted on top!
      if (localF > 0.35 && nextImg) {
        const portalScreenX = drawX + targetFocusX * drawW;
        const portalScreenY = drawY + targetFocusY * drawH;
        const baseRadiusPx = currentStage.portal.radius * drawW;

        // Aperture expands organically as the camera pierces the object
        const apertureF = (localF - 0.35) / 0.65; // 0.0 to 1.0
        const smoothAperture = Math.pow(apertureF, 2.0);
        const radiusPx = baseRadiusPx * (1.0 + smoothAperture * 18.0);

        ctx.save();
        ctx.beginPath();
        ctx.arc(portalScreenX, portalScreenY, Math.max(1, radiusPx), 0, Math.PI * 2);
        ctx.clip();

        // Calculate next image placement inside portal
        // Next image starts at a scale that smoothly matches the incoming aperture
        const nextInScale = 0.08 + 0.92 * apertureF;
        const nextDrawW = baseW * nextInScale;
        const nextDrawH = baseH * nextInScale;
        const nextDrawX = portalScreenX - 0.5 * nextDrawW;
        const nextDrawY = portalScreenY - 0.5 * nextDrawH;

        ctx.globalAlpha = Math.min(1.0, apertureF * 1.8);
        ctx.drawImage(nextImg, nextDrawX, nextDrawY, nextDrawW, nextDrawH);

        // Soft internal feather glow around the physical object's rim
        const rimGrad = ctx.createRadialGradient(
          portalScreenX,
          portalScreenY,
          Math.max(0, radiusPx * 0.75),
          portalScreenX,
          portalScreenY,
          radiusPx
        );
        rimGrad.addColorStop(0, 'rgba(0,0,0,0)');
        rimGrad.addColorStop(1, 'rgba(5,3,8,0.85)');
        ctx.fillStyle = rimGrad;
        ctx.fill();

        ctx.restore();

        // Subtle glowing golden/cyan ring around the object aperture
        if (apertureF < 0.90) {
          const ringAlpha = Math.sin(apertureF * Math.PI) * 0.65;
          ctx.save();
          ctx.beginPath();
          ctx.arc(portalScreenX, portalScreenY, radiusPx, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(245, 158, 11, ${ringAlpha})`;
          ctx.lineWidth = Math.max(1.5, 3 * (1 - apertureF));
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. VIGNETTE & SUBTLE SCANLINE OVERLAY
      const scanGrad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        Math.min(w, h) * 0.35,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.75
      );
      scanGrad.addColorStop(0, 'rgba(0,0,0,0)');
      scanGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [imagesReady, progress, onStageChange, updateCanvasSize]);

  // Handle direct click on canvas to zoom into portal or click callouts
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near any callout pin
    const numStages = ZOOM_STAGES.length;
    const p = Math.max(0, Math.min(1.0, progress));
    const stageIdx = Math.floor(p * (numStages - 1));
    const currentStage = ZOOM_STAGES[stageIdx];

    // Trigger audio click feedback
    sound.play('click');

    // Advance smoothly to next stage
    const nextP = Math.min(1.0, (stageIdx + 1) / (numStages - 1));
    onTargetProgressChange(nextP);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0006;
    const newP = Math.max(0.0, Math.min(1.0, progress + delta));
    onTargetProgressChange(newP);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-[#050308]"
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
};
