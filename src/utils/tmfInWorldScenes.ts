// Generates pristine, high-resolution pixel art scenes with in-world prospectus text and diagrams
import { generateTMFCharacters } from './tmfSprites';

function createHDCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

/**
 * SCENE 0: The Boardroom Lineup & Genesis Seat Overview
 * 1024 x 1024
 */
export function createScene0_Lineup(): HTMLCanvasElement {
  const { canvas, ctx } = createHDCanvas(1024, 1024);

  // Deep obsidian background
  ctx.fillStyle = '#080505';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle architectural grid wall
  ctx.strokeStyle = '#140f0f';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 680);
    ctx.stroke();
  }
  for (let y = 0; y < 680; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Wooden floor with perspective boards
  ctx.fillStyle = '#120d0d';
  ctx.fillRect(0, 680, 1024, 344);
  ctx.fillStyle = '#191212';
  for (let x = 0; x < 1024; x += 24) {
    ctx.fillRect(x, 680, 12, 344);
  }

  // Top In-World Typography
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('THE MUTUAL FUN', 512, 110);

  ctx.fillStyle = '#ededed';
  ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EVERY SEAT BELONGS TO ONE FUND.', 512, 165);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '18px "JetBrains Mono", monospace';
  ctx.fillText('4,001 ON-CHAIN SEATS · 64×64 PIXEL PORTRAITS · 11 UNIQUE CHARACTERS', 512, 210);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('THE CHAIR IS THE MAIN RARITY TRAIT · AN ON-CHAIN BRIEFCASE BELONGS TO EACH SEAT', 512, 245);

  // Draw the 7 official characters scaled up crisply in the center
  const chars = generateTMFCharacters();
  const charScale = 3.2; // Each 48x64 char becomes ~154x205 px
  const charW = 48 * charScale;
  const charH = 64 * charScale;
  const startX = 512 - (3.5 * (charW - 14));

  chars.forEach((c, idx) => {
    const cx = startX + idx * (charW - 14);
    const cy = 460;
    ctx.drawImage(c, cx, cy, charW, charH);
  });

  // Callout banner above the center executive chair pointing to the Briefcase
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(330, 780, 364, 76);
  ctx.fillRect(330, 780, 364, 76);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('► TARGET: ON-CHAIN BRIEFCASE', 512, 812);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('Cashed returns collect here · Travels with Seat', 512, 836);

  return canvas;
}

/**
 * SCENE 1: The Open Briefcase Vault & On-Chain Ledger
 * 1024 x 1024
 */
