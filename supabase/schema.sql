-- ============================================================
-- The Aurelia Grand & Suites — PostgreSQL Schema
-- Designed for Supabase (PostgreSQL 15+)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";   -- needed for exclusion constraints

-- ============================================================
-- 1. SUITES
-- ============================================================
CREATE TABLE suites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT        NOT NULL,
  slug          TEXT        UNIQUE NOT NULL,
  category      TEXT        NOT NULL CHECK (category IN ('penthouse','villa','suite','deluxe','loft','studio')),
  floor         INT         NOT NULL,
  room_number   TEXT        UNIQUE NOT NULL,
  sqft          INT         NOT NULL,
  base_rate_usd NUMERIC(10,2) NOT NULL,
  max_guests    INT         NOT NULL DEFAULT 2,
  amenities     TEXT[]      NOT NULL DEFAULT '{}',
  description   TEXT,
  image_url     TEXT,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. GUESTS
-- ============================================================
CREATE TABLE guests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name    TEXT        NOT NULL,
  last_name     TEXT        NOT NULL,
  email         TEXT        UNIQUE NOT NULL,
  phone         TEXT,
  nationality   TEXT,
  vip_tier      TEXT        CHECK (vip_tier IN ('black','platinum','gold','silver','member')) DEFAULT 'member',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. RESERVATIONS
-- ============================================================
CREATE TABLE reservations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref     TEXT        UNIQUE NOT NULL,  -- e.g. AUR-2026-0001
  suite_id        UUID        NOT NULL REFERENCES suites(id),
  guest_id        UUID        NOT NULL REFERENCES guests(id),
  check_in        DATE        NOT NULL,
  check_out       DATE        NOT NULL,
  nights          INT         GENERATED ALWAYS AS (check_out - check_in) STORED,
  guests_count    INT         NOT NULL DEFAULT 1,
  status          TEXT        NOT NULL CHECK (status IN ('confirmed','checked_in','checked_out','cancelled','no_show')) DEFAULT 'confirmed',
  room_number     TEXT,
  nightly_rate    NUMERIC(10,2) NOT NULL,
  promo_code      TEXT,
  discount_pct    NUMERIC(5,2) DEFAULT 0,
  addons          JSONB       NOT NULL DEFAULT '[]',
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_amount      NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  balance_due     NUMERIC(10,2) NOT NULL DEFAULT 0,
  channel         TEXT        NOT NULL CHECK (channel IN ('direct','booking_com','expedia','corporate','walk_in')) DEFAULT 'direct',
  special_requests TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Prevent double-booking: no two confirmed/checked-in reservations
-- can overlap on the same suite.
ALTER TABLE reservations
  ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    suite_id WITH =,
    daterange(check_in, check_out) WITH &&
  )
  WHERE (status IN ('confirmed','checked_in'));

-- ============================================================
-- 4. FOLIO ITEMS  (guest billing line-items)
-- ============================================================
CREATE TABLE folio_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id  UUID        NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  category        TEXT        NOT NULL CHECK (category IN ('room_charge','room_service','minibar','laundry','spa','transport','other')),
  description     TEXT        NOT NULL,
  amount          NUMERIC(10,2) NOT NULL,
  quantity        INT         NOT NULL DEFAULT 1,
  is_paid         BOOLEAN     NOT NULL DEFAULT FALSE,
  posted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. HOUSEKEEPING TASKS
-- ============================================================
CREATE TABLE housekeeping_tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number     TEXT        NOT NULL,
  floor           INT         NOT NULL,
  status          TEXT        NOT NULL CHECK (status IN ('clean','dirty','in_progress','maintenance')) DEFAULT 'dirty',
  attendant       TEXT,
  priority        TEXT        CHECK (priority IN ('vip','high','normal','low')) DEFAULT 'normal',
  notes           TEXT,
  last_cleaned    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_reservations_dates   ON reservations (check_in, check_out);
CREATE INDEX idx_reservations_status  ON reservations (status);
CREATE INDEX idx_reservations_guest   ON reservations (guest_id);
CREATE INDEX idx_folio_reservation    ON folio_items  (reservation_id);
CREATE INDEX idx_housekeeping_floor   ON housekeeping_tasks (floor);
CREATE INDEX idx_housekeeping_status  ON housekeeping_tasks (status);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS) EXAMPLES
-- ============================================================
-- Enable RLS on all tables
ALTER TABLE suites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests             ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE folio_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_tasks ENABLE ROW LEVEL SECURITY;

-- Public read access to suites (anyone can browse availability)
CREATE POLICY "Suites are publicly readable"
  ON suites FOR SELECT
  USING (TRUE);

-- Guests can read only their own profile
CREATE POLICY "Guests read own profile"
  ON guests FOR SELECT
  USING (auth.uid()::TEXT = id::TEXT);

-- Guests can see only their own reservations
CREATE POLICY "Guests read own reservations"
  ON reservations FOR SELECT
  USING (guest_id IN (
    SELECT id FROM guests WHERE auth.uid()::TEXT = id::TEXT
  ));

-- Staff role can read/write everything (example)
CREATE POLICY "Staff full access to reservations"
  ON reservations FOR ALL
  USING (auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'staff');

CREATE POLICY "Staff full access to housekeeping"
  ON housekeeping_tasks FOR ALL
  USING (auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'staff');

CREATE POLICY "Staff full access to folios"
  ON folio_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'staff');

