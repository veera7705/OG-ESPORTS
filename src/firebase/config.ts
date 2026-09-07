import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

/**
 * ============================================================================
 * ⚠️ FIREBASE CONFIGURATION
 * ============================================================================
 * 
 * Replace the values below with your Firebase Web App credentials from
 * Firebase Console -> Project Settings -> General -> Your apps -> Web app
 * 
 * If you leave these placeholders as they are, the app will run in
 * "Demo & Development Mode" with full 24-slot transactional logic,
 * local database persistence, and admin testing enabled out of the box!
 */
export const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: "og-esports-br-clash.firebaseapp.com",
  projectId: "og-esports-br-clash",
  storageBucket: "og-esports-br-clash.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Check if valid user-provided Firebase configuration exists
export const isConfiguredWithRealFirebase = (): boolean => {
  return (
    firebaseConfig.apiKey !== "" &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
    firebaseConfig.projectId !== "og-esports-br-clash"
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (isConfiguredWithRealFirebase()) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 Connected to live Firebase project:", firebaseConfig.projectId);
  } else {
    console.info("⚡ OG Esports running in Demo Mode. Connect your Firebase project in src/firebase/config.ts for production.");
  }
} catch (error) {
  console.warn("Could not initialize live Firebase, falling back to local storage engine:", error);
}

export { app, db, auth };
