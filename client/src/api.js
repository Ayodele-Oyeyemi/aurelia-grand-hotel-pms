const API_BASE = import.meta.env.VITE_API_URL || '';

export const NGN_RATE = 1580;

export function formatCurrency(amountUSD, currency = 'USD') {
  const num = Number(amountUSD) || 0;
  if (currency === 'NGN') {
    const ngn = num * NGN_RATE;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(ngn).replace('NGN', '₦');
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Fallback in-memory database in case server is starting or standalone demo
const fallbackSuites = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Presidential Ocean Penthouse',
    slug: 'presidential-ocean-penthouse',
    category: 'penthouse',
    floor: 4,
    room_number: '401',
    sqft: 2800,
    base_rate_usd: 1250.00,
    max_guests: 4,
    status: 'occupied',
    amenities: ['Ocean View', 'Private Infinity Pool', 'Butler Service', 'Grand Piano', 'Helipad Access', 'Wine Cellar'],
    description: 'The crown jewel of The Aurelia Grand. A sprawling 2,800 sq ft penthouse with 270° Atlantic ocean views, private infinity pool, dedicated butler, and exclusive helipad access.',
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Royal Lagoon Villa',
    slug: 'royal-lagoon-villa',
    category: 'villa',
    floor: 4,
    room_number: '402',
    sqft: 2200,
    base_rate_usd: 950.00,
    max_guests: 4,
    status: 'available',
    amenities: ['Lagoon View', 'Private Garden', 'Outdoor Shower', 'Jacuzzi', 'Kitchenette', 'Fireplace'],
    description: 'A secluded 2,200 sq ft villa overlooking the lagoon with a private tropical garden, outdoor rain shower, and heated jacuzzi.',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Executive Diplomatic Suite',
    slug: 'executive-diplomatic-suite',
    category: 'suite',
    floor: 3,
    room_number: '301',
    sqft: 1600,
    base_rate_usd: 650.00,
    max_guests: 3,
    status: 'occupied',
    amenities: ['City View', 'Boardroom', 'Lounge Area', 'Nespresso Machine', 'Smart Home', 'Premium Minibar'],
    description: 'A 1,600 sq ft power suite designed for heads of state and C-suite executives, featuring a private boardroom and smart home controls.',
    image_url: 'https://images.unsplash.com/photo-1590490360182-c33d955e5310?w=800'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    name: 'Signature Deluxe King',
    slug: 'signature-deluxe-king',
    category: 'deluxe',
    floor: 3,
    room_number: '302',
    sqft: 1100,
    base_rate_usd: 420.00,
    max_guests: 2,
    status: 'available',
    amenities: ['Harbor View', 'Rain Shower', 'Work Desk', 'Pillow Menu', 'Evening Turndown', 'Complimentary Breakfast'],
    description: 'An elegant 1,100 sq ft retreat with panoramic harbor views, Italian marble bathroom, and curated pillow menu.',
    image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    name: 'Garden Terrace Loft',
    slug: 'garden-terrace-loft',
    category: 'loft',
    floor: 2,
    room_number: '201',
    sqft: 900,
    base_rate_usd: 310.00,
    max_guests: 2,
    status: 'available',
    amenities: ['Garden View', 'Private Terrace', 'Daybed', 'Reading Nook', 'Bluetooth Speaker', 'Organic Toiletries'],
    description: 'A charming 900 sq ft split-level loft with a private terrace overlooking the botanical gardens.',
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    name: 'Classic Club Studio',
    slug: 'classic-club-studio',
    category: 'studio',
    floor: 2,
    room_number: '202',
    sqft: 650,
    base_rate_usd: 220.00,
    max_guests: 2,
    status: 'occupied',
    amenities: ['Pool View', 'Club Lounge Access', 'Smart TV', 'USB Charging', 'Rainfall Shower', 'Fitness Center'],
    description: 'A smart 650 sq ft studio with pool views and complimentary access to the exclusive Club Lounge.',
    image_url: 'https://images.unsplash.com/photo-1612320648774-0a26f863e55a?w=800'
  }
];

