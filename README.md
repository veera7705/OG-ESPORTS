# OG ESPORTS — BR CLASHES TOURNAMENT REGISTRATION PLATFORM

A production-ready, high-performance esports tournament registration web application built for **OG ESPORTS** with real-time 24-team slot tracking, atomic slot limit enforcement, verified squad entry, and a secure Firebase-authenticated admin dashboard with CSV export.

---

## 📁 Project Structure

```text
/
├── index.html                     # Main HTML entry with esports meta tags & gaming fonts
├── metadata.json                  # Application metadata & permissions
├── package.json                   # Dependencies and scripts (React 19, Tailwind v4, Firebase)
├── firestore.rules                # Hardened Firestore Security Rules (24-slot limit & ABAC)
├── firebase-blueprint.json        # Database schema intermediate representation
├── README.md                      # Complete setup & deployment guide
├── src/
│   ├── main.tsx                   # React app entry point
│   ├── App.tsx                    # Main controller, routing, and real-time listeners
│   ├── index.css                  # Global Tailwind v4 styles, fonts & gaming animations
│   ├── types.ts                   # TypeScript interfaces (TeamRegistration, Stats, Errors)
│   ├── config.ts                  # Tournament settings & ADMIN_WHATSAPP_NUMBER
│   ├── firebase/
│   │   ├── config.ts              # ⚠️ PASTE YOUR FIREBASE WEB APP CONFIG HERE
│   │   ├── db.ts                  # Firestore transactions, 24-slot cap, realtime stats & CSV
│   │   └── auth.ts                # Firebase Authentication (Admin Email/Password)
│   └── components/
│       ├── Navbar.tsx             # Brand header with live slot badge & admin access
│       ├── HeroSection.tsx        # Hero banner, 4 key badges, and live countdown timer
│       ├── SlotCounter.tsx        # Realtime "12 / 24" counter, progress bar & slot grid
│       ├── RegistrationForm.tsx   # 4 Players + Sub, validation & duplicate prevention
│       ├── RegistrationSuccess.tsx# Trophy victory ticket with slot badge & copy feature
│       ├── AdminDashboard.tsx     # Protected table, search, filters, status toggles, CSV export
│       ├── AdminLogin.tsx         # Secure email & password Firebase Auth login
│       ├── WhatsAppFloatingButton.tsx # Pulsing floating WhatsApp contact button
│       └── SetupGuideModal.tsx    # Interactive in-app configuration walkthrough
```

---

## ⚡ The ONLY 2 Values You Need To Replace

When you open this project in **VS Code**, you only need to customize two places:

### 1. Your Admin WhatsApp Number
* File: `src/config.ts`
* Line: Look for `export const ADMIN_WHATSAPP_NUMBER = "919876543210";`
* Replace `919876543210` with your actual 10-digit or international WhatsApp phone number (digits only, no spaces, hyphens, or `+`).

### 2. Your Firebase Web App Credentials
* File: `src/firebase/config.ts`
* Look for `export const firebaseConfig = { ... };`
* Replace the placeholder keys with your Firebase project keys (detailed in Step 5 & 6 below).

---

## 🚀 Beginner-Friendly Firebase Setup (Step-by-Step from ZERO)

### Step 1: Create a Free Firebase Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/) in your browser.
2. Sign in with your Google Account.
3. Click **Add project** (or **Create a project**).
4. Enter your Project name (e.g., `og-esports-br-clashes`) and click **Continue**.
5. Google Analytics is optional; you can disable it or click **Create project**.
6. Wait a few seconds for Firebase to finish, then click **Continue**.

---

### Step 2: Enable Cloud Firestore Database
1. In the left-hand menu of the Firebase Console, go to **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose a database location close to your players (e.g., `asia-south1` for Mumbai / India or your preferred region) and click **Next**.
4. Select **Start in production mode** and click **Create**.
5. Once your Firestore database is created, click on the **Rules** tab at the top.
6. Open the `firestore.rules` file in this project, copy all its content, paste it into the Firebase Rules editor, and click **Publish**.

---

### Step 3: Enable Firebase Authentication (Email/Password)
1. In the left-hand menu, go to **Build** → **Authentication**.
2. Click **Get Started**.
3. In the **Sign-in method** tab, click on **Email/Password**.
4. Turn on the first toggle: **Enable Email/Password**. (Leave "Email link (passwordless sign-in)" disabled).
5. Click **Save**.

