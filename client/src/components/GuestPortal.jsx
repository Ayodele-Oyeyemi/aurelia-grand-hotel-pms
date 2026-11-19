import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Search, Users, Calendar,
  Sparkles, Star, ArrowRight, Play, Utensils,
  Dumbbell, Camera, X, ZoomIn, Check
} from 'lucide-react';
import SuiteCard from './SuiteCard';
import ReservationDrawer from './ReservationDrawer';
import ConfirmationCard from './ConfirmationCard';
import AIConcierge from './AIConcierge';
import { api, formatCurrency } from '../api';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
const imgErr = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

// ── HERO SLIDES ──────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    title: 'The Pinnacle of Atlantic Luxury',
    subtitle: 'Victoria Island, Lagos',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=90',
    cta: 'Explore Suites'
  },
  {
    id: 2,
    title: 'Infinity Pool & Cabana Retreat',
    subtitle: 'Aerial Resort Swimming Pool',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=90',
    cta: 'View Day Packages'
  },
  {
    id: 3,
    title: 'Presidential Penthouse Living',
    subtitle: 'Floor 20 · Atlantic Panorama',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=90',
    cta: 'Reserve Now'
  },
  {
    id: 4,
    title: 'Sky Rooftop Fine Dining',
    subtitle: 'The Sky Restaurant · Penthouse Level',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=90',
    cta: 'Book a Table'
  },
  {
    id: 5,
    title: 'Grand Convention & Ballroom',
    subtitle: 'Events · Banquets · Celebrations',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=90',
    cta: 'Plan Your Event'
  }
];

// ── HOTEL WINGS ──────────────────────────────────────────────
const HOTEL_WINGS = [
  {
    id: 'aurelia-gardens',
    name: 'Aurelia Gardens',
    tagline: 'Garden & Nature Retreat',
    rooms: 'Garden Standard · Garden Classic',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    desc: 'Tranquil garden-facing rooms surrounded by tropical flora, with pool views and relaxed garden patio access.'
  },
  {
    id: 'aurelia-hotel',
    name: 'Aurelia Hotel',
    tagline: 'The Main Tower Experience',
    rooms: 'Superior · Diplomatic · Presidential',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    desc: 'Iconic oceanfront tower offering panoramic Atlantic views, executive suites, and the celebrated Presidential Penthouse.'
  },
  {
    id: 'aurelia-suites',
    name: 'Aurelia Suites',
    tagline: 'Residential Luxury Living',
    rooms: 'Studio Suite · Executive Suite',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    desc: 'Spacious residential-style suites with private terraces, kitchenettes, and lagoon views — perfect for extended stays.'
  }
];