let fallbackReservations = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    booking_ref: 'AUR-2026-0001',
    suite_id: 'a1000000-0000-0000-0000-000000000001',
    suite_name: 'Presidential Ocean Penthouse',
    guest_name: 'Chidi Okafor',
    guest_email: 'chidi.okafor@email.com',
    guest_phone: '+234-801-555-0101',
    vip_tier: 'black',
    check_in: '2026-11-08',
    check_out: '2026-11-13',
    guests_count: 2,
    status: 'checked_in',
    room_number: '401',
    nightly_rate: 1250.00,
    promo_code: null,
    discount_pct: 0,
    addons: [{ name: 'Airport Chauffeur Pickup', price: 150 }, { name: 'Couples Thermal Spa Pass', price: 200 }],
    subtotal: 6600.00,
    tax_amount: 825.00,
    total_amount: 7425.00,
    balance_due: 0,
    channel: 'direct',
    special_requests: 'Ocean-facing suite. Shellfish-free minibar.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    booking_ref: 'AUR-2026-0002',
    suite_id: 'a1000000-0000-0000-0000-000000000003',
    suite_name: 'Executive Diplomatic Suite',
    guest_name: 'Aisha Bello',
    guest_email: 'aisha.bello@email.com',
    guest_phone: '+234-802-555-0102',
    vip_tier: 'platinum',
    check_in: '2026-11-07',
    check_out: '2026-11-10',
    guests_count: 1,
    status: 'checked_in',
    room_number: '301',
    nightly_rate: 650.00,
    promo_code: null,
    discount_pct: 0,
    addons: [{ name: 'Guaranteed 4 PM Late Check-Out', price: 75 }],
    subtotal: 2025.00,
    tax_amount: 253.13,
    total_amount: 2278.13,
    balance_due: 2278.13,
    channel: 'corporate',
    special_requests: 'Early check-in at 11 AM if possible.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    booking_ref: 'AUR-2026-0003',
    suite_id: 'a1000000-0000-0000-0000-000000000004',
    suite_name: 'Signature Deluxe King',
    guest_name: 'Elena Müller',
    guest_email: 'elena.muller@email.com',
    guest_phone: '+49-170-555-0103',
    vip_tier: 'gold',
    check_in: '2026-11-08',
    check_out: '2026-11-11',
    guests_count: 2,
    status: 'confirmed',
    room_number: null,
    nightly_rate: 420.00,
    promo_code: null,
    discount_pct: 0,
    addons: [],
    subtotal: 1260.00,
    tax_amount: 157.50,
    total_amount: 1417.50,
    balance_due: 1417.50,
    channel: 'booking_com',
    special_requests: 'Quiet room away from elevator.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    booking_ref: 'AUR-2026-0004',
    suite_id: 'a1000000-0000-0000-0000-000000000002',
    suite_name: 'Royal Lagoon Villa',
    guest_name: 'James Chen',
    guest_email: 'james.chen@email.com',
    guest_phone: '+1-415-555-0104',
    vip_tier: 'platinum',
    check_in: '2026-11-09',
    check_out: '2026-11-14',
    guests_count: 1,
    status: 'confirmed',
    room_number: null,
    nightly_rate: 950.00,
    promo_code: null,
    discount_pct: 0,
    addons: [{ name: 'Floating Champagne Breakfast', price: 120 }],
    subtotal: 4870.00,
    tax_amount: 608.75,
    total_amount: 5478.75,
    balance_due: 5478.75,
    channel: 'direct',
    special_requests: 'Need boardroom access for 3-hour meeting.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    booking_ref: 'AUR-2026-0005',
    suite_id: 'a1000000-0000-0000-0000-000000000001',
    suite_name: 'Presidential Ocean Penthouse',
    guest_name: 'Fatima Al-Rashid',
    guest_email: 'fatima.alrashid@email.com',
    guest_phone: '+971-50-555-0105',
    vip_tier: 'black',
    check_in: '2026-11-14',
    check_out: '2026-11-19',
    guests_count: 3,
    status: 'confirmed',
    room_number: null,
    nightly_rate: 1250.00,
    promo_code: null,
    discount_pct: 0,
    addons: [
      { name: 'Airport Chauffeur Pickup', price: 150 },
      { name: 'Couples Thermal Spa Pass', price: 200 },
      { name: 'Guaranteed 4 PM Late Check-Out', price: 75 }
    ],
    subtotal: 6675.00,
    tax_amount: 834.38,
    total_amount: 7509.38,
    balance_due: 7509.38,
    channel: 'direct',
    special_requests: 'Halal dining required. Private security detail (2 persons).'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    booking_ref: 'AUR-2026-0006',
    suite_id: 'a1000000-0000-0000-0000-000000000005',
    suite_name: 'Garden Terrace Loft',
    guest_name: 'Oluwaseun Adeyemi',
    guest_email: 'seun.adeyemi@email.com',
    guest_phone: '+234-803-555-0106',
    vip_tier: 'gold',
    check_in: '2026-11-10',
    check_out: '2026-11-15',
    guests_count: 2,
    status: 'confirmed',
    room_number: null,
    nightly_rate: 310.00,
    promo_code: 'DEV20',
    discount_pct: 20,
    addons: [
      { name: 'Floating Champagne Breakfast', price: 120 },
      { name: 'Couples Thermal Spa Pass', price: 200 }
    ],
    subtotal: 1560.00,
    tax_amount: 195.00,
    total_amount: 1755.00,
    balance_due: 1755.00,
    channel: 'direct',
    special_requests: 'Honeymoon — champagne and rose petals on arrival.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    booking_ref: 'AUR-2026-0007',
    suite_id: 'a1000000-0000-0000-0000-000000000006',
    suite_name: 'Classic Club Studio',
    guest_name: 'Sophie Dubois',
    guest_email: 'sophie.dubois@email.com',
    guest_phone: '+33-6-555-0107',
    vip_tier: 'silver',
    check_in: '2026-11-08',
    check_out: '2026-11-10',
    guests_count: 1,
    status: 'checked_in',
    room_number: '202',
    nightly_rate: 220.00,
    promo_code: null,
    discount_pct: 0,
    addons: [],
    subtotal: 440.00,
    tax_amount: 55.00,
    total_amount: 495.00,
    balance_due: 495.00,
    channel: 'expedia',
    special_requests: 'Travel blogger — may photograph room for publication.'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    booking_ref: 'AUR-2026-0008',
    suite_id: 'a1000000-0000-0000-0000-000000000006',
    suite_name: 'Classic Club Studio',
    guest_name: 'Kwame Asante',
    guest_email: 'kwame.asante@email.com',
    guest_phone: '+233-24-555-0108',
    vip_tier: 'member',
    check_in: '2026-11-11',
    check_out: '2026-11-13',
    guests_count: 1,
    status: 'confirmed',
    room_number: null,
    nightly_rate: 220.00,
    promo_code: null,
    discount_pct: 0,
    addons: [],
    subtotal: 440.00,
    tax_amount: 55.00,
    total_amount: 495.00,
    balance_due: 495.00,
    channel: 'corporate',
    special_requests: 'Corporate booking via Dangote Group.'
  }
];

