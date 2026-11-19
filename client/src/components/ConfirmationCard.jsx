import React from 'react';
import { Crown, CheckCircle2, Printer, ArrowLeft, Calendar, User, MapPin, Sparkles } from 'lucide-react';
import { formatCurrency } from '../api';

export default function ConfirmationCard({
  reservation,
  suite,
  currency,
  onClose,
  onNewBooking
}) {
  const handlePrint = () => {
    window.print();
  };

  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl theme-bg-elevated rounded-3xl border border-gold/50 shadow-2xl overflow-hidden theme-text-primary print:shadow-none print:border-none">

        {/* Top Gold Crest Header */}
        <div className="[background:linear-gradient(to_right,var(--bg-secondary),var(--bg-elevated),var(--bg-secondary))] px-8 pt-8 pb-6 border-b theme-border text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold/10 border border-gold/40 text-gold mb-3 shadow-lg shadow-gold/10">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-serif-display font-bold text-gold tracking-wide">
            THE AURELIA GRAND &amp; SUITES
          </h2>
          <p className="text-[11px] uppercase tracking-widest theme-text-secondary mt-1">
            Confirmed Luxury Reservation &amp; Digital Room Key
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/30 text-emerald text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Guaranteed Reservation Confirmed</span>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-8 space-y-6 [background:linear-gradient(to_bottom,var(--bg-elevated),var(--bg-secondary))]">

          {/* Reference Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl theme-bg-primary border theme-border gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest theme-text-secondary block">
                Booking Reference
              </span>
              <span className="text-xl font-mono font-bold text-gold tracking-wider">
                {reservation.booking_ref}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest theme-text-secondary block">
                Assigned Suite
              </span>
              <span className="text-sm font-semibold theme-text-primary">
                {reservation.room_number ? `Suite ${reservation.room_number}` : 'Key Delivered at VIP Check-in'}
              </span>
            </div>
          </div>

          {/* Guest & Suite Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl [background-color:var(--bg-secondary)] border theme-border">
              <span className="text-[10px] theme-text-secondary uppercase tracking-wider block mb-1">
                Primary Guest
              </span>
              <p className="font-semibold theme-text-primary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold" /> {reservation.guest_name}
              </p>
              <p className="text-[11px] text-gold mt-1 uppercase font-mono">
                {reservation.vip_tier || 'Black'} Tier VIP
              </p>
            </div>

            <div className="p-3.5 rounded-xl [background-color:var(--bg-secondary)] border theme-border">
              <span className="text-[10px] theme-text-secondary uppercase tracking-wider block mb-1">
                Suite Category
              </span>
              <p className="font-semibold theme-text-primary truncate">
                {reservation.suite_name || suite?.name || 'Grand Suite'}
              </p>
              <p className="text-[11px] theme-text-secondary mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold" /> Victoria Island, Lagos
              </p>
            </div>

            <div className="p-3.5 rounded-xl [background-color:var(--bg-secondary)] border theme-border">
              <span className="text-[10px] theme-text-secondary uppercase tracking-wider block mb-1">
                Check-In Date
              </span>
              <p className="font-semibold theme-text-primary flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" /> {reservation.check_in}
              </p>
              <p className="text-[10px] theme-text-secondary mt-0.5">3:00 PM West Africa Time</p>
            </div>

            <div className="p-3.5 rounded-xl [background-color:var(--bg-secondary)] border theme-border">
              <span className="text-[10px] theme-text-secondary uppercase tracking-wider block mb-1">
                Check-Out Date
              </span>
              <p className="font-semibold theme-text-primary flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" /> {reservation.check_out}
              </p>
              <p className="text-[10px] theme-text-secondary mt-0.5">12:00 PM Check-Out</p>
            </div>
          </div>

          {/* Add-Ons Summary if any */}
          {reservation.addons && reservation.addons.length > 0 && (
            <div className="p-3 rounded-xl [background-color:var(--bg-secondary)] border theme-border">
              <span className="text-[10px] text-gold uppercase tracking-wider font-semibold block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Included VIP Inclusions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {reservation.addons.map((a, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded theme-bg-elevated border theme-border theme-text-secondary">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tear Line / Decorative Perforation */}
          <div className="relative py-2 flex items-center justify-between">
            <div className="w-4 h-8 rounded-r-full [background-color:var(--bg-secondary)] -ml-8 border-y border-r theme-border" />
            <div className="flex-1 border-t-2 border-dashed border-[var(--border-color)] mx-2" />
            <div className="w-4 h-8 rounded-l-full [background-color:var(--bg-secondary)] -mr-8 border-y border-l theme-border" />
          </div>

          {/* Bottom Bar: Total Paid & QR Code */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider theme-text-secondary block">
                Total Amount Paid
              </span>
              <span className="text-2xl font-serif-display font-bold text-gold">
                {formatCurrency(reservation.total_amount, currency)}
              </span>
              <span className="text-[11px] text-emerald block font-medium mt-0.5">
                • Settlement Completed Online
              </span>
            </div>

            {/* Stylized QR Code placeholder */}
            <div className="flex flex-col items-center">
              <div className="w-18 h-18 p-1.5 bg-white rounded-xl shadow-md flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full text-black fill-current">
                  <path d="M0,0 h14 v14 h-14 z M2,2 v10 h10 v-10 z M4,4 h6 v6 h-6 z" />
                  <path d="M26,0 h14 v14 h-14 z M28,2 v10 h10 v-10 z M30,4 h6 v6 h-6 z" />
                  <path d="M0,26 h14 v14 h-14 z M2,28 v10 h10 v-10 z M4,30 h6 v6 h-6 z" />
                  <path d="M18,2 h4 v4 h-4 z M18,10 h4 v4 h-4 z M18,18 h4 v4 h-4 z M2,18 h4 v4 h-4 z M10,18 h4 v4 h-4 z M26,18 h4 v4 h-4 z M34,18 h4 v4 h-4 z M18,26 h4 v4 h-4 z M26,26 h4 v4 h-4 z M34,26 h4 v4 h-4 z M18,34 h4 v4 h-4 z M26,34 h4 v4 h-4 z M34,34 h4 v4 h-4 z" />
                </svg>
              </div>
              <span className="text-[9px] font-mono theme-text-secondary mt-1 tracking-widest uppercase">
                AURELIA-KEY
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t theme-border [background-color:var(--bg-secondary)] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={onNewBooking || onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl theme-bg-elevated hover:bg-gold/20 theme-text-primary hover:text-gold text-xs font-semibold transition-colors cursor-pointer border theme-border"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Book Another Suite</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Download &amp; Print Key</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
