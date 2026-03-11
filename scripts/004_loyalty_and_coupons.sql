-- Additional roles and partner profiles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.partner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_type TEXT CHECK (partner_type IN ('hotel', 'agency', 'property_manager')),
  company_name TEXT,
  tax_number TEXT,
  address TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty accounts and transactions
CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points_balance INTEGER NOT NULL DEFAULT 0,
  lifetime_points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loyalty_point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES public.loyalty_accounts(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('earn','redeem','adjust')),
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons and usages
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  host_id UUID REFERENCES public.hosts(id) ON DELETE CASCADE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed_amount')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_booking_total NUMERIC(10,2),
  max_discount_amount NUMERIC(10,2),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  usage_limit INTEGER,
  per_user_limit INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  discount_applied NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extend bookings with discount and coupon info
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS points_redeemed INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_price NUMERIC(10,2);

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_insert_own" ON public.user_roles;
CREATE POLICY "user_roles_insert_own" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_update_own" ON public.user_roles;
CREATE POLICY "user_roles_update_own" ON public.user_roles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for partner_profiles
DROP POLICY IF EXISTS "partner_profiles_select_own" ON public.partner_profiles;
CREATE POLICY "partner_profiles_select_own" ON public.partner_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "partner_profiles_insert_own" ON public.partner_profiles;
CREATE POLICY "partner_profiles_insert_own" ON public.partner_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "partner_profiles_update_own" ON public.partner_profiles;
CREATE POLICY "partner_profiles_update_own" ON public.partner_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for loyalty_accounts
DROP POLICY IF EXISTS "loyalty_accounts_select_own" ON public.loyalty_accounts;
CREATE POLICY "loyalty_accounts_select_own" ON public.loyalty_accounts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "loyalty_accounts_insert_own" ON public.loyalty_accounts;
CREATE POLICY "loyalty_accounts_insert_own" ON public.loyalty_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "loyalty_accounts_update_own" ON public.loyalty_accounts;
CREATE POLICY "loyalty_accounts_update_own" ON public.loyalty_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for loyalty_point_transactions
DROP POLICY IF EXISTS "loyalty_tx_select_own" ON public.loyalty_point_transactions;
CREATE POLICY "loyalty_tx_select_own" ON public.loyalty_point_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_accounts a
      WHERE a.id = account_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "loyalty_tx_insert_own" ON public.loyalty_point_transactions;
CREATE POLICY "loyalty_tx_insert_own" ON public.loyalty_point_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.loyalty_accounts a
      WHERE a.id = account_id AND a.user_id = auth.uid()
    )
  );

-- RLS policies for coupons
DROP POLICY IF EXISTS "coupons_select_all_active" ON public.coupons;
CREATE POLICY "coupons_select_all_active" ON public.coupons
  FOR SELECT USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (expires_at IS NULL OR expires_at >= NOW())
  );

DROP POLICY IF EXISTS "coupons_manage_own" ON public.coupons;
CREATE POLICY "coupons_manage_own" ON public.coupons
  FOR ALL USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- RLS policies for coupon_usages
DROP POLICY IF EXISTS "coupon_usages_select_own" ON public.coupon_usages;
CREATE POLICY "coupon_usages_select_own" ON public.coupon_usages
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "coupon_usages_insert_own" ON public.coupon_usages;
CREATE POLICY "coupon_usages_insert_own" ON public.coupon_usages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

