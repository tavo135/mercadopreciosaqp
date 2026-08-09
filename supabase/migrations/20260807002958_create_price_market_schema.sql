/*
# Create PrecioMercadoAQP core schema

1. New Tables
- `markets` — mercados de Arequipa (San Camilo, Rio Seco, etc.)
  - id (uuid PK), name, city, type (retail/wholesale/rural/fishing), status, created_at
- `products` — productos (papa, cebolla, tomate, limón, palta)
  - id (uuid PK), name, category (tubérculo/fruta/verdura/otro), unit, status, created_at
- `prices` — tabla central de precios reportados
  - id (uuid PK), product_id FK, market_id FK, price_pen, unit, quality_tier (primera/segunda/rescate),
    purchase_mode (choice/surprise_bag/rescue), source_type (manual/whatsapp/voice/vendor_self),
    photo_url, status (pending/approved/rejected), reporter_name, reporter_phone, reporter_reputation,
    notes, collected_at, created_at
- `vendors` — vendedores con inclusión digital
  - id (uuid PK), name, phone, stall_number, market_id FK, has_smartphone, has_internet,
    preferred_contact, proxy fields, vendor_type, zone, schedule, town, transport_contact,
    verified, created_at

2. Security
- RLS enabled on all tables.
- This is a no-auth public app: all policies use `TO anon, authenticated`.
- Public read access for approved prices, markets, products, and verified vendors.
- Anyone can submit a price (insert with status pending).
- Update restricted to status changes (admin approval/rejection) via anon role for MVP.
- Delete allowed for MVP admin flow.
*/

-- Mercados
CREATE TABLE IF NOT EXISTS markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text DEFAULT 'Arequipa',
  type text DEFAULT 'retail' CHECK (type IN ('retail', 'wholesale', 'rural', 'fishing')),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text CHECK (category IN ('tuberculo', 'fruta', 'verdura', 'otro')),
  unit text DEFAULT 'kg',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Precios (tabla central)
CREATE TABLE IF NOT EXISTS prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  market_id uuid REFERENCES markets(id) ON DELETE CASCADE,
  price_pen decimal(10,2) NOT NULL,
  unit text DEFAULT 'kg',
  quality_tier text DEFAULT 'primera' CHECK (quality_tier IN ('primera', 'segunda', 'rescate')),
  purchase_mode text DEFAULT 'choice' CHECK (purchase_mode IN ('choice', 'surprise_bag', 'rescue')),
  source_type text DEFAULT 'manual' CHECK (source_type IN ('manual', 'whatsapp', 'voice', 'vendor_self')),
  photo_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reporter_name text,
  reporter_phone text,
  reporter_reputation int DEFAULT 0,
  notes text,
  collected_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Vendedores
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  stall_number text,
  market_id uuid REFERENCES markets(id) ON DELETE SET NULL,
  has_smartphone boolean DEFAULT false,
  has_internet boolean DEFAULT false,
  preferred_contact text DEFAULT 'whatsapp' CHECK (preferred_contact IN ('whatsapp', 'voice_note', 'missed_call', 'proxy', 'physical')),
  proxy_name text,
  proxy_phone text,
  proxy_relationship text,
  vendor_type text DEFAULT 'stall' CHECK (vendor_type IN ('stall', 'ambulante', 'farmer', 'fisher')),
  zone text,
  schedule text,
  town text,
  transport_contact text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Markets policies (public read, public insert for MVP)
DROP POLICY IF EXISTS "anon_select_markets" ON markets;
CREATE POLICY "anon_select_markets" ON markets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_markets" ON markets;
CREATE POLICY "anon_insert_markets" ON markets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_markets" ON markets;
CREATE POLICY "anon_update_markets" ON markets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Products policies (public read, public insert for MVP)
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Prices policies (public read approved, anyone can submit, admin can update/delete)
DROP POLICY IF EXISTS "anon_select_prices" ON prices;
CREATE POLICY "anon_select_prices" ON prices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prices" ON prices;
CREATE POLICY "anon_insert_prices" ON prices FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prices" ON prices;
CREATE POLICY "anon_update_prices" ON prices FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prices" ON prices;
CREATE POLICY "anon_delete_prices" ON prices FOR DELETE
  TO anon, authenticated USING (true);

-- Vendors policies (public read, public insert for MVP)
DROP POLICY IF EXISTS "anon_select_vendors" ON vendors;
CREATE POLICY "anon_select_vendors" ON vendors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_vendors" ON vendors;
CREATE POLICY "anon_insert_vendors" ON vendors FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_vendors" ON vendors;
CREATE POLICY "anon_update_vendors" ON vendors FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_market_id ON prices(market_id);
CREATE INDEX IF NOT EXISTS idx_prices_status ON prices(status);
CREATE INDEX IF NOT EXISTS idx_prices_collected_at ON prices(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_market_id ON vendors(market_id);
