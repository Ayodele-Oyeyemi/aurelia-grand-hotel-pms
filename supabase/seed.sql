-- ============================================================
-- The Aurelia Grand & Suites — Seed Data
-- ============================================================

-- ============================================================
-- 1. SUITES (6 Luxury Suites)
-- ============================================================
INSERT INTO suites (id, name, slug, category, floor, room_number, sqft, base_rate_usd, max_guests, amenities, description, image_url) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Presidential Ocean Penthouse', 'presidential-ocean-penthouse', 'penthouse', 4, '401', 2800, 1250.00, 4,
   ARRAY['Ocean View','Private Infinity Pool','Butler Service','Grand Piano','Helipad Access','Wine Cellar'],
   'The crown jewel of The Aurelia Grand. A sprawling 2,800 sq ft penthouse with 270° Atlantic ocean views, private infinity pool, dedicated butler, and exclusive helipad access.',
   'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),

  ('a1000000-0000-0000-0000-000000000002', 'Royal Lagoon Villa', 'royal-lagoon-villa', 'villa', 4, '402', 2200, 950.00, 4,
   ARRAY['Lagoon View','Private Garden','Outdoor Shower','Jacuzzi','Kitchenette','Fireplace'],
   'A secluded 2,200 sq ft villa overlooking the lagoon with a private tropical garden, outdoor rain shower, and heated jacuzzi.',
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),

  ('a1000000-0000-0000-0000-000000000003', 'Executive Diplomatic Suite', 'executive-diplomatic-suite', 'suite', 3, '301', 1600, 650.00, 3,
   ARRAY['City View','Boardroom','Lounge Area','Nespresso Machine','Smart Home','Premium Minibar'],
   'A 1,600 sq ft power suite designed for heads of state and C-suite executives, featuring a private boardroom and smart home controls.',
   'https://images.unsplash.com/photo-1590490360182-c33d955e5310?w=800'),

  ('a1000000-0000-0000-0000-000000000004', 'Signature Deluxe King', 'signature-deluxe-king', 'deluxe', 3, '302', 1100, 420.00, 2,
   ARRAY['Harbor View','Rain Shower','Work Desk','Pillow Menu','Evening Turndown','Complimentary Breakfast'],
   'An elegant 1,100 sq ft retreat with panoramic harbor views, Italian marble bathroom, and curated pillow menu.',
   'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),

  ('a1000000-0000-0000-0000-000000000005', 'Garden Terrace Loft', 'garden-terrace-loft', 'loft', 2, '201', 900, 310.00, 2,
   ARRAY['Garden View','Private Terrace','Daybed','Reading Nook','Bluetooth Speaker','Organic Toiletries'],
   'A charming 900 sq ft split-level loft with a private terrace overlooking the botanical gardens.',
   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),

  ('a1000000-0000-0000-0000-000000000006', 'Classic Club Studio', 'classic-club-studio', 'studio', 2, '202', 650, 220.00, 2,
   ARRAY['Pool View','Club Lounge Access','Smart TV','USB Charging','Rainfall Shower','Fitness Center'],
   'A smart 650 sq ft studio with pool views and complimentary access to the exclusive Club Lounge.',
   'https://images.unsplash.com/photo-1612320648774-0a26f863e55a?w=800');

-- ============================================================
-- 2. GUESTS (8 Profiles)
-- ============================================================
INSERT INTO guests (id, first_name, last_name, email, phone, nationality, vip_tier, notes) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Chidi', 'Okafor', 'chidi.okafor@email.com', '+234-801-555-0101', 'Nigerian', 'black', 'Black Tier VIP. Prefers ocean-facing suites. Allergic to shellfish.'),
  ('b1000000-0000-0000-0000-000000000002', 'Aisha', 'Bello', 'aisha.bello@email.com', '+234-802-555-0102', 'Nigerian', 'platinum', 'Platinum member. Frequent business traveler. Early check-in preferred.'),
  ('b1000000-0000-0000-0000-000000000003', 'Elena', 'Müller', 'elena.muller@email.com', '+49-170-555-0103', 'German', 'gold', 'Gold member. Prefers quiet rooms. Requests extra towels.'),
  ('b1000000-0000-0000-0000-000000000004', 'James', 'Chen', 'james.chen@email.com', '+1-415-555-0104', 'American', 'platinum', 'Platinum member. Tech CEO. Needs fast WiFi and boardroom access.'),
  ('b1000000-0000-0000-0000-000000000005', 'Fatima', 'Al-Rashid', 'fatima.alrashid@email.com', '+971-50-555-0105', 'Emirati', 'black', 'Black Tier VIP. Halal dining required. Travels with private security.'),
  ('b1000000-0000-0000-0000-000000000006', 'Oluwaseun', 'Adeyemi', 'seun.adeyemi@email.com', '+234-803-555-0106', 'Nigerian', 'gold', 'Gold member. Honeymoon trip. Requested champagne on arrival.'),
  ('b1000000-0000-0000-0000-000000000007', 'Sophie', 'Dubois', 'sophie.dubois@email.com', '+33-6-555-0107', 'French', 'silver', 'Silver member. Travel blogger. May photograph rooms for publication.'),
  ('b1000000-0000-0000-0000-000000000008', 'Kwame', 'Asante', 'kwame.asante@email.com', '+233-24-555-0108', 'Ghanaian', 'member', 'New guest. Corporate booking via Dangote Group.');

-- ============================================================
-- 3. RESERVATIONS (8 Active / Upcoming)
-- ============================================================
INSERT INTO reservations (id, booking_ref, suite_id, guest_id, check_in, check_out, guests_count, status, room_number, nightly_rate, promo_code, discount_pct, addons, subtotal, tax_amount, total_amount, balance_due, channel, special_requests) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'AUR-2026-0001',
   'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   '2026-11-08', '2026-11-13', 2, 'checked_in', '401', 1250.00, NULL, 0,
   '[{"name":"Airport Chauffeur Pickup","price":150},{"name":"Couples Thermal Spa Pass","price":200}]',
   6600.00, 825.00, 7425.00, 0, 'direct', 'Ocean-facing suite. Shellfish-free minibar.'),

  ('c1000000-0000-0000-0000-000000000002', 'AUR-2026-0002',
   'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002',
   '2026-11-07', '2026-11-10', 1, 'checked_in', '301', 650.00, NULL, 0,
   '[{"name":"Guaranteed 4 PM Late Check-Out","price":75}]',
   2025.00, 253.13, 2278.13, 2278.13, 'corporate', 'Early check-in at 11 AM if possible.'),

  ('c1000000-0000-0000-0000-000000000003', 'AUR-2026-0003',
   'a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003',
   '2026-11-08', '2026-11-11', 2, 'confirmed', NULL, 420.00, NULL, 0, '[]',
   1260.00, 157.50, 1417.50, 1417.50, 'booking_com', 'Quiet room away from elevator.'),

  ('c1000000-0000-0000-0000-000000000004', 'AUR-2026-0004',
   'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004',
   '2026-11-09', '2026-11-14', 1, 'confirmed', NULL, 950.00, NULL, 0,
   '[{"name":"Floating Champagne Breakfast","price":120}]',
   4870.00, 608.75, 5478.75, 5478.75, 'direct', 'Need boardroom access for 3-hour meeting.'),

  ('c1000000-0000-0000-0000-000000000005', 'AUR-2026-0005',
   'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000005',
   '2026-11-14', '2026-11-19', 3, 'confirmed', NULL, 1250.00, NULL, 0,
   '[{"name":"Airport Chauffeur Pickup","price":150},{"name":"Couples Thermal Spa Pass","price":200},{"name":"Guaranteed 4 PM Late Check-Out","price":75}]',
   6675.00, 834.38, 7509.38, 7509.38, 'direct', 'Halal dining required. Private security detail (2 persons).'),

  ('c1000000-0000-0000-0000-000000000006', 'AUR-2026-0006',
   'a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000006',
   '2026-11-10', '2026-11-15', 2, 'confirmed', NULL, 310.00, 'DEV20', 20,
   '[{"name":"Floating Champagne Breakfast","price":120},{"name":"Couples Thermal Spa Pass","price":200}]',
   1560.00, 195.00, 1755.00, 1755.00, 'direct', 'Honeymoon — champagne and rose petals on arrival.'),

  ('c1000000-0000-0000-0000-000000000007', 'AUR-2026-0007',
   'a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000007',
   '2026-11-08', '2026-11-10', 1, 'checked_in', '202', 220.00, NULL, 0, '[]',
   440.00, 55.00, 495.00, 495.00, 'expedia', 'Travel blogger — may photograph room for publication.'),

  ('c1000000-0000-0000-0000-000000000008', 'AUR-2026-0008',
   'a1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000008',
   '2026-11-11', '2026-11-13', 1, 'confirmed', NULL, 220.00, NULL, 0, '[]',
   440.00, 55.00, 495.00, 495.00, 'corporate', 'Corporate booking via Dangote Group. Airport pickup arranged separately.');