let fallbackFolios = {
  'c1000000-0000-0000-0000-000000000001': [
    { id: 'f-1', category: 'room_charge', description: 'Presidential Ocean Penthouse — Night 1', amount: 1250.00, quantity: 1, is_paid: true },
    { id: 'f-2', category: 'room_service', description: 'Wagyu Steak Dinner for 2', amount: 185.00, quantity: 1, is_paid: true },
    { id: 'f-3', category: 'minibar', description: 'Dom Pérignon 2012', amount: 320.00, quantity: 1, is_paid: false },
    { id: 'f-4', category: 'spa', description: 'Couples Deep Tissue Massage (90 min)', amount: 280.00, quantity: 1, is_paid: false }
  ],
  'c1000000-0000-0000-0000-000000000002': [
    { id: 'f-5', category: 'room_charge', description: 'Executive Diplomatic Suite — Night 1', amount: 650.00, quantity: 1, is_paid: false },
    { id: 'f-6', category: 'room_service', description: 'Continental Breakfast', amount: 45.00, quantity: 1, is_paid: false },
    { id: 'f-7', category: 'laundry', description: 'Express Dry Cleaning — 3 items', amount: 65.00, quantity: 1, is_paid: false }
  ],
  'c1000000-0000-0000-0000-000000000007': [
    { id: 'f-8', category: 'room_charge', description: 'Classic Club Studio — Night 1', amount: 220.00, quantity: 1, is_paid: false },
    { id: 'f-9', category: 'minibar', description: 'Craft Beer Selection', amount: 24.00, quantity: 3, is_paid: false }
  ]
};

