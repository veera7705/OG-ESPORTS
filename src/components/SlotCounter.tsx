import React from 'react';
import { Users, Flame, ShieldAlert, CheckCircle2, CircleDashed } from 'lucide-react';
import { TournamentStats } from '../types';

interface SlotCounterProps {
  stats: TournamentStats;
}

export const SlotCounter: React.FC<SlotCounterProps> = ({ stats }) => {
  const registered = Math.min(stats.registeredCount, stats.maxSlots);
  const remaining = Math.max(0, stats.maxSlots - registered);
  const isFull = registered >= stats.maxSlots;
  const progressPercent = Math.min(100, Math.round((registered / stats.maxSlots) * 100));

  // Generate array of 24 slot numbers
  const slotArray = Array.from({ length: stats.maxSlots }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-14">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0f111d] to-[#0a0c16] border border-purple-900/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 blur-3xl pointer-events-none" />

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-chakra font-semibold text-slate-300 uppercase tracking-widest mb-2">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>LIVE TOURNAMENT CAPACITY</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white tracking-wider uppercase">
            TEAM SLOTS
          </h3>

          {/* Main big numbers */}
          <div className="my-3 flex items-baseline justify-center gap-2">
            <span className={`font-orbitron font-black text-4xl sm:text-6xl ${
              isFull ? 'text-red-400 text-glow-purple' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'
            }`}>
              {registered}
            </span>
            <span className="font-orbitron text-2xl sm:text-3xl text-slate-500 font-bold">
              /
            </span>
            <span className="font-orbitron font-black text-3xl sm:text-4xl text-slate-300">
              {stats.maxSlots}
            </span>
          </div>

          {/* Required Status Text */}
          {isFull ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-400 font-chakra font-bold text-sm sm:text-base animate-pulse">
              <ShieldAlert className="w-4 h-4" />
              <span>🔴 REGISTRATIONS CLOSED</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 font-chakra font-bold text-sm sm:text-base">
              <span className="text-purple-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                {registered} TEAMS REGISTERED
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-cyan-400">
                {remaining} SLOTS REMAINING
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#07080f] rounded-full h-3 sm:h-4 p-0.5 border border-slate-800 mb-8">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isFull 
                ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-md shadow-red-500/50' 
                : 'bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 shadow-md shadow-cyan-500/30'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Visual 24-Slot Grid Matrix */}
        <div className="border-t border-slate-800/80 pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-chakra font-bold text-slate-400 uppercase tracking-wider">
              OFFICIAL SQUAD GRID (SLOT #01 TO #24)
            </span>
            <div className="flex items-center gap-3 text-xs font-rajdhani text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-600"></span> Claimed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#090b14] border border-slate-700"></span> Open
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {slotArray.map((slotNum) => {
              const isClaimed = slotNum <= registered;

              return (
                <div
                  key={slotNum}
                  className={`relative p-2 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
                    isClaimed
                      ? 'bg-purple-950/50 border border-purple-500/40 text-purple-200 shadow-sm'
                      : 'bg-[#080912] border border-slate-800/80 text-slate-500 hover:border-slate-700'
                  }`}
                  title={`Slot #${slotNum < 10 ? '0' + slotNum : slotNum}: ${isClaimed ? 'Claimed' : 'Available'}`}
                >
                  <span className="text-[9px] font-chakra text-slate-400 uppercase">SLOT</span>
                  <span className={`font-orbitron font-bold text-xs ${isClaimed ? 'text-cyan-300' : 'text-slate-400'}`}>
                    #{slotNum < 10 ? `0${slotNum}` : slotNum}
                  </span>
                  {isClaimed ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-purple-400 mt-0.5" />
                  ) : (
                    <CircleDashed className="w-2.5 h-2.5 text-slate-600 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