export function createScene1_Briefcase(): HTMLCanvasElement {
  const { canvas, ctx } = createHDCanvas(1024, 1024);

  // Dark obsidian table background
  ctx.fillStyle = '#0a0707';
  ctx.fillRect(0, 0, 1024, 1024);

  // Outer Leather Briefcase Shell
  ctx.fillStyle = '#54260d'; // Rich saddle leather
  ctx.fillRect(60, 60, 904, 904);

  // Stitched leather rim
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 6;
  ctx.strokeRect(70, 70, 884, 884);

  // Brass Corner Plates with Rivets
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x, y, 48, 48);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x + 10, y + 10, 8, 8);
    ctx.fillRect(x + 30, y + 30, 8, 8);
  };
  drawCorner(60, 60);
  drawCorner(916, 60);
  drawCorner(60, 916);
  drawCorner(916, 916);

  // Emerald Velvet Interior Lining
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(100, 100, 824, 824);

  // TOP HEADER EMBEDDED IN BRIEFCASE
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('THE ON-CHAIN BRIEFCASE VAULT', 512, 145);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CASHED DIVIDENDS COLLECT HERE.', 512, 195);

  // LEFT SIDE: The Official On-Chain Ledger Document (With real legible text, NO placeholder bars!)
  ctx.fillStyle = '#f8fafc'; // Crisp parchment paper
  ctx.fillRect(130, 240, 480, 560);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(130, 240, 480, 560);

  // Document Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('THE MUTUAL FUN // SEAT CHARTER', 155, 280);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillText('OFFICIAL PROSPECTUS RECORD — TOKENOMICS & DIVIDENDS', 155, 305);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(155, 320);
  ctx.lineTo(585, 320);
  ctx.stroke();

  // Document Content: Real Legible Prospectus Rules!
  const docLines = [
    { title: '1. DIVIDEND COLLECTION', desc: 'Cashed returns from fund investments distribute straight to the Briefcase.' },
    { title: '2. WALLET-TO-WALLET MOBILITY', desc: 'The Briefcase is on-chain. When a Seat is transferred, the Briefcase travels with it.' },
    { title: '3. BUYER PAYMENT CLAUSE', desc: 'Its balance becomes an integral part of the buyer\'s purchase payment.' },
    { title: '4. ENROLLMENT REQUIREMENT', desc: 'Holding a seat earns nothing until enrolled with a one-time front-end load.' },
    { title: '5. FRONT-END LOAD SPLIT', desc: 'Load fee: Exactly 50% is burned; 50% is added directly to the Fund.' },
    { title: '6. TRANSFER CONDITION', desc: 'Enrollment automatically expires whenever the Seat changes hands.' },
  ];

  let lineY = 350;
  docLines.forEach((item) => {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(item.title, 155, lineY);

    ctx.fillStyle = '#475569';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(item.desc, 155, lineY + 18);
    lineY += 46;
  });

  // Stamp at the bottom of the ledger: FIVE FUNDS COUNCIL EMBLEM (The Target Portal!)
  const stampX = 370;
  const stampY = 680;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(stampX - 70, stampY - 45, 140, 90);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(stampX - 70, stampY - 45, 140, 90);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('FIVE FUNDS COUNCIL', stampX, stampY - 15);
  ctx.fillText('► ZOOM PORTAL ◄', stampX, stampY + 6);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText('ENTER COUNCIL HALL', stampX, stampY + 26);

  // RIGHT SIDE: Stacks of Gold & Emerald Coins
  ctx.fillStyle = '#022c22';
  ctx.fillRect(640, 240, 250, 560);
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2;
  ctx.strokeRect(640, 240, 250, 560);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('VAULT RESERVES', 765, 280);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('+48,200 $TMF CASHED', 765, 305);

  // Draw 24 pixel coins in the vault
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 3; c++) {
      const isGold = (r + c) % 2 === 0;
      const coinX = 685 + c * 50;
      const coinY = 360 + r * 65;

      ctx.fillStyle = isGold ? '#b45309' : '#047857';
      ctx.beginPath();
      ctx.arc(coinX, coinY, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isGold ? '#fbbf24' : '#34d399';
      ctx.beginPath();
      ctx.arc(coinX, coinY, 17, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(coinX - 3, coinY - 3, 6, 6);
    }
  }

  // Quote at bottom of briefcase
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('“The Briefcase is on-chain. It travels with the Seat.” — The Mutual Fun Prospectus', 512, 860);

  return canvas;
}

/**
 * SCENE 2: The Five Funds Council Hall
 * 1024 x 1024
 */