let fallbackHousekeeping = [
  { id: 'hk-101', room_number: '101', floor: 1, status: 'clean', attendant: 'Ngozi Eze', priority: 'normal', notes: null, last_cleaned: '2026-11-08 06:00:00+01' },
  { id: 'hk-102', room_number: '102', floor: 1, status: 'clean', attendant: 'Ngozi Eze', priority: 'normal', notes: null, last_cleaned: '2026-11-08 06:30:00+01' },
  { id: 'hk-103', room_number: '103', floor: 1, status: 'dirty', attendant: null, priority: 'normal', notes: 'Guest checkout at 11 AM', last_cleaned: null },
  { id: 'hk-104', room_number: '104', floor: 1, status: 'maintenance', attendant: null, priority: 'high', notes: 'AC unit replacement — ETA 2 days', last_cleaned: null },
  { id: 'hk-201', room_number: '201', floor: 2, status: 'clean', attendant: 'Blessing Obi', priority: 'normal', notes: null, last_cleaned: '2026-11-08 07:00:00+01' },
  { id: 'hk-202', room_number: '202', floor: 2, status: 'in_progress', attendant: 'Blessing Obi', priority: 'normal', notes: 'Guest checked in — turndown', last_cleaned: null },
  { id: 'hk-203', room_number: '203', floor: 2, status: 'dirty', attendant: null, priority: 'normal', notes: 'Checkout expected today', last_cleaned: null },
  { id: 'hk-204', room_number: '204', floor: 2, status: 'clean', attendant: 'Blessing Obi', priority: 'normal', notes: null, last_cleaned: '2026-11-08 07:30:00+01' },
  { id: 'hk-301', room_number: '301', floor: 3, status: 'clean', attendant: 'Emeka Nnamdi', priority: 'vip', notes: 'VIP guest — Aisha Bello', last_cleaned: '2026-11-08 05:30:00+01' },
  { id: 'hk-302', room_number: '302', floor: 3, status: 'dirty', attendant: null, priority: 'normal', notes: 'Awaiting arrival — Elena Müller', last_cleaned: null },
  { id: 'hk-303', room_number: '303', floor: 3, status: 'clean', attendant: 'Emeka Nnamdi', priority: 'normal', notes: null, last_cleaned: '2026-11-08 08:00:00+01' },
  { id: 'hk-304', room_number: '304', floor: 3, status: 'maintenance', attendant: null, priority: 'low', notes: 'Bathroom tile grouting', last_cleaned: null },
  { id: 'hk-401', room_number: '401', floor: 4, status: 'clean', attendant: 'Tunde Bakare', priority: 'vip', notes: 'Black Tier VIP — Chidi Okafor', last_cleaned: '2026-11-08 05:00:00+01' },
  { id: 'hk-402', room_number: '402', floor: 4, status: 'dirty', attendant: null, priority: 'high', notes: 'Deep clean before VIP arrival', last_cleaned: null },
  { id: 'hk-403', room_number: '403', floor: 4, status: 'clean', attendant: 'Tunde Bakare', priority: 'normal', notes: null, last_cleaned: '2026-11-08 08:30:00+01' },
  { id: 'hk-404', room_number: '404', floor: 4, status: 'in_progress', attendant: 'Tunde Bakare', priority: 'normal', notes: 'Restocking minibar', last_cleaned: null }
];

const fallbackAnalytics = {
  kpis: {
    occupancy_rate: 87.5,
    occupancy_trend: '+4.2% vs last week',
    adr_usd: 685.00,
    adr_trend: '+8.1% vs last month',
    revpar_usd: 599.38,
    revpar_trend: '+12.4% YoY',
    monthly_revenue_usd: 287400.00,
    monthly_revenue_trend: '+15.3% ahead of target'
  },
  trend_14d: [
    { date: '10/26', occupancy: 72, revenue: 14200 },
    { date: '10/27', occupancy: 75, revenue: 15400 },
    { date: '10/28', occupancy: 80, revenue: 17800 },
    { date: '10/29', occupancy: 82, revenue: 18100 },
    { date: '10/30', occupancy: 88, revenue: 21500 },
    { date: '10/31', occupancy: 95, revenue: 24800 },
    { date: '11/01', occupancy: 92, revenue: 23600 },
    { date: '11/02', occupancy: 85, revenue: 19400 },
    { date: '11/03', occupancy: 78, revenue: 16800 },
    { date: '11/04', occupancy: 84, revenue: 18900 },
    { date: '11/05', occupancy: 89, revenue: 22100 },
    { date: '11/06', occupancy: 94, revenue: 25400 },
    { date: '11/07', occupancy: 91, revenue: 24100 },
    { date: '11/08', occupancy: 88, revenue: 22800 }
  ],
  channel_mix: [
    { channel: 'Direct / Brand Website', percentage: 48, count: 54, color: '#D4AF37' },
    { channel: 'Booking.com', percentage: 24, count: 27, color: '#3B82F6' },
    { channel: 'Corporate Accounts', percentage: 18, count: 20, color: '#10B981' },
    { channel: 'Expedia / GDS', percentage: 10, count: 11, color: '#F59E0B' }
  ],
  ai_pricing_recommendation: {
    title: 'Weekend Surge & Penthouse Yield Adjustment',
    headline: 'High demand detected for upcoming weekend (Nov 14-16)',
    suggestion: 'Recommend increasing Presidential Penthouse & Royal Villa base rates by 18% (+$225/night) due to the Lagos Tech Summit and private charter bookings. Studio availability is tight at 95% forecast occupancy. Apply a 2-night minimum length-of-stay (MLOS) restriction across Deluxe King suites to maximize yield.'
  }
};

