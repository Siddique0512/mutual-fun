// Generates authentic 64x64 on-chain pixel portrait data for The Mutual Fun Seats

export interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const PORTRAIT_TRAITS = [
  { name: 'The Architect', chair: 'Eames Walnut Executive', rarity: 'Legendary' },
  { name: 'The Operator', chair: 'Ergonomic Mesh Aeron', rarity: 'Common' },
  { name: 'The Quant', chair: 'Monolithic Carbon Fiber', rarity: 'Rare' },
  { name: 'The Steward', chair: 'Tufted Emerald Leather', rarity: 'Uncommon' },
  { name: 'The Sovereign', chair: 'Gold Gilded High-Back', rarity: 'Mythic' },
  { name: 'The Trustee', chair: 'Blackened Iron Swivel', rarity: 'Rare' },
  { name: 'The Pioneer', chair: 'Classic Teakwood Armchair', rarity: 'Uncommon' },
  { name: 'The Custodian', chair: 'Minimalist Steel Frame', rarity: 'Common' },
  { name: 'The Arbitrageur', chair: 'Midnight Velvet Club Chair', rarity: 'Rare' },
  { name: 'The Delegate', chair: 'Brushed Brass Cantilever', rarity: 'Uncommon' },
  { name: 'The Chairman', chair: 'Corner Office Obsidian Throne', rarity: 'Unique (Seat 0)' },
];

/**
 * Procedurally generates a deterministic 64x64 pixel grid for a given portrait and fund
 */
