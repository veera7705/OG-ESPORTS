import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, isConfiguredWithRealFirebase } from './config';

export interface AdminUser {
  uid: string;
  email: string | null;
  isDemo?: boolean;
}

const LOCAL_ADMIN_SESSION_KEY = 'og_esports_admin_session';

/**
 * Sign in as admin with email & password
 */
export async function loginAdminUser(email: string, pass: string): Promise<AdminUser> {
  const cleanEmail = email.trim();

  // 1. Live Firebase Authentication
  if (auth && isConfiguredWithRealFirebase()) {
    const userCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return {
      uid: userCred.user.uid,
      email: userCred.user.email,
      isDemo: false
    };
  }

  // 2. Demo fallback authentication
  // Allows the organizer to test the admin panel immediately in preview
  // Accepts standard credentials or whatever email they configured
  if (!cleanEmail || !pass) {
    throw new Error("Please enter both email and password.");
  }

  if (pass.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  // Demo validation (allows admin@ogesports.com or any valid email with demo password)
  if (cleanEmail === 'admin@ogesports.com' && pass === 'admin123456') {
    const demoUser: AdminUser = {
      uid: 'demo-admin-uid-01',
      email: cleanEmail,
      isDemo: true
    };
    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(demoUser));
    window.dispatchEvent(new Event('og_auth_update'));
    return demoUser;
  }

  // If user enters custom credentials in demo mode, let them test easily
  if (cleanEmail.includes('@') && pass.length >= 6) {
    const demoUser: AdminUser = {
      uid: 'custom-admin-' + Date.now(),
      email: cleanEmail,
      isDemo: true
    };
    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(demoUser));
    window.dispatchEvent(new Event('og_auth_update'));
    return demoUser;
  }

  throw new Error("Invalid credentials. For demo preview, use admin@ogesports.com / admin123456.");
}

/**
 * Sign out admin
 */
export async function logoutAdminUser(): Promise<void> {
  if (auth && isConfiguredWithRealFirebase()) {
    await signOut(auth);
    return;
  }

  localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event('og_auth_update'));
}

/**
 * Subscribe to admin authentication state changes
 */
export function subscribeAdminAuthState(callback: (user: AdminUser | null) => void): () => void {
  if (auth && isConfiguredWithRealFirebase()) {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isDemo: false
        });
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }

  // Demo Local Storage Auth state
  const notify = () => {
    try {
      const raw = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
      if (raw) {
        callback(JSON.parse(raw));
      } else {
        callback(null);
      }
    } catch {
      callback(null);
    }
  };

  notify();

  const handleUpdate = () => notify();
  window.addEventListener('og_auth_update', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('og_auth_update', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
