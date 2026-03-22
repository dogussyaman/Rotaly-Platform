-- Admin helper for RLS checks
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = uid AND role = 'admin'
  );
$$;

-- Data integrity constraints
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_check_dates'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.bookings WHERE check_out <= check_in
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_check_dates CHECK (check_out > check_in);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_guests_positive'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.bookings WHERE guests_count <= 0
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_guests_positive CHECK (guests_count > 0);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'messages_conversation_id_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_conversation_id_fkey
      FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Backfill final_price if missing
UPDATE public.bookings
SET final_price = total_price
WHERE final_price IS NULL;

CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at ON public.messages(conversation_id, created_at);

-- Normalize primary images and enforce single primary image per listing
WITH ranked AS (
  SELECT
    id,
    listing_id,
    row_number() OVER (
      PARTITION BY listing_id
      ORDER BY is_primary DESC, sort_order ASC, created_at ASC
    ) AS rn
  FROM public.listing_images
)
UPDATE public.listing_images li
SET is_primary = (r.rn = 1)
FROM ranked r
WHERE li.id = r.id;

CREATE UNIQUE INDEX IF NOT EXISTS listing_images_one_primary
  ON public.listing_images(listing_id) WHERE is_primary;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'loyalty_accounts_user_unique'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.loyalty_accounts GROUP BY user_id HAVING COUNT(*) > 1
  ) THEN
    ALTER TABLE public.loyalty_accounts
      ADD CONSTRAINT loyalty_accounts_user_unique UNIQUE (user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hosts_user_unique'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.hosts GROUP BY user_id HAVING COUNT(*) > 1
  ) THEN
    ALTER TABLE public.hosts
      ADD CONSTRAINT hosts_user_unique UNIQUE (user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_role_unique'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.user_roles GROUP BY user_id, role HAVING COUNT(*) > 1
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role);
  END IF;
END $$;

-- Auto-create loyalty account on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile_loyalty()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.loyalty_accounts (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Backfill missing loyalty accounts
INSERT INTO public.loyalty_accounts (user_id)
SELECT p.id
FROM public.profiles p
LEFT JOIN public.loyalty_accounts a ON a.user_id = p.id
WHERE a.user_id IS NULL;

DROP TRIGGER IF EXISTS on_profile_created_loyalty ON public.profiles;
CREATE TRIGGER on_profile_created_loyalty
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile_loyalty();

-- Keep listing rating in sync on review changes
CREATE OR REPLACE FUNCTION public.refresh_listing_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  target_listing_id uuid;
BEGIN
  target_listing_id := COALESCE(NEW.listing_id, OLD.listing_id);

  UPDATE public.listings
  SET
    rating = (SELECT AVG(rating) FROM public.reviews WHERE listing_id = target_listing_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE listing_id = target_listing_id)
  WHERE id = target_listing_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;

CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.refresh_listing_rating();

-- Admin visibility policies
DROP POLICY IF EXISTS "bookings_select_admin" ON public.bookings;
CREATE POLICY "bookings_select_admin" ON public.bookings
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "user_roles_select_admin" ON public.user_roles;
CREATE POLICY "user_roles_select_admin" ON public.user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "partner_profiles_select_admin" ON public.partner_profiles;
CREATE POLICY "partner_profiles_select_admin" ON public.partner_profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "loyalty_accounts_select_admin" ON public.loyalty_accounts;
CREATE POLICY "loyalty_accounts_select_admin" ON public.loyalty_accounts
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "loyalty_tx_select_admin" ON public.loyalty_point_transactions;
CREATE POLICY "loyalty_tx_select_admin" ON public.loyalty_point_transactions
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "coupons_select_admin" ON public.coupons;
CREATE POLICY "coupons_select_admin" ON public.coupons
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "coupon_usages_select_admin" ON public.coupon_usages;
CREATE POLICY "coupon_usages_select_admin" ON public.coupon_usages
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "coupon_usages_select_host" ON public.coupon_usages;
CREATE POLICY "coupon_usages_select_host" ON public.coupon_usages
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.coupons c
      JOIN public.hosts h ON c.host_id = h.id
      WHERE c.id = coupon_id AND h.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "wishlists_select_admin" ON public.wishlists;
CREATE POLICY "wishlists_select_admin" ON public.wishlists
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "wishlist_items_select_admin" ON public.wishlist_items;
CREATE POLICY "wishlist_items_select_admin" ON public.wishlist_items
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "tour_operators_select_admin" ON public.tour_operators;
CREATE POLICY "tour_operators_select_admin" ON public.tour_operators
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "tour_bookings_select_admin" ON public.tour_bookings;
CREATE POLICY "tour_bookings_select_admin" ON public.tour_bookings
  FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "tours_select_admin" ON public.tours;
CREATE POLICY "tours_select_admin" ON public.tours
  FOR SELECT USING (public.is_admin(auth.uid()));
