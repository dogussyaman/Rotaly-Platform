-- Tour operators
CREATE TABLE IF NOT EXISTS public.tour_operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  phone TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tours
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID REFERENCES public.tour_operators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  city TEXT,
  country TEXT,
  duration_minutes INTEGER,
  max_participants INTEGER,
  base_price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'TRY',
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tour schedules (departure times / sessions)
CREATE TABLE IF NOT EXISTS public.tour_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  available_spots INTEGER,
  price_override NUMERIC(10,2),
  is_cancelled BOOLEAN DEFAULT false
);

-- Tour bookings
CREATE TABLE IF NOT EXISTS public.tour_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.tour_schedules(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  participants_count INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  special_requests TEXT,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
  points_redeemed INTEGER NOT NULL DEFAULT 0,
  discount_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  final_price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tour reviews
CREATE TABLE IF NOT EXISTS public.tour_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.tour_bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tour_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for tour_operators
DROP POLICY IF EXISTS "tour_operators_select_own" ON public.tour_operators;
CREATE POLICY "tour_operators_select_own" ON public.tour_operators
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tour_operators_insert_own" ON public.tour_operators;
CREATE POLICY "tour_operators_insert_own" ON public.tour_operators
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tour_operators_update_own" ON public.tour_operators;
CREATE POLICY "tour_operators_update_own" ON public.tour_operators
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for tours
DROP POLICY IF EXISTS "tours_select_public" ON public.tours;
CREATE POLICY "tours_select_public" ON public.tours
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "tours_manage_own" ON public.tours;
CREATE POLICY "tours_manage_own" ON public.tours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tour_operators o
      WHERE o.id = operator_id AND o.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tour_operators o
      WHERE o.id = operator_id AND o.user_id = auth.uid()
    )
  );

-- RLS policies for tour_schedules
DROP POLICY IF EXISTS "tour_schedules_select_public" ON public.tour_schedules;
CREATE POLICY "tour_schedules_select_public" ON public.tour_schedules
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "tour_schedules_manage_own" ON public.tour_schedules;
CREATE POLICY "tour_schedules_manage_own" ON public.tour_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tours t
      JOIN public.tour_operators o ON t.operator_id = o.id
      WHERE t.id = tour_id AND o.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tours t
      JOIN public.tour_operators o ON t.operator_id = o.id
      WHERE t.id = tour_id AND o.user_id = auth.uid()
    )
  );

-- RLS policies for tour_bookings
DROP POLICY IF EXISTS "tour_bookings_select_guest_or_operator" ON public.tour_bookings;
CREATE POLICY "tour_bookings_select_guest_or_operator" ON public.tour_bookings
  FOR SELECT USING (
    guest_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.tours t
      JOIN public.tour_operators o ON t.operator_id = o.id
      WHERE t.id = tour_id AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "tour_bookings_insert_guest" ON public.tour_bookings;
CREATE POLICY "tour_bookings_insert_guest" ON public.tour_bookings
  FOR INSERT WITH CHECK (guest_id = auth.uid());

DROP POLICY IF EXISTS "tour_bookings_update_guest_or_operator" ON public.tour_bookings;
CREATE POLICY "tour_bookings_update_guest_or_operator" ON public.tour_bookings
  FOR UPDATE USING (
    guest_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.tours t
      JOIN public.tour_operators o ON t.operator_id = o.id
      WHERE t.id = tour_id AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "tour_bookings_delete_guest_or_operator" ON public.tour_bookings;
CREATE POLICY "tour_bookings_delete_guest_or_operator" ON public.tour_bookings
  FOR DELETE USING (
    guest_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.tours t
      JOIN public.tour_operators o ON t.operator_id = o.id
      WHERE t.id = tour_id AND o.user_id = auth.uid()
    )
  );

-- RLS policies for tour_reviews
DROP POLICY IF EXISTS "tour_reviews_select_public" ON public.tour_reviews;
CREATE POLICY "tour_reviews_select_public" ON public.tour_reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "tour_reviews_insert_own" ON public.tour_reviews;
CREATE POLICY "tour_reviews_insert_own" ON public.tour_reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

