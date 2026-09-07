import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldAlert, ArrowRight, ArrowLeft, Info, Eye, EyeOff } from 'lucide-react';
import { loginAdminUser, AdminUser } from '../firebase/auth';
import { isConfiguredWithRealFirebase } from '../firebase/config';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
  onCancel: () => void;
  onOpenSetupGuide: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onSuccess,
  onCancel,
  onOpenSetupGuide
}) => {
  const isRealFirebase = isConfiguredWithRealFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill in both Email and Password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await loginAdminUser(email, password);
      onSuccess(user);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Authentication failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@ogesports.com');
    setPassword('admin123456');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d0f1c] border border-purple-900/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-950/50">
            <Lock className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white tracking-wider uppercase">
            OG ESPORTS ADMIN
          </h2>
          <p className="text-xs font-chakra font-medium text-slate-400 mt-1">
            SECURE FIREBASE AUTHENTICATION PORTAL
          </p>
        </div>

        {/* Demo Mode Notice */}
        {!isRealFirebase && (
          <div className="mb-6 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-chakra text-cyan-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-cyan-300">⚡ PREVIEW TEST MODE</span>
              <button 
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] underline hover:text-white font-bold cursor-pointer"
              >
                Auto-Fill Demo
              </button>
            </div>
            <p className="text-slate-300 text-[11px]">
              Demo login: <code className="text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded">admin@ogesports.com</code> / <code className="text-cyan-300 bg-cyan-950 px-1 py-0.5 rounded">admin123456</code>
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 flex items-start gap-2.5 text-red-200 text-xs font-chakra">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div>
            <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ogesports.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080912] border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 font-rajdhani font-semibold text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-chakra font-bold text-slate-300 uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#080912] border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 font-rajdhani font-semibold text-sm focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-chakra font-bold text-sm tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO ADMIN PANEL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-chakra">
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </button>

          <button
            type="button"
            onClick={onOpenSetupGuide}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Setup Instructions</span>
          </button>
        </div>

      </div>
    </div>
  );
};
