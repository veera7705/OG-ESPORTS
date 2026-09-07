import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Download, 
  Search, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  RefreshCw, 
  ShieldCheck, 
  Phone, 
  AlertTriangle,
  Flame,
  PlusCircle,
  Database
} from 'lucide-react';
import { TeamRegistration, TeamStatus } from '../types';
import { TOURNAMENT_CONFIG } from '../config';
import { 
  subscribeAllRegistrations, 
  updateTeamStatus, 
  deleteTeamRegistration, 
  exportRegistrationsToCSV,
  resetDemoRegistrations
} from '../firebase/db';
import { logoutAdminUser, AdminUser } from '../firebase/auth';
import { isConfiguredWithRealFirebase } from '../firebase/config';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onOpenSetupGuide: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onOpenSetupGuide
}) => {
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TeamStatus>('all');
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TeamRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDemoResetModal, setShowDemoResetModal] = useState(false);

  const isRealFirebase = isConfiguredWithRealFirebase();

  // Subscribe to real-time registrations updates
  useEffect(() => {
    const unsubscribe = subscribeAllRegistrations((data) => {
      setTeams(data);
    });
    return () => unsubscribe();
  }, []);

  // Stats calculation
  const activeTeams = teams.filter(t => t.status !== 'cancelled');
  const totalRegisteredCount = activeTeams.length;
  const maxSlots = TOURNAMENT_CONFIG.maxTeams;
  const slotsLeft = Math.max(0, maxSlots - totalRegisteredCount);
  const isRegistrationOpen = totalRegisteredCount < maxSlots;

  const confirmedCount = teams.filter(t => t.status === 'confirmed').length;
  const registeredCount = teams.filter(t => t.status === 'registered').length;
  const cancelledCount = teams.filter(t => t.status === 'cancelled').length;

  // Search & Filter
  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.whatsapp.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (teamId: string, newStatus: TeamStatus) => {
    setIsUpdating(true);
    try {
      await updateTeamStatus(teamId, newStatus);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    setIsUpdating(true);
    try {
      await deleteTeamRegistration(deleteCandidate.id);
      setDeleteCandidate(null);
      if (selectedTeam?.id === deleteCandidate.id) {
        setSelectedTeam(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete registration.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCSV = () => {
    if (teams.length === 0) {
      alert("No registrations available to export.");
      return;
    }
    exportRegistrationsToCSV(teams);
  };

  const handleResetDemo = (preset: 'default' | 'empty' | 'full') => {
    resetDemoRegistrations(preset);
    setShowDemoResetModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-purple-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-chakra text-[11px] font-bold tracking-widest uppercase">
              AUTHENTICATED AS {user.email || 'ADMIN'}
            </span>
            {isRealFirebase ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-chakra text-[11px] font-bold">
                🔥 LIVE FIREBASE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 font-chakra text-[11px] font-bold">
                ⚡ LOCAL STORAGE DEMO
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-orbitron font-extrabold text-white tracking-wider uppercase mt-1">
            OG ESPORTS — ADMIN PANEL
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-slate-400 font-medium">
            24-Team Tournament Management, Verification & Room Dispatch
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-chakra font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT REGISTRATIONS (CSV)</span>
          </button>

          {!isRealFirebase && (
            <button
              onClick={() => setShowDemoResetModal(true)}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-chakra font-bold tracking-wide transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Data</span>
            </button>
          )}

          <button
            onClick={onOpenSetupGuide}
            className="px-3 py-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-chakra font-bold tracking-wide transition-all flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Setup Guide</span>
          </button>

          <button
            onClick={() => {
              logoutAdminUser();
              onLogout();
            }}
            className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-chakra font-bold tracking-wide transition-all flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

        </div>
      </div>

      {/* REQUIRED STATISTICS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* Metric 1: TOTAL TEAMS */}
        <div className="p-5 rounded-2xl bg-[#0d0f1c] border border-purple-900/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-chakra uppercase tracking-wider mb-2">
            <span>TOTAL TEAMS</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-orbitron font-black text-3xl sm:text-4xl text-white">
            {totalRegisteredCount} <span className="text-slate-500 text-2xl font-bold">/ {maxSlots}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-chakra text-slate-400">
            <span className="text-emerald-400 font-semibold">{confirmedCount} Confirmed</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">{registeredCount} Registered</span>
            {cancelledCount > 0 && (
              <>
                <span>•</span>
                <span className="text-red-400 font-semibold">{cancelledCount} Cancelled</span>
              </>
            )}
          </div>
        </div>

        {/* Metric 2: SLOTS LEFT */}
        <div className="p-5 rounded-2xl bg-[#0d0f1c] border border-cyan-900/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-chakra uppercase tracking-wider mb-2">
            <span>SLOTS LEFT</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-orbitron font-black text-3xl sm:text-4xl text-cyan-400">
            {slotsLeft}
          </div>
          <div className="mt-2 text-xs font-chakra text-slate-400">
            {slotsLeft === 0 ? "All 24 team slots reserved" : `${slotsLeft} slot(s) ready for registration`}
          </div>
        </div>

        {/* Metric 3: STATUS */}
        <div className="p-5 rounded-2xl bg-[#0d0f1c] border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-chakra uppercase tracking-wider mb-2">
            <span>STATUS</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-orbitron font-black text-2xl sm:text-3xl">
            {isRegistrationOpen ? (
              <span className="text-emerald-400">REGISTRATION OPEN</span>
            ) : (
              <span className="text-red-400">REGISTRATION CLOSED</span>
            )}
          </div>
          <div className="mt-2 text-xs font-chakra text-slate-400">
            Enforced atomically on 24-team limit
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0d0f1c] border border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by team, captain, or WhatsApp..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080912] border border-slate-800 focus:border-cyan-400 text-white placeholder-slate-600 font-rajdhani text-sm focus:outline-none transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-chakra font-bold text-slate-400 uppercase mr-1">
            Status:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold uppercase transition-all ${
              statusFilter === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#080912] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({teams.length})
          </button>
          <button
            onClick={() => setStatusFilter('registered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold uppercase transition-all flex items-center gap-1 ${
              statusFilter === 'registered'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-[#080912] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🟢 Registered</span>
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold uppercase transition-all flex items-center gap-1 ${
              statusFilter === 'confirmed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#080912] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🟡 Confirmed</span>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold uppercase transition-all flex items-center gap-1 ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-[#080912] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🔴 Cancelled</span>
          </button>
        </div>

      </div>

      {/* REQUIRED ADMIN TEAM TABLE */}
      <div className="rounded-2xl bg-[#0d0f1c] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#080914] text-[11px] font-chakra font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Slot</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4">Captain</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">Player 1</th>
                <th className="py-3.5 px-4">Player 2</th>
                <th className="py-3.5 px-4">Player 3</th>
                <th className="py-3.5 px-4">Player 4</th>
                <th className="py-3.5 px-4">Substitute</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-rajdhani text-sm">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 font-chakra">
                    No registrations found matching your query.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const formattedSlot = team.slotNumber < 10 ? `0${team.slotNumber}` : `${team.slotNumber}`;
                  
                  return (
                    <tr 
                      key={team.id}
                      className="hover:bg-purple-950/20 transition-colors group"
                    >
                      {/* Slot */}
                      <td className="py-3.5 px-4 font-orbitron font-bold text-cyan-300 whitespace-nowrap">
                        #{formattedSlot}
                      </td>

                      {/* Team */}
                      <td className="py-3.5 px-4 font-orbitron font-bold text-white whitespace-nowrap">
                        {team.teamName}
                      </td>

                      {/* Captain */}
                      <td className="py-3.5 px-4 font-chakra font-semibold text-slate-200 whitespace-nowrap">
                        {team.captainName}
                      </td>

                      {/* WhatsApp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <a
                          href={`https://wa.me/91${team.whatsapp}?text=${encodeURIComponent(`Hi ${team.captainName}, regarding your team ${team.teamName} registration for OG ESPORTS BR CLASHES (Slot #${formattedSlot})...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-chakra font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>+91 {team.whatsapp}</span>
                        </a>
                      </td>

                      {/* Players 1-4 & Sub */}
                      <td className="py-3.5 px-4 text-xs font-chakra text-slate-300 max-w-[140px] truncate" title={team.player1}>
                        {team.player1}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-chakra text-slate-300 max-w-[140px] truncate" title={team.player2}>
                        {team.player2}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-chakra text-slate-300 max-w-[140px] truncate" title={team.player3}>
                        {team.player3}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-chakra text-slate-300 max-w-[140px] truncate" title={team.player4}>
                        {team.player4}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-chakra text-slate-400 max-w-[120px] truncate" title={team.substitute || '-'}>
                        {team.substitute || '-'}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs font-chakra text-slate-400 whitespace-nowrap">
                        {new Date(team.registeredAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={team.status}
                          onChange={(e) => handleStatusChange(team.id, e.target.value as TeamStatus)}
                          disabled={isUpdating}
                          className={`text-xs font-chakra font-bold rounded-lg px-2.5 py-1 focus:outline-none border cursor-pointer ${
                            team.status === 'confirmed'
                              ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                              : team.status === 'registered'
                              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                              : 'bg-red-950/80 border-red-500/50 text-red-300'
                          }`}
                        >
                          <option value="registered" className="bg-[#0b0d18] text-emerald-400">🟢 Registered</option>
                          <option value="confirmed" className="bg-[#0b0d18] text-amber-400">🟡 Confirmed</option>
                          <option value="cancelled" className="bg-[#0b0d18] text-red-400">🔴 Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTeam(team)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Full Registration"
                          >
                            <Eye className="w-4 h-4 text-cyan-400" />
                          </button>

                          <button
                            onClick={() => setDeleteCandidate(team)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0e101f] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-chakra font-bold text-cyan-400 uppercase tracking-widest">
                  SLOT #{selectedTeam.slotNumber < 10 ? `0${selectedTeam.slotNumber}` : selectedTeam.slotNumber} DETAILS
                </span>
                <h3 className="font-orbitron font-extrabold text-xl text-white">
                  {selectedTeam.teamName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-rajdhani text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-chakra text-slate-400 uppercase block">Captain Name</span>
                  <span className="font-chakra font-bold text-base text-slate-200">{selectedTeam.captainName}</span>
                </div>
                <div>
                  <span className="text-xs font-chakra text-slate-400 uppercase block">WhatsApp</span>
                  <a 
                    href={`https://wa.me/91${selectedTeam.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-chakra font-bold text-base text-emerald-400 hover:underline"
                  >
                    +91 {selectedTeam.whatsapp}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080912] border border-slate-800">
                <span className="text-xs font-chakra font-bold text-purple-300 uppercase tracking-wider block mb-2">
                  Registered Players
                </span>
                <div className="space-y-1.5 text-xs font-chakra text-slate-300">
                  <div>1. {selectedTeam.player1}</div>
                  <div>2. {selectedTeam.player2}</div>
                  <div>3. {selectedTeam.player3}</div>
                  <div>4. {selectedTeam.player4}</div>
                  {selectedTeam.substitute && (
                    <div className="text-slate-400 pt-1 border-t border-slate-800 mt-1">
                      Substitute: {selectedTeam.substitute}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-chakra text-slate-400 pt-2">
                <span>Status: <strong className="uppercase text-cyan-400">{selectedTeam.status}</strong></span>
                <span>Registered: {new Date(selectedTeam.registeredAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-chakra font-bold text-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e101f] border border-red-500/40 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-orbitron font-bold text-lg text-white">
                DELETE REGISTRATION?
              </h3>
            </div>
            
            <p className="text-sm font-rajdhani text-slate-300 mb-6">
              Are you sure you want to delete team <strong className="text-white font-bold">{deleteCandidate.teamName}</strong> (Slot #{deleteCandidate.slotNumber})?
              This will free up Slot #{deleteCandidate.slotNumber} for other teams.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={isUpdating}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-chakra font-bold text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-chakra font-bold text-xs flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CONFIRM DELETE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO DATA PRESET MODAL */}
      {showDemoResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e101f] border border-purple-500/40 p-6 shadow-2xl">
            <h3 className="font-orbitron font-bold text-lg text-white mb-2">
              QUICK TEST PRESETS
            </h3>
            <p className="text-xs font-chakra text-slate-400 mb-6">
              Switch test registration data to test different tournament capacity states:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleResetDemo('default')}
                className="w-full text-left p-3 rounded-xl bg-[#080914] border border-slate-800 hover:border-cyan-400 font-chakra text-xs text-white flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-cyan-300">Standard Test (8 / 24 Filled)</div>
                  <div className="text-slate-400 text-[11px]">8 teams registered, 16 slots remaining</div>
                </div>
                <span>Apply</span>
              </button>

              <button
                onClick={() => handleResetDemo('full')}
                className="w-full text-left p-3 rounded-xl bg-[#080914] border border-slate-800 hover:border-red-400 font-chakra text-xs text-white flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-red-400">Full Capacity (24 / 24 Filled)</div>
                  <div className="text-slate-400 text-[11px]">Simulates locked registration with 24 teams</div>
                </div>
                <span>Apply</span>
              </button>

              <button
                onClick={() => handleResetDemo('empty')}
                className="w-full text-left p-3 rounded-xl bg-[#080914] border border-slate-800 hover:border-purple-400 font-chakra text-xs text-white flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-purple-300">Clean Slate (0 / 24 Filled)</div>
                  <div className="text-slate-400 text-[11px]">Clear all registrations for fresh testing</div>
                </div>
                <span>Apply</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDemoResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-chakra font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
