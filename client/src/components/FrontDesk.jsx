import React, { useState, useEffect, useCallback } from 'react';
import { Search, LogIn, LogOut, Receipt, CheckCircle2, RefreshCw } from 'lucide-react';
import FolioModal from './FolioModal';
import { api } from '../api';

const ROOM_OPTIONS = ['101', '102', '103', '104', '201', '202', '203', '204', '301', '302', '303', '304', '401', '402', '403', '404'];

export default function FrontDesk({ currency }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'arrivals', 'inhouse', 'departures'
  const [selectedReservationForFolio, setSelectedReservationForFolio] = useState(null);
  const [isFolioOpen, setIsFolioOpen] = useState(false);
  const [assignedRooms, setAssignedRooms] = useState({});
  const [actionNotice, setActionNotice] = useState('');

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getReservations();
      if (res && res.data) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations, filterTab]);

  const handleCheckIn = async (resId, suiteDefaultRoom) => {
    const chosenRoom = assignedRooms[resId] || suiteDefaultRoom || '401';
    try {
      await api.updateReservation(resId, {
        status: 'checked_in',
        room_number: chosenRoom
      });
      setActionNotice(`Reservation ${resId.substring(0, 8)} successfully checked into Room ${chosenRoom}`);
      setTimeout(() => setActionNotice(''), 3000);
      loadReservations();
    } catch (err) {
      console.error('Check-in failed:', err);
    }
  };

  const handleCheckOut = async (resId) => {
    try {
      await api.updateReservation(resId, {
        status: 'checked_out'
      });
      setActionNotice(`Guest successfully checked out. Room marked for turnover.`);
      setTimeout(() => setActionNotice(''), 3000);
      loadReservations();
    } catch (err) {
      console.error('Check-out failed:', err);
    }
  };

  const openFolio = (reservation) => {
    setSelectedReservationForFolio(reservation);
    setIsFolioOpen(true);
  };

  // Filter reservations based on active tab and search query
  const filteredReservations = reservations.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      r.booking_ref.toLowerCase().includes(q) ||
      r.guest_name.toLowerCase().includes(q) ||
      (r.room_number && r.room_number.includes(q));

    if (!matchesSearch) return false;

    if (filterTab === 'inhouse') return r.status === 'checked_in';
    if (filterTab === 'arrivals') return r.status === 'confirmed';
    if (filterTab === 'departures') return r.status === 'checked_out' || (r.status === 'checked_in' && r.check_out === '2026-11-10');
    return true;
  });

  const totalInHouse = reservations.filter(r => r.status === 'checked_in').length;
  const expectedArrivals = reservations.filter(r => r.status === 'confirmed').length;
  const totalCheckedOut = reservations.filter(r => r.status === 'checked_out').length;

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Top Banner / Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b theme-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
            Front Desk Operations &amp; Arrivals Tape
          </span>
          <h1 className="text-2xl font-serif-display font-semibold theme-text-primary">
            Duty Manager Terminal — Victoria Island
          </h1>
          <p className="text-xs theme-text-secondary mt-0.5">
            Real-time VIP guest check-ins, key encoding, room assignments &amp; folio ledgers
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl theme-bg-elevated border theme-border text-center">
            <span className="text-[10px] uppercase theme-text-secondary block">In-House</span>
            <span className="text-lg font-bold text-emerald">{totalInHouse} Suites</span>
          </div>
          <div className="px-4 py-2 rounded-xl theme-bg-elevated border theme-border text-center">
            <span className="text-[10px] uppercase theme-text-secondary block">Arrivals</span>
            <span className="text-lg font-bold text-gold">{expectedArrivals} Guests</span>
          </div>
          <div className="px-4 py-2 rounded-xl theme-bg-elevated border theme-border text-center">
            <span className="text-[10px] uppercase theme-text-secondary block">Departed</span>
            <span className="text-lg font-bold theme-text-muted">{totalCheckedOut} Rooms</span>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald/15 border border-emerald/40 text-emerald text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Search Bar & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 theme-bg-elevated p-3.5 rounded-2xl border theme-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 theme-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ref, guest name, or room..."
            className="w-full theme-bg-primary border theme-border rounded-xl pl-9 pr-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Reservations' },
            { id: 'arrivals', label: "Today's Arrivals" },
            { id: 'inhouse', label: 'In-House Guests' },
            { id: 'departures', label: 'Departures' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                filterTab === tab.id
                  ? 'bg-gold text-white font-bold shadow'
                  : 'theme-bg-primary border theme-border theme-text-secondary hover:theme-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={loadReservations}
            title="Refresh Ledger"
            className="p-2 rounded-xl theme-bg-primary border theme-border theme-text-secondary hover:text-gold transition-colors cursor-pointer ml-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Arrivals/Departures Master Table */}
      <div className="theme-bg-elevated rounded-2xl border theme-border shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="[background-color:var(--bg-secondary)] border-b theme-border text-[11px] font-semibold theme-text-secondary uppercase tracking-wider">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Guest Name &amp; VIP Tier</th>
                <th className="py-3.5 px-4">Suite Category</th>
                <th className="py-3.5 px-4">Stay Dates</th>
                <th className="py-3.5 px-4">Nights</th>
                <th className="py-3.5 px-4">Room</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions &amp; Folio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center theme-text-secondary">
                    Loading guest records...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center theme-text-secondary">
                    No reservations matching current search filter.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const isCheckedIn = res.status === 'checked_in';
                  const isConfirmed = res.status === 'confirmed';
                  const isCheckedOut = res.status === 'checked_out';

                  const d1 = new Date(res.check_in);
                  const d2 = new Date(res.check_out);
                  const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24))) || 3;

                  return (
                    <tr
                      key={res.id}
                      className="hover:[background-color:var(--bg-secondary)] transition-colors group cursor-pointer"
                      onClick={() => openFolio(res)}
                    >
                      {/* Booking Ref */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-gold">
                        {res.booking_ref}
                      </td>

                      {/* Guest Name & Tier */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold theme-text-primary">{res.guest_name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase border ${
                            res.vip_tier === 'black'
                              ? 'bg-gold/20 text-gold border-gold/40'
                              : res.vip_tier === 'platinum'
                              ? 'bg-blue-400/20 text-blue-400 border-blue-400/30'
                              : 'theme-bg-elevated theme-text-secondary theme-border'
                          }`}>
                            {res.vip_tier || 'Member'}
                          </span>
                        </div>
                        <span className="text-[11px] theme-text-secondary block font-sans">
                          {res.guest_email}
                        </span>
                      </td>

                      {/* Suite */}
                      <td className="py-3.5 px-4 font-serif-display font-medium theme-text-primary">
                        {res.suite_name}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 theme-text-secondary">
                        <span>{res.check_in}</span>
                        <span className="mx-1 theme-text-muted">→</span>
                        <span>{res.check_out}</span>
                      </td>

                      {/* Nights */}
                      <td className="py-3.5 px-4 font-mono theme-text-secondary">
                        {nights} nts
                      </td>

                      {/* Room Assignment */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {isCheckedIn ? (
                          <span className="px-2.5 py-1 rounded-lg theme-bg-primary border theme-border text-gold font-mono font-bold">
                            Room {res.room_number || '401'}
                          </span>
                        ) : isConfirmed ? (
                          <select
                            value={assignedRooms[res.id] || res.room_number || '302'}
                            onChange={(e) => setAssignedRooms({ ...assignedRooms, [res.id]: e.target.value })}
                            className="theme-bg-primary border theme-border rounded-lg px-2 py-1 text-xs theme-text-primary focus:border-gold focus:outline-none"
                          >
                            {ROOM_OPTIONS.map((rm) => (
                              <option key={rm} value={rm}>
                                Room {rm}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="theme-text-secondary font-mono">
                            Room {res.room_number || '—'}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isCheckedIn && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald/15 text-emerald border border-emerald/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                            In-House
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Confirmed
                          </span>
                        )}
                        {isCheckedOut && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-400/20 text-slate-500 border border-slate-400/30">
                            Checked Out
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => handleCheckIn(res.id, res.room_number)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gold hover:bg-gold-hover text-white font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>Check In</span>
                            </button>
                          )}

                          {isCheckedIn && (
                            <button
                              type="button"
                              onClick={() => handleCheckOut(res.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg theme-bg-elevated hover:bg-rose/20 theme-text-primary hover:text-rose font-medium text-[11px] transition-colors cursor-pointer border theme-border"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Check Out</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openFolio(res)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg theme-bg-primary hover:bg-gold/15 border theme-border theme-text-secondary hover:text-gold text-[11px] font-medium transition-colors cursor-pointer"
                            title="View Folio Ledger"
                          >
                            <Receipt className="w-3.5 h-3.5 text-gold" />
                            <span>Folio</span>
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

      {/* Folio Modal */}
      {selectedReservationForFolio && (
        <FolioModal
          reservation={selectedReservationForFolio}
          isOpen={isFolioOpen}
          currency={currency}
          onClose={() => setIsFolioOpen(false)}
          onFolioUpdated={loadReservations}
        />
      )}

    </div>
  );
}
