import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  runTransaction, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, isConfiguredWithRealFirebase } from './config';
import { TeamRegistration, RegistrationFormData, TournamentStats, TeamStatus } from '../types';
import { TOURNAMENT_CONFIG } from '../config';

const LOCAL_STORAGE_REGISTRATIONS_KEY = 'og_esports_registrations_v2';
const LOCAL_STORAGE_STATS_KEY = 'og_esports_stats_v2';

// Seed sample squads so the app starts with realistic slots filled (e.g. 10 / 24)
const DEFAULT_SEED_TEAMS: TeamRegistration[] = [
  {
    id: 'team-01',
    slotNumber: 1,
    teamName: 'SOUL REAPERS',
    teamNameLower: 'soul reapers',
    captainName: 'Aman "Viper" Sharma',
    whatsapp: '9876543201',
    player1: 'Viper (UID: 512489102)',
    player2: 'MortalX (UID: 512489103)',
    player3: 'Shadow (UID: 512489104)',
    player4: 'Phantom (UID: 512489105)',
    substitute: 'Ghost (UID: 512489106)',
    registeredAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    status: 'confirmed'
  },
  {
    id: 'team-02',
    slotNumber: 2,
    teamName: 'HYDRA DOMINANCE',
    teamNameLower: 'hydra dominance',
    captainName: 'Rohan Verma',
    whatsapp: '9876543202',
    player1: 'HydraRohan (UID: 523190111)',
    player2: 'Blaze (UID: 523190112)',
    player3: 'Frost (UID: 523190113)',
    player4: 'Thunder (UID: 523190114)',
    substitute: 'Storm (UID: 523190115)',
    registeredAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'confirmed'
  },
  {
    id: 'team-03',
    slotNumber: 3,
    teamName: 'GODLIKE WARRIORS',
    teamNameLower: 'godlike warriors',
    captainName: 'Vikram "Kronos" Rathore',
    whatsapp: '9876543203',
    player1: 'Kronos (UID: 541098231)',
    player2: 'Zeus (UID: 541098232)',
    player3: 'Ares (UID: 541098233)',
    player4: 'Hades (UID: 541098234)',
    substitute: '',
    registeredAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'registered'
  },
  {
    id: 'team-04',
    slotNumber: 4,
    teamName: 'CYBER PUNKS',
    teamNameLower: 'cyber punks',
    captainName: 'Kunal Kapoor',
    whatsapp: '9876543204',
    player1: 'CyberNeo (UID: 598712340)',
    player2: 'Matrix (UID: 598712341)',
    player3: 'Glitch (UID: 598712342)',
    player4: 'Byte (UID: 598712343)',
    substitute: 'Bit (UID: 598712344)',
    registeredAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'registered'
  },
  {
    id: 'team-05',
    slotNumber: 5,
    teamName: 'APEX PREDATORS',
    teamNameLower: 'apex predators',
    captainName: 'Deepak Patel',
    whatsapp: '9876543205',
    player1: 'ApexHunter (UID: 567890123)',
    player2: 'Stalker (UID: 567890124)',
    player3: 'Slayer (UID: 567890125)',
    player4: 'Venom (UID: 567890126)',
    substitute: '',
    registeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'confirmed'
  },
  {
    id: 'team-06',
    slotNumber: 6,
    teamName: 'NEON TITANS',
    teamNameLower: 'neon titans',
    captainName: 'Sameer Khan',
    whatsapp: '9876543206',
    player1: 'NeonTitan (UID: 512093845)',
    player2: 'Colossus (UID: 512093846)',
    player3: 'Goliath (UID: 512093847)',
    player4: 'Atlas (UID: 512093848)',
    substitute: '',
    registeredAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'registered'
  },
  {
    id: 'team-07',
    slotNumber: 7,
    teamName: 'VALKYRIE SQUAD',
    teamNameLower: 'valkyrie squad',
    captainName: 'Neha Deshmukh',
    whatsapp: '9876543207',
    player1: 'Valkyrie_Queen (UID: 591238471)',
    player2: 'Freya (UID: 591238472)',
    player3: 'Athena (UID: 591238473)',
    player4: 'Artemis (UID: 591238474)',
    substitute: 'Nyx (UID: 591238475)',
    registeredAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'confirmed'
  },
  {
    id: 'team-08',
    slotNumber: 8,
    teamName: 'INFERNO DRAGONS',
    teamNameLower: 'inferno dragons',
    captainName: 'Rahul Sen',
    whatsapp: '9876543208',
    player1: 'Draco (UID: 538910283)',
    player2: 'Ignis (UID: 538910284)',
    player3: 'Pyro (UID: 538910285)',
    player4: 'Smaug (UID: 538910286)',
    substitute: '',
    registeredAt: new Date(Date.now() - 900000).toISOString(),
    status: 'registered'
  }
];

