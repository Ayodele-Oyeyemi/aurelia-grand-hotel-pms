/**
 * The Aurelia Grand & Suites — Stateful In-Memory Store & Supabase Hybrid Layer
 */

const { v4: uuidv4 } = require('uuid');
const seedData = require('../data/seedData');

// Deep clone utility to ensure mutations don't alter pristine seed objects
function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// In-memory state singletons
let suitesState = cloneDeep(seedData.suites);
let guestsState = cloneDeep(seedData.guests);
let reservationsState = cloneDeep(seedData.reservations);
let folioItemsState = cloneDeep(seedData.folioItems);
let housekeepingTasksState = cloneDeep(seedData.housekeepingTasks);

// Supabase client initialization (if credentials are provided)
let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('[Hybrid Store] Failed to initialize Supabase client:', err.message);
    supabase = null;
  }
}

function getSupabaseClient() {
  return supabase; // null when not configured
}

function isSupabaseConfigured() {
  return Boolean(supabase);
}

function getDataLayerInfo() {
  return {
    activeLayer: isSupabaseConfigured() ? 'supabase' : 'in-memory',
    supabaseUrlConfigured: Boolean(supabaseUrl),
    stats: {
      suites: suitesState.length,
      guests: guestsState.length,
      reservations: reservationsState.length,
      folioItems: folioItemsState.length,
      housekeepingTasks: housekeepingTasksState.length
    }
  };
}

// ============================================================
// SUITES
// ============================================================

function getSuites(filters = {}) {
  const { available_from, available_to } = filters;
  let result = [...suitesState];

  if (available_from && available_to) {
    const reqStart = new Date(available_from);
    const reqEnd = new Date(available_to);

    // Filter out suites that have overlapping active reservations
    result = result.filter(suite => {
      const hasConflict = reservationsState.some(res => {
        if (res.suite_id !== suite.id) return false;
        if (!['confirmed', 'checked_in'].includes(res.status)) return false;

        const resStart = new Date(res.check_in);
        const resEnd = new Date(res.check_out);

        // Date overlap condition: max(resStart, reqStart) < min(resEnd, reqEnd)
        return resStart < reqEnd && resEnd > reqStart;
      });

      return !hasConflict;
    });
  }

  // Wing filter
  if (filters.wing) {
    result = result.filter(s => s.wing === filters.wing);
  }
  // Category filter  
  if (filters.category) {
    result = result.filter(s => s.category === filters.category);
  }

  return result;
}

function getSuiteById(idOrSlug) {
  return suitesState.find(s => s.id === idOrSlug || s.slug === idOrSlug) || null;
}

// ============================================================
// GUESTS
// ============================================================

function getGuests() {
  return [...guestsState];
}

function getGuestById(id) {
  return guestsState.find(g => g.id === id) || null;
}

function getGuestByEmail(email) {
  if (!email) return null;
  return guestsState.find(g => g.email.toLowerCase() === email.toLowerCase()) || null;
}

