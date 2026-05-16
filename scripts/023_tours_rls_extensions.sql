-- ============================================================================
-- TOURS RLS extensions: host-linked operators, 021 tables, helper functions
-- Run AFTER 022_tours_host_and_format.sql
-- ============================================================================

-- ============================================================================
-- Helper functions
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_tour_operator_for(p_operator_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tour_operators o
    WHERE o.id = p_operator_id
      AND o.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_tour_operator(p_operator_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_tour_operator_for(p_operator_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_tour_operator(p_operator_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tour_operators o
    WHERE o.id = p_operator_id
      AND (
        o.user_id = auth.uid()
        OR (
          o.host_id IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM public.hosts h
            WHERE h.id = o.host_id
              AND h.user_id = auth.uid()
          )
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_tour(p_tour_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tours t
    JOIN public.tour_operators o ON o.id = t.operator_id
    WHERE t.id = p_tour_id
      AND (
        o.user_id = auth.uid()
        OR (
          o.host_id IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM public.hosts h
            WHERE h.id = o.host_id
              AND h.user_id = auth.uid()
          )
        )
      )
  );
$$;

-- ============================================================================
-- tour_operators: extend insert/update for host-linked operators
-- ============================================================================
DROP POLICY IF EXISTS "tour_operators_insert_own" ON public.tour_operators;
CREATE POLICY "tour_operators_insert_own" ON public.tour_operators
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      operator_type = 'company'
      OR (
        operator_type = 'host'
        AND host_id IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM public.hosts h
          WHERE h.id = host_id
            AND h.user_id = auth.uid()
        )
      )
    )
  );

DROP POLICY IF EXISTS "tour_operators_update_own" ON public.tour_operators;
CREATE POLICY "tour_operators_update_own" ON public.tour_operators
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR (
      host_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.hosts h
        WHERE h.id = host_id AND h.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "tour_operators_select_own" ON public.tour_operators;
CREATE POLICY "tour_operators_select_own" ON public.tour_operators
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      host_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.hosts h
        WHERE h.id = host_id AND h.user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- tours: replace manage policy to include host-linked path
-- ============================================================================
DROP POLICY IF EXISTS "tours_manage_own" ON public.tours;
CREATE POLICY "tours_manage_own" ON public.tours
  FOR ALL
  USING (public.can_manage_tour(id))
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tour_operators o
      WHERE o.id = operator_id
        AND public.can_manage_tour_operator(o.id)
    )
  );

-- Operators can read their own inactive tours
DROP POLICY IF EXISTS "tours_select_own_operator" ON public.tours;
CREATE POLICY "tours_select_own_operator" ON public.tours
  FOR SELECT
  USING (public.can_manage_tour(id));

-- ============================================================================
-- tour_schedules: host-linked management
-- ============================================================================
DROP POLICY IF EXISTS "tour_schedules_manage_own" ON public.tour_schedules;
CREATE POLICY "tour_schedules_manage_own" ON public.tour_schedules
  FOR ALL
  USING (public.can_manage_tour(tour_id))
  WITH CHECK (public.can_manage_tour(tour_id));

-- ============================================================================
-- tour_bookings: host-linked operator access
-- ============================================================================
DROP POLICY IF EXISTS "tour_bookings_select_guest_or_operator" ON public.tour_bookings;
CREATE POLICY "tour_bookings_select_guest_or_operator" ON public.tour_bookings
  FOR SELECT
  USING (
    guest_id = auth.uid()
    OR public.can_manage_tour(tour_id)
  );

DROP POLICY IF EXISTS "tour_bookings_update_guest_or_operator" ON public.tour_bookings;
CREATE POLICY "tour_bookings_update_guest_or_operator" ON public.tour_bookings
  FOR UPDATE
  USING (
    guest_id = auth.uid()
    OR public.can_manage_tour(tour_id)
  );

DROP POLICY IF EXISTS "tour_bookings_delete_guest_or_operator" ON public.tour_bookings;
CREATE POLICY "tour_bookings_delete_guest_or_operator" ON public.tour_bookings
  FOR DELETE
  USING (
    guest_id = auth.uid()
    OR public.can_manage_tour(tour_id)
  );

-- ============================================================================
-- tour_reviews: operator can read reviews on their tours
-- ============================================================================
DROP POLICY IF EXISTS "tour_reviews_select_operator" ON public.tour_reviews;
CREATE POLICY "tour_reviews_select_operator" ON public.tour_reviews
  FOR SELECT
  USING (public.can_manage_tour(tour_id));

-- ============================================================================
-- 021 extension tables RLS
-- ============================================================================
ALTER TABLE public.tour_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_pricing_rules ENABLE ROW LEVEL SECURITY;

-- tour_categories: public read active
DROP POLICY IF EXISTS "tour_categories_select_public" ON public.tour_categories;
CREATE POLICY "tour_categories_select_public" ON public.tour_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "tour_categories_select_admin" ON public.tour_categories;
CREATE POLICY "tour_categories_select_admin" ON public.tour_categories
  FOR SELECT USING (public.is_admin(auth.uid()));

