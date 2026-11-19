import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Wrench, User, RefreshCw } from 'lucide-react';
import { api } from '../api';

const STATUS_CONFIG = {
  clean: {
    label: 'Clean & Inspected',
    colorClasses: 'bg-emerald/10 border-emerald text-emerald',
    badgeClasses: 'bg-emerald/20 text-emerald border-emerald/40',
    icon: CheckCircle
  },
  dirty: {
    label: 'Dirty / Checkout',
    colorClasses: 'bg-rose/10 border-rose text-rose',
    badgeClasses: 'bg-rose/20 text-rose border-rose/40',
    icon: AlertTriangle
  },
  in_progress: {
    label: 'Cleaning in Progress',
    colorClasses: 'bg-amber/10 border-amber text-amber',
    badgeClasses: 'bg-amber/20 text-amber border-amber/40',
    icon: Clock
  },
  maintenance: {
    label: 'Maintenance Hold',
    colorClasses: 'bg-slate-400/10 border-slate-400 text-slate-500',
    badgeClasses: 'bg-slate-400/20 text-slate-500 border-slate-400/40',
    icon: Wrench
  }
};

export default function Housekeeping() {
  const [tasks, setTasks] = useState([]);
  const [filterFloor, setFilterFloor] = useState('all');

  useEffect(() => {
    loadHousekeeping();
  }, []);

  const loadHousekeeping = async () => {
    try {
      const res = await api.getHousekeeping();
      if (res && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load housekeeping tasks:', err);
    }
  };

  const handleUpdateStatus = async (roomNumber, newStatus) => {
    try {
      await api.updateHousekeeping(roomNumber, {
        status: newStatus,
        last_cleaned: newStatus === 'clean' ? new Date().toISOString() : null
      });

      setTasks(prev => prev.map(t => {
        if (t.room_number === roomNumber) {
          return {
            ...t,
            status: newStatus,
            last_cleaned: newStatus === 'clean' ? 'Just now' : t.last_cleaned
          };
        }
        return t;
      }));
    } catch (err) {
      console.error('Housekeeping update error:', err);
    }
  };

  const floors = [4, 3, 2, 1];

  const totalRooms = tasks.length || 16;
  const cleanCount = tasks.filter(t => t.status === 'clean').length;
  const dirtyCount = tasks.filter(t => t.status === 'dirty').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const maintenanceCount = tasks.filter(t => t.status === 'maintenance').length;
  const cleanPercentage = Math.round((cleanCount / (totalRooms || 1)) * 100);

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b theme-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
            Executive Housekeeping &amp; Turndown Management
          </span>
          <h1 className="text-2xl font-serif-display font-semibold theme-text-primary">
            Floor Supervisor Matrix — Tunde Bakare
          </h1>
          <p className="text-xs theme-text-secondary mt-0.5">
            16 luxury suites across 4 wings • Real-time room turnaround &amp; VIP amenity inspection
          </p>
        </div>

        {/* Floor quick filters */}
        <div className="flex items-center gap-2">
          {['all', 4, 3, 2, 1].map((fl) => (
            <button
              key={fl}
              onClick={() => setFilterFloor(fl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filterFloor === fl
                  ? 'bg-gold text-white shadow'
                  : 'theme-bg-elevated border theme-border theme-text-secondary hover:theme-text-primary'
              }`}
            >
              {fl === 'all' ? 'All Floors' : `Floor ${fl}`}
            </button>
          ))}
          <button
            onClick={loadHousekeeping}
            title="Refresh Matrix"
            className="p-2 rounded-xl theme-bg-elevated border theme-border theme-text-secondary hover:text-gold transition-colors cursor-pointer ml-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl theme-bg-elevated border theme-border flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider theme-text-secondary font-semibold">
            Clean &amp; Ready
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif-display font-bold text-emerald">{cleanCount}</span>
            <span className="text-xs text-emerald font-semibold">{cleanPercentage}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl theme-bg-elevated border theme-border flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider theme-text-secondary font-semibold">
            In Progress
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif-display font-bold text-amber">{inProgressCount}</span>
            <span className="text-xs theme-text-secondary">active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl theme-bg-elevated border theme-border flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider theme-text-secondary font-semibold">
            Dirty / Turnover
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif-display font-bold text-rose">{dirtyCount}</span>
            <span className="text-xs text-rose font-medium">pending</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl theme-bg-elevated border theme-border flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider theme-text-secondary font-semibold">
            Maintenance Hold
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif-display font-bold text-slate-500">{maintenanceCount}</span>
            <span className="text-xs text-slate-500">service</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl theme-bg-elevated border theme-border flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
            Total Inventory
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-serif-display font-bold theme-text-primary">{totalRooms}</span>
            <span className="text-xs text-gold">Suites</span>
          </div>
        </div>
      </div>

      {/* 4 Floor Matrices */}
      <div className="space-y-8">
        {floors
          .filter(f => filterFloor === 'all' || filterFloor === f)
          .map((floorNum) => {
            const floorRooms = tasks.filter(t => t.floor === floorNum);
            return (
              <div key={floorNum} className="space-y-3">
                {/* Floor Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-serif-display font-bold text-gold">
                      Floor {floorNum} — {floorNum === 4 ? 'Penthouse & Villa Wing' : floorNum === 3 ? 'Diplomatic & Deluxe Wing' : 'Garden Lofts & Studios'}
                    </h2>
                  </div>
                  <span className="text-xs theme-text-secondary font-mono">
                    {floorRooms.filter(r => r.status === 'clean').length} / {floorRooms.length} Clean
                  </span>
                </div>

                {/* Rooms Grid (4 cards per floor) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {floorRooms.map((room) => {
                    const statusInfo = STATUS_CONFIG[room.status] || STATUS_CONFIG.dirty;
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div
                        key={room.room_number}
                        className={`rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between shadow-lg ${statusInfo.colorClasses}`}
                      >
                        <div>
                          {/* Top row: Room Number & Priority */}
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-serif-display font-bold tracking-tight theme-text-primary">
                              {room.room_number}
                            </span>

                            {room.priority === 'vip' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold border border-gold/40">
                                VIP Priority
                              </span>
                            ) : room.priority === 'high' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose/20 text-rose border border-rose/40">
                                High Turn
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-black/10 theme-text-secondary">
                                Normal
                              </span>
                            )}
                          </div>

                          {/* Status Pill */}
                          <div className="mt-3 flex items-center gap-1.5">
                            <StatusIcon className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-semibold">
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* Attendant & Notes */}
                          <div className="mt-3 space-y-1 text-xs">
                            <div className="flex items-center gap-1.5 theme-text-secondary">
                              <User className="w-3.5 h-3.5 text-gold/80" />
                              <span>Attendant: {room.attendant || 'Unassigned'}</span>
                            </div>

                            {room.notes && (
                              <p className="text-[11px] theme-text-primary italic [background-color:color-mix(in_srgb,var(--bg-primary)_60%,transparent)] p-2 rounded-lg border border-[var(--border-color)]/60 mt-2">
                                "{room.notes}"
                              </p>
                            )}

                            {room.last_cleaned && (
                              <p className="text-[10px] theme-text-secondary font-mono mt-1">
                                Cleaned: {room.last_cleaned.includes('T') ? room.last_cleaned.split('T')[1].substring(0, 5) : room.last_cleaned.substring(11, 16) || 'Morning'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="mt-4 pt-3 border-t border-[var(--border-color)]/60">
                          <span className="text-[10px] uppercase tracking-wider theme-text-secondary block mb-1.5">
                            Update Status:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(room.room_number, 'clean')}
                              className={`py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                                room.status === 'clean' ? 'bg-emerald text-white' : 'theme-bg-primary hover:bg-emerald/20 theme-text-secondary'
                              }`}
                            >
                              Clean
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(room.room_number, 'in_progress')}
                              className={`py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                                room.status === 'in_progress' ? 'bg-amber text-white' : 'theme-bg-primary hover:bg-amber/20 theme-text-secondary'
                              }`}
                            >
                              Progress
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(room.room_number, 'dirty')}
                              className={`py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                                room.status === 'dirty' ? 'bg-rose text-white' : 'theme-bg-primary hover:bg-rose/20 theme-text-secondary'
                              }`}
                            >
                              Dirty
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(room.room_number, 'maintenance')}
                              className={`py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                                room.status === 'maintenance' ? 'bg-slate-500 text-white' : 'theme-bg-primary hover:bg-slate-400/20 theme-text-secondary'
                              }`}
                            >
                              Hold
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

    </div>
  );
}
