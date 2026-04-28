-- ============================================
-- Tony Decay — Database Schema v3 (order_items-aware)
-- Run this in Supabase SQL Editor. Idempotent: drops old objects first.
-- Change vs v2: `orders` no longer references a product directly. Each order
-- has one or more `order_items` rows. Ready for multi-product carts and
-- future Vol.02 / merch without migration.
-- ============================================

-- Drop legacy artifacts (order matters — FKs)
DROP FUNCTION IF EXISTS create_order CASCADE;
DROP FUNCTION IF EXISTS confirm_payment CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS checkout_leads CASCADE;
DROP TABLE IF EXISTS abandoned_checkouts CASCADE;    -- old name from v2
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;              -- old name from v1
DROP TABLE IF EXISTS products CASCADE;

-- ============================================
-- Products: one row per SKU. Vol.02, merch, shirts all go here.
-- ============================================

CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  price_usd numeric(10,2) NOT NULL,
  total integer NOT NULL,                    -- inventory cap
  sold integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed Vol.01
INSERT INTO products (slug, name, description, price_usd, total)
VALUES (
  'vol-01',
  'Tony Decay Vol.01',
  '15 hand-pulled A5 prints on 300gsm cream paper, hand-signed & numbered, ships worldwide.',
  300.00,
  100
);

-- ============================================
-- Orders: order-level data only. No product columns here.
-- ============================================

CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text UNIQUE NOT NULL,

  -- Customer
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,

  -- Shipping address (kept on orders for MVP — split to own table later if needed)
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text NOT NULL,
  country text NOT NULL,

  -- Payment
  payment_method text NOT NULL CHECK (payment_method IN ('paypal', 'yape')),
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  paypal_order_id text,
  yape_confirmation_code text,

  -- Total snapshot (sum of order_items.line_total at create time)
  amount_total numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,

  -- Fulfillment
  shipping_status text DEFAULT 'unfulfilled'
    CHECK (shipping_status IN ('unfulfilled', 'shipped', 'delivered')),
  tracking_number text,
  notes text
);

-- ============================================
-- Order items: one row per line item per order.
-- Snapshotted price + name so later product changes don't retroactively
-- rewrite history.
-- ============================================

CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_slug text NOT NULL,                -- denormalized for quick lookups
  product_name_snapshot text NOT NULL,
  unit_price_snapshot numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Checkout leads: captured form data for people who bounced before paying.
-- Not FK'd to products (soft link via product_slug) — a lead may exist for
-- a product that's later removed.
-- ============================================

CREATE TABLE checkout_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug text,
  email text NOT NULL,
  full_name text,
  phone text,
  address_line1 text,
  city text,
  country text,
  payment_method text,
  email_sent boolean DEFAULT false,
  email_sent_at timestamptz,
  converted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX idx_leads_unsent ON checkout_leads (email_sent, created_at)
  WHERE email_sent = false AND converted = false;
CREATE INDEX idx_orders_email ON orders (email);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);
CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_product ON order_items (product_id);
CREATE INDEX idx_products_active ON products (active) WHERE active = true;

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_leads ENABLE ROW LEVEL SECURITY;

-- Public can read active products (for catalog / inventory display)
CREATE POLICY "Public read active products" ON products FOR SELECT USING (active = true);

-- orders / order_items / checkout_leads: no anon policies → service role only.
-- All writes go through API routes using SUPABASE_SERVICE_ROLE_KEY.

-- ============================================
-- Postgres Functions
-- ============================================

-- Create order: looks up product by slug, checks inventory, inserts
-- orders + order_items atomically, generates slug-prefixed order number.
-- Today it's single-item per order (quantity = 1) — shape supports multi later.
CREATE OR REPLACE FUNCTION create_order(
  p_product_slug text,
  p_email text,
  p_full_name text,
  p_phone text,
  p_address_line1 text,
  p_address_line2 text,
  p_city text,
  p_state text,
  p_postal_code text,
  p_country text,
  p_payment_method text
) RETURNS json AS $$
DECLARE
  v_product RECORD;
  v_order_number text;
  v_order_id uuid;
  v_next_number integer;
  v_prefix text;
  v_line_total numeric(10,2);