-- tour_guides
DROP POLICY IF EXISTS "tour_guides_select_public" ON public.tour_guides;
CREATE POLICY "tour_guides_select_public" ON public.tour_guides
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "tour_guides_manage_own" ON public.tour_guides;
CREATE POLICY "tour_guides_manage_own" ON public.tour_guides
  FOR ALL
  USING (public.can_manage_tour_operator(operator_id))
  WITH CHECK (public.can_manage_tour_operator(operator_id));

DROP POLICY IF EXISTS "tour_guides_select_admin" ON public.tour_guides;
CREATE POLICY "tour_guides_select_admin" ON public.tour_guides
  FOR SELECT USING (public.is_admin(auth.uid()));

-- guide_languages
DROP POLICY IF EXISTS "guide_languages_select_public" ON public.guide_languages;
CREATE POLICY "guide_languages_select_public" ON public.guide_languages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tour_guides g
      WHERE g.id = guide_id AND g.is_active = true
    )
  );

DROP POLICY IF EXISTS "guide_languages_manage_own" ON public.guide_languages;
CREATE POLICY "guide_languages_manage_own" ON public.guide_languages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tour_guides g
      WHERE g.id = guide_id
        AND public.can_manage_tour_operator(g.operator_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tour_guides g
      WHERE g.id = guide_id
        AND public.can_manage_tour_operator(g.operator_id)
    )
  );

DROP POLICY IF EXISTS "guide_languages_select_admin" ON public.guide_languages;
CREATE POLICY "guide_languages_select_admin" ON public.guide_languages
  FOR SELECT USING (public.is_admin(auth.uid()));

-- guide_certifications
DROP POLICY IF EXISTS "guide_certifications_select_public" ON public.guide_certifications;
CREATE POLICY "guide_certifications_select_public" ON public.guide_certifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tour_guides g
      WHERE g.id = guide_id AND g.is_active = true
    )
  );

DROP POLICY IF EXISTS "guide_certifications_manage_own" ON public.guide_certifications;
CREATE POLICY "guide_certifications_manage_own" ON public.guide_certifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.tour_guides g
      WHERE g.id = guide_id
        AND public.can_manage_tour_operator(g.operator_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tour_guides g
      WHERE g.id = guide_id
        AND public.can_manage_tour_operator(g.operator_id)
    )
  );

DROP POLICY IF EXISTS "guide_certifications_select_admin" ON public.guide_certifications;
CREATE POLICY "guide_certifications_select_admin" ON public.guide_certifications
  FOR SELECT USING (public.is_admin(auth.uid()));

-- tour_images
DROP POLICY IF EXISTS "tour_images_select_public" ON public.tour_images;
CREATE POLICY "tour_images_select_public" ON public.tour_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tours t
      WHERE t.id = tour_id AND t.is_active = true
    )
  );

DROP POLICY IF EXISTS "tour_images_manage_own" ON public.tour_images;
CREATE POLICY "tour_images_manage_own" ON public.tour_images
  FOR ALL
  USING (public.can_manage_tour(tour_id))
  WITH CHECK (public.can_manage_tour(tour_id));

DROP POLICY IF EXISTS "tour_images_select_admin" ON public.tour_images;
CREATE POLICY "tour_images_select_admin" ON public.tour_images
  FOR SELECT USING (public.is_admin(auth.uid()));

-- tour_amenities
DROP POLICY IF EXISTS "tour_amenities_select_public" ON public.tour_amenities;
CREATE POLICY "tour_amenities_select_public" ON public.tour_amenities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tours t
      WHERE t.id = tour_id AND t.is_active = true
    )
  );

DROP POLICY IF EXISTS "tour_amenities_manage_own" ON public.tour_amenities;
CREATE POLICY "tour_amenities_manage_own" ON public.tour_amenities
  FOR ALL
  USING (public.can_manage_tour(tour_id))
  WITH CHECK (public.can_manage_tour(tour_id));

DROP POLICY IF EXISTS "tour_amenities_select_admin" ON public.tour_amenities;
CREATE POLICY "tour_amenities_select_admin" ON public.tour_amenities
  FOR SELECT USING (public.is_admin(auth.uid()));

-- tour_pricing_rules
DROP POLICY IF EXISTS "tour_pricing_rules_select_public" ON public.tour_pricing_rules;
CREATE POLICY "tour_pricing_rules_select_public" ON public.tour_pricing_rules
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.tours t
      WHERE t.id = tour_id AND t.is_active = true
    )
  );

DROP POLICY IF EXISTS "tour_pricing_rules_manage_own" ON public.tour_pricing_rules;
CREATE POLICY "tour_pricing_rules_manage_own" ON public.tour_pricing_rules
  FOR ALL
  USING (public.can_manage_tour(tour_id))
  WITH CHECK (public.can_manage_tour(tour_id));

DROP POLICY IF EXISTS "tour_pricing_rules_select_admin" ON public.tour_pricing_rules;
CREATE POLICY "tour_pricing_rules_select_admin" ON public.tour_pricing_rules
  FOR SELECT USING (public.is_admin(auth.uid()));

-- tour_schedules admin read
DROP POLICY IF EXISTS "tour_schedules_select_admin" ON public.tour_schedules;
CREATE POLICY "tour_schedules_select_admin" ON public.tour_schedules
  FOR SELECT USING (public.is_admin(auth.uid()));
