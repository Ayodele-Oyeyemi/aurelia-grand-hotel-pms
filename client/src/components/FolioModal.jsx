import React, { useState, useEffect, useCallback } from 'react';
import { X, Receipt, Plus, CheckCircle, Utensils, Wine, Shirt, Sparkles, Car, Bed, CreditCard } from 'lucide-react';
import { api, formatCurrency } from '../api';

const CATEGORY_ICONS = {
  room_charge: Bed,
  room_service: Utensils,
  minibar: Wine,
  laundry: Shirt,
  spa: Sparkles,
  transport: Car,
  other: Receipt
};

export default function FolioModal({
  reservation,
  isOpen,
  onClose,
  currency,
  onFolioUpdated
}) {
  const [folioData, setFolioData] = useState({
    items: [],
    total: 0,
    paid: 0,
    balance_due: 0
  });
  const [loading, setLoading] = useState(true);

  // New charge form state
  const [category, setCategory] = useState('room_service');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadFolio = useCallback(async () => {
    if (!reservation?.id) return;
    setLoading(true);
    try {
      const res = await api.getFolio(reservation.id);
      if (res && res.data) {
        setFolioData(res.data);
      }
    } catch (err) {
      console.error('Failed to load folio:', err);
    } finally {
      setLoading(false);
    }
  }, [reservation?.id]);

  useEffect(() => {
    if (isOpen && reservation?.id) {
      loadFolio();
    }
  }, [isOpen, reservation?.id, loadFolio]);

  if (!isOpen || !reservation) return null;

  const handleAddCharge = async (e) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    setStatusMessage('');
    try {
      await api.addFolioItem(reservation.id, {
        category,
        description,
        amount: Number(amount),
        quantity: Number(quantity)
      });
      setDescription('');
      setAmount('');
      setQuantity(1);
      setStatusMessage('Charge posted to room folio');
      setTimeout(() => setStatusMessage(''), 2500);
      await loadFolio();
      if (onFolioUpdated) onFolioUpdated();
    } catch (err) {
      console.error('Add charge error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettleBalance = async () => {
    try {
      await api.settleFolio(reservation.id);
      await loadFolio();
      setStatusMessage('All outstanding charges settled');
      setTimeout(() => setStatusMessage(''), 2500);
      if (onFolioUpdated) onFolioUpdated();
    } catch (err) {
      console.error('Settle balance error:', err);
    }
  };

  const totalCharges = folioData.items.reduce((acc, it) => acc + (it.amount * (it.quantity || 1)), 0);
  const totalPaid = folioData.items.filter(it => it.is_paid).reduce((acc, it) => acc + (it.amount * (it.quantity || 1)), 0);
  const balanceDue = Math.max(0, totalCharges - totalPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl theme-bg-elevated rounded-3xl border theme-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden theme-text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 [background-color:var(--bg-secondary)] border-b theme-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif-display font-semibold theme-text-primary">
                  Guest Billing Folio — {reservation.guest_name}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                  {reservation.booking_ref}
                </span>
              </div>
              <p className="text-xs theme-text-secondary">
                {reservation.suite_name} • Room {reservation.room_number || 'Unassigned'} • Stay: {reservation.check_in} to {reservation.check_out}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl theme-text-secondary hover:theme-text-primary hover:theme-bg-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Folio Items Table Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Status Alert */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald/10 border border-emerald/30 text-emerald text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Charges Table */}
          <div className="theme-bg-primary rounded-2xl border theme-border overflow-hidden">
            <div className="p-3 [background-color:var(--bg-secondary)] border-b theme-border flex items-center justify-between text-xs font-semibold theme-text-secondary uppercase tracking-wider">
              <span>Item Description</span>
              <div className="flex items-center gap-8">
                <span>Qty</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
            </div>

            <div className="divide-y divide-[var(--border-color)]/60">
              {loading ? (
                <div className="p-6 text-center theme-text-secondary text-xs">
                  Loading folio ledger...
                </div>
              ) : folioData.items.length === 0 ? (
                <div className="p-6 text-center theme-text-secondary text-xs">
                  No charges currently posted to this room folio.
                </div>
              ) : (
                folioData.items.map((item, idx) => {
                  const Icon = CATEGORY_ICONS[item.category] || Receipt;
                  return (
                    <div key={item.id || idx} className="p-3.5 flex items-center justify-between text-xs hover:theme-bg-elevated transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg theme-bg-elevated border theme-border flex items-center justify-center text-gold">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-medium theme-text-primary">{item.description}</p>
                          <span className="text-[10px] theme-text-secondary uppercase tracking-wider font-mono">
                            {item.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <span className="theme-text-secondary font-mono w-4 text-center">
                          {item.quantity || 1}
                        </span>
                        <span className="font-semibold theme-text-primary min-w-[70px] text-right">
                          {formatCurrency(item.amount * (item.quantity || 1), currency)}
                        </span>
                        <div className="min-w-[80px] text-right">
                          {item.is_paid ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald/15 text-emerald border border-emerald/30">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose/15 text-rose border border-rose/30">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add New Room Charge Form */}
          <div className="p-4 rounded-2xl [background-color:var(--bg-secondary)] border theme-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Post New Room / Service Charge
            </h3>

            <form onSubmit={handleAddCharge} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] theme-text-secondary mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full theme-bg-primary border theme-border rounded-lg px-2.5 py-2 theme-text-primary focus:border-gold focus:outline-none"
                >
                  <option value="room_service">Room Service Dining</option>
                  <option value="minibar">Minibar / Cellar</option>
                  <option value="spa">Spa &amp; Wellness</option>
                  <option value="laundry">Valet &amp; Laundry</option>
                  <option value="transport">Chauffeur / Transfer</option>
                  <option value="other">Miscellaneous Charge</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] theme-text-secondary mb-1">Charge Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Caviar &amp; Krug Champagne Service"
                  required
                  className="w-full theme-bg-primary border theme-border rounded-lg px-2.5 py-2 theme-text-primary focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] theme-text-secondary mb-1">Amount (USD $)</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="250.00"
                    required
                    className="w-full theme-bg-primary border theme-border rounded-lg px-2.5 py-2 theme-text-primary focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 rounded-lg bg-gold hover:bg-gold-hover text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Financial Totals Summary Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl theme-bg-primary border theme-border text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider theme-text-secondary block">
                Total Charges
              </span>
              <span className="text-base font-bold theme-text-primary">
                {formatCurrency(totalCharges, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider theme-text-secondary block">
                Total Paid
              </span>
              <span className="text-base font-bold text-emerald">
                {formatCurrency(totalPaid, currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider theme-text-secondary block">
                Balance Due
              </span>
              <span className={`text-base font-bold ${balanceDue > 0 ? 'text-rose' : 'text-gold'}`}>
                {formatCurrency(balanceDue, currency)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 [background-color:var(--bg-secondary)] border-t theme-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs theme-text-secondary">
            <CreditCard className="w-4 h-4 text-gold" />
            <span>Card on File: •••• 4242 (AmEx Centurion)</span>
          </div>

          <div className="flex items-center gap-3">
            {balanceDue > 0 ? (
              <button
                type="button"
                onClick={handleSettleBalance}
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
              >
                Settle Balance ({formatCurrency(balanceDue, currency)})
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Folio Zero Balance Settled
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl theme-bg-elevated hover:theme-bg-primary theme-text-primary text-xs font-medium transition-colors cursor-pointer border theme-border"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