BEGIN
  SELECT * INTO v_product FROM products
    WHERE slug = p_product_slug AND active = true;
  IF v_product IS NULL THEN
    RETURN json_build_object('error', 'product_not_found');
  END IF;
  IF v_product.sold >= v_product.total THEN
    RETURN json_build_object('error', 'sold_out');
  END IF;

  -- Order number: TD-<SLUG_UPPER_NODASH>-XXX  e.g. TD-VOL01-001
  v_prefix := 'TD-' || UPPER(REPLACE(p_product_slug, '-', '')) || '-';
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(order_number FROM LENGTH(v_prefix) + 1) AS integer)),
    0
  ) + 1
    INTO v_next_number
    FROM orders
    WHERE order_number LIKE v_prefix || '%';
  v_order_number := v_prefix || LPAD(v_next_number::text, 3, '0');

  v_line_total := v_product.price_usd * 1;   -- quantity = 1 for MVP

  -- Insert orders row
  INSERT INTO orders (
    order_number, amount_total, currency,
    email, full_name, phone,
    address_line1, address_line2, city, state, postal_code, country,
    payment_method
  ) VALUES (
    v_order_number, v_line_total, 'USD',
    p_email, p_full_name, p_phone,
    p_address_line1, p_address_line2, p_city, p_state, p_postal_code, p_country,
    p_payment_method
  ) RETURNING id INTO v_order_id;

  -- Insert order_items row (1 line for now)
  INSERT INTO order_items (
    order_id, product_id, product_slug,
    product_name_snapshot, unit_price_snapshot,
    quantity, line_total
  ) VALUES (
    v_order_id, v_product.id, v_product.slug,
    v_product.name, v_product.price_usd,
    1, v_line_total
  );

  RETURN json_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'amount_total', v_line_total,
    'currency', 'USD',
    'product_slug', v_product.slug
  );
END;
$$ LANGUAGE plpgsql;

-- Confirm payment: atomically marks order paid + increments products.sold
-- for each line item (handles multi-item carts when they arrive).
CREATE OR REPLACE FUNCTION confirm_payment(
  p_order_id uuid,
  p_paypal_order_id text DEFAULT NULL
) RETURNS json AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_first_slug text;
  v_first_remaining integer;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN json_build_object('error', 'order_not_found');
  END IF;
  IF v_order.payment_status = 'completed' THEN
    RETURN json_build_object('error', 'already_completed');
  END IF;

  -- For every item in the order, lock its product row and bump sold.
  -- First loop: validate every item has stock. If any is sold-out, abort
  -- without changing anything (the transaction rollback handles this).
  FOR v_item IN
    SELECT oi.*, p.total AS cap, p.sold AS current_sold, p.id AS pid, p.slug AS pslug
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = p_order_id
     ORDER BY oi.created_at
     FOR UPDATE OF p
  LOOP
    IF v_item.current_sold + v_item.quantity > v_item.cap THEN
      RETURN json_build_object('error', 'sold_out', 'product_slug', v_item.pslug);
    END IF;

    UPDATE products
       SET sold = sold + v_item.quantity,
           updated_at = now()
     WHERE id = v_item.pid;

    -- Capture first item's slug + remaining for the return payload.
    IF v_first_slug IS NULL THEN
      v_first_slug := v_item.pslug;
      v_first_remaining := v_item.cap - (v_item.current_sold + v_item.quantity);
    END IF;
  END LOOP;

  UPDATE orders SET
    payment_status = 'completed',
    paid_at = now(),
    paypal_order_id = COALESCE(p_paypal_order_id, paypal_order_id)
  WHERE id = p_order_id;

  RETURN json_build_object(
    'success', true,
    'order_number', v_order.order_number,
    'product_slug', v_first_slug,
    'remaining', v_first_remaining
  );
END;
$$ LANGUAGE plpgsql;