// ── DINING ───────────────────────────────────────────────────
const DINING = [
  { name: 'The Sky Restaurant', cuisine: 'International Fine Dining', desc: 'Tallest penthouse rooftop dining with 360° Lagos views', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', hours: '7AM – 11PM' },
  { name: 'Atarodo', cuisine: 'Afro-Centric Gourmet', desc: 'Bold contemporary Nigerian and West African flavours', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', hours: '12PM – 10PM' },
  { name: 'Lagoon Breeze', cuisine: 'Poolside Grill & Seafood', desc: 'Fresh Atlantic catch, wood-fired grill, poolside cabanas', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', hours: '11AM – 10PM' },
  { name: 'Calabash Bar', cuisine: 'Sports Lounge & Buffet', desc: 'Live sports, craft cocktails, and generous buffet spreads', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', hours: '10AM – 2AM' },
  { name: 'Lagos Irish Pub', cuisine: 'Live Music & Patio Dining', desc: 'Craft beers, pub classics, live music under the stars', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600', hours: '4PM – 2AM' },
  { name: 'Red Chinese Lounge', cuisine: 'Rooftop Asian Fusion', desc: 'Cantonese classics meets modern Lagos on the rooftop terrace', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600', hours: '6PM – 11PM' }
];

// ── MEETINGS ─────────────────────────────────────────────────
const MEETINGS = [
  { name: 'Grand Ballroom', capacity: '1,200 pax', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600', desc: "Lagos's most prestigious event hall with crystal chandeliers" },
  { name: 'Convention Centre', capacity: '800 pax', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600', desc: 'State-of-the-art conference hall with simultaneous translation booths' },
  { name: 'Fantasia', capacity: '400 pax', image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=600', desc: 'Tropical-themed outdoor banquet space for weddings and gala events' },
  { name: 'Executive Boardrooms', capacity: '20 pax each', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', desc: 'Four premium boardrooms with AV systems and butler service' }
];

// ── RECREATIONAL ─────────────────────────────────────────────
const RECREATIONAL = [
  { name: 'Olympic Swimming Pool', desc: '50m outdoor pool with heated lanes, cabanas & poolside bar', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600', icon: '🏊' },
  { name: 'Gymnasium & Sauna', desc: 'State-of-the-art equipment, Finnish sauna, steam room', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', icon: '💪' },
  { name: 'Flood-Lit Tennis Courts', desc: '4 international-standard courts available day and night', image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600', icon: '🎾' },
  { name: 'Luxury Thermal Spa', desc: 'Couples treatments, hydrothermal pools, Himalayan salt rooms', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', icon: '💆' },
  { name: 'Salon & Nail Studio', desc: 'Full-service luxury salon with international stylists', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', icon: '💅' }
];

// ── EVENTS ───────────────────────────────────────────────────
const EVENTS = [
  { title: 'Lagos Tech Summit Gala', date: 'Nov 15, 2026', price: 75000, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
  { title: 'Tropical Wonderland Festival', date: 'Nov 22, 2026', price: 25000, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600' },
  { title: 'Haute Table Charity Dinner', date: 'Dec 5, 2026', price: 150000, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600' },
  { title: 'Intimate Celebrations Showcase', date: 'Dec 12, 2026', price: 45000, image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600' }
];

// ── GALLERY ──────────────────────────────────────────────────
const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600', cat: 'Suites', title: 'Presidential Penthouse' },
  { src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600', cat: 'Pool', title: 'Infinity Pool' },
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', cat: 'Suites', title: 'Royal Lagoon Villa' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', cat: 'Dining', title: 'Sky Restaurant' },
  { src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600', cat: 'Events', title: 'Grand Ballroom' },
  { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', cat: 'Wellness', title: 'Gymnasium' },
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', cat: 'Suites', title: 'Garden Terrace Loft' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', cat: 'Dining', title: 'Atarodo Restaurant' },
  { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', cat: 'Wellness', title: 'Luxury Spa' },
  { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', cat: 'Meetings', title: 'Executive Boardroom' },
  { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600', cat: 'Suites', title: 'Signature Deluxe King' },
  { src: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600', cat: 'Wellness', title: 'Tennis Courts' }
];

// ── FALLBACK SUITES (always guarantee 8 rooms) ───────────────
function getFallbackSuites() {
  return [
    { id: 'fb-1', name: 'Garden Standard Room', slug: 'garden-standard', category: 'standard', wing: 'aurelia-gardens', wingLabel: 'Aurelia Gardens', floor: 1, room_number: '101', sqft: 380, base_rate_usd: 120, max_guests: 2, amenities: ['Garden View', 'King Bed', 'Free WiFi', 'Flat Screen TV'], description: 'Serene garden-facing standard room with lush tropical views and complimentary breakfast.', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', is_active: true },
    { id: 'fb-2', name: 'Garden Classic Room', slug: 'garden-classic', category: 'classic', wing: 'aurelia-gardens', wingLabel: 'Aurelia Gardens', floor: 2, room_number: '201', sqft: 480, base_rate_usd: 165, max_guests: 2, amenities: ['Pool View', 'Smart TV', 'Rainfall Shower', 'Club Lounge'], description: 'Upgraded garden retreat with pool-facing views and premium furnishings.', image_url: 'https://images.unsplash.com/photo-1612320648774-0a26f863e55a?w=800', is_active: true },
    { id: 'fb-3', name: 'Classic Superior Room', slug: 'classic-superior', category: 'superior', wing: 'aurelia-hotel', wingLabel: 'Aurelia Hotel', floor: 5, room_number: '501', sqft: 550, base_rate_usd: 220, max_guests: 2, amenities: ['City View', 'King Bed', 'Marble Bathroom', 'Work Desk'], description: 'Sophisticated 550 sq ft superior room with Lagos city views.', image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', is_active: true },
    { id: 'fb-4', name: 'Atlantic Superior Room', slug: 'atlantic-superior', category: 'superior', wing: 'aurelia-hotel', wingLabel: 'Aurelia Hotel', floor: 8, room_number: '801', sqft: 620, base_rate_usd: 290, max_guests: 2, amenities: ['Atlantic View', 'Floor-to-Ceiling Windows', 'Rain Shower', 'Breakfast'], description: 'Stunning oceanfront room with floor-to-ceiling windows framing the Atlantic.', image_url: 'https://images.unsplash.com/photo-1590490360182-c33d955e5310?w=800', is_active: true },
    { id: 'fb-5', name: 'Diplomatic Suite', slug: 'diplomatic-suite', category: 'suite', wing: 'aurelia-hotel', wingLabel: 'Aurelia Hotel', floor: 12, room_number: '1201', sqft: 1100, base_rate_usd: 450, max_guests: 3, amenities: ['Panoramic View', 'Boardroom', 'Smart Home', 'Butler'], description: '1,100 sq ft power suite for executives and diplomats with dedicated butler.', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', is_active: true },
    { id: 'fb-6', name: 'Presidential Suite', slug: 'presidential-suite', category: 'penthouse', wing: 'aurelia-hotel', wingLabel: 'Aurelia Hotel', floor: 20, room_number: '2001', sqft: 2800, base_rate_usd: 1250, max_guests: 4, amenities: ['Ocean View', 'Infinity Pool', 'Butler', 'Grand Piano'], description: 'The crown jewel — 2,800 sq ft penthouse with 270° Atlantic panorama.', image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', is_active: true },
    { id: 'fb-7', name: 'Studio Suite', slug: 'studio-suite', category: 'studio', wing: 'aurelia-suites', wingLabel: 'Aurelia Suites', floor: 3, room_number: '301', sqft: 650, base_rate_usd: 310, max_guests: 2, amenities: ['Pool View', 'Kitchenette', 'Private Terrace', 'Daybed'], description: 'Smart 650 sq ft studio suite with pool-terrace views and kitchenette.', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', is_active: true },
    { id: 'fb-8', name: 'Executive Suite', slug: 'executive-suite', category: 'deluxe', wing: 'aurelia-suites', wingLabel: 'Aurelia Suites', floor: 7, room_number: '701', sqft: 950, base_rate_usd: 580, max_guests: 2, amenities: ['Lagoon View', 'Jacuzzi', 'Kitchenette', 'VIP Concierge'], description: 'Luxurious 950 sq ft executive suite with private jacuzzi and lagoon view.', image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', is_active: true }
  ];
}

// ── SHARED SUB-COMPONENTS ────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-10">
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-2">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-serif-display font-bold theme-text-primary">{title}</h2>
      {subtitle && <p className="mt-3 text-sm theme-text-secondary max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function TableBookingModal({ restaurant, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  if (!restaurant) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm theme-bg-elevated rounded-2xl border theme-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <div>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Reserve a Table</p>
            <h3 className="text-lg font-serif-display theme-text-primary">{restaurant.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 theme-text-muted hover:text-gold cursor-pointer transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-4"><Star className="w-7 h-7 text-emerald" /></div>
            <h4 className="text-lg font-serif-display theme-text-primary mb-2">Reservation Confirmed!</h4>
            <p className="text-sm theme-text-secondary mb-6">We will confirm your table at {restaurant.name} shortly.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gold text-white font-semibold text-sm cursor-pointer">Done</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium theme-text-secondary mb-1.5">Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium theme-text-secondary mb-1.5">Time</label>
                <select value={time} onChange={e => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary cursor-pointer">
                  {['12:00','13:00','14:00','18:00','19:00','20:00','21:00'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium theme-text-secondary mb-1.5">Guests</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary cursor-pointer">
                  {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} guests</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-sm cursor-pointer transition-colors">
              Request Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function BanquetModal({ venue, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [event, setEvent] = useState('');
  const [guests, setGuests] = useState('');
  if (!venue) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm theme-bg-elevated rounded-2xl border theme-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <div>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Request a Quote</p>
            <h3 className="text-lg font-serif-display theme-text-primary">{venue.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 theme-text-muted hover:text-gold cursor-pointer transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4"><Star className="w-7 h-7 text-gold" /></div>
            <h4 className="text-lg font-serif-display theme-text-primary mb-2">Quote Requested!</h4>
            <p className="text-sm theme-text-secondary mb-6">Our events team will contact you within 2 hours.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gold text-white font-semibold text-sm cursor-pointer">Done</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-6 space-y-3">
            <input required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
            <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
            <input required placeholder="Event Type (e.g., Wedding, Conference)" value={event} onChange={e => setEvent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
            <input required placeholder="Expected Guest Count" type="number" value={guests} onChange={e => setGuests(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
            <button type="submit" className="w-full py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-sm cursor-pointer transition-colors">
              Request Banquet Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── MAIN GUEST PORTAL ────────────────────────────────────────
export default function GuestPortal({ currency, currentUser, onOpenAuth }) {
  // Hero carousel
  const [slide, setSlide] = useState(0);
  const autoRef = useRef(null);

  // Search bar
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-18');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Wing filter
  const [activeWing, setActiveWing] = useState('all');

  // Suites state
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmedRes, setConfirmedRes] = useState(null);
  const [tableModal, setTableModal] = useState(null);
  const [banquetModal, setBanquetModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('All');

  // Load suites with guaranteed fallback
  const loadSuites = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeWing !== 'all') params.wing = activeWing;
      const res = await api.getSuites(params);
      // Normalize all possible response shapes
      let data = Array.isArray(res) ? res
        : Array.isArray(res?.data) ? res.data
        : Array.isArray(res?.suites) ? res.suites
        : [];
      setSuites(data.length > 0 ? data : getFallbackSuites());
    } catch {
      setSuites(getFallbackSuites());
    } finally {
      setLoading(false);
    }
  }, [activeWing]);

  useEffect(() => { loadSuites(); }, [loadSuites]);

  // Hero auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(autoRef.current);
  }, []);

  const goSlide = (n) => {
    clearInterval(autoRef.current);
    setSlide(n);
    autoRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5500);
  };

  const galleryCats = ['All', ...new Set(GALLERY.map(g => g.cat))];
  const filteredGallery = galleryFilter === 'All' ? GALLERY : GALLERY.filter(g => g.cat === galleryFilter);

  const handleReserve = (suite) => { setSelectedSuite(suite); setDrawerOpen(true); };
  const handleBookingSuccess = (res, suite) => {
    setDrawerOpen(false);
    setConfirmedRes({ ...res, suite_name: suite.name });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="home" className="theme-bg-primary">

      {/* ══ HERO CAROUSEL ══════════════════════════════════════ */}
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" onError={imgErr} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          </div>
        ))}

        {/* Slide content */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-3 drop-shadow">
              {HERO_SLIDES[slide].subtitle}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-bold mb-6 leading-tight drop-shadow-lg">
              {HERO_SLIDES[slide].title}
            </h1>
            <button
              onClick={() => scrollTo('suite-grid')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold hover:bg-gold-hover text-white font-bold text-sm uppercase tracking-wider cursor-pointer transition-colors shadow-lg shadow-gold/30">
              {HERO_SLIDES[slide].cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Left / Right arrows */}
        <button onClick={() => goSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => goSlide((slide + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${i === slide ? 'bg-gold w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`} />
          ))}
        </div>

        {/* Best Price widget */}
        <div className="absolute bottom-6 right-6 bg-gold text-white px-4 py-3 rounded-xl shadow-xl text-center hidden sm:block">
          <p className="text-[10px] font-bold uppercase tracking-wider">✦ Best Price Here!</p>
          <p className="text-[9px] opacity-90 mt-0.5">24h Service · Book Direct & Save</p>
          <button onClick={() => scrollTo('availability-bar')}
            className="mt-2 block w-full text-[10px] bg-white/20 hover:bg-white/30 rounded px-3 py-1 font-bold cursor-pointer transition-colors">
            Book Now →
          </button>
        </div>
      </section>

      {/* ══ AVAILABILITY SEARCH BAR ════════════════════════════ */}
      <section id="availability-bar" className="theme-bg-elevated border-b theme-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadSuites();
              scrollTo('suite-grid');
            }}
            className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-semibold uppercase tracking-wider theme-text-muted mb-1.5">
                Arrival Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[11px] font-semibold uppercase tracking-wider theme-text-muted mb-1.5">
                Departure Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary" />
              </div>
            </div>
            <div className="min-w-[110px]">
              <label className="block text-[11px] font-semibold uppercase tracking-wider theme-text-muted mb-1.5">Adults</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <select value={adults} onChange={e => setAdults(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary cursor-pointer">
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="min-w-[110px]">
              <label className="block text-[11px] font-semibold uppercase tracking-wider theme-text-muted mb-1.5">Children</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <select value={children} onChange={e => setChildren(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm theme-bg-secondary border theme-border focus:border-gold focus:outline-none theme-text-primary cursor-pointer">
                  {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <button type="submit"
              className="h-[42px] px-8 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
              <Search className="w-4 h-4" /> Check Availability
            </button>
          </form>
        </div>
      </section>

      {/* ══ HOTEL WINGS ════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          eyebrow="Our Properties"
          title="Three Distinct Wings of Luxury"
          subtitle="From garden retreats to oceanfront penthouses — find your perfect Aurelia experience." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOTEL_WINGS.map(wing => (
            <div key={wing.id}
              className="group theme-bg-elevated rounded-2xl border theme-border overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-52 overflow-hidden">
                <img src={wing.image} alt={wing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={imgErr} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-[9px] uppercase tracking-widest text-gold/90 font-bold">{wing.tagline}</span>
                  <h3 className="text-white font-serif-display text-xl font-bold">{wing.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs theme-text-muted mb-1">{wing.rooms}</p>
                <p className="text-sm theme-text-secondary leading-relaxed mb-4">{wing.desc}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setActiveWing(wing.id); scrollTo('suite-grid'); }}
                    className="flex-1 py-2 rounded-lg border border-gold text-gold text-xs font-semibold hover:bg-gold hover:text-white cursor-pointer transition-colors">
                    View Rooms
                  </button>
                  <button
                    onClick={() => { setActiveWing(wing.id); scrollTo('suite-grid'); }}
                    className="flex-1 py-2 rounded-lg bg-gold hover:bg-gold-hover text-white text-xs font-semibold cursor-pointer transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SUITE GRID ═════════════════════════════════════════ */}
      <section id="suite-grid" className="theme-bg-secondary py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Suites & Residences"
            title="Signature Rooms & Suites"
            subtitle={`Showing ${suites.length} luxury rooms across all wings`} />

          {/* Wing filter tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[{ id: 'all', label: 'All Rooms' }, ...HOTEL_WINGS.map(w => ({ id: w.id, label: w.name }))].map(tab => (
              <button key={tab.id} onClick={() => setActiveWing(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  activeWing === tab.id
                    ? 'bg-gold text-white shadow-sm'
                    : 'theme-bg-elevated border theme-border theme-text-secondary hover:border-gold hover:text-gold'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(n => (
                <div key={n} className="h-80 rounded-2xl theme-bg-elevated animate-pulse border theme-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suites.map(suite => (
                <SuiteCard key={suite.id} suite={suite} currency={currency} onReserve={handleReserve} />
              ))}
            </div>
          )}

          {!loading && suites.length === 0 && (
            <div className="text-center py-16 theme-text-muted">
              <p className="text-lg">No rooms found for this wing.{' '}
                <button onClick={() => setActiveWing('all')} className="text-gold underline cursor-pointer">
                  View all rooms
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══ DAY PACKAGES ═══════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          eyebrow="Day Experiences"
          title="Exclusive Day Packages"
          subtitle="Experience the full Aurelia Grand without an overnight stay." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Pool Day Pass',
              desc: 'Full Olympic pool access from 9AM–6PM, inclusive of Lunch & Dinner Buffet at Kuramo BLD Restaurant. Includes towel service, sun-lounger, and welcome mocktail.',
              weekday: 15000, weekend: 25000,
              image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
              badge: '🏊 All-Day Pool & Dining'
            },
            {
              title: 'Hakuna Matata Atlantic Theme Park',
              desc: 'Full-day access to our spectacular Atlantic Theme Park featuring thrilling water slides, the giant wave pool, adrenaline rides, and live entertainment for all ages.',
              weekday: 8500, weekend: 12500,
              image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
              badge: '🎢 Theme Park & Attractions'
            }
          ].map(pkg => (
            <div key={pkg.title} className="group theme-bg-elevated rounded-2xl border theme-border overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-56 overflow-hidden">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={imgErr} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-white text-xs font-bold">
                  {pkg.badge}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif-display font-bold theme-text-primary mb-2">{pkg.title}</h3>
                <p className="text-sm theme-text-secondary leading-relaxed mb-5">{pkg.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 rounded-xl border border-gold text-gold text-xs font-bold hover:bg-gold hover:text-white cursor-pointer transition-colors">
                    Weekday — ₦{pkg.weekday.toLocaleString()}
                  </button>
                  <button className="py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-white text-xs font-bold cursor-pointer transition-colors">
                    Weekend — ₦{pkg.weekend.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ DINING ════════════════════════════════════════════ */}
      <section id="dining" className="theme-bg-secondary py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Aurelia Dining"
            title="Six Signature Restaurants"
            subtitle="From rooftop fine dining to poolside grills — a culinary journey across six distinct flavours." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DINING.map(d => (
              <div key={d.name} className="group theme-bg-elevated rounded-2xl border theme-border overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-44 overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={imgErr} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium">
                    {d.hours}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gold font-bold uppercase tracking-wider mb-1">{d.cuisine}</p>
                  <h3 className="text-base font-serif-display font-semibold theme-text-primary mb-1">{d.name}</h3>
                  <p className="text-xs theme-text-secondary leading-relaxed mb-3">{d.desc}</p>
                  <button onClick={() => setTableModal(d)}
                    className="w-full py-2 rounded-lg bg-gold hover:bg-gold-hover text-white text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" /> Reserve a Table
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MEETINGS & BANQUETING ══════════════════════════════ */}
      <section id="meetings" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          eyebrow="Meetings & Banqueting"
          title="World-Class Event Spaces"
          subtitle="From intimate boardrooms to Lagos's most prestigious ballroom — every event deserves perfection." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MEETINGS.map(m => (
            <div key={m.name} className="group theme-bg-elevated rounded-2xl border theme-border overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-40 overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={imgErr} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold text-white text-[9px] font-bold">
                  {m.capacity}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-serif-display font-semibold theme-text-primary mb-1">{m.name}</h3>
                <p className="text-xs theme-text-secondary leading-relaxed mb-3">{m.desc}</p>
                <button onClick={() => setBanquetModal(m)}
                  className="w-full py-2 rounded-lg border border-gold text-gold text-xs font-semibold hover:bg-gold hover:text-white cursor-pointer transition-colors">
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ RECREATIONAL SERVICES ══════════════════════════════ */}
      <section id="recreational" className="theme-bg-secondary py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Wellness & Recreation"
            title="Recreational Services"
            subtitle="Revitalise your body and spirit with our world-class recreational facilities." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {RECREATIONAL.map(r => (
              <div key={r.name} className="group theme-bg-elevated rounded-2xl border theme-border overflow-hidden hover:shadow-xl transition-all text-center">
                <div className="relative h-32 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={imgErr} />
                  <div className="absolute inset-0 bg-black/40" />
                  <span className="absolute inset-0 flex items-center justify-center text-3xl">{r.icon}</span>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold theme-text-primary mb-1">{r.name}</h3>
                  <p className="text-[10px] theme-text-muted leading-tight">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EVENTS ════════════════════════════════════════════ */}
      <section id="events" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          eyebrow="Upcoming Events"
          title="Events & Experiences"
          subtitle="Exclusive Lagos luxury events — from galas to intimate celebrations." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EVENTS.map(ev => (
            <div key={ev.title} className="group theme-bg-elevated rounded-2xl border theme-border overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-40 overflow-hidden">
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={imgErr} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs text-white/90 font-semibold">{ev.date}</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-serif-display font-semibold theme-text-primary mb-2">{ev.title}</h3>
                <p className="text-xs text-gold font-bold mb-3">₦{ev.price.toLocaleString()} / person</p>
                <button className="w-full py-2 rounded-lg bg-gold hover:bg-gold-hover text-white text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" /> Get Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GALLERY ════════════════════════════════════════════ */}
      <section id="gallery" className="theme-bg-secondary py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Gallery"
            title="A Visual Journey"
            subtitle="Explore The Aurelia Grand through the lens of luxury, comfort, and elegance." />

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {galleryCats.map(cat => (
              <button key={cat} onClick={() => setGalleryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  galleryFilter === cat
                    ? 'bg-gold text-white'
                    : 'theme-bg-elevated border theme-border theme-text-secondary hover:border-gold hover:text-gold'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredGallery.map((photo, i) => (
              <div key={i} onClick={() => setLightbox(photo)}
                className="relative group h-44 rounded-xl overflow-hidden cursor-pointer border theme-border hover:border-gold transition-colors">
                <img src={photo.src} alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={imgErr} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-semibold">{photo.title}</p>
                  <p className="text-white/60 text-[10px]">{photo.cat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIGHTBOX ══════════════════════════════════════════ */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/92 flex items-center justify-center p-4 lightbox-overlay"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors">
            <X className="w-6 h-6" />
          </button>
          <img src={lightbox.src} alt={lightbox.title}
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl object-contain"
            onError={imgErr}
            onClick={e => e.stopPropagation()} />
          <div className="absolute bottom-6 text-center text-white/80 text-sm font-semibold">
            {lightbox.title} · <span className="text-gold">{lightbox.cat}</span>
          </div>
        </div>
      )}

      {/* ══ RESERVATION DRAWER & CONFIRMATION ══════════════════ */}
      <ReservationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        suite={selectedSuite}
        currency={currency}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
        initialGuests={adults}
        onBookingSuccess={handleBookingSuccess}
      />

      {confirmedRes && (
        <ConfirmationCard
          reservation={confirmedRes}
          suite={selectedSuite}
          currency={currency}
          onClose={() => setConfirmedRes(null)}
          onNewBooking={() => { setConfirmedRes(null); loadSuites(); }}
        />
      )}

      {/* ══ MODALS ════════════════════════════════════════════ */}
      <TableBookingModal restaurant={tableModal} onClose={() => setTableModal(null)} />
      <BanquetModal venue={banquetModal} onClose={() => setBanquetModal(null)} />

      {/* ══ FLOATING AI CONCIERGE ═════════════════════════════ */}
      <AIConcierge />
    </div>
  );
}