// Helper to initialize local storage data
function getLocalRegistrations(): TeamRegistration[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REGISTRATIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(DEFAULT_SEED_TEAMS));
      return DEFAULT_SEED_TEAMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Local storage error:", e);
    return DEFAULT_SEED_TEAMS;
  }
}

function saveLocalRegistrations(teams: TeamRegistration[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(teams));
    window.dispatchEvent(new Event('og_storage_update'));
  } catch (e) {
    console.error("Failed to save to local storage", e);
  }
}

/**
 * Validates connection to Firestore as specified by Firebase skill guidelines
 */
export async function testFirestoreConnection(): Promise<boolean> {
  if (!db || !isConfiguredWithRealFirebase()) {
    return false;
  }
  try {
    await getDocFromServer(doc(db, 'metadata', 'connection_test'));
    return true;
  } catch (error) {
    console.warn("Firestore test ping error:", error);
    return false;
  }
}

/**
 * Real-time subscriber for Tournament Stats (live slot count)
 */
export function subscribeTournamentStats(callback: (stats: TournamentStats) => void): () => void {
  if (db && isConfiguredWithRealFirebase()) {
    const statsDocRef = doc(db, 'metadata', 'stats');
    const unsubscribe = onSnapshot(statsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          registeredCount: data.registeredCount ?? 0,
          maxSlots: TOURNAMENT_CONFIG.maxTeams,
          isOpen: data.isOpen ?? true,
          lastUpdated: data.lastUpdated ?? Date.now()
        });
      } else {
        // Doc doesn't exist yet, query registrations count
        queryRegistrationsCount((count) => {
          callback({
            registeredCount: count,
            maxSlots: TOURNAMENT_CONFIG.maxTeams,
            isOpen: count < TOURNAMENT_CONFIG.maxTeams,
            lastUpdated: Date.now()
          });
        });
      }
    }, (error) => {
      console.warn("Error listening to stats, falling back to query:", error);
      queryRegistrationsCount((count) => {
        callback({
          registeredCount: count,
          maxSlots: TOURNAMENT_CONFIG.maxTeams,
          isOpen: count < TOURNAMENT_CONFIG.maxTeams,
          lastUpdated: Date.now()
        });
      });
    });
    return unsubscribe;
  }

  // Fallback / Local Storage Live Listener
  const notifyLocalStats = () => {
    const teams = getLocalRegistrations();
    const activeCount = teams.filter(t => t.status !== 'cancelled').length;
    callback({
      registeredCount: activeCount,
      maxSlots: TOURNAMENT_CONFIG.maxTeams,
      isOpen: activeCount < TOURNAMENT_CONFIG.maxTeams,
      lastUpdated: Date.now()
    });
  };

  notifyLocalStats();

  const handleUpdate = () => {
    notifyLocalStats();
  };

  window.addEventListener('og_storage_update', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('og_storage_update', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

function queryRegistrationsCount(callback: (count: number) => void) {
  if (!db) return callback(0);
  const q = collection(db, 'registrations');
  getDocs(q).then((snapshot) => {
    const active = snapshot.docs.filter(d => d.data().status !== 'cancelled').length;
    callback(active);
  }).catch(() => callback(0));
}

/**
 * Real-time subscriber for all registrations (Admin Dashboard)
 */
export function subscribeAllRegistrations(callback: (teams: TeamRegistration[]) => void): () => void {
  if (db && isConfiguredWithRealFirebase()) {
    const q = query(collection(db, 'registrations'), orderBy('slotNumber', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teams: TeamRegistration[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        teams.push({
          id: docSnap.id,
          slotNumber: data.slotNumber,
          teamName: data.teamName,
          teamNameLower: data.teamNameLower || data.teamName.toLowerCase(),
          captainName: data.captainName,
          whatsapp: data.whatsapp,
          player1: data.player1,
          player2: data.player2,
          player3: data.player3,
          player4: data.player4,
          substitute: data.substitute || '',
          registeredAt: data.registeredAt?.toDate?.()?.toISOString?.() || data.registeredAt || new Date().toISOString(),
          status: data.status || 'registered'
        });
      });
      callback(teams);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
    });
    return unsubscribe;
  }

  // Local Storage Subscriber
  const notify = () => {
    const teams = getLocalRegistrations();
    teams.sort((a, b) => a.slotNumber - b.slotNumber);
    callback(teams);
  };

  notify();

  const handleUpdate = () => notify();
  window.addEventListener('og_storage_update', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener('og_storage_update', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

/**
 * Register a new squad with atomic verification:
 * - 24 Team limit check
 * - Duplicate team name check (case-insensitive)
 * - Duplicate captain WhatsApp check
 * - Sequential slot assignment (1 to 24)
 */
export async function registerTeam(data: RegistrationFormData): Promise<TeamRegistration> {
  const cleanTeamName = data.teamName.trim();
  const cleanTeamLower = cleanTeamName.toLowerCase();
  const cleanCaptain = data.captainName.trim();
  const cleanWhatsapp = data.whatsapp.replace(/\D/g, ''); // 10 digits

  if (cleanWhatsapp.length !== 10) {
    throw new Error("Captain WhatsApp number must be exactly 10 digits.");
  }

  // 1. LIVE FIREBASE TRANSACTION
  if (db && isConfiguredWithRealFirebase()) {
    return await runTransaction(db, async (transaction) => {
      const registrationsColRef = collection(db, 'registrations');
      const allDocsSnapshot = await getDocs(registrationsColRef);
      
      const existingTeams: TeamRegistration[] = [];
      allDocsSnapshot.forEach(docSnap => {
        const d = docSnap.data();
        existingTeams.push({
          id: docSnap.id,
          slotNumber: d.slotNumber,
          teamName: d.teamName,
          teamNameLower: d.teamNameLower || d.teamName.toLowerCase(),
          captainName: d.captainName,
          whatsapp: d.whatsapp,
          player1: d.player1,
          player2: d.player2,
          player3: d.player3,
          player4: d.player4,
          substitute: d.substitute,
          registeredAt: d.registeredAt,
          status: d.status
        });
      });

      // Filter active (registered or confirmed)
      const activeTeams = existingTeams.filter(t => t.status !== 'cancelled');

      // Check 24 limit
      if (activeTeams.length >= TOURNAMENT_CONFIG.maxTeams) {
        throw new Error("REGISTRATIONS CLOSED: All 24 slots have been filled!");
      }

      // Check duplicate team name
      const duplicateName = existingTeams.find(t => t.teamNameLower === cleanTeamLower && t.status !== 'cancelled');
      if (duplicateName) {
        throw new Error(`Team name "${cleanTeamName}" is already registered. Please choose another name.`);
      }

      // Check duplicate WhatsApp
      const duplicatePhone = existingTeams.find(t => t.whatsapp === cleanWhatsapp && t.status !== 'cancelled');
      if (duplicatePhone) {
        throw new Error(`WhatsApp number ${cleanWhatsapp} has already been registered for team "${duplicatePhone.teamName}".`);
      }

      // Find first available slot number from 1 to 24
      const occupiedSlots = new Set(activeTeams.map(t => t.slotNumber));
      let assignedSlot = -1;
      for (let s = 1; s <= TOURNAMENT_CONFIG.maxTeams; s++) {
        if (!occupiedSlots.has(s)) {
          assignedSlot = s;
          break;
        }
      }

      if (assignedSlot === -1 || assignedSlot > TOURNAMENT_CONFIG.maxTeams) {
        throw new Error("REGISTRATIONS CLOSED: No slots remaining.");
      }

      const newDocRef = doc(registrationsColRef);
      const newRegistrationData = {
        teamName: cleanTeamName,
        teamNameLower: cleanTeamLower,
        captainName: cleanCaptain,
        whatsapp: cleanWhatsapp,
        player1: data.player1.trim(),
        player2: data.player2.trim(),
        player3: data.player3.trim(),
        player4: data.player4.trim(),
        substitute: data.substitute?.trim() || '',
        slotNumber: assignedSlot,
        registeredAt: serverTimestamp(),
        status: 'registered' as TeamStatus
      };

      transaction.set(newDocRef, newRegistrationData);

      // Also update public stats document atomically
      const statsDocRef = doc(db, 'metadata', 'stats');
      transaction.set(statsDocRef, {
        registeredCount: activeTeams.length + 1,
        maxSlots: TOURNAMENT_CONFIG.maxTeams,
        isOpen: (activeTeams.length + 1) < TOURNAMENT_CONFIG.maxTeams,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      return {
        id: newDocRef.id,
        ...newRegistrationData,
        registeredAt: new Date().toISOString()
      };
    });
  }

  // 2. FALLBACK LOCAL ENGINE (Zero setup friction, 100% functional)
  // Artificial delay to mimic server response & show gaming loader
  await new Promise(r => setTimeout(r, 600));

  const existingTeams = getLocalRegistrations();
  const activeTeams = existingTeams.filter(t => t.status !== 'cancelled');

  // Check 24 limit
  if (activeTeams.length >= TOURNAMENT_CONFIG.maxTeams) {
    throw new Error("REGISTRATIONS CLOSED: All 24 slots have been filled!");
  }

  // Check duplicate team name
  const duplicateName = existingTeams.find(t => t.teamNameLower === cleanTeamLower && t.status !== 'cancelled');
  if (duplicateName) {
    throw new Error(`Team name "${cleanTeamName}" is already registered. Please choose another name.`);
  }

  // Check duplicate WhatsApp
  const duplicatePhone = existingTeams.find(t => t.whatsapp === cleanWhatsapp && t.status !== 'cancelled');
  if (duplicatePhone) {
    throw new Error(`WhatsApp number ${cleanWhatsapp} has already been registered for team "${duplicatePhone.teamName}".`);
  }

  // Find lowest available slot
  const occupiedSlots = new Set(activeTeams.map(t => t.slotNumber));
  let assignedSlot = -1;
  for (let s = 1; s <= TOURNAMENT_CONFIG.maxTeams; s++) {
    if (!occupiedSlots.has(s)) {
      assignedSlot = s;
      break;
    }
  }

  if (assignedSlot === -1 || assignedSlot > TOURNAMENT_CONFIG.maxTeams) {
    throw new Error("REGISTRATIONS CLOSED: No slots remaining.");
  }

  const newTeam: TeamRegistration = {
    id: 'team-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    slotNumber: assignedSlot,
    teamName: cleanTeamName,
    teamNameLower: cleanTeamLower,
    captainName: cleanCaptain,
    whatsapp: cleanWhatsapp,
    player1: data.player1.trim(),
    player2: data.player2.trim(),
    player3: data.player3.trim(),
    player4: data.player4.trim(),
    substitute: data.substitute?.trim() || '',
    registeredAt: new Date().toISOString(),
    status: 'registered'
  };

  existingTeams.push(newTeam);
  saveLocalRegistrations(existingTeams);

  return newTeam;
}

/**
 * Admin: Update team registration status
 */
export async function updateTeamStatus(teamId: string, newStatus: TeamStatus): Promise<void> {
  if (db && isConfiguredWithRealFirebase()) {
    const docRef = doc(db, 'registrations', teamId);
    await updateDoc(docRef, { status: newStatus });
    
    // Refresh stats
    queryRegistrationsCount(count => {
      if (!db) return;
      setDoc(doc(db, 'metadata', 'stats'), {
        registeredCount: count,
        maxSlots: TOURNAMENT_CONFIG.maxTeams,
        isOpen: count < TOURNAMENT_CONFIG.maxTeams,
        lastUpdated: serverTimestamp()
      }, { merge: true }).catch(() => {});
    });
    return;
  }

  const teams = getLocalRegistrations();
  const index = teams.findIndex(t => t.id === teamId);
  if (index !== -1) {
    teams[index].status = newStatus;
    saveLocalRegistrations(teams);
  }
}

/**
 * Admin: Delete team registration
 */
export async function deleteTeamRegistration(teamId: string): Promise<void> {
  if (db && isConfiguredWithRealFirebase()) {
    const docRef = doc(db, 'registrations', teamId);
    await deleteDoc(docRef);
    
    // Refresh stats
    queryRegistrationsCount(count => {
      if (!db) return;
      setDoc(doc(db, 'metadata', 'stats'), {
        registeredCount: count,
        maxSlots: TOURNAMENT_CONFIG.maxTeams,
        isOpen: count < TOURNAMENT_CONFIG.maxTeams,
        lastUpdated: serverTimestamp()
      }, { merge: true }).catch(() => {});
    });
    return;
  }

  let teams = getLocalRegistrations();
  teams = teams.filter(t => t.id !== teamId);
  saveLocalRegistrations(teams);
}

/**
 * Admin: Reset or clear all test registrations
 */
export function resetDemoRegistrations(preset: 'default' | 'empty' | 'full' = 'default') {
  if (preset === 'empty') {
    saveLocalRegistrations([]);
  } else if (preset === 'default') {
    saveLocalRegistrations(DEFAULT_SEED_TEAMS);
  } else if (preset === 'full') {
    const fullTeams: TeamRegistration[] = [];
    for (let i = 1; i <= 24; i++) {
      fullTeams.push({
        id: `team-${i}`,
        slotNumber: i,
        teamName: `SQUAD ${i < 10 ? '0' + i : i}`,
        teamNameLower: `squad ${i < 10 ? '0' + i : i}`,
        captainName: `Captain ${i}`,
        whatsapp: `98765432${i < 10 ? '0' + i : i}`,
        player1: `P1_UID_${i}01`,
        player2: `P2_UID_${i}02`,
        player3: `P3_UID_${i}03`,
        player4: `P4_UID_${i}04`,
        substitute: '',
        registeredAt: new Date().toISOString(),
        status: i % 3 === 0 ? 'confirmed' : 'registered'
      });
    }
    saveLocalRegistrations(fullTeams);
  }
}

/**
 * Export registrations to CSV file download
 */
export function exportRegistrationsToCSV(teams: TeamRegistration[]) {
  const headers = [
    'Slot Number',
    'Team Name',
    'Captain Name',
    'Captain WhatsApp',
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Substitute',
    'Registration Date',
    'Status'
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = teams.map(t => [
    t.slotNumber,
    escapeCSV(t.teamName),
    escapeCSV(t.captainName),
    escapeCSV(`+91 ${t.whatsapp}`),
    escapeCSV(t.player1),
    escapeCSV(t.player2),
    escapeCSV(t.player3),
    escapeCSV(t.player4),
    escapeCSV(t.substitute || 'None'),
    escapeCSV(new Date(t.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })),
    escapeCSV(t.status.toUpperCase())
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OG_ESPORTS_BR_CLASHES_REGISTRATIONS_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