-- ============================================================
-- 4. FOLIO ITEMS (sample charges for checked-in guests)
-- ============================================================
INSERT INTO folio_items (reservation_id, category, description, amount, quantity, is_paid) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'room_charge', 'Presidential Ocean Penthouse — Night 1', 1250.00, 1, TRUE),
  ('c1000000-0000-0000-0000-000000000001', 'room_service', 'Wagyu Steak Dinner for 2', 185.00, 1, TRUE),
  ('c1000000-0000-0000-0000-000000000001', 'minibar', 'Dom Pérignon 2012', 320.00, 1, FALSE),
  ('c1000000-0000-0000-0000-000000000001', 'spa', 'Couples Deep Tissue Massage (90 min)', 280.00, 1, FALSE),

  ('c1000000-0000-0000-0000-000000000002', 'room_charge', 'Executive Diplomatic Suite — Night 1', 650.00, 1, FALSE),
  ('c1000000-0000-0000-0000-000000000002', 'room_service', 'Continental Breakfast', 45.00, 1, FALSE),
  ('c1000000-0000-0000-0000-000000000002', 'laundry', 'Express Dry Cleaning — 3 items', 65.00, 1, FALSE),

  ('c1000000-0000-0000-0000-000000000007', 'room_charge', 'Classic Club Studio — Night 1', 220.00, 1, FALSE),
  ('c1000000-0000-0000-0000-000000000007', 'minibar', 'Craft Beer Selection', 24.00, 3, FALSE);

