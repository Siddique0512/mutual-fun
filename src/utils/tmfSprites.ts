// Generates authentic pixel-art sprites matching The Mutual Fun official art department style

export interface PixelSpriteSheet {
  characters: HTMLCanvasElement[];
  openBriefcase: HTMLCanvasElement;
  councilRoom: HTMLCanvasElement;
  votingTerminal: HTMLCanvasElement;
  galaxyCosmos: HTMLCanvasElement;
}

/**
 * Creates an offscreen canvas with nearest-neighbor crisp pixels
 */
function createPixelCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

/**
 * Generates the 7 official characters from The Mutual Fun art department
 */
export function generateTMFCharacters(): HTMLCanvasElement[] {
  const list: HTMLCanvasElement[] = [];

  // Common palette
  const BLACK = '#0c0808';
  const SUIT_TAN = '#9b7653';
  const SUIT_GREY = '#6b7280';
  const SUIT_BROWN = '#5c3a21';
  const SUIT_GREEN = '#2d5a3f';
  const SHIRT_WHITE = '#f3f4f6';
  const TIE_GREEN = '#15803d';
  const TIE_RED = '#b91c1c';
  const TIE_GOLD = '#d97706';
  const CHAIR_BLUE = '#60a5fa';
  const CHAIR_WOOD = '#854d0e';
  const CHAIR_DARK = '#262626';
  const BRIEFCASE_BROWN = '#78350f';
  const BRIEFCASE_BLUE = '#1e3a8a';
  const BRASS = '#fbbf24';

  // Base character canvas width=48, height=64
  const types = ['alien', 'mask', 'mannequin', 'dog', 'robot', 'skull', 'vampire'];

  types.forEach((type, idx) => {
    const { canvas, ctx } = createPixelCanvas(48, 64);

    // Floor shadow
    ctx.fillStyle = '#060404';
    ctx.fillRect(8, 56, 32, 4);

    // 1. Draw Chair
    if (type === 'alien') {
      // Blue executive high-back chair with padding
      ctx.fillStyle = CHAIR_BLUE;
      ctx.fillRect(12, 16, 24, 26);
      ctx.fillStyle = '#93c5fd';
      ctx.fillRect(14, 18, 20, 22);
      // Armrests
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 32, 3, 10);
      ctx.fillRect(35, 32, 3, 10);
      // Base column & casters
      ctx.fillStyle = '#334155';
      ctx.fillRect(22, 44, 4, 10);
      ctx.fillRect(14, 54, 20, 3);
    } else if (type === 'mask' || type === 'dog' || type === 'robot') {
      // Blue ladder-back / office frame chair
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(14, 18, 20, 24);
      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(16, 20, 16, 20);
      // Legs
      ctx.fillStyle = '#1e40af';
      ctx.fillRect(14, 44, 2, 13);
      ctx.fillRect(32, 44, 2, 13);
      ctx.fillRect(14, 52, 20, 2);
    } else {
      // Wooden high-back Windsor chair with vertical spindles
      ctx.fillStyle = CHAIR_WOOD;
      ctx.fillRect(14, 12, 20, 4); // top rail
      for (let s = 16; s <= 32; s += 4) {
        ctx.fillRect(s, 16, 2, 26); // spindles
      }
      ctx.fillRect(12, 36, 24, 5); // wooden seat
      // Armrests
      ctx.fillRect(10, 32, 3, 6);
      ctx.fillRect(35, 32, 3, 6);
      // Legs
      ctx.fillRect(14, 42, 3, 15);
      ctx.fillRect(31, 42, 3, 15);
      ctx.fillRect(16, 50, 16, 2);
    }

    // 2. Body / Suit
    const suitColor = 
      type === 'vampire' ? SUIT_GREEN :
      type === 'robot' ? SUIT_GREY :
      type === 'skull' ? SUIT_BROWN :
      type === 'dog' ? '#ffffff' : SUIT_TAN;

    // Torso
    ctx.fillStyle = suitColor;
    ctx.fillRect(17, 28, 14, 16);

    // Shirt & Tie
    if (type === 'dog') {
      // Suspenders
      ctx.fillStyle = '#18181b';
      ctx.fillRect(18, 28, 2, 16);
      ctx.fillRect(28, 28, 2, 16);
      // Red tie
      ctx.fillStyle = TIE_RED;
      ctx.fillRect(23, 30, 2, 12);
    } else {
      // White shirt collar
      ctx.fillStyle = SHIRT_WHITE;
      ctx.fillRect(22, 28, 4, 4);
      // Tie
      const tieColor = 
        type === 'alien' || type === 'mask' ? TIE_GREEN :
        type === 'robot' ? TIE_RED :
        type === 'vampire' || type === 'skull' ? TIE_GOLD : '#7f1d1d';
      ctx.fillStyle = tieColor;
      ctx.fillRect(23, 31, 2, 11);
    }

    // Hands folded in lap
    const skinTone = 
      type === 'alien' ? '#9ca3af' :
      type === 'mask' ? '#f3f4f6' :
      type === 'mannequin' ? '#d4a373' :
      type === 'dog' ? '#d4a373' :
      type === 'robot' ? '#94a3b8' :
      type === 'skull' ? '#f5f5f4' : '#fbcfe8';
    ctx.fillStyle = skinTone;
    ctx.fillRect(21, 38, 6, 4);

    // Legs & Shoes
    ctx.fillStyle = type === 'dog' ? '#18181b' : '#374151';
    ctx.fillRect(18, 44, 4, 11);
    ctx.fillRect(26, 44, 4, 11);
    // Shoes
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(16, 54, 6, 3);
    ctx.fillRect(26, 54, 6, 3);

    // 3. Heads
    if (type === 'alien') {
      // Smooth grey oval dome head
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(18, 14, 12, 14);
      ctx.fillRect(16, 17, 16, 9);
      // Giant slanted black almond eyes
      ctx.fillStyle = '#09090b';
      ctx.fillRect(19, 19, 4, 5);
      ctx.fillRect(25, 19, 4, 5);
    } else if (type === 'mask') {
      // Pale round mask with dark round eyes
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(19, 14, 10, 14);
      ctx.fillRect(17, 17, 14, 9);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(21, 19, 2, 4);
      ctx.fillRect(25, 19, 2, 4);
    } else if (type === 'mannequin') {
      // Segmented wooden head
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(19, 14, 10, 14);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(21, 19, 2, 2);
      ctx.fillRect(25, 19, 2, 2);
      ctx.fillRect(22, 24, 4, 1);
    } else if (type === 'dog') {
      // Golden retriever with floppy ears and tongue
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(18, 15, 12, 12);
      // Floppy ears on sides
      ctx.fillStyle = '#b45309';
      ctx.fillRect(16, 15, 3, 10);
      ctx.fillRect(29, 15, 3, 10);
      // Snout & tongue
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(22, 20, 4, 3);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(23, 23, 2, 2);
    } else if (type === 'robot') {
      // Grey tin robot with red antenna
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(23, 9, 2, 5); // antenna
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(18, 14, 12, 14);
      // Yellow glowing square eyes
      ctx.fillStyle = '#facc15';
      ctx.fillRect(20, 18, 3, 3);
      ctx.fillRect(25, 18, 3, 3);
      // Grille mouth
      ctx.fillStyle = '#475569';
      ctx.fillRect(21, 23, 6, 2);
    } else if (type === 'skull') {
      // Bone skull with square eye sockets
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(19, 14, 10, 14);
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(20, 18, 3, 4);
      ctx.fillRect(25, 18, 3, 4);
      ctx.fillRect(23, 23, 2, 2); // nose
      ctx.fillRect(22, 26, 4, 1); // teeth line
    } else if (type === 'vampire') {
      // Slick black hair, pale skin, red eyes
      ctx.fillStyle = '#09090b';
      ctx.fillRect(18, 13, 12, 5);
      ctx.fillRect(17, 15, 2, 6);
      ctx.fillRect(29, 15, 2, 6);
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(19, 16, 10, 12);
      // Red eyes
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(21, 19, 2, 2);
      ctx.fillRect(25, 19, 2, 2);
    }

    // 4. Briefcase on Floor
    const bColor = type === 'skull' ? BRIEFCASE_BLUE : BRIEFCASE_BROWN;
    ctx.fillStyle = bColor;
    ctx.fillRect(36, 45, 10, 11);
    ctx.fillStyle = BRASS;
    ctx.fillRect(39, 43, 4, 2); // handle
    ctx.fillRect(38, 49, 2, 2); // brass latch
    ctx.fillRect(44, 49, 2, 2); // brass latch

    // Optional Potted plant for Mask character (as in uploaded image!)
    if (type === 'mask') {
      ctx.fillStyle = '#991b1b'; // pot
      ctx.fillRect(6, 49, 6, 7);
      ctx.fillStyle = '#16a34a'; // plant leaves
      ctx.fillRect(7, 44, 4, 5);
      ctx.fillRect(5, 46, 2, 3);
      ctx.fillRect(11, 46, 2, 3);
    }

    list.push(canvas);
  });

  return list;
}

