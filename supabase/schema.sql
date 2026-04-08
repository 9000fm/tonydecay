-- ============================================
-- Tony Decay Print Store — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Inventory: single row tracking total and sold
CREATE TABLE inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  total integer NOT NULL DEFAULT 100,
  sold integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO inventory (total, sold) VALUES (100, 0);

-- Orders: one row per purchase
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number text UNIQUE NOT NULL,

  -- Customer
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,

  -- Shipping address
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

  -- Amount
  amount_usd numeric(10,2) NOT NULL DEFAULT 300.00,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,

  -- Fulfillment
  shipping_status text DEFAULT 'unfulfilled'
    CHECK (shipping_status IN ('unfulfilled', 'shipped', 'delivered')),
  tracking_number text,
  notes text
);

-- Abandoned checkouts: for follow-up emails
CREATE TABLE abandoned_checkouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Indexes
CREATE INDEX idx_abandoned_unsent ON abandoned_checkouts (email_sent, created_at)
  WHERE email_sent = false AND converted = false;
CREATE INDEX idx_orders_email ON orders (email);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_checkouts ENABLE ROW LEVEL SECURITY;

-- Inventory: anyone can read, only service role can update
CREATE POLICY "Public read inventory" ON inventory FOR SELECT USING (true);

-- Orders + abandoned_checkouts: service role only (all access via API routes)
-- No policies needed — RLS blocks all anon access by default

-- ============================================
-- Postgres Functions
-- ============================================

-- Create order: generates order number, checks inventory (no decrement)
CREATE OR REPLACE FUNCTION create_order(
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
  v_inventory RECORD;
  v_order_number text;
  v_order_id uuid;
  v_next_number integer;
BEGIN
  SELECT * INTO v_inventory FROM inventory LIMIT 1;
  IF v_inventory.sold >= v_inventory.total THEN
    RETURN json_build_object('error', 'sold_out');
  END IF;

  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS integer)), 0) + 1
    INTO v_next_number FROM orders;
  v_order_number := 'TD-' || LPAD(v_next_number::text, 3, '0');

  INSERT INTO orders (
    order_number, email, full_name, phone,
    address_line1, address_line2, city, state, postal_code, country,
    payment_method
  ) VALUES (
    v_order_number, p_email, p_full_name, p_phone,
    p_address_line1, p_address_line2, p_city, p_state, p_postal_code, p_country,
    p_payment_method
  ) RETURNING id INTO v_order_id;

  RETURN json_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number
  );
END;
$$ LANGUAGE plpgsql;

-- Confirm payment: atomically marks order paid + increments sold count
CREATE OR REPLACE FUNCTION confirm_payment(
  p_order_id uuid,
  p_paypal_order_id text DEFAULT NULL
) RETURNS json AS $$
DECLARE
  v_inventory RECORD;
  v_order RECORD;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN json_build_object('error', 'order_not_found');
  END IF;
  IF v_order.payment_status = 'completed' THEN
    RETURN json_build_object('error', 'already_completed');
  END IF;

  SELECT * INTO v_inventory FROM inventory LIMIT 1 FOR UPDATE;
  IF v_inventory.sold >= v_inventory.total THEN
    RETURN json_build_object('error', 'sold_out');
  END IF;

  UPDATE orders SET
    payment_status = 'completed',
    paid_at = now(),
    paypal_order_id = COALESCE(p_paypal_order_id, paypal_order_id)
  WHERE id = p_order_id;

  UPDATE inventory SET sold = sold + 1, updated_at = now();

  RETURN json_build_object(
    'success', true,
    'order_number', v_order.order_number,
    'remaining', v_inventory.total - (v_inventory.sold + 1)
  );
END;
$$ LANGUAGE plpgsql;