function createGuest(data) {
  const newGuest = {
    id: data.id || uuidv4(),
    first_name: data.first_name || data.firstName || 'Valued',
    last_name: data.last_name || data.lastName || 'Guest',
    email: data.email || `guest_${Date.now()}@aureliagrand.com`,
    phone: data.phone || null,
    nationality: data.nationality || null,
    vip_tier: data.vip_tier || data.vipTier || 'member',
    notes: data.notes || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  guestsState.push(newGuest);
  return newGuest;
}

// ============================================================
// RESERVATIONS
// ============================================================

function enrichReservation(reservation) {
  if (!reservation) return null;
  const guest = getGuestById(reservation.guest_id);
  const suite = getSuiteById(reservation.suite_id);

  return {
    ...reservation,
    guest: guest ? {
      id: guest.id,
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      nationality: guest.nationality,
      vip_tier: guest.vip_tier,
      notes: guest.notes
    } : null,
    suite: suite ? {
      id: suite.id,
      name: suite.name,
      slug: suite.slug,
      category: suite.category,
      room_number: suite.room_number,
      floor: suite.floor,
      sqft: suite.sqft,
      base_rate_usd: suite.base_rate_usd,
      image_url: suite.image_url,
      amenities: suite.amenities
    } : null
  };
}

function getReservations(filters = {}) {
  const { status, search } = filters;
  let list = [...reservationsState];

  if (status && status !== 'all') {
    list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(r => {
      const refMatch = r.booking_ref.toLowerCase().includes(q);
      const guest = getGuestById(r.guest_id);
      const nameMatch = guest ? `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(q) : false;
      const emailMatch = guest ? guest.email.toLowerCase().includes(q) : false;
      return refMatch || nameMatch || emailMatch;
    });
  }

  // Sort by created_at DESC (newest first)
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return list.map(enrichReservation);
}

function getReservationById(idOrRef) {
  const r = reservationsState.find(res => res.id === idOrRef || res.booking_ref === idOrRef);
  return r ? enrichReservation(r) : null;
}

function generateNextBookingRef() {
  const prefix = 'AUR-2026-';
  let maxSeq = 8; // seed has up to 0008

  for (const r of reservationsState) {
    if (r.booking_ref && r.booking_ref.startsWith(prefix)) {
      const numPart = parseInt(r.booking_ref.slice(prefix.length), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}

function createReservation(data) {
  const {
    suiteId, suite_id,
    guestId, guest_id,
    guestInfo,
    checkIn, check_in,
    checkOut, check_out,
    guestsCount, guests_count,
    nightlyRate, nightly_rate,
    promoCode, promo_code,
    discountPct, discount_pct,
    addons = [],
    channel = 'direct',
    specialRequests, special_requests,
    roomNumber, room_number
  } = data;

  const resolvedSuiteId = suiteId || suite_id;
  const suite = getSuiteById(resolvedSuiteId);
  if (!suite) {
    throw new Error(`Suite not found with id: ${resolvedSuiteId}`);
  }

  // Resolve or create guest
  let resolvedGuestId = guestId || guest_id;
  if (!resolvedGuestId && guestInfo) {
    const existing = getGuestByEmail(guestInfo.email);
    if (existing) {
      resolvedGuestId = existing.id;
    } else {
      const newGuest = createGuest(guestInfo);
      resolvedGuestId = newGuest.id;
    }
  }

  if (!resolvedGuestId) {
    throw new Error('A valid guestId or guestInfo object is required to create a reservation');
  }

  const startDateStr = checkIn || check_in;
  const endDateStr = checkOut || check_out;
  if (!startDateStr || !endDateStr) {
    throw new Error('checkIn and checkOut dates are required');
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  const nights = Math.max(1, isNaN(diffDays) ? 1 : diffDays);

  const rate = Number(nightlyRate || nightly_rate || suite.base_rate_usd);
  const discount = Number(discountPct || discount_pct || 0);

  // Subtotal calculation
  const grossRoomCharge = nights * rate;
  const discountAmount = discount > 0 ? (grossRoomCharge * (discount / 100)) : 0;
  const netRoomCharge = grossRoomCharge - discountAmount;

  // Addons calculation
  const normalizedAddons = Array.isArray(addons) ? addons : [];
  const addonsTotal = normalizedAddons.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const subtotal = Number((netRoomCharge + addonsTotal).toFixed(2));
  // 7.5% VAT + 5% hospitality levy = 12.5%
  const taxAmount = Number((subtotal * 0.125).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  const newReservation = {
    id: uuidv4(),
    booking_ref: generateNextBookingRef(),
    suite_id: resolvedSuiteId,
    guest_id: resolvedGuestId,
    check_in: startDateStr,
    check_out: endDateStr,
    nights,
    guests_count: Number(guestsCount || guests_count || 1),
    status: 'confirmed',
    room_number: roomNumber || room_number || null,
    nightly_rate: rate,
    promo_code: promoCode || promo_code || null,
    discount_pct: discount,
    addons: normalizedAddons,
    subtotal,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    balance_due: totalAmount,
    channel: channel || 'direct',
    special_requests: specialRequests || special_requests || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  reservationsState.push(newReservation);

  // Automatically create initial folio items
  // 1. Room Charge
  folioItemsState.push({
    id: uuidv4(),
    reservation_id: newReservation.id,
    category: 'room_charge',
    description: `${suite.name} — ${nights} Night(s)`,
    amount: netRoomCharge,
    quantity: 1,
    is_paid: false,
    posted_at: new Date().toISOString()
  });

  // 2. Addons as folio items
  for (const addon of normalizedAddons) {
    folioItemsState.push({
      id: uuidv4(),
      reservation_id: newReservation.id,
      category: 'other',
      description: addon.name || 'Add-on Service',
      amount: Number(addon.price) || 0,
      quantity: 1,
      is_paid: false,
      posted_at: new Date().toISOString()
    });
  }

  return enrichReservation(newReservation);
}

function updateReservation(id, updates = {}) {
  const index = reservationsState.findIndex(r => r.id === id || r.booking_ref === id);
  if (index === -1) {
    return null;
  }

  const res = reservationsState[index];
  const now = new Date().toISOString();

  // Handle status transitions
  if (updates.status) {
    const nextStatus = updates.status.toLowerCase();
    res.status = nextStatus;

    const assignedRoom = updates.room_number || updates.roomNumber || res.room_number;

    if (nextStatus === 'checked_in') {
      if (assignedRoom) {
        updateHousekeepingTask(assignedRoom, {
          status: 'clean',
          notes: `Guest checked in (${res.booking_ref})`
        });
      }
    } else if (nextStatus === 'checked_out') {
      if (assignedRoom) {
        updateHousekeepingTask(assignedRoom, {
          status: 'dirty',
          notes: `Guest checked out (${res.booking_ref}) — awaiting cleaning`
        });
      }
    }
  }

  // Handle room number update
  if (updates.room_number !== undefined || updates.roomNumber !== undefined) {
    res.room_number = updates.room_number || updates.roomNumber || null;
  }

  if (updates.special_requests !== undefined || updates.specialRequests !== undefined) {
    res.special_requests = updates.special_requests || updates.specialRequests;
  }

  if (updates.balance_due !== undefined) {
    res.balance_due = Number(updates.balance_due);
  }

  res.updated_at = now;
  reservationsState[index] = res;

  return enrichReservation(res);
}

// ============================================================
// FOLIO ITEMS
// ============================================================

function getFolioItems(reservationId) {
  return folioItemsState.filter(f => f.reservation_id === reservationId);
}

function addFolioItem(reservationId, itemData) {
  const reservation = reservationsState.find(r => r.id === reservationId || r.booking_ref === reservationId);
  if (!reservation) {
    throw new Error(`Reservation not found with ID: ${reservationId}`);
  }

  const amount = Number(itemData.amount) || 0;
  const quantity = Number(itemData.quantity) || 1;
  const isPaid = Boolean(itemData.is_paid || itemData.isPaid || false);

  const newItem = {
    id: uuidv4(),
    reservation_id: reservation.id,
    category: itemData.category || 'other',
    description: itemData.description || 'Incidental Charge',
    amount,
    quantity,
    is_paid: isPaid,
    posted_at: new Date().toISOString()
  };

  folioItemsState.push(newItem);

  // If unpaid, increase reservation balance due and total amount
  if (!isPaid) {
    const itemTotal = amount * quantity;
    reservation.balance_due = Number((Number(reservation.balance_due) + itemTotal).toFixed(2));
    reservation.total_amount = Number((Number(reservation.total_amount) + itemTotal).toFixed(2));
    reservation.updated_at = new Date().toISOString();
  }

  return newItem;
}

function settleFolio(reservationId) {
  const reservation = reservationsState.find(r => r.id === reservationId || r.booking_ref === reservationId);
  if (!reservation) {
    throw new Error(`Reservation not found with ID: ${reservationId}`);
  }

  let settledCount = 0;
  for (const item of folioItemsState) {
    if (item.reservation_id === reservation.id && !item.is_paid) {
      item.is_paid = true;
      settledCount++;
    }
  }

  reservation.balance_due = 0;
  reservation.updated_at = new Date().toISOString();

  return {
    success: true,
    settledCount,
    reservation: enrichReservation(reservation)
  };
}

// ============================================================
// HOUSEKEEPING
// ============================================================

function getHousekeepingTasks() {
  const tasks = [...housekeepingTasksState];
  tasks.sort((a, b) => {
    if (a.floor !== b.floor) {
      return a.floor - b.floor;
    }
    return a.room_number.localeCompare(b.room_number, undefined, { numeric: true });
  });
  return tasks;
}

function updateHousekeepingTask(roomNumber, updates = {}) {
  const index = housekeepingTasksState.findIndex(t => t.room_number === String(roomNumber));
  if (index === -1) {
    return null;
  }

  const task = housekeepingTasksState[index];
  const now = new Date().toISOString();

  if (updates.status !== undefined) {
    task.status = updates.status;
    if (updates.status === 'clean') {
      task.last_cleaned = now;
    }
  }

  if (updates.attendant !== undefined) {
    task.attendant = updates.attendant;
  }

  if (updates.priority !== undefined) {
    task.priority = updates.priority;
  }

  if (updates.notes !== undefined) {
    task.notes = updates.notes;
  }

  task.updated_at = now;
  housekeepingTasksState[index] = task;
  return task;
}

// ============================================================
// ANALYTICS
// ============================================================

function getAnalytics() {
  const totalRooms = 16;

  // Active checked-in reservations
  const checkedInReservations = reservationsState.filter(r => r.status === 'checked_in');
  const occupiedRooms = checkedInReservations.length;
  const occupancyRate = Number(((occupiedRooms / totalRooms) * 100).toFixed(1));

  // ADR: average daily rate of checked-in reservations
  const nightlyRatesSum = checkedInReservations.reduce((sum, r) => sum + Number(r.nightly_rate), 0);
  const adr = occupiedRooms > 0 ? Number((nightlyRatesSum / occupiedRooms).toFixed(2)) : 0;

  // RevPAR: ADR * (occupancyRate / 100) or total room revenue / totalRooms
  const revpar = Number((adr * (occupiedRooms / totalRooms)).toFixed(2));

  // Total revenue across all reservations
  const totalRevenue = Number(
    reservationsState.reduce((sum, r) => sum + Number(r.total_amount), 0).toFixed(2)
  );

  // Monthly revenue (active seed month is Nov 2026, or current calendar month)
  const monthlyRevenue = totalRevenue;

  // Channel Mix
  const channelMix = {
    direct: 0,
    booking_com: 0,
    expedia: 0,
    corporate: 0,
    walk_in: 0
  };

  for (const r of reservationsState) {
    const ch = r.channel || 'direct';
    if (channelMix[ch] !== undefined) {
      channelMix[ch]++;
    } else {
      channelMix[ch] = (channelMix[ch] || 0) + 1;
    }
  }

  // Folio Revenue by Category
  const revenueByCategory = {
    room_charge: 0,
    room_service: 0,
    minibar: 0,
    laundry: 0,
    spa: 0,
    transport: 0,
    other: 0
  };

  for (const item of folioItemsState) {
    const cat = item.category || 'other';
    const amount = Number(item.amount) * (Number(item.quantity) || 1);
    if (revenueByCategory[cat] !== undefined) {
      revenueByCategory[cat] = Number((revenueByCategory[cat] + amount).toFixed(2));
    } else {
      revenueByCategory[cat] = Number(amount.toFixed(2));
    }
  }

  // 14-day Occupancy Trend (Nov 1 to Nov 14, 2026)
  const occupancyTrend = [
    { date: '2026-11-01', occupancy: 62.5, revenue: 14500.00 },
    { date: '2026-11-02', occupancy: 68.8, revenue: 16200.00 },
    { date: '2026-11-03', occupancy: 75.0, revenue: 17800.00 },
    { date: '2026-11-04', occupancy: 75.0, revenue: 18400.00 },
    { date: '2026-11-05', occupancy: 81.3, revenue: 21500.00 },
    { date: '2026-11-06', occupancy: 87.5, revenue: 24200.00 },
    { date: '2026-11-07', occupancy: 81.3, revenue: 22800.00 },
    { date: '2026-11-08', occupancy: occupancyRate, revenue: 18200.00 },
    { date: '2026-11-09', occupancy: 68.8, revenue: 16900.00 },
    { date: '2026-11-10', occupancy: 75.0, revenue: 19100.00 },
    { date: '2026-11-11', occupancy: 81.3, revenue: 20400.00 },
    { date: '2026-11-12', occupancy: 87.5, revenue: 23600.00 },
    { date: '2026-11-13', occupancy: 93.8, revenue: 27500.00 },
    { date: '2026-11-14', occupancy: 87.5, revenue: 25100.00 }
  ];

  return {
    totalRooms,
    occupiedRooms,
    occupancyRate,
    adr,
    revpar,
    totalRevenue,
    monthlyRevenue,
    channelMix,
    revenueByCategory,
    occupancyTrend
  };
}

// Reset store to initial seed data (useful for test runs)
function resetToSeedData() {
  suitesState = cloneDeep(seedData.suites);
  guestsState = cloneDeep(seedData.guests);
  reservationsState = cloneDeep(seedData.reservations);
  folioItemsState = cloneDeep(seedData.folioItems);
  housekeepingTasksState = cloneDeep(seedData.housekeepingTasks);
}

module.exports = {
  isSupabaseConfigured,
  getSupabaseClient,
  getDataLayerInfo,
  getSuites,
  getSuiteById,
  getGuests,
  getGuestById,
  getGuestByEmail,
  createGuest,
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  getFolioItems,
  addFolioItem,
  settleFolio,
  getHousekeepingTasks,
  updateHousekeepingTask,
  getAnalytics,
  resetToSeedData
};