export function createScene2_Council(): HTMLCanvasElement {
  const { canvas, ctx } = createHDCanvas(1024, 1024);

  // Dark stone sanctuary
  ctx.fillStyle = '#080606';
  ctx.fillRect(0, 0, 1024, 1024);

  // Pillars
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(20, 0, 60, 1024);
  ctx.fillRect(944, 0, 60, 1024);

  // Top In-World Headline
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText('THE FIVE FUNDS COUNCIL', 512, 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ARGON · BOGLE · SMAUG · MIDAS · VLADD', 512, 120);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('FIVE FUNDS BEGIN WITH THE SAME STRUCTURE · THEY DIFFER THROUGH MEMBER DECISIONS', 512, 160);

  // The 5 Banners rendered with high detail and text!
  const funds = [
    { name: 'ARGON', color: '#60a5fa', title: 'DIVISION I', mandate: 'Liquid Alpha & Tech', seats: '800 SEATS' },
    { name: 'BOGLE', color: '#34d399', title: 'DIVISION II', mandate: 'Low-Cost Indexing', seats: '800 SEATS' },
    { name: 'SMAUG', color: '#f87171', title: 'DIVISION III', mandate: 'Treasury Reserves', seats: '800 SEATS' },
    { name: 'MIDAS', color: '#fbbf24', title: 'DIVISION IV', mandate: 'Sovereign Returns', seats: '800 SEATS' },
    { name: 'VLADD', color: '#a78bfa', title: 'DIVISION V', mandate: 'Autonomous Macro', seats: '800 SEATS' },
  ];

  funds.forEach((f, idx) => {
    const bx = 100 + idx * 168;
    const by = 210;
    const bw = 148;
    const bh = 260;

    // Banner fabric
    ctx.fillStyle = f.color;
    ctx.fillRect(bx, by, bw, bh);

    ctx.fillStyle = '#0f0c0c';
    ctx.fillRect(bx + 4, by + 4, bw - 8, bh - 8);

    // Banner Text
    ctx.fillStyle = f.color;
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText(f.name, bx + bw / 2, by + 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(f.title, bx + bw / 2, by + 75);

    ctx.fillStyle = f.color;
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(f.seats, bx + bw / 2, by + 110);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(f.mandate, bx + bw / 2, by + 145);

    // Emblem box
    ctx.strokeStyle = f.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx + 35, by + 175, bw - 70, 55);
    ctx.fillStyle = f.color;
    ctx.fillRect(bx + bw / 2 - 10, by + 192, 20, 20);
  });

  // Middle Section: Open Market & Till Buybacks Board
  ctx.fillStyle = '#14141d';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 500, 824, 95);
  ctx.fillRect(100, 500, 824, 95);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('OPEN MARKET LIQUIDITY // THE TILL BACKS BUYBACKS', 512, 530);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('RANDOM CHAIR: 401k + 8%   |   SPECIFIC CHAIR: 401k + 16%   |   SELL TO TILL: 401k − 8%', 512, 565);

  // Bottom Section: The Great Round Table
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(512, 780, 360, 160, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 5 Council Members around the table
  for (let m = 0; m < 5; m++) {
    const angle = (m / 5) * Math.PI * 2 - Math.PI / 2;
    const mx = 512 + Math.cos(angle) * 310;
    const my = 780 + Math.sin(angle) * 125;

    ctx.fillStyle = funds[m].color;
    ctx.fillRect(mx - 24, mx < 512 ? my - 24 : my - 34, 48, 48);
  }

  // CENTER CONSOLE OF THE TABLE: WEEKLY GOVERNANCE TERMINAL (The Target Portal!)
  const portX = 512;
  const portY = 780;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(portX, portY, 85, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillText('WEEKLY VOTING', portX, portY - 20);
  ctx.fillText('► TARGET ◄', portX, portY + 4);
  ctx.fillStyle = '#60a5fa';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('WEEK 13 SEAL', portX, portY + 28);

  return canvas;
}

/**
 * SCENE 3: The Weekly Voting Terminal & Week 13 Continuation Seal
 * 1024 x 1024
 */
export function createScene3_Voting(): HTMLCanvasElement {
  const { canvas, ctx } = createHDCanvas(1024, 1024);

  // Outer dark cabinet
  ctx.fillStyle = '#09090e';
  ctx.fillRect(0, 0, 1024, 1024);

  // Industrial terminal metal chassis
  ctx.fillStyle = '#1e212b';
  ctx.fillRect(40, 40, 944, 944);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, 944, 944);

  // Main Display CRT Glass
  ctx.fillStyle = '#050811';
  ctx.fillRect(80, 80, 864, 620);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  ctx.strokeRect(80, 80, 864, 620);

  // CRT Screen Top Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText('GOVERNANCE INTERFACE // THE MUTUAL FUN', 512, 130);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MEMBERS VOTE WEEKLY ON HOW THEIR FUND INVESTS.', 512, 180);

  // 13-Week Timeline Track
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(120, 220, 784, 40);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 220, 784, 40);

  for (let w = 1; w <= 13; w++) {
    const wx = 125 + (w - 1) * 60;
    const isW13 = w === 13;

    ctx.fillStyle = isW13 ? '#f59e0b' : '#3b82f6';
    ctx.fillRect(wx + 10, 228, 40, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`W${w}`, wx + 30, 245);
  }

  // LEFT SIDE OF MONITOR: M&A Mergers & Acquisitions Protocol
  ctx.fillStyle = '#090d16';
  ctx.fillRect(120, 290, 360, 380);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 290, 360, 380);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('MERGERS & ACQUISITIONS (M&A)', 140, 330);

  const maRules = [
    '• SEAT + SEAT → MERGE → ONE SEAT',
    '• Two enrolled Seats in same fund and class merge into one a class higher.',
    '• SUPPLY GETS SMALLER: Deflationary consolidation mechanism.',
    '• CHECKS TRANSFER: The retired chair’s dividend checks transfer to survivor.',
    '• OUTCOME: Resulting Seat achieves CORNER OFFICE status.',
  ];

  let maY = 370;
  maRules.forEach(r => {
    ctx.fillStyle = r.startsWith('• SEAT') ? '#34d399' : '#cbd5e1';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(r, 140, maY);
    maY += 45;
  });

  // RIGHT SIDE OF MONITOR: THE GOLDEN WEEK 13 CONTINUATION SEAL (The Target Portal!)
  const sealX = 690;
  const sealY = 480;
  const sealRadius = 120;

  // Outer golden laurels
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius + 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0c0a09';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('WEEK 13', sealX, sealY - 45);
  ctx.fillText('CONTINUATION', sealX, sealY - 18);
  ctx.fillText('VOTE', sealX, sealY + 8);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText('► TARGET: 4,001 SEATS ◄', sealX, sealY + 45);

  // Below Monitor: Physical Mechanical Push Buttons
  ctx.fillStyle = '#15803d'; // Green Button: VOTE YES
  ctx.fillRect(150, 750, 200, 75);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('VOTE YES [FUND]', 250, 795);

  ctx.fillStyle = '#b91c1c'; // Red Button: VOTE NO
  ctx.fillRect(412, 750, 200, 75);
  ctx.fillText('VOTE NO', 512, 795);

  ctx.fillStyle = '#d97706'; // Amber Button: DELEGATE
  ctx.fillRect(674, 750, 200, 75);
  ctx.fillText('DELEGATE', 774, 795);

  // Quote on bottom metal panel
  ctx.fillStyle = '#fef08a';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('“Every 13th week, members vote on whether the fund continues.” — The Mutual Fun Prospectus', 512, 885);

  return canvas;
}