async function safeFetch(url, options = {}, fallbackFn) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    // Normalize: server returns raw array OR { data: [...] } or { suites: [...] }
    if (Array.isArray(json)) {
      return { success: true, data: json };
    }
    if (json && Array.isArray(json.data)) return json;
    if (json && Array.isArray(json.suites)) return { success: true, data: json.suites };
    if (json && Array.isArray(json.reservations)) return { success: true, data: json.reservations };
    if (json && Array.isArray(json.items)) return { success: true, data: json.items, ...json };
    return { success: true, data: json, ...json };
  } catch (err) {
    console.warn(`[PMS Hybrid Layer] Fetch to ${url} failed or offline, using fallback state:`, err.message);
    return fallbackFn();
  }
}

export const api = {
  getSuites: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/api/suites${query ? '?' + query : ''}`, {}, () => {
      let filtered = [...fallbackSuites];
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter(s => s.category.toLowerCase() === params.category.toLowerCase());
      }
      return { success: true, data: filtered };
    });
  },

  getSuite: (id) => {
    return safeFetch(`${API_BASE}/api/suites/${id}`, {}, () => {
      const suite = fallbackSuites.find(s => s.id === id || s.slug === id);
      return { success: !!suite, data: suite };
    });
  },

  getReservations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/api/reservations${query ? '?' + query : ''}`, {}, () => {
      let filtered = [...fallbackReservations];
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(r => r.status === params.status);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(r => 
          r.booking_ref.toLowerCase().includes(s) || 
          r.guest_name.toLowerCase().includes(s)
        );
      }
      return { success: true, data: filtered };
    });
  },

  createReservation: (data) => {
    return safeFetch(`${API_BASE}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const newRes = {
        id: `c-demo-${Date.now()}`,
        booking_ref: `AUR-2026-${randNum}`,
        suite_id: data.suite_id,
        suite_name: data.suite_name || 'Signature Suite',
        guest_name: `${data.first_name} ${data.last_name}`,
        guest_email: data.email,
        guest_phone: data.phone,
        vip_tier: data.vip_tier || 'member',
        check_in: data.check_in,
        check_out: data.check_out,
        guests_count: data.guests_count || 1,
        status: 'confirmed',
        room_number: data.room_number || null,
        nightly_rate: data.nightly_rate || 500,
        promo_code: data.promo_code || null,
        discount_pct: data.discount_pct || 0,
        addons: data.addons || [],
        subtotal: data.subtotal,
        tax_amount: data.tax_amount,
        total_amount: data.total_amount,
        balance_due: 0,
        channel: 'direct',
        special_requests: data.special_requests || 'Direct online booking'
      };
      fallbackReservations.unshift(newRes);
      return { success: true, data: newRes };
    });
  },

  updateReservation: (id, data) => {
    return safeFetch(`${API_BASE}/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const idx = fallbackReservations.findIndex(r => r.id === id);
      if (idx !== -1) {
        fallbackReservations[idx] = { ...fallbackReservations[idx], ...data };
        return { success: true, data: fallbackReservations[idx] };
      }
      return { success: false, error: 'Not found' };
    });
  },

  getFolio: (resId) => {
    return safeFetch(`${API_BASE}/api/folio/${resId}`, {}, () => {
      const items = fallbackFolios[resId] || [
        { id: `f-${resId}-1`, category: 'room_charge', description: 'Room Charge (Full Stay)', amount: 650.00, quantity: 1, is_paid: true }
      ];
      const total = items.reduce((acc, it) => acc + (it.amount * (it.quantity || 1)), 0);
      const paid = items.filter(it => it.is_paid).reduce((acc, it) => acc + (it.amount * (it.quantity || 1)), 0);
      return {
        success: true,
        data: {
          reservation_id: resId,
          items,
          total,
          paid,
          balance_due: Math.max(0, total - paid)
        }
      };
    });
  },

  addFolioItem: (resId, data) => {
    return safeFetch(`${API_BASE}/api/folio/${resId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      if (!fallbackFolios[resId]) fallbackFolios[resId] = [];
      const newItem = {
        id: `f-${Date.now()}`,
        category: data.category || 'other',
        description: data.description,
        amount: Number(data.amount) || 0,
        quantity: Number(data.quantity) || 1,
        is_paid: false
      };
      fallbackFolios[resId].push(newItem);
      return { success: true, data: newItem };
    });
  },

  settleFolio: (resId) => {
    return safeFetch(`${API_BASE}/api/folio/${resId}/settle`, {
      method: 'PATCH'
    }, () => {
      if (fallbackFolios[resId]) {
        fallbackFolios[resId] = fallbackFolios[resId].map(it => ({ ...it, is_paid: true }));
      }
      const resIdx = fallbackReservations.findIndex(r => r.id === resId);
      if (resIdx !== -1) {
        fallbackReservations[resIdx].balance_due = 0;
      }
      return { success: true, message: 'Folio balance fully settled' };
    });
  },

  getHousekeeping: () => {
    return safeFetch(`${API_BASE}/api/housekeeping`, {}, () => {
      return { success: true, data: fallbackHousekeeping };
    });
  },

  updateHousekeeping: (room, data) => {
    return safeFetch(`${API_BASE}/api/housekeeping/${room}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const idx = fallbackHousekeeping.findIndex(h => h.room_number === String(room));
      if (idx !== -1) {
        fallbackHousekeeping[idx] = { ...fallbackHousekeeping[idx], ...data };
        return { success: true, data: fallbackHousekeeping[idx] };
      }
      return { success: false, error: 'Room not found' };
    });
  },

  getAnalytics: () => {
    return safeFetch(`${API_BASE}/api/analytics`, {}, () => {
      return { success: true, data: fallbackAnalytics };
    });
  },

  askConcierge: (data) => {
    return safeFetch(`${API_BASE}/api/concierge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const msg = (data.message || '').toLowerCase();
      let response = "Welcome to The Aurelia Grand & Suites. As your private AI Concierge, I am delighted to curate every moment of your stay. How may I be of service today?";

      if (msg.includes('recommend') || msg.includes('suite')) {
        response = "For an unrivaled ultra-luxury experience, I warmly recommend our Presidential Ocean Penthouse on Floor 4. It boasts 2,800 sq ft of private opulence, a cliffside infinity pool, dedicated 24-hour butler, and helipad reception. For tranquil privacy, the Royal Lagoon Villa is our secluded oasis.";
      } else if (msg.includes('lagos') || msg.includes('itinerary') || msg.includes('vi') || msg.includes('victoria island')) {
        response = "Here is your bespoke 3-day Victoria Island itinerary:\n\n• Day 1: Sunset cocktail on our Aurelia Horizon Helipad, followed by private omakase dining at Nok by Alara.\n• Day 2: Private catamaran cruise across Tarkwa Bay and Lagos Lagoon, followed by a VIP spa treatment at our Thermal Suite.\n• Day 3: Contemporary art tour through Nike Art Gallery and Terra Kulture, concluded with dinner at RSVP Lagos.";
      } else if (msg.includes('dining') || msg.includes('restaurant') || msg.includes('eat') || msg.includes('food')) {
        response = "The Aurelia Grand offers three signature culinary experiences:\n1. 'L'Orangerie' — Michelin-starred French-West African fusion.\n2. 'The Obsidian Lounge' — Handcrafted single-origin cocktails and caviar service.\n3. 'Lagoon Terrace' — Fresh Atlantic seafood grilled over charcoal.";
      } else if (msg.includes('spa') || msg.includes('massage')) {
        response = "Our Thermal Spa is open 7:00 AM – 10:00 PM. We offer couples massages, Finnish saunas, Himalayan salt inhalation rooms, and private thermal plunge pools. Would you like me to reserve a session for you?";
      }

      return {
        success: true,
        data: {
          reply: response,
          timestamp: new Date().toISOString()
        }
      };
    });
  }
};
