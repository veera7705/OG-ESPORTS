import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Copy, Share2, ArrowLeft, Shield } from 'lucide-react';
import { TeamRegistration } from '../types';
import { TOURNAMENT_CONFIG, ADMIN_WHATSAPP_NUMBER } from '../config';

interface RegistrationSuccessProps {
  team: TeamRegistration;
  onBackToHome: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  team,
  onBackToHome
}) => {
  // Fire celebratory esports confetti on screen load
  useEffect(() => {
    try {
      // Primary burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#ec4899', '#ffffff']
      });

      // Side fireworks
      const timeout1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#00f0ff']
        });
      }, 250);

      const timeout2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#c084fc', '#38bdf8']
        });
      }, 400);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    } catch (e) {
      console.error("Confetti trigger:", e);
    }
  }, []);

  const formattedSlot = team.slotNumber < 10 ? `0${team.slotNumber}` : `${team.slotNumber}`;

  const copyTicketDetails = () => {
    const text = `🏆 OG ESPORTS — BR CLASHES REGISTRATION\n\n` +
      `SQUAD: ${team.teamName}\n` +
      `SLOT: #${formattedSlot}\n` +
      `CAPTAIN: ${team.captainName}\n` +
      `PLAYERS:\n• ${team.player1}\n• ${team.player2}\n• ${team.player3}\n• ${team.player4}` +
      (team.substitute ? `\n• Sub: ${team.substitute}` : '') +
      `\n\nOfficial confirmation verified. See you in the battlefield!`;
    navigator.clipboard.writeText(text);
    alert("Squad registration details copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#111424] to-[#080912] border border-cyan-500/30 p-8 sm:p-12 shadow-2xl shadow-purple-950/40 text-center overflow-hidden">
        
        {/* Futuristic glowing corners */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Big Trophy Graphic */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] mb-6 shadow-xl shadow-cyan-500/20 animate-bounce duration-1000">
          <div className="w-full h-full bg-[#090b14] rounded-[14px] flex items-center justify-center">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-400" />
          </div>
        </div>

        {/* Required Headline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-chakra font-bold uppercase tracking-wider mb-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>CONFIRMED ENTRY</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white tracking-wider uppercase text-glow-cyan mb-2">
          REGISTRATION SUCCESSFUL!
        </h1>

        <p className="text-lg sm:text-xl font-rajdhani font-bold text-cyan-300 mb-8">
          Welcome to OG ESPORTS BR CLASHES
        </p>

        {/* Official Squad Pass Card */}
        <div className="my-6 p-6 sm:p-8 rounded-2xl bg-[#06070e] border border-purple-500/30 text-left shadow-inner relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-orbitron font-bold text-sm text-white tracking-wider">
                OG ESPORTS SQUAD PASS
              </span>
            </div>
            <span className="font-chakra text-xs text-slate-400">
              STATUS: <span className="text-emerald-400 font-bold uppercase">REGISTERED</span>
            </span>
          </div>

          {/* Slot Highlight */}
          <div className="text-center py-4 bg-[#0a0d1a] rounded-xl border border-cyan-500/30 mb-6">
            <div className="text-xs font-chakra font-bold text-slate-400 tracking-widest uppercase">
              YOUR SLOT
            </div>
            <div className="font-orbitron font-black text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 tracking-wider">
              #{formattedSlot}
            </div>
          </div>

          {/* Team and Captain Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-rajdhani">
            <div>
              <span className="text-xs font-chakra text-slate-400 uppercase tracking-wider block">
                Team Name
              </span>
              <span className="font-orbitron font-bold text-lg text-white">
                {team.teamName}
              </span>
            </div>

            <div>
              <span className="text-xs font-chakra text-slate-400 uppercase tracking-wider block">
                Captain Name
              </span>
              <span className="font-chakra font-semibold text-base text-cyan-300">
                {team.captainName}
              </span>
            </div>

            <div>
              <span className="text-xs font-chakra text-slate-400 uppercase tracking-wider block">
                Registered Contact
              </span>
              <span className="font-chakra text-slate-300">
                +91 {team.whatsapp}
              </span>
            </div>

            <div>
              <span className="text-xs font-chakra text-slate-400 uppercase tracking-wider block">
                Tournament Date
              </span>
              <span className="font-chakra text-slate-300">
                {TOURNAMENT_CONFIG.registrationDateText} • {TOURNAMENT_CONFIG.registrationTimeText}
              </span>
            </div>
          </div>

          {/* Lineup summary */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-chakra text-slate-400 uppercase tracking-wider block mb-2">
              Registered Squad Lineup
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-chakra text-slate-300">
              <div>1. {team.player1}</div>
              <div>2. {team.player2}</div>
              <div>3. {team.player3}</div>
              <div>4. {team.player4}</div>
              {team.substitute && (
                <div className="col-span-2 text-slate-400">Sub: {team.substitute}</div>
              )}
            </div>
          </div>

        </div>

        {/* Required Message */}
        <p className="text-base sm:text-lg font-rajdhani font-semibold text-slate-300 mb-8">
          You are officially registered. Get your squad ready!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          
          <button
            onClick={copyTicketDetails}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-chakra font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4 text-cyan-400" />
            <span>COPY SQUAD PASS</span>
          </button>

          {/* Required Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-chakra font-bold text-sm tracking-wide transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>

        </div>

      </div>
    </div>
  );
};
