import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Phone, 
  UploadCloud, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  FileCode, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { isConfiguredWithRealFirebase } from '../firebase/config';
import { testFirestoreConnection } from '../firebase/db';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const isRealFirebase = isConfiguredWithRealFirebase();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const ok = await testFirestoreConnection();
      if (ok) {
        setTestResult("✅ Success! Live Firestore is connected and responsive.");
      } else {
        setTestResult("⚠️ App is currently running in local storage preview mode. Add your Firebase credentials in src/firebase/config.ts to connect live.");
      }
    } catch (e: any) {
      setTestResult("❌ Connection test failed: " + e.message);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#0d0f1e] border border-cyan-500/40 p-6 sm:p-10 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white tracking-wide">
              FIREBASE & WHATSAPP SETUP GUIDE
            </h2>
            <p className="text-xs font-chakra text-slate-400">
              Zero-to-Hero configuration instructions for VS Code & Deployment
            </p>
          </div>
        </div>

        {/* Current status banner */}
        <div className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isRealFirebase 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
        }`}>
          <div>
            <div className="font-chakra font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              STATUS: {isRealFirebase ? "Connected to Live Firebase" : "Active in Local Demo Mode (Ready to Connect)"}
            </div>
            <p className="text-xs font-rajdhani text-slate-300 mt-0.5">
              The app has full 24-slot transactional logic, admin login, and CSV export running right now!
            </p>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-chakra font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{testingConnection ? "Testing..." : "Test Firestore Ping"}</span>
          </button>
        </div>

        {testResult && (
          <div className="mt-3 p-3 rounded-lg bg-[#070810] border border-slate-700 text-xs font-chakra text-slate-200">
            {testResult}
          </div>
        )}

        {/* Step-by-step Tabs / Sections */}
        <div className="mt-8 space-y-6 font-rajdhani">
          
          {/* STEP 1: Firebase Project */}
          <div className="p-4 rounded-xl bg-[#090b14] border border-slate-800">
            <h3 className="font-chakra font-bold text-sm text-cyan-300 uppercase flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs">1</span>
              Create Firebase Project & App
            </h3>
            <p className="text-xs text-slate-300">
              1. Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-2.5 h-2.5" /></a> and click <strong>Add Project</strong>. Name it <code className="text-purple-300 font-mono">og-esports-br-clash</code>.<br />
              2. Click <strong>Web (&lt;/&gt;)</strong> to add a web application. Give it an app nickname.
            </p>
          </div>

          {/* STEP 2: Enable Firestore & Security Rules */}
          <div className="p-4 rounded-xl bg-[#090b14] border border-slate-800">
            <h3 className="font-chakra font-bold text-sm text-purple-300 uppercase flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xs">2</span>
              Enable Cloud Firestore & Paste Rules
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              1. In Firebase Console, go to <strong>Build → Firestore Database → Create Database</strong>.<br />
              2. Go to the <strong>Rules</strong> tab and copy-paste the contents of <code className="text-cyan-300 font-mono">firestore.rules</code> from this repository, then click <strong>Publish</strong>.
            </p>
          </div>

          {/* STEP 3 & 4: Enable Authentication & Create Admin */}
          <div className="p-4 rounded-xl bg-[#090b14] border border-slate-800">
            <h3 className="font-chakra font-bold text-sm text-emerald-300 uppercase flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs">3</span>
              Enable Authentication & Create Admin Account
            </h3>
            <p className="text-xs text-slate-300 mb-1">
              1. In Firebase Console, go to <strong>Build → Authentication → Get Started</strong>.<br />
              2. Under the <strong>Sign-in method</strong> tab, enable <strong>Email/Password</strong>.<br />
              3. Go to the <strong>Users</strong> tab and click <strong>Add User</strong>. Enter your admin email and a secure password.<br />
              4. You will use these exact credentials to log in to <code className="text-cyan-300 font-mono">/admin</code>.
            </p>
          </div>

          {/* STEP 5 & 6: Where to paste Firebase Config */}
          <div className="p-4 rounded-xl bg-[#090b14] border border-cyan-500/30">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-chakra font-bold text-sm text-cyan-300 uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs">4</span>
                Where to Paste Firebase Configuration
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">src/firebase/config.ts</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Copy your Firebase Web App configuration from <strong>Project Settings → General → Your apps → SDK setup and configuration</strong> and paste it inside:
            </p>
            <div className="relative p-3 rounded-lg bg-[#05060b] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <pre>{`export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "og-esports-br-clash.firebaseapp.com",
  projectId: "og-esports-br-clash",
  storageBucket: "og-esports-br-clash.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};`}</pre>
            </div>
          </div>

          {/* STEP 7: Where to replace WhatsApp number */}
          <div className="p-4 rounded-xl bg-[#090b14] border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-chakra font-bold text-sm text-emerald-300 uppercase flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs">5</span>
                Set Your Real Admin WhatsApp Number
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">src/config.ts</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Open <code className="text-emerald-300 font-mono">src/config.ts</code> and update the <code className="text-white font-mono">ADMIN_WHATSAPP_NUMBER</code> constant:
            </p>
            <div className="p-3 rounded-lg bg-[#05060b] border border-slate-800 font-mono text-[11px] text-emerald-300">
              <code>export const ADMIN_WHATSAPP_NUMBER = "919876543210"; // Digits only with country code</code>
            </div>
          </div>

          {/* STEP 8: Deploy */}
          <div className="p-4 rounded-xl bg-[#090b14] border border-slate-800">
            <h3 className="font-chakra font-bold text-sm text-purple-300 uppercase flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 border border-purple-500/40 flex items-center justify-center text-xs">6</span>
              Deploying to Production
            </h3>
            <p className="text-xs text-slate-300">
              Run <code className="text-cyan-300 font-mono">npm run build</code>. The production static files will be generated in <code className="text-cyan-300 font-mono">dist/</code>.
              Deploy seamlessly with <strong>Firebase Hosting</strong> (<code className="text-purple-300 font-mono">firebase deploy</code>) or drop onto Vercel / GitHub Pages!
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-chakra font-bold text-xs tracking-wider transition-all shadow-md shadow-purple-600/30"
          >
            GOT IT, CLOSE GUIDE
          </button>
        </div>

      </div>
    </div>
  );
};