/**
 * Creates Scene 1: The Boardroom Lineup
 */
export function generateBoardroomScene(chars: HTMLCanvasElement[]): HTMLCanvasElement {
  const { canvas, ctx } = createPixelCanvas(384, 128);
  ctx.fillStyle = '#0a0707';
  ctx.fillRect(0, 0, 384, 128);

  // Subtle floor perspective slats
  ctx.fillStyle = '#140f0f';
  for (let x = 0; x < 384; x += 6) {
    ctx.fillRect(x, 90, 4, 38);
  }

  // Draw the 7 characters side by side exactly like the uploaded image
  const startX = 24;
  const spacing = 48;
  chars.forEach((c, i) => {
    ctx.drawImage(c, startX + i * spacing, 36);
  });

  return canvas;
}

/**
 * Creates Scene 2: Open Briefcase Vault with Cashed Dividends & Tokens
 */
export function generateBriefcaseScene(): HTMLCanvasElement {
  const { canvas, ctx } = createPixelCanvas(256, 256);
  ctx.fillStyle = '#0a0707';
  ctx.fillRect(0, 0, 256, 256);

  // Wooden desk surface
  ctx.fillStyle = '#171111';
  ctx.fillRect(0, 140, 256, 116);

  // Open Briefcase Box
  // Outer leather shell
  ctx.fillStyle = '#5c2d12';
  ctx.fillRect(32, 50, 192, 130);

  // Brass corner guards & hinges
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(30, 48, 8, 8);
  ctx.fillRect(218, 48, 8, 8);
  ctx.fillRect(30, 172, 8, 8);
  ctx.fillRect(218, 172, 8, 8);

  // Deep green velvet interior lining
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(40, 58, 176, 114);

  // Left side: Stacks of on-chain ledger sheets
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(52, 70, 60, 45);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(54, 72, 56, 41);
  ctx.fillStyle = '#64748b';
  // Text lines on ledger
  for (let y = 78; y <= 108; y += 6) {
    ctx.fillRect(58, y, 46, 2);
  }

  // Right side: Cascading $TMF Gold & Emerald Dividend Coins
  // Draw pixel coin stacks
  const drawCoin = (cx: number, cy: number, color: string, rim: string) => {
    ctx.fillStyle = rim;
    ctx.fillRect(cx - 7, cy - 7, 14, 14);
    ctx.fillStyle = color;
    ctx.fillRect(cx - 5, cy - 5, 10, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1, cy - 1, 2, 2); // glint
  };

  // Multiple coins spilling out
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const isGold = (row + col) % 2 === 0;
      drawCoin(
        135 + col * 14 + (row % 2) * 5,
        78 + row * 16,
        isGold ? '#fbbf24' : '#34d399',
        isGold ? '#b45309' : '#059669'
      );
    }
  }

  // Center Emblem on the ledger: The Five Funds Compass (Target portal for next zoom!)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(100, 100, 56, 56);
  ctx.fillStyle = '#fbbf24';
  ctx.strokeRect(100, 100, 56, 56);
  ctx.fillRect(124, 104, 8, 48);
  ctx.fillRect(104, 124, 48, 8);

  // Brass latches and lock
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(120, 180, 16, 10);
  ctx.fillStyle = '#000000';
  ctx.fillRect(126, 184, 4, 4);

  return canvas;
}