-- ============================================================
-- 5. HOUSEKEEPING TASKS (16 rooms across 4 floors)
-- ============================================================
INSERT INTO housekeeping_tasks (room_number, floor, status, attendant, priority, notes, last_cleaned) VALUES
  ('101', 1, 'clean',        'Ngozi Eze',     'normal',  NULL,                              '2026-11-08 06:00:00+01'),
  ('102', 1, 'clean',        'Ngozi Eze',     'normal',  NULL,                              '2026-11-08 06:30:00+01'),
  ('103', 1, 'dirty',        NULL,            'normal',  'Guest checkout at 11 AM',         NULL),
  ('104', 1, 'maintenance',  NULL,            'high',    'AC unit replacement — ETA 2 days', NULL),
  ('201', 2, 'clean',        'Blessing Obi',  'normal',  NULL,                              '2026-11-08 07:00:00+01'),
  ('202', 2, 'in_progress',  'Blessing Obi',  'normal',  'Guest checked in — turndown',     NULL),
  ('203', 2, 'dirty',        NULL,            'normal',  'Checkout expected today',          NULL),
  ('204', 2, 'clean',        'Blessing Obi',  'normal',  NULL,                              '2026-11-08 07:30:00+01'),
  ('301', 3, 'clean',        'Emeka Nnamdi',  'vip',     'VIP guest — Aisha Bello',         '2026-11-08 05:30:00+01'),
  ('302', 3, 'dirty',        NULL,            'normal',  'Awaiting arrival — Elena Müller',  NULL),
  ('303', 3, 'clean',        'Emeka Nnamdi',  'normal',  NULL,                              '2026-11-08 08:00:00+01'),
  ('304', 3, 'maintenance',  NULL,            'low',     'Bathroom tile grouting',           NULL),
  ('401', 4, 'clean',        'Tunde Bakare',  'vip',     'Black Tier VIP — Chidi Okafor',   '2026-11-08 05:00:00+01'),
  ('402', 4, 'dirty',        NULL,            'high',    'Deep clean before VIP arrival',    NULL),
  ('403', 4, 'clean',        'Tunde Bakare',  'normal',  NULL,                              '2026-11-08 08:30:00+01'),
  ('404', 4, 'in_progress',  'Tunde Bakare',  'normal',  'Restocking minibar',              NULL);

