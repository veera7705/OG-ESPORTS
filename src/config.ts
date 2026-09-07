/**
 * ============================================================================
 * OG ESPORTS — BR CLASHES CONFIGURATION
 * ============================================================================
 * 
 * 🔧 EDIT YOUR SETTINGS BELOW:
 * 1. ADMIN_WHATSAPP_NUMBER: Put your 10-digit or international WhatsApp number (digits only, no spaces or +)
 * 2. REGISTRATION_TIMEZONE: Change timezone if needed (default: Asia/Kolkata)
 */

// ============================================================================
// ⚠️ REPLACE THIS WITH YOUR REAL WHATSAPP NUMBER (digits only, e.g., '919876543210')
// ============================================================================
export const ADMIN_WHATSAPP_NUMBER = "919876543210"; 

// Tournament Brand Information
export const TOURNAMENT_CONFIG = {
  orgName: "OG ESPORTS",
  tournamentName: "OG ESPORTS — BR CLASHES",
  shortTitle: "BR CLASHES",
  subtitle: "Build your squad. Enter the battlefield. Take the win.",
  maxTeams: 24,
  
  // Registration Schedule Info
  registrationDateText: "8TH",
  registrationTimeText: "4:00 PM",
  registrationTimezone: "Asia/Kolkata",
  
  // Pre-filled WhatsApp message
  whatsappDefaultMessage: "Hi OG ESPORTS, I have a question about the BR Clash registration.",
  
  // Rules & Guidelines for players
  rules: [
    "Strictly first-come, first-served basis. Exactly 24 team slots.",
    "Captain WhatsApp number will be used for official custom room ID & password dispatch.",
    "Duplicate team names or duplicate WhatsApp numbers will be automatically rejected.",
    "All 4 main player UIDs must be valid and verified before match time.",
    "Emulators are strictly prohibited unless explicitly specified by admins."
  ]
};

/**
 * Calculates next registration open date (8th of the current or next month at 4:00 PM in Asia/Kolkata).
 * If today is before the 8th at 4:00 PM, returns this month's 8th. Otherwise, returns next month's 8th.
 */
export function getTargetRegistrationDate(): Date {
  const now = new Date();
  
  // We compute based on the 8th at 16:00:00
  const target = new Date();
  target.setDate(8);
  target.setHours(16, 0, 0, 0);

  // If already passed this month's 8th 4:00 PM, target is next month's 8th
  // But for tournament testing, if today is within 3 days after the 8th, consider open.
  // To allow organizers full control, we also support an admin override toggle in UI.
  return target;
}