/**
 * Creates Scene 3: The Five Funds Council Room
 */
export function generateCouncilScene(): HTMLCanvasElement {
  const { canvas, ctx } = createPixelCanvas(256, 256);
  ctx.fillStyle = '#0a0707';
  ctx.fillRect(0, 0, 256, 256);

  // Dark stone architectural pillars
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(12, 10, 20, 236);
  ctx.fillRect(224, 10, 20, 236);

  // 5 Hanging Fund Banners in authentic pixel art
  const funds = [
    { name: 'ARGON', color: '#60a5fa', emblem: 'atom' },
    { name: 'BOGLE', color: '#34d399', emblem: 'compass' },
    { name: 'SMAUG', color: '#f87171', emblem: 'dragon' },
    { name: 'MIDAS', color: '#fbbf24', emblem: 'gold' },
    { name: 'VLADD', color: '#a78bfa', emblem: 'bat' },
  ];

  funds.forEach((f, idx) => {
    const bx = 42 + idx * 36;
    const by = 24;
    // Banner cloth
    ctx.fillStyle = f.color;
    ctx.fillRect(bx, by, 28, 48);
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(bx + 2, by + 2, 24, 44);

    // Banner Text
    ctx.fillStyle = f.color;
    ctx.fillRect(bx + 4, by + 6, 20, 3);

    // Emblem
    ctx.fillStyle = f.color;
    ctx.fillRect(bx + 8, by + 18, 12, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 12, by + 22, 4, 4);
  });

  // Circular Council Table at center
  ctx.fillStyle = '#292524';
  ctx.beginPath();
  ctx.ellipse(128, 170, 80, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 5 Seated Council Members around the table
  for (let m = 0; m < 5; m++) {
    const angle = (m / 5) * Math.PI * 2;
    const mx = 128 + Math.cos(angle) * 70;
    const my = 170 + Math.sin(angle) * 32;

    ctx.fillStyle = funds[m].color;
    ctx.fillRect(mx - 6, my - 12, 12, 12);
    ctx.fillStyle = '#f5f5f4';
    ctx.fillRect(mx - 4, my - 16, 8, 8); // head
  }

  // Central on-chain voting beacon on table (Next Zoom Portal!)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(128, 170, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(124, 166, 8, 8);

  return canvas;
}

/**
 * Creates Scene 4: Weekly Voting Terminal & Week 13 Continuation Seal
 */
export function generateVotingScene(): HTMLCanvasElement {
  const { canvas, ctx } = createPixelCanvas(256, 256);
  ctx.fillStyle = '#0a0707';
  ctx.fillRect(0, 0, 256, 256);

  // Heavy steel governance terminal casing
  ctx.fillStyle = '#1e1e24';
  ctx.fillRect(20, 20, 216, 216);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 216, 216);

  // Monitor screen bezel
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(36, 36, 184, 130);

  // Screen header: WEEKLY BALLOT
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(44, 44, 80, 6);

  // 13 Weeks cadence timeline bar
  ctx.fillStyle = '#334155';
  ctx.fillRect(44, 60, 168, 6);
  for (let w = 0; w < 13; w++) {
    ctx.fillStyle = w === 12 ? '#f59e0b' : '#60a5fa';
    ctx.fillRect(44 + w * 13, 58, 6, 10);
  }

  // Golden Week 13 Continuation Seal at center (Next Portal!)
  const cx = 128;
  const cy = 114;
  const radius = 32;

  // Outer golden scalloped ring
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
  ctx.fill();

  // Pixel laurel wreath & "W13" emblem
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx - 10, cy - 6, 6, 12);
  ctx.fillRect(cx - 2, cy - 6, 4, 12);
  ctx.fillRect(cx + 4, cy - 6, 6, 12);

  // Physical Terminal mechanical buttons below
  ctx.fillStyle = '#15803d'; // Vote YES
  ctx.fillRect(46, 180, 48, 20);
  ctx.fillStyle = '#b91c1c'; // Vote NO
  ctx.fillRect(106, 180, 48, 20);
  ctx.fillStyle = '#d97706'; // Delegate
  ctx.fillRect(166, 180, 44, 20);

  return canvas;
}

