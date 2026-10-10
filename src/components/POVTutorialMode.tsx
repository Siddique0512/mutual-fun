import React, { useState } from 'react';
import { sound } from '../utils/audio';
import {
  UserCheck,
  Flame,
  Coins,
  ArrowRightLeft,
  Vote,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface POVTutorialModeProps {
  currentStageIndex: number;
  onNavigateStage: (stageIndex: number) => void;
  onJumpToProgress: (progress: number) => void;
}

export const POVTutorialMode: React.FC<POVTutorialModeProps> = ({
  currentStageIndex,
  onNavigateStage,
  onJumpToProgress,
}) => {
  // POV Interactive Member State (Simulating being an actual Seat holder)
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [briefcaseBalance, setBriefcaseBalance] = useState(0);
  const [hasVotedWeekly, setHasVotedWeekly] = useState(false);
  const [hasVotedContinuation, setHasVotedContinuation] = useState(false);
  const [mergedClass, setMergedClass] = useState<'Standard' | 'Corner Office'>('Standard');
  const [isTransferring, setIsTransferring] = useState(false);
  const [activeFundId, setActiveFundId] = useState('bogle');
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  // STEP 1: Enroll Seat (50% burned, 50% to fund)
  const handleEnroll = () => {
    setIsEnrolled(true);
    sound.play('reveal');
  };

  // STEP 2: Simulate dividend distribution
  const handleAddDividends = () => {
    sound.play('chime');
    setBriefcaseBalance((prev) => prev + 12400);
  };

  // STEP 2B: Simulate Seat Transfer with Briefcase
  const handleTransferSeat = () => {
    setIsTransferring(true);
    sound.play('warp');
    setTimeout(() => {
      setIsTransferring(false);
      // Enrollment ends on transfer according to Prospectus
      setIsEnrolled(false);
    }, 1800);
  };

  // STEP 4: Cast Weekly Vote
  const handleCastVote = () => {
    setHasVotedWeekly(true);
    sound.play('click');
  };

  // STEP 4B: Cast Continuation Vote
  const handleContinuationVote = () => {
    setHasVotedContinuation(true);
    sound.play('chime');
  };

  // STEP 4C: Merge Seats (M&A)
  const handleMergeSeats = () => {
    setMergedClass('Corner Office');
    sound.play('reveal');
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top POV Member Identity Badge */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto pt-14 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#0c0a12]/90 border border-amber-500/40 px-3.5 py-1.5 backdrop-blur-md text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">POV:</span>
          <span className="text-white font-bold">MEMBER #0401</span>
          <span className="text-zinc-600">|</span>
          <span className="text-amber-300 uppercase">{activeFundId} FUND</span>
          <span className="text-zinc-600">|</span>
          <span className={isEnrolled ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
            {isEnrolled ? 'ENROLLED' : 'NOT ENROLLED'}
          </span>
          {mergedClass === 'Corner Office' && (
            <span className="text-amber-400 font-bold bg-amber-500/20 px-1 border border-amber-500/40 text-[10px]">
              CORNER OFFICE
            </span>
          )}
        </div>

        {/* Quick Help Guide Button */}
        <button
          onClick={() => setShowHelpGuide(!showHelpGuide)}
          className="flex items-center gap-1 bg-[#0c0a12]/90 border border-white/10 hover:border-zinc-500 px-3 py-1.5 backdrop-blur-md text-xs font-mono text-zinc-300 hover:text-white cursor-pointer transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">POV GUIDE</span>
        </button>
      </div>

      {/* Guide Drawer Modal if toggled */}
      {showHelpGuide && (
        <div className="fixed inset-0 bg-black/75 z-40 flex items-center justify-center p-4 pointer-events-auto backdrop-blur-sm">
          <div className="bg-[#0f0c18] border border-amber-500/60 p-6 max-w-lg w-full font-mono text-xs text-zinc-300 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-sm font-bold text-amber-400">HOW THE LIVE POV TUTORIAL WORKS</span>
              <button
                onClick={() => setShowHelpGuide(false)}
                className="text-zinc-400 hover:text-white cursor-pointer px-2 py-0.5 border border-zinc-700"
              >
                ✕ CLOSE
              </button>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Instead of reading abstract text, you are now experiencing The Mutual Fun through the first-person perspective of <strong>Member #0401</strong>.
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-black/40 border border-zinc-800">
                <span className="text-amber-300 font-bold">1. Take Your Seat & Enroll:</span> Experience why holding a seat earns nothing until you pay the 50/50 load fee.
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800">
                <span className="text-amber-300 font-bold">2. Collect Dividends:</span> See returns land in your on-chain Briefcase and watch it travel on transfer.
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800">
                <span className="text-amber-300 font-bold">3. Five Funds Council:</span> Compare strategies and test Till liquidity.
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800">
                <span className="text-amber-300 font-bold">4. Cast Ballots & M&A:</span> Vote weekly, decide continuation at Week 13, and merge into Corner Office.
              </div>
              <div className="p-2 bg-black/40 border border-zinc-800">
                <span className="text-amber-300 font-bold">5. Sovereign Cosmos:</span> Verify that nobody holds the keys.
              </div>
            </div>
            <button
              onClick={() => setShowHelpGuide(false)}
              className="w-full py-2 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold hover:bg-amber-500/30 cursor-pointer text-center"
            >
              CONTINUE TUTORIAL →
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive POV HUD for Current Stage */}
      <div className="w-full max-w-2xl mx-auto pointer-events-auto select-none mb-16">
        <div className="bg-[#090710]/92 border border-amber-500/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] p-4 sm:p-5 rounded-sm">
          {/* STAGE 0: Seat & Enrollment POV */}
          {currentStageIndex === 0 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-amber-400 font-bold">STEP 01: TAKE YOUR SEAT & ACTIVATE ENROLLMENT</span>
                <span className="text-zinc-500">SEAT #0401</span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                You are sitting in the executive chair. Your Seat connects your on-chain artwork, your fund voting power, and a Briefcase placed on the floor beside your feet.
              </p>

              <div className="p-2.5 bg-black/60 border border-amber-500/20 space-y-1">
                <div className="text-amber-300 font-bold">PROSPECTUS LAW:</div>
                <div className="text-zinc-300">
                  &ldquo;Holding a Seat earns nothing.&rdquo; You must enroll by paying a one-time front-end load in $TMF.
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  >
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span>ENROLL NOW (PAY FRONT-END LOAD)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 px-3 py-1.5 border border-emerald-500/40">
                    <UserCheck className="w-4 h-4" />
                    <span>ACTIVATED: 50% LOAD BURNED · 50% SENT TO FUND</span>
                  </div>
                )}

                <button
                  onClick={() => onNavigateStage(1)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 cursor-pointer transition-colors ml-auto"
                >
                  <span>ZOOM TO BRIEFCASE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 1: Briefcase Vault POV */}
          {currentStageIndex === 1 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-amber-400 font-bold">STEP 02: YOUR ON-CHAIN BRIEFCASE VAULT</span>
                <span className="text-emerald-400 font-bold">
                  BALANCE: {briefcaseBalance.toLocaleString()} $TMF
                </span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                You look directly inside your leather Briefcase. Cashed dividends generated by your fund&apos;s investments automatically collect here on-chain.
              </p>

              {/* Live Interactive POV Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAddDividends}
                  className="flex items-center justify-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/20 font-bold cursor-pointer transition-all"
                >
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>SIMULATE DIVIDEND PAYOUT (+12,400 $TMF)</span>
                </button>

                <button
                  onClick={handleTransferSeat}
                  disabled={isTransferring}
                  className="flex items-center justify-center gap-2 p-2.5 bg-blue-500/10 border border-blue-500/60 text-blue-300 hover:bg-blue-500/20 font-bold cursor-pointer transition-all disabled:opacity-50"
                >
                  <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                  <span>{isTransferring ? 'TRANSFERRING WITH SEAT...' : 'SIMULATE TRANSFER (WALLET A → B)'}</span>
                </button>
              </div>

              <div className="text-[11px] text-zinc-400 pt-1">
                Notice: When transferred, the Briefcase balance stays inside the Seat for the buyer, but enrollment resets.
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => onNavigateStage(2)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 font-bold cursor-pointer transition-colors"
                >
                  <span>ZOOM TO FIVE FUNDS COUNCIL</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: Five Funds Council Room POV */}
          {currentStageIndex === 2 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-amber-400 font-bold">STEP 03: THE FIVE FUNDS COUNCIL HALL</span>
                <span className="text-zinc-400">800 SEATS EACH</span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                You sit at the grand council table. All five funds started with the exact same structure, but diverged based on how their members voted.
              </p>

              {/* Fund Switcher Simulation */}
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-400">SELECT YOUR SEAT&apos;S FUND:</div>
                <div className="flex flex-wrap gap-1.5">
                  {['argon', 'bogle', 'smaug', 'midas', 'vladd'].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFundId(f);
                        sound.play('click');
                      }}
                      className={`px-2.5 py-1 text-[11px] uppercase border cursor-pointer transition-all ${
                        activeFundId === f
                          ? 'bg-amber-500 text-black font-bold border-amber-400'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Till Simulator */}
              <div className="p-2.5 bg-black/50 border border-zinc-800 text-[11px] space-y-1">
                <div className="text-amber-300 font-bold">THE TILL BACKS BUYBACKS:</div>
                <div className="text-zinc-300">
                  Random Chair: <strong className="text-emerald-400">401k + 8%</strong> · Specific Chair: <strong className="text-blue-400">401k + 16%</strong> · Sell to Till: <strong className="text-red-400">401k − 8%</strong>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => onNavigateStage(3)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 font-bold cursor-pointer transition-colors"
                >
                  <span>ZOOM TO VOTING TERMINAL</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: Weekly Voting & Continuation POV */}
          {currentStageIndex === 3 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-amber-400 font-bold">STEP 04: GOVERNANCE & WEEK 13 CONTINUATION</span>
                <span className="text-zinc-400">13-WEEK CADENCE</span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                You face your mechanical governance terminal. You vote weekly on investment allocation, and every 13th week on whether the fund continues.
              </p>

              {/* Live Ballot Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleCastVote}
                  disabled={hasVotedWeekly}
                  className={`flex items-center justify-center gap-2 p-2 border font-bold cursor-pointer transition-all ${
                    hasVotedWeekly
                      ? 'bg-blue-950/40 border-blue-500/40 text-blue-400'
                      : 'bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30'
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  <span>{hasVotedWeekly ? '✓ WEEKLY VOTE SUBMITTED' : 'CAST WEEKLY INVESTMENT VOTE'}</span>
                </button>

                <button
                  onClick={handleContinuationVote}
                  disabled={hasVotedContinuation}
                  className={`flex items-center justify-center gap-2 p-2 border font-bold cursor-pointer transition-all ${
                    hasVotedContinuation
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                      : 'bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{hasVotedContinuation ? '✓ CONTINUATION APPROVED' : 'WEEK 13: VOTE CONTINUATION'}</span>
                </button>
              </div>

              {/* M&A Simulation */}
              <div className="flex items-center justify-between p-2 bg-black/60 border border-zinc-800 text-[11px]">
                <div className="text-zinc-300">
                  M&A: Merge two enrolled Seats into a class higher.
                </div>
                {mergedClass !== 'Corner Office' ? (
                  <button
                    onClick={handleMergeSeats}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 font-bold hover:bg-amber-500/30 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>MERGE TO CORNER OFFICE</span>
                  </button>
                ) : (
                  <span className="text-amber-400 font-bold">STATUS: CORNER OFFICE PROMOTED</span>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => onNavigateStage(4)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 font-bold cursor-pointer transition-colors"
                >
                  <span>ZOOM TO 4,001 SEATS COSMOS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: Cosmic Autonomy POV */}
          {currentStageIndex === 4 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-amber-400 font-bold">STEP 05: SOVEREIGN AUTONOMY & RECURSION</span>
                <span className="text-zinc-400">4,001 SEATS TOTAL</span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                You look outward at the full 4,001 member constellation. There is no CEO, no team allocation, no upgrade key, and no pause switch.
              </p>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                <div className="p-2 bg-black/50 border border-zinc-800">
                  <div className="text-zinc-500">OWNERSHIP</div>
                  <div className="text-amber-400 font-bold mt-0.5">NO OWNER</div>
                </div>
                <div className="p-2 bg-black/50 border border-zinc-800">
                  <div className="text-zinc-500">CONTRACTS</div>
                  <div className="text-amber-400 font-bold mt-0.5">IMMUTABLE</div>
                </div>
                <div className="p-2 bg-black/50 border border-zinc-800">
                  <div className="text-zinc-500">CENSORSHIP</div>
                  <div className="text-amber-400 font-bold mt-0.5">NO PAUSE SWITCH</div>
                </div>
              </div>

              <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-center font-bold text-sm tracking-wide">
                STOP TRADING ALONE.
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-[11px] text-zinc-500">
                  Zooming into Seat 0 loops back to Genesis.
                </span>
                <button
                  onClick={() => {
                    onJumpToProgress(0);
                    sound.play('warp');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 font-bold cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESTART MEMBER JOURNEY</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