---

### Step 4: Create Your Admin User Account
1. Inside the **Authentication** section, click on the **Users** tab (next to "Sign-in method").
2. Click the **Add user** button.
3. Enter your Admin Email (e.g., `admin@ogesports.com` or your personal email) and a strong password.
4. Click **Add user**.
5. **Done!** You will use this email and password to log in at the `/admin` portal.

---

### Step 5: Get Your Firebase Web App Configuration
1. Click on the ⚙️ **Gear icon** next to "Project Overview" in the top-left menu, and select **Project settings**.
2. Scroll down to the **Your apps** section.
3. Click the **Web** icon (`</>`).
4. Enter an App nickname (e.g., `OG Esports Web App`).
5. You can optionally check "Also set up Firebase Hosting for this app" if you plan to use Firebase Hosting.
6. Click **Register app**.
7. Under "Add Firebase SDK", look for `const firebaseConfig = { ... };`.

---

### Step 6: Where to Paste the Firebase Configuration
1. Open the file `src/firebase/config.ts` in **VS Code**.
2. Paste your keys into `firebaseConfig`:
```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyYourActualApiKeyHere",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```
3. Save the file. The app will immediately connect to your live Firebase backend!

---

### Step 7: Set Your Admin WhatsApp Number
1. Open `src/config.ts` in VS Code.
2. Update `ADMIN_WHATSAPP_NUMBER`:
```typescript
export const ADMIN_WHATSAPP_NUMBER = "919876543210"; // Country code + 10 digits
```
3. Save the file.

---

### Step 8: Deploy The Website

#### Method A: Firebase Hosting (Recommended)
1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase Project.
   - When asked "What do you want to use as your public directory?", type: `dist`
   - When asked "Configure as a single-page app (rewrite all urls to /index.html)?", type: `y` (Yes)
   - When asked "Set up automatic builds and deploys with GitHub?", type: `n`
5. Deploy:
   ```bash
   firebase deploy --only hosting
   ```
6. Your live site will be accessible at `https://your-project-id.web.app`!

#### Method B: Vercel / Netlify
1. Connect your GitHub repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy with 1 click!

---

## 🧪 Production Testing Checklist

Before opening registration to the public, verify the following:

- [ ] **Public Landing Page**: Loads with "OG ESPORTS — BR CLASHES", subtitle, and the 4 highlight badges.
- [ ] **Slot Counter**: Displays live capacity (`X / 24 TEAMS REGISTERED`).
- [ ] **Validation Test**:
  - Empty team name → Blocked.
  - Empty captain name → Blocked.
  - WhatsApp number with less/more than 10 digits → Blocked.
  - Missing any of the 4 required players → Blocked.
- [ ] **Duplicate Prevention Test**:
  - Register a squad named "DELTA FORCE".
  - Attempt to register another squad named "delta force" → Blocked with duplicate name error.
  - Attempt to register with the same WhatsApp number → Blocked with duplicate WhatsApp error.
- [ ] **24-Team Limit Test**:
  - In Admin Panel, click "Test Data" → "Full Capacity (24/24)".
  - Return to public page: verify counter shows `24 / 24` with "🔴 REGISTRATIONS CLOSED".
  - Form is visibly disabled and prevents submission.
- [ ] **Success Screen**:
  - Submitting a valid squad displays trophy, confetti, assigned Slot Number (e.g. `#09`), and squad pass.
- [ ] **Admin Authentication**:
  - Visit `/admin` or `#admin`.
  - Enter incorrect credentials → Denied.
  - Enter valid credentials → Grants access to Dashboard.
- [ ] **Status Toggles & Deletion**:
  - Change team status from Registered to Confirmed.
  - Delete a cancelled team: slot is freed immediately.
- [ ] **CSV Export**:
  - Click "EXPORT REGISTRATIONS (CSV)" in Admin panel.
  - Downloaded CSV contains all 11 columns with properly formatted squad details.
- [ ] **WhatsApp Contact Button**:
  - Click floating button at bottom right: opens WhatsApp chat with pre-filled message.
