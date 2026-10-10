import React from 'react';
import { PROSPECTUS_CONTENT, STAGES } from '../data/prospectus';
import { PixelCanvas } from './PixelCanvas';
import { sound } from '../utils/audio';

interface OverlayControllerProps {
  progress: number;
  activeMarker: string | null;
  onSelectMarker: (id: string | null) => void;
  hoveredFund: string | null;
  onHoverFund: (fundId: string | null) => void;
}

export const OverlayController: React.FC<OverlayControllerProps> = ({
  progress,
  activeMarker,
  onSelectMarker,
  hoveredFund,
  onHoverFund,
}) => {
  // Find current stage based on progress
  const currentStage = STAGES.find(
    (s) => progress >= s.range[0] && progress < s.range[1]
  ) || STAGES[STAGES.length - 1];

  const stageProgress = Math.min(
    1,
    Math.max(
      0,
      (progress - currentStage.range[0]) / (currentStage.range[1] - currentStage.range[0])
    )
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12">
      {/* Dynamic Centered Content depending on Level with measured backdrop scrim */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full">
        <div className="bg-[#050508]/85 backdrop-blur-md border border-white/10 px-6 py-6 md:px-8 md:py-7 max-w-xl w-full mx-auto shadow-[0_0_60px_rgba(0,0,0,0.9)] rounded-sm pointer-events-auto transition-all duration-300">
        {/* LEVEL 00: THE VOID */}
        {currentStage.id === 'void' && (
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
              {PROSPECTUS_CONTENT.summary.tagline === 'STOP TRADING ALONE.' ? 'THE MUTUAL FUN' : 'THE MUTUAL FUN'}
            </h1>
            <p className="text-zinc-400 font-mono text-sm max-w-md mx-auto">
              {PROSPECTUS_CONTENT.pixel.concept}
            </p>
            <div className="pt-8 text-amber-400/80 font-mono text-xs tracking-widest animate-pulse">
              {PROSPECTUS_CONTENT.pixel.scrollHint}
            </div>
          </div>
        )}

        {/* LEVEL 01: THE SEAT */}
        {currentStage.id === 'seat' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              01 · MEMBERSHIP TOKEN
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              EVERY SEAT BELONGS TO ONE FUND.
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              4,001 on-chain Seats forming the governance of The Mutual Fun.
            </p>

            {/* Interactive Marker Details Bar */}
            <div className="pt-4 flex flex-wrap justify-center gap-2 pointer-events-auto">
              {PROSPECTUS_CONTENT.seat.markers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectMarker(activeMarker === m.id ? null : m.id);
                    sound.play('click');
                  }}
                  className={`px-3 py-1 text-xs font-mono transition-colors border cursor-pointer ${
                    activeMarker === m.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  [{m.label}]
                </button>
              ))}
            </div>

            {/* Active Marker Selected Info */}
            {activeMarker && (
              <div className="mt-3 p-3 bg-zinc-900/90 border border-amber-500/40 text-left max-w-md mx-auto pointer-events-auto backdrop-blur-md">
                {(() => {
                  const m = PROSPECTUS_CONTENT.seat.markers.find((item) => item.id === activeMarker);
                  if (!m) return null;
                  return (
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400">{m.title}</div>
                      <div className="text-xs text-zinc-300 mt-1">{m.text}</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* LEVEL 02: ON-CHAIN ART */}
        {currentStage.id === 'art' && (
          <div className="space-y-3 max-w-xl pointer-events-auto">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              02 · 64 × 64 PIXELS
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              ON-CHAIN PORTRAIT
            </h2>
            <p className="text-zinc-300 text-sm max-w-lg mx-auto">
              The Seat&apos;s artwork is a 64×64 pixel portrait stored on-chain.
            </p>

            {/* Interactive Pixel Canvas with Mouse Luminous Reaction & 11 Traits */}
            <div className="py-2">
              <PixelCanvas zoomLevel={4} interactive={true} activeFundId="bogle" />
            </div>

            <div className="text-xs font-mono text-zinc-400 pt-1">
              <span>11 UNIQUE PORTRAITS</span>
              <span className="mx-2 text-zinc-600">·</span>
              <span className="text-amber-400/90">THE CHAIR IS THE MAIN RARITY TRAIT</span>
            </div>
          </div>
        )}

        {/* LEVEL 03: THE SEAT AS A SYSTEM */}
        {currentStage.id === 'system' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              03 · ARCHITECTURE
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              THE ART IS ONLY ONE PART.
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              The Seat connects art, membership, voting and a briefcase.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 max-w-lg mx-auto text-left">
              {PROSPECTUS_CONTENT.systemComponents.map((c, i) => (
                <div key={i} className="p-2.5 bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
                  <div className="text-[11px] font-mono text-amber-400 font-bold">{c.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEVEL 04: THE BRIEFCASE */}
        {currentStage.id === 'briefcase' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              04 · ON-CHAIN VAULT
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              CASHED DIVIDENDS COLLECT HERE.
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              The Briefcase is on-chain. It travels with the Seat.
            </p>
            <div className="p-3 bg-zinc-900/70 border border-amber-500/30 font-mono text-xs text-zinc-300 max-w-md mx-auto">
              WALLET A → SEAT → WALLET B
              <div className="text-amber-300/90 text-[11px] mt-1 font-sans">
                Its balance becomes part of the buyer&apos;s payment.
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 05: FIVE FUNDS */}
        {currentStage.id === 'funds' && (
          <div className="space-y-4 max-w-2xl pointer-events-auto">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              05 · ONE SEAT ↓ ONE FUND
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              ARGON · BOGLE · SMAUG · MIDAS · VLADD
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Five funds begin with the same structure. They differ through member decisions.
            </p>

            {/* Fund Selector buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-3">
              {PROSPECTUS_CONTENT.funds.map((f) => (
                <button
                  key={f.id}
                  onMouseEnter={() => onHoverFund(f.id)}
                  onMouseLeave={() => onHoverFund(null)}
                  onClick={() => onHoverFund(hoveredFund === f.id ? null : f.id)}
                  className={`px-3 py-1.5 font-mono text-xs transition-all border cursor-pointer ${
                    hoveredFund === f.id
                      ? 'bg-white/10 text-white border-white scale-105'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                  }`}
                  style={{ borderColor: hoveredFund === f.id ? f.color : undefined }}
                >
                  {f.name} (800)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LEVEL 06: WEEKLY VOTING */}
        {currentStage.id === 'voting' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-blue-400 font-mono text-xs tracking-wider">
              06 · GOVERNANCE
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              WEEKLY VOTE
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Members vote weekly on how their fund invests.
            </p>
            <div className="text-xs font-mono text-zinc-500 pt-1">
              WEEKS 01 THROUGH 13
            </div>
          </div>
        )}

        {/* LEVEL 07: CONTINUATION VOTE */}
        {currentStage.id === 'continuation' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              07 · WEEK 13
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              CONTINUATION VOTE
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Members decide whether the fund continues.
            </p>
            <div className="text-xs font-mono text-amber-400/80 pt-1">
              THE 13TH WEEK MANDATE
            </div>
          </div>
        )}

        {/* LEVEL 08: ENROLLMENT */}
        {currentStage.id === 'enrollment' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-emerald-400 font-mono text-xs tracking-wider">
              08 · ACTIVATION
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              HOLDING A SEAT EARNS NOTHING.
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Enroll with a one-time front-end load in $TMF:
            </p>
            <div className="flex justify-center items-center gap-6 pt-2 font-mono text-xs">
              <span className="text-red-400">50% BURNED</span>
              <span className="text-zinc-600">/</span>
              <span className="text-emerald-400">50% FUND</span>
            </div>
            <div className="text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80 max-w-xs mx-auto">
              Enrollment ends when the Seat changes hands.
            </div>
          </div>
        )}

        {/* LEVEL 09: OPEN MARKET */}
        {currentStage.id === 'openmarket' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              09 · LIQUIDITY
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              OPEN MARKET
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              The till backs buybacks.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 max-w-md mx-auto text-center font-mono">
              <div className="p-2 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">RANDOM CHAIR</div>
                <div className="text-xs text-emerald-400 font-bold mt-1">401k + 8%</div>
              </div>
              <div className="p-2 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">SPECIFIC CHAIR</div>
                <div className="text-xs text-blue-400 font-bold mt-1">401k + 16%</div>
              </div>
              <div className="p-2 bg-zinc-900/60 border border-zinc-800">
                <div className="text-[10px] text-zinc-400">SELL</div>
                <div className="text-xs text-red-400 font-bold mt-1">401k − 8%</div>
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 10: $TMF TOKEN */}
        {currentStage.id === 'token' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              10 · TOKENOMICS
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              $TMF
            </h2>
            <div className="text-xl md:text-2xl font-mono font-bold text-amber-400">
              1,604,401,000 TOTAL SUPPLY
            </div>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              401k per 4,001 Seat.
            </p>
            <div className="text-xs font-mono text-zinc-400 pt-1">
              MINTED ONCE · NO TEAM ALLOCATION
            </div>
          </div>
        )}

        {/* LEVEL 11: M&A */}
        {currentStage.id === 'manda' && (
          <div className="space-y-4 max-w-xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              11 · MERGERS & ACQUISITIONS
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              SEAT + SEAT → MERGE → ONE SEAT
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              Two enrolled Seats in the same fund and class can merge into one Seat a class higher.
            </p>
            <div className="text-xs font-mono text-amber-400 pt-2">
              SUPPLY GETS SMALLER · THE RETIRED CHAIR&apos;S CHECKS TRANSFER
            </div>
            <div className="pt-2">
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 font-mono text-xs">
                CORNER OFFICE
              </span>
            </div>
          </div>
        )}

        {/* LEVEL 12: 4,001 SEATS */}
        {currentStage.id === 'seatfield' && (
          <div className="space-y-4 max-w-2xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              12 · THE ENTIRE MAP
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              4,001 SEATS
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              800 · 800 · 800 · 800 · 800 + SEAT 0
            </p>
            <div className="text-xs font-mono text-zinc-500 pt-1">
              800 SEATS PER FUND · SEAT 0 FOR THE CHAIRMAN
            </div>
          </div>
        )}

        {/* LEVEL 13: THE SYSTEM MAP */}
        {currentStage.id === 'systemmap' && (
          <div className="space-y-4 max-w-2xl">
            <span className="text-amber-400 font-mono text-xs tracking-wider">
              13 · CIRCULAR ARCHITECTURE
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              THE SEAT CYCLE
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-mono">
              SEAT → ENROLL → VOTE → FUND → DIVIDENDS → BRIEFCASE → SEAT
            </p>
            <div className="text-xs text-zinc-400 pt-1">
              How the autonomous pieces connect.
            </div>
          </div>
        )}

        {/* LEVEL 14: NOBODY HOLDS THE KEYS */}
        {currentStage.id === 'nobody' && (
          <div className="space-y-5 max-w-xl">
            <span className="text-zinc-500 font-mono text-xs tracking-wider">
              14 · AUTONOMY
            </span>
            <div className="text-xl md:text-2xl font-mono text-zinc-400">
              SO WHO CONTROLS IT?
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              NOBODY HOLDS THE KEYS.
            </h2>
            <div className="flex justify-center gap-4 text-xs font-mono text-amber-400/90 pt-2">
              <span>NO OWNER</span>
              <span>·</span>
              <span>NO UPGRADE MECHANISM</span>
              <span>·</span>
              <span>NO PAUSE SWITCH</span>
            </div>
            <div className="space-y-1 text-xs md:text-sm text-zinc-400 font-mono pt-3">
              <p>Routine functions can be called by anyone.</p>
              <p>Everything else runs automatically.</p>
            </div>
          </div>
        )}

        {/* FINAL LEVEL: THE MUTUAL FUN */}
        {currentStage.id === 'final' && (
          <div className="space-y-5 max-w-xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              THE MUTUAL FUN
            </h2>
            <div className="space-y-1.5 text-xs md:text-sm font-mono text-zinc-300">
              <div>4,001 SEATS</div>
              <div>5 FUNDS</div>
              <div>WEEKLY MEMBER VOTING</div>
              <div>ON-CHAIN BRIEFCASES</div>
            </div>
            <div className="pt-6 text-xl md:text-2xl font-bold text-amber-400 font-mono tracking-wide">
              STOP TRADING ALONE.
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
