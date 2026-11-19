import React, { useState } from 'react';
import { X, Car, Wine, Sparkles, Clock, Check, ShieldCheck, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency, api } from '../api';

const AVAILABLE_ADDONS = [
  {
    id: 'chauffeur',
    name: 'Airport Chauffeur Pickup (Mercedes S-Class)',
    price: 150,
    icon: Car,
    desc: 'VIP flight tracking & chilled champagne welcome'
  },
  {
    id: 'champagne',
    name: 'Floating Champagne Breakfast',
    price: 120,
    icon: Wine,
    desc: 'Artisanal pastry basket & Laurent-Perrier Brut'
  },
  {
    id: 'spa',
    name: 'Couples Thermal Spa Pass',
    price: 200,
    icon: Sparkles,
    desc: '90-min hydrotherapy & private plunge pool'
  },
  {
    id: 'late_checkout',
    name: 'Guaranteed 4 PM Late Check-Out',
    price: 75,
    icon: Clock,
    desc: 'Relax unhurried until your evening departure'
  }
];

export default function ReservationDrawer({
  isOpen,
  onClose,
  suite,
  currency,
  initialCheckIn = '2026-11-08',
  initialCheckOut = '2026-11-11',
  initialGuests = 2,
  onBookingSuccess
}) {
  // Always call all hooks unconditionally first
  const [firstName, setFirstName] = useState('Chidi');
  const [lastName, setLastName] = useState('Okafor');
  const [email, setEmail] = useState('chidi.okafor@email.com');
  const [phone, setPhone] = useState('+234-801-555-0101');
  const [vipTier] = useState('black');
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guestsCount] = useState(initialGuests);

  // Add-ons State
  const [selectedAddons, setSelectedAddons] = useState([
    AVAILABLE_ADDONS[0], // Airport Chauffeur pre-selected for VIP
    AVAILABLE_ADDONS[2]  // Spa pass pre-selected
  ]);

  // Promo code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Payment & Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !suite) return null;

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24))) || 3;

  // Financial calculations
  const rawRoomRateTotal = suite.base_rate_usd * calculatedNights;
  const discountPct = appliedPromo === 'DEV20' ? 20 : 0;
  const discountAmount = (rawRoomRateTotal * discountPct) / 100;
  const roomTotalAfterDiscount = rawRoomRateTotal - discountAmount;

  const addonsTotal = selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
  const subtotal = roomTotalAfterDiscount + addonsTotal;

  // 7.5% VAT + 5% Hospitality Levy = 12.5%
  const vatAmount = subtotal * 0.075;
  const levyAmount = subtotal * 0.05;
  const taxAmount = vatAmount + levyAmount;
  const totalAmount = subtotal + taxAmount;

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const applyPromoCode = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'DEV20') {
      setAppliedPromo('DEV20');
    } else if (code === '') {
      setAppliedPromo(null);
    } else {
      setPromoError('Invalid promo code. Try DEV20 for 20% off room rate.');
    }
  };

  const handleSimulatedPayment = async (provider) => {
    if (!firstName || !lastName || !email) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    setPaymentProvider(provider);
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const reservationData = {
        suite_id: suite.id,
        suite_name: suite.name,
        room_number: suite.room_number,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        vip_tier: vipTier,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: Number(guestsCount),
        nightly_rate: suite.base_rate_usd,
        promo_code: appliedPromo,
        discount_pct: discountPct,
        addons: selectedAddons.map(a => ({ name: a.name, price: a.price })),
        subtotal: Number(subtotal.toFixed(2)),
        tax_amount: Number(taxAmount.toFixed(2)),
        total_amount: Number(totalAmount.toFixed(2)),
        special_requests: `Simulated checkout via ${provider}. VIP Black Tier luxury package.`
      };

      // Slight simulation latency for realism
      await new Promise(r => setTimeout(r, 1200));

      const res = await api.createReservation(reservationData);
      if (res && res.data) {
        onBookingSuccess(res.data, suite);
      } else {
        throw new Error(res.error || 'Unable to confirm reservation');
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setErrorMessage(err.message || 'Payment simulation failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl theme-bg-elevated border-l theme-border shadow-2xl flex flex-col theme-text-primary">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b theme-border [background-color:var(--bg-secondary)]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                Curated Luxury Reservation
              </span>
              <h2 className="text-xl font-serif-display font-semibold theme-text-primary">
                {suite.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl theme-text-secondary hover:theme-text-primary hover:theme-bg-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-7">

            {/* Step 1: Guest Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-sm font-semibold uppercase tracking-wider theme-text-primary">
                  Guest &amp; Stay Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium theme-text-secondary mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
                    placeholder="Chidi"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium theme-text-secondary mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
                    placeholder="Okafor"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium theme-text-secondary mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
                    placeholder="guest@aureliagrand.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium theme-text-secondary mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
                    placeholder="+234-801-555-0101"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium theme-text-secondary mb-1">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium theme-text-secondary mb-1">Check-Out ({calculatedNights} nights)</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Bespoke Add-Ons */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider theme-text-primary">
                    Bespoke Concierge Add-Ons
                  </h3>
                </div>
                <span className="text-[11px] theme-text-secondary">Tap to toggle</span>
              </div>

              <div className="space-y-2.5">
                {AVAILABLE_ADDONS.map((addon) => {
                  const Icon = addon.icon;
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-gold/10 border-gold shadow-sm ring-1 ring-gold/40'
                          : 'theme-bg-primary border-[var(--border-color)] hover:theme-bg-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-gold text-white' : 'theme-bg-elevated text-gold'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold theme-text-primary">{addon.name}</p>
                          <p className="text-[11px] theme-text-secondary">{addon.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gold">
                          +{formatCurrency(addon.price, currency)}
                        </span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-gold border-gold text-white' : 'border-[var(--border-color)] theme-bg-primary'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Review & Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">3</span>
                <h3 className="text-sm font-semibold uppercase tracking-wider theme-text-primary">
                  Rate Breakdown &amp; Promo Code
                </h3>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={applyPromoCode} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter promo code (e.g. DEV20)"
                    className="flex-1 theme-bg-primary border theme-border rounded-lg px-3 py-2 text-xs theme-text-primary uppercase placeholder:normal-case focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg theme-bg-elevated hover:bg-gold hover:text-white theme-text-primary font-medium text-xs transition-colors cursor-pointer border theme-border"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="mt-1.5 text-[11px] text-emerald flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3" /> Promo DEV20 active — 20% room discount applied!
                  </p>
                )}
                {promoError && (
                  <p className="mt-1.5 text-[11px] text-rose flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> {promoError}
                  </p>
                )}
              </form>

              {/* Breakdown Ledger */}
              <div className="[background-color:var(--bg-secondary)] rounded-xl border theme-border p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center theme-text-secondary">
                  <span>
                    {suite.name} ({calculatedNights} {calculatedNights === 1 ? 'night' : 'nights'} × {formatCurrency(suite.base_rate_usd, currency)})
                  </span>
                  <span className="font-medium theme-text-primary">{formatCurrency(rawRoomRateTotal, currency)}</span>
                </div>

                {discountPct > 0 && (
                  <div className="flex justify-between items-center text-emerald">
                    <span>Developer Promo Discount ({discountPct}%)</span>
                    <span>-{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}

                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center theme-text-secondary">
                    <span>{addon.name}</span>
                    <span className="font-medium theme-text-primary">{formatCurrency(addon.price, currency)}</span>
                  </div>
                ))}

                <div className="pt-2 border-t border-[var(--border-color)]/60 flex justify-between items-center theme-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold theme-text-primary">{formatCurrency(subtotal, currency)}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] theme-text-secondary">
                  <span>Lagos State VAT (7.5%)</span>
                  <span>{formatCurrency(vatAmount, currency)}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] theme-text-secondary">
                  <span>Hospitality Development Levy (5.0%)</span>
                  <span>{formatCurrency(levyAmount, currency)}</span>
                </div>

                <div className="pt-2.5 border-t border-[var(--border-color)] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-semibold theme-text-primary block">Total Amount</span>
                    <span className="text-[10px] theme-text-secondary">All taxes &amp; service charges included</span>
                  </div>
                  <span className="text-xl font-serif-display font-bold text-gold">
                    {formatCurrency(totalAmount, currency)}
                  </span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose/10 border border-rose/30 text-rose text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

          </div>

          {/* Checkout Action Footer */}
          <div className="p-6 border-t theme-border [background-color:var(--bg-secondary)] space-y-3">
            <div className="flex items-center justify-between text-xs theme-text-secondary">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald" /> 256-Bit Encrypted Simulated Gateway
              </span>
              <span className="font-mono text-gold font-semibold">
                {formatCurrency(totalAmount, currency)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Simulated Paystack */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulatedPayment('Paystack (NGN / Card)')}
                className="py-3 px-4 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-md"
              >
                {isProcessing && paymentProvider?.includes('Paystack') ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Simulated Paystack</span>
                  </>
                )}
              </button>

              {/* Simulated Stripe */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSimulatedPayment('Stripe (Global USD)')}
                className="py-3 px-4 rounded-xl theme-bg-elevated hover:theme-bg-primary border border-gold/40 text-gold font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isProcessing && paymentProvider?.includes('Stripe') ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>Simulated Stripe</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
