import React, { useState, useEffect } from 'react';
import { Flame, Users, Calendar, Clock, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { TOURNAMENT_CONFIG, getTargetRegistrationDate } from '../config';
import { TournamentStats } from '../types';

interface HeroSectionProps {
  stats: TournamentStats;
  onRegisterClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onRegisterClick
}) => {
  const isSlotsFull = stats.registeredCount >= stats.maxSlots;

  // Countdown calculations
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasPassed: true // By default, check against target
  });

  useEffect(() => {
    const targetDate = getTargetRegistrationDate();

    const calculateTime = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          hasPassed: true
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          hasPassed: false
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-purple-900/20">
      
      {/* Subtle Background Ambience & Radial Glows */}
      <div className="absolute inset-0 esports-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-950/80 to-cyan-950/80 border border-purple-500/30 text-xs sm:text-sm font-chakra font-bold text-cyan-300 mb-6 shadow-lg shadow-purple-950/50">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="tracking-widest">OFFICIAL ESPORTS TOURNAMENT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-purple-300 tracking-wider">SEASON 2026</span>
        </div>

        {/* Hero Title */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 uppercase">
            {TOURNAMENT_CONFIG.orgName}
          </h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-orbitron font-black tracking-tight text-white mt-1 uppercase text-glow-purple">
            {TOURNAMENT_CONFIG.shortTitle}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl font-rajdhani font-semibold text-slate-300 tracking-wide mb-8">
          {TOURNAMENT_CONFIG.subtitle}
        </p>

        {/* Prominent Required Tournament Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
          
          {/* Badge 1: Free Registration */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e111d]/80 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-950/30 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">🆓</span>
            <span className="font-chakra font-bold text-sm sm:text-base text-white tracking-wide">
              FREE REGISTRATION
            </span>
            <span className="text-[11px] font-rajdhani text-slate-400 font-semibold uppercase">
              No Entry Fee
            </span>
          </div>

          {/* Badge 2: First 24 Teams Only */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e111d]/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/30 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">👥</span>
            <span className="font-chakra font-bold text-sm sm:text-base text-cyan-300 tracking-wide">
              FIRST 24 TEAMS ONLY
            </span>
            <span className="text-[11px] font-rajdhani text-slate-400 font-semibold uppercase">
              Strict Cap
            </span>
          </div>

          {/* Badge 3: Registration Date 8th */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e111d]/80 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-950/30 flex flex-col items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-400 mb-1" />
            <span className="font-chakra font-bold text-sm sm:text-base text-white tracking-wide">
              REGISTRATION: {TOURNAMENT_CONFIG.registrationDateText}
            </span>
            <span className="text-[11px] font-rajdhani text-slate-400 font-semibold uppercase">
              Scheduled Date
            </span>
          </div>

          {/* Badge 4: Time 4:00 PM */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#0e111d]/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/30 flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 text-cyan-400 mb-1" />
            <span className="font-chakra font-bold text-sm sm:text-base text-cyan-300 tracking-wide">
              TIME: {TOURNAMENT_CONFIG.registrationTimeText}
            </span>
            <span className="text-[11px] font-rajdhani text-slate-400 font-semibold uppercase">
              {TOURNAMENT_CONFIG.registrationTimezone}
            </span>
          </div>

        </div>

        {/* Real-time Status & Live Countdown Box */}
        <div className="max-w-xl mx-auto mb-10 p-5 rounded-2xl bg-gradient-to-b from-[#111424]/90 to-[#0b0c16]/90 border border-slate-800 shadow-xl backdrop-blur-lg">
          
          {/* Status Headline according to specifications */}
          {isSlotsFull ? (
            <div className="flex items-center justify-center gap-2 text-red-400 font-orbitron font-bold text-base sm:text-lg">
              <Lock className="w-5 h-5" />
              <span>ALL 24 TEAM SLOTS ARE FILLED 🔒</span>
            </div>
          ) : timeLeft.hasPassed ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-orbitron font-bold text-base sm:text-lg">
              <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
              <span>REGISTRATIONS ARE NOW OPEN 🔥</span>
            </div>
          ) : (
            <div>
              <p className="text-xs sm:text-sm font-chakra font-semibold text-purple-300 tracking-widest uppercase mb-3">
                REGISTRATION OPENS IN
              </p>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 rounded-lg bg-[#07080f] border border-purple-500/20">
                  <div className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-400">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-chakra text-slate-400 uppercase">Days</div>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-[#07080f] border border-purple-500/20">
                  <div className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-chakra text-slate-400 uppercase">Hours</div>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-[#07080f] border border-purple-500/20">
                  <div className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-chakra text-slate-400 uppercase">Mins</div>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-[#07080f] border border-purple-500/20">
                  <div className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-chakra text-slate-400 uppercase">Secs</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 text-xs font-rajdhani text-slate-400">
            Timezone: <span className="text-slate-200 font-semibold">{TOURNAMENT_CONFIG.registrationTimezone}</span> • Custom Room ID provided to Captain via WhatsApp
          </div>
        </div>

        {/* Large Primary Action Button */}
        <div>
          {isSlotsFull ? (
            <button
              disabled
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-base sm:text-lg font-chakra font-bold tracking-wider cursor-not-allowed opacity-80"
            >
              <Lock className="w-5 h-5 text-red-400" />
              <span>REGISTRATIONS CLOSED</span>
            </button>
          ) : (
            <button
              onClick={onRegisterClick}
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white text-base sm:text-lg font-chakra font-extrabold tracking-wider shadow-xl shadow-purple-600/30 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>REGISTER YOUR TEAM</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
