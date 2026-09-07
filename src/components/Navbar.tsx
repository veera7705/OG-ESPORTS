import React from 'react';
import { Shield, Users, Lock, MessageCircle, ExternalLink } from 'lucide-react';
import { TOURNAMENT_CONFIG, ADMIN_WHATSAPP_NUMBER } from '../config';
import { TournamentStats } from '../types';

interface NavbarProps {
  stats: TournamentStats;
  currentPage: 'public' | 'admin';
  onNavigate: (page: 'public' | 'admin') => void;
  onOpenSetupGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentPage,
  onNavigate,
  onOpenSetupGuide
}) => {
  const isFull = stats.registeredCount >= stats.maxSlots;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/30 bg-[#07080d]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('public')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-all">
            <div className="w-full h-full bg-[#090b14] rounded-[7px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-lg sm:text-xl tracking-wider text-white">
                {TOURNAMENT_CONFIG.orgName}
              </span>
              <span className="text-[10px] font-chakra font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                BR CLASH
              </span>
            </div>
            <p className="text-[11px] font-rajdhani text-slate-400 font-semibold tracking-wider hidden sm:block">
              24-TEAM TOURNAMENT
            </p>
          </div>
        </div>

        {/* Live Slot Counter Pill & Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Real-time slot status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isFull ? 'bg-red-400' : 'bg-cyan-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isFull ? 'bg-red-500' : 'bg-cyan-400'
              }`}></span>
            </span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-chakra text-xs font-semibold text-slate-300">
              SLOTS: <span className={isFull ? "text-red-400 font-bold" : "text-cyan-400 font-bold"}>{stats.registeredCount}</span> / {stats.maxSlots}
            </span>
          </div>

          {/* Quick WhatsApp Link in header */}
          <a
            href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(TOURNAMENT_CONFIG.whatsappDefaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 text-xs font-chakra font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>

          {/* Setup Guide Button */}
          <button
            onClick={onOpenSetupGuide}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-purple-950/30 border border-purple-500/30 hover:bg-purple-900/30 text-purple-300 text-xs font-chakra font-medium transition-colors"
            title="Firebase & WhatsApp Setup Guide"
          >
            Config Guide
          </button>

          {/* Admin Navigation Button */}
          {currentPage === 'public' ? (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 text-xs font-chakra font-bold tracking-wide transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>ADMIN PANEL</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('public')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-chakra font-bold tracking-wide transition-all shadow-md shadow-purple-600/30"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>PUBLIC PORTAL</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
