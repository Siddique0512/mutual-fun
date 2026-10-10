import React, { useState } from 'react';
import { ZOOM_STAGES } from './TrueInfiniteZoomCanvas';
import { PixelCanvas } from './PixelCanvas';
import { sound } from '../utils/audio';
import {
  X,
  Sparkles,
  Flame,
  Coins,
  ArrowRightLeft,
  Vote,
  ShieldCheck,
  Layers,
  Calculator,
  ChevronRight,
  Crown,
  Briefcase,
  Users,
  Grid,
} from 'lucide-react';

interface ProspectusDossierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
}

export const ProspectusDossierDrawer: React.FC<ProspectusDossierDrawerProps> = ({
  isOpen,
  onClose,
  currentStageIndex,
  onSelectStage,
}) => {
  const [activeTab, setActiveTab] = useState(currentStageIndex);
  const [showPixelInspector, setShowPixelInspector] = useState(false);

  // Interactive Till Calculator
  const [benchmarkPrice, setBenchmarkPrice] = useState(401000);
  const [chairType, setChairType] = useState<'random' | 'specific' | 'sell'>('random');

  const calculateTillPrice = () => {
    if (chairType === 'random') return Math.round(benchmarkPrice * 1.08);
    if (chairType === 'specific') return Math.round(benchmarkPrice * 1.16);
    return Math.round(benchmarkPrice * 0.92);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-[560px] md:w-[640px] bg-[#09070f]/95 backdrop-blur-2xl border-l border-amber-500/30 shadow-[-20px_0_50px_rgba(0,0,0,0.95)] flex flex-col font-mono text-xs select-none">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0d0a16]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-xs animate-pulse" />
          <h2 className="text-sm font-bold text-white tracking-wider">
            OFFICIAL PROSPECTUS DOSSIER
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 cursor-pointer transition-colors"
          title="Close dossier"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 10 Chapter Tabs */}
      <div className="flex items-center border-b border-white/10 bg-[#07050b] overflow-x-auto scrollbar-none">
        {ZOOM_STAGES.map((stage, idx) => (
          <button
            key={stage.id}
            onClick={() => {
              setActiveTab(idx);
              onSelectStage(idx);
              sound.play('click');
            }}
            className={`px-3 py-2.5 whitespace-nowrap border-b-2 cursor-pointer transition-colors ${
              activeTab === idx
                ? 'border-amber-400 text-amber-300 font-bold bg-amber-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {stage.num} · {stage.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Drawer Body (Scrollable Detailed Content) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-zinc-300">
        {/* TAB 0: THE FIVE WALLS & 4,001 SEATS */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 01 / THE ART DEPARTMENT
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Five Walls & 4,001 Cutout Portraits
              </h3>
            </div>

            <div className="p-3 bg-black/60 border border-amber-500/20 space-y-2">
              <div className="text-amber-300 font-bold">5 PARTS OF EVERY PORTRAIT:</div>
              <ul className="space-y-1 list-disc pl-4 text-zinc-300 leading-relaxed">
                <li><strong>Certificate Frame:</strong> Engraved like a stock certificate (5 designs; 2 rare: oxblood lacquer & gold foil).</li>
                <li><strong>The Wall:</strong> Fund color background. Each fund has 800 portraits and 8 patterns.</li>
                <li><strong>The Chair:</strong> Main rarity trait across 8 rungs (folding chair to gilded throne).</li>
                <li><strong>The Shareholder:</strong> Head, hair, face, outfit, and skin tone. ~15% are Weirdos.</li>
                <li><strong>The Briefcase:</strong> ERC-6551 token-bound account owned by the Seat for cash dividends.</li>
              </ul>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
              <div className="p-2 bg-[#2a3b4c]/40 border border-[#3b526b]">
                <div className="text-cyan-300 font-bold">ARGON</div>
                <div className="text-zinc-400">800 Seats</div>
              </div>
              <div className="p-2 bg-[#1b3238]/40 border border-[#2c4e56]">
                <div className="text-teal-300 font-bold">BOGLE</div>
                <div className="text-zinc-400">800 Seats</div>
              </div>
              <div className="p-2 bg-[#4a3918]/40 border border-[#6b5223]">
                <div className="text-amber-300 font-bold">SMAUG</div>
                <div className="text-zinc-400">800 Seats</div>
              </div>
              <div className="p-2 bg-[#423115]/40 border border-[#63491f]">
                <div className="text-yellow-300 font-bold">MIDAS</div>
                <div className="text-zinc-400">800 Seats</div>
              </div>
              <div className="p-2 bg-[#471a21]/40 border border-[#6b2732]">
                <div className="text-red-300 font-bold">VLADD</div>
                <div className="text-zinc-400">800 Seats</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: THE CHAIR LADDER */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 02 / COLLECTION RARITY
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Chair Ladder (8 Rung Hierarchy)
              </h3>
            </div>

            <div className="border border-zinc-800 bg-black/40 overflow-hidden rounded-xs">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                    <th className="p-1.5 font-semibold">Rung</th>
                    <th className="p-1.5 font-semibold">Chair</th>
                    <th className="p-1.5 font-semibold text-right">Seats</th>
                    <th className="p-1.5 font-semibold text-right">Rarity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">1</td>
                    <td className="p-1.5 text-white">The Interns Folding Chair</td>
                    <td className="p-1.5 text-right">1,235</td>
                    <td className="p-1.5 text-right text-zinc-400">30.87%</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">2</td>
                    <td className="p-1.5 text-white">Beige Task Chair</td>
                    <td className="p-1.5 text-right">777</td>
                    <td className="p-1.5 text-right text-zinc-400">19.42%</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">3</td>
                    <td className="p-1.5 text-white">Creaking Wooden Swivel</td>
                    <td className="p-1.5 text-right">850</td>
                    <td className="p-1.5 text-right text-zinc-400">21.24%</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">4</td>
                    <td className="p-1.5 text-emerald-400">Green Bankers Chair</td>
                    <td className="p-1.5 text-right">560</td>
                    <td className="p-1.5 text-right text-emerald-400">14.00%</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">5</td>
                    <td className="p-1.5 text-white">Oxblood Wingback</td>
                    <td className="p-1.5 text-right">271</td>
                    <td className="p-1.5 text-right text-zinc-400">6.77%</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">6</td>
                    <td className="p-1.5 text-white">Deep Button Chesterfield</td>
                    <td className="p-1.5 text-right">179</td>
                    <td className="p-1.5 text-right text-zinc-400">4.47%</td>
                  </tr>
                  <tr className="text-zinc-300">
                    <td className="p-1.5 text-zinc-500">7</td>
                    <td className="p-1.5 text-blue-400">Tasteful Walnut Lounge</td>
                    <td className="p-1.5 text-right">88</td>
                    <td className="p-1.5 text-right text-blue-400">2.20%</td>
                  </tr>
                  <tr className="bg-amber-500/10 text-amber-300 font-bold">
                    <td className="p-1.5 text-amber-500">8</td>
                    <td className="p-1.5 text-amber-300">The Gilded Throne</td>
                    <td className="p-1.5 text-right">37</td>
                    <td className="p-1.5 text-right">0.92%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30">
              <div className="text-amber-300 font-bold">M&A CORNER OFFICE UPGRADE:</div>
              <p className="mt-1 leading-relaxed text-zinc-300">
                Every chair on the chair ladder has an upgraded <strong>Corner Office</strong> version earned only by merging two Seats through M&A. It carries the weight of both original chairs + 10% (e.g. 2.00x becomes 2.20x) permanently for votes and dividends.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: THE WEIRDOS */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 03 / NON-HUMAN SITTERS
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Weirdos (~15% · 601 of 4,001 Seats)
              </h3>
            </div>

            <div className="border border-zinc-800 bg-black/40 overflow-hidden rounded-xs">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                    <th className="p-1.5 font-semibold">Sitter</th>
                    <th className="p-1.5 font-semibold text-right">Seats</th>
                    <th className="p-1.5 font-semibold text-right">Rarity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  <tr>
                    <td className="p-1.5 text-white">The Offworld Consultant</td>
                    <td className="p-1.5 text-right">99</td>
                    <td className="p-1.5 text-right text-zinc-400">2.47%</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-cyan-300">The Fired Analysts Ghost</td>
                    <td className="p-1.5 text-right">89</td>
                    <td className="p-1.5 text-right text-cyan-400">2.22%</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-white">The Floor Model</td>
                    <td className="p-1.5 text-right">78</td>
                    <td className="p-1.5 text-right text-zinc-400">1.95%</td>
                  </tr>
                  <tr className="bg-amber-500/10 text-amber-300 font-bold">
                    <td className="p-1.5">The Golden Retriever Who Made Partner</td>
                    <td className="p-1.5 text-right">93</td>
                    <td className="p-1.5 text-right">2.32%</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-white">The Quant (Robot)</td>
                    <td className="p-1.5 text-right">86</td>
                    <td className="p-1.5 text-right text-zinc-400">2.15%</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-white">The Long Holder</td>
                    <td className="p-1.5 text-right">80</td>
                    <td className="p-1.5 text-right text-zinc-400">2.00%</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 text-white">The Night Trader</td>
                    <td className="p-1.5 text-right">76</td>
                    <td className="p-1.5 text-right text-zinc-400">1.90%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-400">
              Standout wardrobe: Fiscal New Year Hat (0.32%), Worked All Night Bathrobe (0.70%), Annual Gala Tuxedo (0.82%), Old Money Monocle (1.90%), Corner Office Cigar (2.35%).
            </p>
          </div>
        )}

        {/* TAB 3: THE BRIEFCASE VAULT */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 04 / ON-CHAIN ACCOUNT
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Briefcase (ERC-6551 Token-Bound Account)
              </h3>
            </div>

            <div className="p-3 bg-black/60 border border-amber-500/20 space-y-2">
              <div className="text-amber-300 font-bold">CARDINAL RULE:</div>
              <p className="leading-relaxed">
                Holding a Seat earns nothing until enrolled. Cashed dividends land inside the Briefcase, one balance per token: $TMF, ETH as WETH, and any secondary tokens.
              </p>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div><strong>Travels with the Seat:</strong> Because the account belongs to the Seat and not to your wallet, it transfers automatically when the Seat is sold.</div>
              <div><strong>Forms Buyer Payment:</strong> Accumulated balance within the Briefcase constitutes value delivered directly to the buyer upon transfer.</div>
            </div>
          </div>
        )}

        {/* TAB 4: THE TRAIT VAULT */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 05 / 100% ON-CHAIN STORAGE
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Trait Vault (114,367 Bytes Sealed Art)
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-black/60 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">SEALED ART</div>
                <div className="text-amber-400 font-bold text-xs mt-0.5">114,367 BYTES</div>
              </div>
              <div className="p-2.5 bg-black/60 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">MATRIX</div>
                <div className="text-emerald-400 font-bold text-xs mt-0.5">64 × 64 PIXELS</div>
              </div>
              <div className="p-2.5 bg-black/60 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">PALETTE</div>
                <div className="text-cyan-400 font-bold text-xs mt-0.5">64 COLORS</div>
              </div>
            </div>

            <p className="leading-relaxed">
              Most NFT images are links to external servers or IPFS. These are not. Every trait is stored as raw bytecode in the Trait Vault on-chain, written once when the contract deployed.
            </p>

            <button
              onClick={() => setShowPixelInspector(!showPixelInspector)}
              className="w-full py-2 bg-zinc-900 border border-amber-500/40 text-amber-300 font-bold hover:bg-black cursor-pointer transition-colors"
            >
              {showPixelInspector ? 'HIDE 64×64 MATRIX' : 'INSPECT ON-CHAIN PIXEL MATRIX'}
            </button>

            {showPixelInspector && (
              <div className="pt-2 text-center">
                <PixelCanvas interactive={true} zoomLevel={4} />
              </div>
            )}
          </div>
        )}

        {/* TAB 5: THE EXECUTIVE BOARDROOM */}
        {activeTab === 5 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 06 / ACTIVE PARTICIPATION
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Executive Boardroom & Front-End Load
              </h3>
            </div>

            <div className="p-3 bg-black/60 border border-amber-500/20 space-y-2">
              <div className="text-amber-300 font-bold">50/50 ENROLLMENT SPLIT:</div>
              <ul className="space-y-1 list-disc pl-4 text-zinc-300">
                <li><strong>50% Burned Forever:</strong> Slashes token circulation permanently.</li>
                <li><strong>50% to Fund Investments:</strong> Fuels direct treasury trades.</li>
              </ul>
            </div>

            <p className="leading-relaxed">
              Enrolled members gain access to weekly voting rights and dividend distributions. Non-enrolled seats remain passive and receive zero yields until enrolled.
            </p>
          </div>
        )}

        {/* TAB 6: GRAND COUNCIL OF FIVE FUNDS */}
        {activeTab === 6 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 07 / COMPETING CAPITAL ALLOCATION
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Grand Council of Five Funds & The Till
              </h3>
            </div>

            <p className="leading-relaxed">
              All five funds begin with 800 seats each and identical initial reserves. They diverge as members vote on asset strategies.
            </p>

            {/* Interactive Till Calculator */}
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>THE TILL BUYBACK CALCULATOR</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Benchmark 401,000 $TMF par value:
              </p>

              <div className="flex gap-2">
                {[
                  { id: 'random', label: 'Random (+8%)' },
                  { id: 'specific', label: 'Specific (+16%)' },
                  { id: 'sell', label: 'Sell to Till (-8%)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setChairType(item.id as 'random' | 'specific' | 'sell')}
                    className={`flex-1 py-1.5 text-[11px] border cursor-pointer transition-colors ${
                      chairType === item.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                        : 'bg-black/40 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center p-2 bg-black/60 border border-zinc-800">
                <span className="text-zinc-400">Calculated Value:</span>
                <span className="text-amber-300 font-bold text-sm">
                  {calculateTillPrice().toLocaleString()} $TMF
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: WEEKLY GOVERNANCE BALLOT */}
        {activeTab === 7 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 08 / WEEKLY DEMOCRACY
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The Weekly Governance Ballot
              </h3>
            </div>

            <div className="p-3 bg-black/60 border border-amber-500/20 space-y-2">
              <div className="text-amber-300 font-bold">BALLOT MECHANICS:</div>
              <p className="leading-relaxed">
                Members vote each week on investments, portfolio rebalancing, and treasury management. Folding chair = 1.00x vote weight. Merged Corner Offices wield up to 2.20x weight.
              </p>
            </div>
          </div>
        )}

        {/* TAB 8: WEEK 13 CONTINUATION */}
        {activeTab === 8 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 09 / EXISTENTIAL MANDATE
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Week 13 Continuation Vote & Liquidation
              </h3>
            </div>

            <div className="p-3 bg-black/60 border border-amber-500/20 space-y-2">
              <div className="text-amber-300 font-bold">THE CONTINUATION RULE:</div>
              <p className="leading-relaxed">
                Every 13th week, shareholders cast a vote: <strong>CONTINUE</strong> or <strong>DISSOLVE</strong>. If passed, fund capital locks for the next quarter. If failed, the fund liquidates and the Till returns all backing ETH directly to members!
              </p>
            </div>
          </div>
        )}

        {/* TAB 9: 4,001 SEATS COSMOS & SEAT 0 */}
        {activeTab === 9 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                CHAPTER 10 / MACROECONOMIC ARCHITECTURE
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                The 4,001 Seats Cosmos & Seat 0 (The Chairman)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-black/60 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">TOTAL SUPPLY</div>
                <div className="text-amber-400 font-bold text-xs mt-0.5">
                  1,604,401,000 $TMF
                </div>
              </div>
              <div className="p-2.5 bg-black/60 border border-zinc-800">
                <div className="text-zinc-500 text-[10px]">PER SEAT ALLOCATION</div>
                <div className="text-emerald-400 font-bold text-xs mt-0.5">
                  401,000 $TMF
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/40 space-y-1">
              <div className="text-amber-300 font-bold">SEAT 0: THE CHAIRMAN</div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Belongs to the building and is never for sale. Nobody holds the keys: No owner, no upgrade mechanism, no pause switch. All routine functions can be called by anyone.
              </p>
            </div>

            <div className="p-3 bg-amber-500/20 border border-amber-500 text-center font-bold text-sm text-amber-200">
              STOP TRADING ALONE.
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-white/10 bg-[#07050b] flex items-center justify-between">
        <span className="text-[11px] text-zinc-500">THE MUTUAL FUN · COMPLETE DOSSIER</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold hover:bg-amber-500/30 cursor-pointer transition-colors"
        >
          RETURN TO CANVAS
        </button>
      </div>
    </aside>
  );
};