/**
 * SCENE 4: The 4,001 Seats Cosmos & Autonomous Protocol
 * 1024 x 1024
 */
export function createScene4_Galaxy(): HTMLCanvasElement {
  const { canvas, ctx } = createHDCanvas(1024, 1024);

  // Infinite deep cosmos background
  ctx.fillStyle = '#050303';
  ctx.fillRect(0, 0, 1024, 1024);

  // Top Cosmic Charter Inscription
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText('THE NETWORK ARCHITECTURE', 512, 75);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('4,001 SEATS · 5 FUNDS · NOBODY HOLDS THE KEYS', 512, 135);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('1,604,401,000 $TMF TOTAL SUPPLY · 401,000 PER SEAT', 512, 185);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('MINTED ONCE · NO TEAM ALLOCATION · FIXED IMMUTABLE SUPPLY', 512, 225);

  // 4,001 Stars swirling in 5 spiral arms around center (512, 560)
  const cx = 512;
  const cy = 560;
  const fundColors = ['#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa'];
  const fundNames = ['ARGON [800]', 'BOGLE [800]', 'SMAUG [800]', 'MIDAS [800]', 'VLADD [800]'];

  for (let f = 0; f < 5; f++) {
    const baseAngle = (f / 5) * Math.PI * 2;
    const color = fundColors[f];

    for (let s = 0; s < 800; s++) {
      const dist = 30 + Math.sqrt(s / 800) * 310;
      const angle = baseAngle + (dist / 330) * Math.PI * 2.2;
      const px = cx + Math.cos(angle) * dist + (Math.sin(s * 7) * 9);
      const py = cy + Math.sin(angle) * dist + (Math.cos(s * 7) * 9);

      if (px >= 0 && px < 1024 && py >= 0 && py < 1024) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(px), Math.floor(py), s % 7 === 0 ? 3 : 2, s % 7 === 0 ? 3 : 2);
      }
    }

    // Label at outer edge of each arm
    const lx = cx + Math.cos(baseAngle + 2.2) * 350;
    const ly = cy + Math.sin(baseAngle + 2.2) * 350;
    ctx.fillStyle = color;
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(fundNames[f], lx, ly);
  }

  // CENTRAL GOLDEN CHAIRMAN SEAT 0 THRONE (Target Portal that loops into Genesis!)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - 38, cy - 50, 76, 100);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx - 32, cy - 44, 64, 88);

  ctx.fillStyle = '#d97706';
  ctx.fillRect(cx - 22, cy - 34, 44, 55);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 13px "JetBrains Mono", monospace';
  ctx.fillText('SEAT 0', cx, cy - 65);
  ctx.fillText('CHAIRMAN', cx, cy + 70);

  // Bottom 3 Autonomous Pillars Inscription
  ctx.fillStyle = '#111827';
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  ctx.strokeRect(120, 870, 784, 80);
  ctx.fillRect(120, 870, 784, 80);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('[ NO OWNER ]     ·     [ NO UPGRADE MECHANISM ]     ·     [ NO PAUSE SWITCH ]', 512, 905);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('Routine functions can be called by anyone. Everything else runs automatically.', 512, 932);

  // Final Call to Action
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText('STOP TRADING ALONE.', 512, 988);

  return canvas;
}