export function generateSeatPixels(portraitIndex: number = 0, fundId: string = 'bogle'): Uint8ClampedArray {
  const size = 64;
  const pixels = new Uint8ClampedArray(size * size * 4);

  // Fund color accents
  const fundColors: Record<string, [number, number, number]> = {
    argon: [96, 165, 250],   // Electric Blue
    bogle: [52, 211, 153],   // Emerald
    smaug: [248, 113, 113],  // Crimson
    midas: [251, 191, 36],   // Gold
    vladd: [167, 139, 250],  // Violet
  };

  const accent = fundColors[fundId] || fundColors.bogle;

  // Background gradient: very dark obsidian charcoal
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Subtle background grid floor & vignette
      const distFromCenter = Math.hypot(x - 32, y - 32) / 45;
      const bgLum = Math.max(8, Math.min(22, 18 - distFromCenter * 10));

      pixels[idx] = bgLum;
      pixels[idx + 1] = bgLum + 1;
      pixels[idx + 2] = bgLum + 4;
      pixels[idx + 3] = 255;

      // Chair back & headrest (y from 14 to 46, x from 16 to 48)
      const chairWidth = 14 + (portraitIndex % 3) * 2;
      const isChairBack = (
        x >= 32 - chairWidth && 
        x <= 32 + chairWidth && 
        y >= 16 && 
        y <= 48
      );

      // Chair outline & cushioning
      if (isChairBack) {
        const isBorder = (
          x === 32 - chairWidth || 
          x === 32 + chairWidth || 
          y === 16 || 
          y === 48
        );
        if (isBorder) {
          pixels[idx] = 45;
          pixels[idx + 1] = 48;
          pixels[idx + 2] = 58;
        } else {
          // Chair upholstery: rich dark leather with subtle fund hue
          const leatherTone = 24 + ((x ^ y) % 5);
          pixels[idx] = Math.min(255, leatherTone + accent[0] * 0.12);
          pixels[idx + 1] = Math.min(255, leatherTone + accent[1] * 0.12);
          pixels[idx + 2] = Math.min(255, leatherTone + accent[2] * 0.12);
        }
      }

      // Chair headrest accent top (y from 12 to 16)
      if (x >= 24 && x <= 40 && y >= 12 && y <= 16) {
        pixels[idx] = 55;
        pixels[idx + 1] = 58;
        pixels[idx + 2] = 68;
      }

      // Chair Armrests (left and right)
      const isLeftArm = (x >= 32 - chairWidth - 4 && x <= 32 - chairWidth && y >= 34 && y <= 45);
      const isRightArm = (x >= 32 + chairWidth && x <= 32 + chairWidth + 4 && y >= 34 && y <= 45);
      if (isLeftArm || isRightArm) {
        pixels[idx] = 60;
        pixels[idx + 1] = 64;
        pixels[idx + 2] = 72;
      }

      // Chair base & central hydraulic column (y from 48 to 58)
      if (x >= 30 && x <= 34 && y >= 48 && y <= 56) {
        // Metallic steel column
        const steel = 90 - Math.abs(x - 32) * 20;
        pixels[idx] = steel;
        pixels[idx + 1] = steel;
        pixels[idx + 2] = steel + 10;
      }

      // Chair 5-star caster base legs (y 56 to 60)
      if (y >= 56 && y <= 59 && x >= 20 && x <= 44) {
        if (x === 20 || x === 44 || x === 32 || (y === 58 && (x >= 24 && x <= 40))) {
          pixels[idx] = 70;
          pixels[idx + 1] = 75;
          pixels[idx + 2] = 85;
        }
      }

      // Silhouette Person / Member Avatar seated:
      // Head (y from 20 to 30, x from 27 to 37)
      const headDist = Math.hypot(x - 32, y - 25);
      if (headDist <= 5.2) {
        // Face skin or shadow silhouette
        const isEyeline = y === 24 && (x === 30 || x === 34);
        if (isEyeline) {
          pixels[idx] = 230;
          pixels[idx + 1] = 235;
          pixels[idx + 2] = 245;
        } else {
          // Warm minimal silhouette
          pixels[idx] = 210;
          pixels[idx + 1] = 180;
          pixels[idx + 2] = 160;
        }
      }

      // Hair / Hat / Visor
      if (y >= 19 && y <= 23 && Math.abs(x - 32) <= 5.5) {
        pixels[idx] = 30;
        pixels[idx + 1] = 30;
        pixels[idx + 2] = 35;
      }

      // Suit shoulders / Torso (y 31 to 46, x from 22 to 42)
      if (y >= 31 && y <= 46) {
        const torsoHalfWidth = Math.min(10, (y - 30) * 0.9);
        if (Math.abs(x - 32) <= torsoHalfWidth) {
          // Dark tailored suit
          pixels[idx] = 20;
          pixels[idx + 1] = 22;
          pixels[idx + 2] = 28;

          // Shirt collar & necktie
          if (x >= 31 && x <= 33 && y >= 31 && y <= 34) {
            // White shirt
            pixels[idx] = 230;
            pixels[idx + 1] = 230;
            pixels[idx + 2] = 235;
          }
          if (x === 32 && y >= 34 && y <= 42) {
            // Fund-tinted silk necktie
            pixels[idx] = accent[0];
            pixels[idx + 1] = accent[1];
            pixels[idx + 2] = accent[2];
          }
        }
      }

      // The On-Chain Briefcase resting by the chair leg (y 44 to 55, x 44 to 56)
      if (x >= 44 && x <= 56 && y >= 45 && y <= 55) {
        const isCaseBorder = x === 44 || x === 56 || y === 45 || y === 55;
        const isHandle = (y >= 43 && y <= 45 && x >= 48 && x <= 52);

        if (isHandle) {
          pixels[idx] = 190;
          pixels[idx + 1] = 160;
          pixels[idx + 2] = 80; // Brass handle
        } else if (isCaseBorder) {
          pixels[idx] = 30;
          pixels[idx + 1] = 22;
          pixels[idx + 2] = 15;
        } else {
          // Premium saddle-leather briefcase body
          pixels[idx] = 135;
          pixels[idx + 1] = 85;
          pixels[idx + 2] = 45;
          
          // Brass latch locks at x=47 and x=53, y=49
          if ((x === 47 || x === 53) && (y === 48 || y === 49)) {
            pixels[idx] = 245;
            pixels[idx + 1] = 205;
            pixels[idx + 2] = 95;
          }
        }
      }

      // Outer frame subtle border
      if (x === 0 || x === 63 || y === 0 || y === 63) {
        pixels[idx] = 32;
        pixels[idx + 1] = 34;
        pixels[idx + 2] = 42;
      }
    }
  }

  return pixels;
}
