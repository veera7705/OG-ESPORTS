export type TeamStatus = 'registered' | 'confirmed' | 'cancelled';

export interface TeamRegistration {
  id: string;
  teamName: string;
  teamNameLower: string;
  captainName: string;
  whatsapp: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  substitute?: string;
  slotNumber: number;
  registeredAt: string | number; // ISO string or timestamp
  status: TeamStatus;
}

export interface RegistrationFormData {
  teamName: string;
  captainName: string;
  whatsapp: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  substitute: string;
}

export interface TournamentStats {
  registeredCount: number;
  maxSlots: number;
  isOpen: boolean;
  lastUpdated?: string | number;
}

export interface FormValidationErrors {
  teamName?: string;
  captainName?: string;
  whatsapp?: string;
  player1?: string;
  player2?: string;
  player3?: string;
  player4?: string;
  substitute?: string;
  general?: string;
}
