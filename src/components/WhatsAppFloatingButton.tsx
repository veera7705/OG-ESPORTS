import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ADMIN_WHATSAPP_NUMBER, TOURNAMENT_CONFIG } from '../config';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(TOURNAMENT_CONFIG.whatsappDefaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      
      {/* Tooltip on hover */}
      <div className="absolute right-full bottom-1/2 translate-y-1/2 mr-3.5 hidden sm:flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="px-3 py-1.5 rounded-lg bg-[#0e111d] border border-emerald-500/40 text-emerald-300 text-xs font-chakra font-bold tracking-wide shadow-xl whitespace-nowrap">
          Chat with OG Esports
        </div>
        <div className="w-2 h-2 bg-[#0e111d] border-t border-r border-emerald-500/40 rotate-45 -ml-1" />
      </div>

      {/* Pulsing ring */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact OG Esports on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-400 text-white shadow-xl shadow-emerald-900/50 hover:shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white/10 stroke-[2.2]" />
      </a>

    </div>
  );
};