/**
 * Creates Scene 5: 4,001 Seats Galaxy Cosmos & Chairman Seat 0
 */
export function generateGalaxyScene(): HTMLCanvasElement {
  const { canvas, ctx } = createPixelCanvas(256, 256);
  ctx.fillStyle = '#080505';
  ctx.fillRect(0, 0, 256, 256);

  // 4,001 pixel stars in 5 spiral arms
  const fundColors = ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa'];
  const cx = 128;
  const cy = 128;

  for (let f = 0; f < 5; f++) {
    const baseAngle = (f / 5) * Math.PI * 2;
    const color = fundColors[f];

    for (let s = 0; s < 400; s++) {
      const dist = 12 + Math.sqrt(s / 400) * 105;
      const angle = baseAngle + (dist / 120) * Math.PI * 1.8;
      const px = cx + Math.cos(angle) * dist + (Math.sin(s * 9) * 4);
      const py = cy + Math.sin(angle) * dist + (Math.cos(s * 9) * 4);

      if (px >= 0 && px < 256 && py >= 0 && py < 256) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(px), Math.floor(py), s % 8 === 0 ? 2 : 1, s % 8 === 0 ? 2 : 1);
      }
    }
  }

  // Central Golden Chairman Seat 0 Throne
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - 14, cy - 18, 28, 36);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx - 12, cy - 16, 24, 32);

  // Chair back cushioning & armrests
  ctx.fillStyle = '#d97706';
  ctx.fillRect(cx - 8, cy - 12, 16, 20);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(cx - 14, cy, 4, 12);
  ctx.fillRect(cx + 10, cy, 4, 12);

  // Glowing crown / halo
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(cx - 6, cy - 22, 12, 3);
  ctx.fillRect(cx - 2, cy - 24, 4, 2);

  return canvas;
}
