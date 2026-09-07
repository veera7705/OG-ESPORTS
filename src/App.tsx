import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SlotCounter } from './components/SlotCounter';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationSuccess } from './components/RegistrationSuccess';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { SetupGuideModal } from './components/SetupGuideModal';
import { subscribeTournamentStats } from './firebase/db';
import { subscribeAdminAuthState, AdminUser } from './firebase/auth';
import { TournamentStats, TeamRegistration } from './types';
import { TOURNAMENT_CONFIG, ADMIN_WHATSAPP_NUMBER } from './config';
import { Shield, Trophy, Users, BookOpen, ChevronRight, Lock } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState<TournamentStats>({
    registeredCount: 8,
    maxSlots: TOURNAMENT_CONFIG.maxTeams,
    isOpen: true
  });

  const [currentView, setCurrentView] = useState<'public' | 'success' | 'admin'>('public');
  const [successfulRegistration, setSuccessfulRegistration] = useState<TeamRegistration | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);

  // Subscribe to real-time slot stats
  useEffect(() => {
    const unsubscribeStats = subscribeTournamentStats((newStats) => {
      setStats(newStats);
    });
    return () => unsubscribeStats();
  }, []);

  // Subscribe to admin auth state
  useEffect(() => {
    const unsubscribeAuth = subscribeAdminAuthState((user) => {
      setAdminUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to hash / URL change for /admin
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#/admin') {
        setCurrentView('admin');
      } else if (hash === '' || hash === '#home' || hash === '#/') {
        if (currentView === 'admin') setCurrentView('public');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleNavigate = (page: 'public' | 'admin') => {
    if (page === 'admin') {
      window.location.hash = '#admin';
      setCurrentView('admin');
    } else {
      window.location.hash = '#home';
      setCurrentView('public');
    }
  };

  const handleRegistrationSuccess = (team: TeamRegistration) => {
    setSuccessfulRegistration(team);
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSuccessfulRegistration(null);
    setCurrentView('public');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToForm = () => {
    const formEl = document.getElementById('registration-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080d] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Navigation Bar */}
      <Navbar
        stats={stats}
        currentPage={currentView === 'admin' ? 'admin' : 'public'}
        onNavigate={handleNavigate}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* VIEW 1: REGISTRATION SUCCESS SCREEN */}
        {currentView === 'success' && successfulRegistration ? (
          <RegistrationSuccess
            team={successfulRegistration}
            onBackToHome={handleBackToHome}
          />
        ) : null}

        {/* VIEW 2: ADMIN PANEL */}
        {currentView === 'admin' ? (
          adminUser ? (
            <AdminDashboard
              user={adminUser}
              onLogout={() => {
                setAdminUser(null);
                setCurrentView('public');
              }}
              onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
            />
          ) : (
            <AdminLogin
              onSuccess={(user) => setAdminUser(user)}
              onCancel={() => handleNavigate('public')}
              onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
            />
          )
        ) : null}

        {/* VIEW 3: PUBLIC REGISTRATION WEBSITE */}
        {currentView === 'public' && (
          <>
            {/* Hero Section */}
            <HeroSection
              stats={stats}
              onRegisterClick={scrollToForm}
            />

            {/* Live Capacity Counter & Slot Grid */}
            <SlotCounter stats={stats} />

            {/* Official Tournament Guidelines & Format */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
              <div className="rounded-2xl bg-[#0a0c16] border border-slate-800 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800/80 pb-3">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-orbitron font-bold text-base sm:text-lg text-white tracking-wider uppercase">
                    OFFICIAL TOURNAMENT RULES & MATCH PROTOCOL
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 font-rajdhani text-sm">
                  {TOURNAMENT_CONFIG.rules.map((rule, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-[#07080f] border border-slate-800/60 flex items-start gap-2.5 text-slate-300"
                    >
                      <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Official Registration Form */}
            <RegistrationForm
              stats={stats}
              onSuccess={handleRegistrationSuccess}
            />

            {/* Floating WhatsApp Contact Button */}
            <WhatsAppFloatingButton />
          </>
        )}

      </main>

      {/* Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />

      {/* Public Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05060a] py-10 text-center font-rajdhani">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-orbitron font-extrabold text-base tracking-wider text-white">
                {TOURNAMENT_CONFIG.orgName}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-chakra text-xs text-purple-400 tracking-wider uppercase">
                {TOURNAMENT_CONFIG.shortTitle}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-chakra">
              <button
                onClick={() => handleNavigate('public')}
                className="text-slate-400 hover:text-cyan-300 transition-colors"
              >
                Registration
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setIsSetupGuideOpen(true)}
                className="text-slate-400 hover:text-purple-300 transition-colors"
              >
                Configuration
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => handleNavigate('admin')}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-chakra">
            <p>
              FREE REGISTRATION — FIRST 24 TEAMS ONLY • REGISTRATION: 8TH — 4:00 PM
            </p>
            <p>
              © {new Date().getFullYear()} {TOURNAMENT_CONFIG.orgName}. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
