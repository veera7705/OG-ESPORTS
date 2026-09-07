import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Phone, 
  Shield, 
  AlertCircle, 
  Send, 
  Lock, 
  CheckCircle, 
  Info 
} from 'lucide-react';
import { RegistrationFormData, FormValidationErrors, TeamRegistration, TournamentStats } from '../types';
import { registerTeam } from '../firebase/db';

interface RegistrationFormProps {
  stats: TournamentStats;
  onSuccess: (registeredTeam: TeamRegistration) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  stats,
  onSuccess
}) => {
  const isFull = stats.registeredCount >= stats.maxSlots;

  const [formData, setFormData] = useState<RegistrationFormData>({
    teamName: '',
    captainName: '',
    whatsapp: '',
    player1: '',
    player2: '',
    player3: '',
    player4: '',
    substitute: ''
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For WhatsApp, only allow digits and max 10 chars
    if (name === 'whatsapp') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear field-specific error on change
    if (errors[name as keyof FormValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (submissionError) {
      setSubmissionError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormValidationErrors = {};

    // 1. Team Name validation
    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required.";
    } else if (formData.teamName.trim().length < 2) {
      newErrors.teamName = "Team name must be at least 2 characters.";
    }

    // 2. Captain Name validation
    if (!formData.captainName.trim()) {
      newErrors.captainName = "Captain name is required.";
    } else if (formData.captainName.trim().length < 2) {
      newErrors.captainName = "Captain name must be at least 2 characters.";
    }

    // 3. Captain WhatsApp validation (must contain exactly 10 digits)
    const cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (!cleanWhatsapp) {
      newErrors.whatsapp = "Captain WhatsApp number is required.";
    } else if (cleanWhatsapp.length !== 10) {
      newErrors.whatsapp = "WhatsApp number must contain exactly 10 digits.";
    }

    // 4. Main 4 Players validation (All four main players required)
    if (!formData.player1.trim()) {
      newErrors.player1 = "Player 1 Name / UID is required.";
    }
    if (!formData.player2.trim()) {
      newErrors.player2 = "Player 2 Name / UID is required.";
    }
    if (!formData.player3.trim()) {
      newErrors.player3 = "Player 3 Name / UID is required.";
    }
    if (!formData.player4.trim()) {
      newErrors.player4 = "Player 4 Name / UID is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) {
      setSubmissionError("REGISTRATIONS CLOSED: All 24 slots have been filled.");
      return;
    }

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      if (firstError) setSubmissionError(firstError);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const registeredTeam = await registerTeam(formData);
      onSuccess(registeredTeam);
    } catch (err: any) {
      console.error("Registration error:", err);
      setSubmissionError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration-form" className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
      <div className="relative rounded-2xl bg-[#0b0c16]/95 border border-purple-900/40 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-chakra font-bold text-purple-300 uppercase tracking-widest mb-3">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>OFFICIAL SQUAD ENTRY</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-orbitron font-extrabold text-white tracking-wider uppercase">
            TEAM REGISTRATION FORM
          </h2>
          <p className="text-sm sm:text-base font-rajdhani text-slate-400 mt-2 font-medium">
            Fill in your squad details accurately. Slots are reserved instantly upon submission.
          </p>
        </div>

        {/* Disabled Banner when 24 slots are full */}
        {isFull ? (
          <div className="p-6 rounded-xl bg-red-950/60 border border-red-500/50 text-center mb-8 animate-pulse">
            <div className="flex items-center justify-center gap-3 text-red-400 font-orbitron font-bold text-xl sm:text-2xl">
              <Lock className="w-6 h-6" />
              <span>🔴 REGISTRATIONS CLOSED</span>
            </div>
            <p className="font-rajdhani text-slate-300 font-semibold text-base mt-2">
              All 24 team slots have been successfully filled! No further registrations are accepted.
            </p>
            <p className="text-xs font-chakra text-slate-400 mt-1">
              Check with the admin on WhatsApp in case any slot gets cancelled.
            </p>
          </div>
        ) : null}

        {/* Submission Error Banner */}
        {submissionError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-3 text-red-200 text-sm font-chakra">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error: </span>
              {submissionError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={isFull ? "opacity-50 pointer-events-none" : ""}>
          
          {/* SECTION 1: TEAM INFORMATION */}
          <div className="mb-8">
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-800">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="font-orbitron font-bold text-base sm:text-lg text-cyan-300 tracking-wide uppercase">
                Team Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Team Name */}
              <div>
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Team Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="e.g., SOUL REAPERS"
                    disabled={isFull || isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#07080f] border ${
                      errors.teamName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-cyan-400'
                    } text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors`}
                  />
                </div>
                {errors.teamName && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.teamName}</p>
                )}
              </div>

              {/* Captain Name */}
              <div>
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Captain Name <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="captainName"
                    value={formData.captainName}
                    onChange={handleChange}
                    placeholder="e.g., Aman Sharma (or In-Game IGN)"
                    disabled={isFull || isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl bg-[#07080f] border ${
                      errors.captainName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-cyan-400'
                    } text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors`}
                  />
                </div>
                {errors.captainName && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.captainName}</p>
                )}
              </div>

              {/* Captain WhatsApp Number */}
              <div className="md:col-span-2">
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Captain WhatsApp Number <span className="text-cyan-400">*</span>
                  <span className="text-[11px] font-rajdhani text-slate-400 font-normal ml-2">
                    (Exactly 10 digits — used to send custom room ID & password)
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-chakra font-bold text-slate-400 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    disabled={isFull || isSubmitting}
                    className={`w-full pl-14 pr-4 py-3 rounded-xl bg-[#07080f] border ${
                      errors.whatsapp ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-cyan-400'
                    } text-white placeholder-slate-600 font-rajdhani font-bold text-base tracking-wider focus:outline-none transition-colors`}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.whatsapp}</p>
                )}
              </div>

            </div>
          </div>

          {/* SECTION 2: PLAYERS */}
          <div className="mb-8">
            <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-800">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron font-bold text-base sm:text-lg text-purple-300 tracking-wide uppercase">
                Squad Roster / Players
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Player 1 */}
              <div>
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Player 1 Name / UID <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  name="player1"
                  value={formData.player1}
                  onChange={handleChange}
                  placeholder="e.g., Viper (UID: 512489102)"
                  disabled={isFull || isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07080f] border ${
                    errors.player1 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-purple-400'
                  } text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors`}
                />
                {errors.player1 && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.player1}</p>
                )}
              </div>

              {/* Player 2 */}
              <div>
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Player 2 Name / UID <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  name="player2"
                  value={formData.player2}
                  onChange={handleChange}
                  placeholder="e.g., MortalX (UID: 512489103)"
                  disabled={isFull || isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07080f] border ${
                    errors.player2 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-purple-400'
                  } text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors`}
                />
                {errors.player2 && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.player2}</p>
                )}
              </div>

              {/* Player 3 */}
              <div>
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Player 3 Name / UID <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  name="player3"
                  value={formData.player3}
                  onChange={handleChange}
                  placeholder="e.g., Shadow (UID: 512489104)"
                  disabled={isFull || isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07080f] border ${
                    errors.player3 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-purple-400'
                  } text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors`}
                />
                {errors.player3 && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.player3}</p>
                )}
              </div>

              {/* Player 4 */}
              <div>
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Player 4 Name / UID <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  name="player4"
                  value={formData.player4}
                  onChange={handleChange}
                  placeholder="e.g., Phantom (UID: 512489105)"
                  disabled={isFull || isSubmitting}
                  className={`w-full px-4 py-3 rounded-xl bg-[#07080f] border ${
                    errors.player4 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-purple-400'
                  } text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors`}
                />
                {errors.player4 && (
                  <p className="text-red-400 text-xs font-chakra mt-1">{errors.player4}</p>
                )}
              </div>

              {/* Substitute (Optional) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Substitute Name / UID <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="substitute"
                  value={formData.substitute}
                  onChange={handleChange}
                  placeholder="e.g., Ghost (UID: 512489106) — optional"
                  disabled={isFull || isSubmitting}
                  className="w-full px-4 py-3 rounded-xl bg-[#07080f] border border-slate-800 focus:border-purple-400 text-white placeholder-slate-600 font-rajdhani font-semibold text-base focus:outline-none transition-colors"
                />
              </div>

            </div>
          </div>

          {/* Mandatory Confirmation Notice */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-sm font-rajdhani font-semibold text-purple-200">
              By registering, you confirm that the information provided is correct.
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isFull || isSubmitting}
              className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-chakra font-bold text-base sm:text-lg tracking-wider shadow-lg shadow-purple-600/30 hover:shadow-cyan-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>RESERVING SLOT...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>SUBMIT REGISTRATION</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};
