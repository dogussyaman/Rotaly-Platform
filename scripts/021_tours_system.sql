-- ============================================================================
-- TOURS EXTENSION - Guide / Category / Image / Amenity support for existing tour schema
-- ============================================================================
-- This script extends the existing tour schema in public.tours and public.tour_operators.
-- It does NOT recreate the existing public.tours table or overwrite existing tour bookings.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. Tour Categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tour_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.tour_categories (name, description, icon, color, is_active) VALUES
  ('Tarihî', 'Antik medeniyetler, müzeler, arkeolojik siteler', '🏛️', '#8B4513', true),
  ('Doğa', 'Ormanlar, dağlar, ormanlı alanlar, kuş gözlemciliği', '🌲', '#228B22', true),
  ('Macera', 'Tırmanış, su sporları, paragliding, dalgıç', '⛺', '#FF6347', true),
  ('Şehir', 'Şehir turu, alışveriş, kültür, rehberli geziler', '🏙️', '#4169E1', true),
  ('Gözlem', 'Kuş, yıldız, fotoğraf, doğa fotoğrafçılığı', '🔭', '#2F4F4F', true),
  ('Kültür', 'Yerel kültür, sanat, müzik, festival', '🎭', '#9932CC', true),
  ('Gourmet', 'Yemek turu, şarap tadımı, yerel mutfak', '🍷', '#DC143C', true),
  ('Din', 'Dini mekanlar, ziyaretler, spor', '⛪', '#FFD700', true)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_tour_categories_name ON public.tour_categories(name);

-- ============================================================================
-- 2. Tour Guides
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tour_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES public.tour_operators(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(20),
  experience_years INT DEFAULT 0,
  certifications_text TEXT,
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  tours_completed INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_guides_operator_id ON public.tour_guides(operator_id);

-- ============================================================================
-- 3. Guide Languages
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.guide_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES public.tour_guides(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  language_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(20) DEFAULT 'native',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guide_languages_guide_id ON public.guide_languages(guide_id);

-- ============================================================================
-- 4. Guide Certifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.guide_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES public.tour_guides(id) ON DELETE CASCADE,
  certification_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guide_certifications_guide_id ON public.guide_certifications(guide_id);

-- ============================================================================
-- 5. Extend existing tours table
-- ============================================================================
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS tour_guide_id UUID REFERENCES public.tour_guides(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tour_category_id UUID REFERENCES public.tour_categories(id),
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS detailed_itinerary TEXT,
  ADD COLUMN IF NOT EXISTS meeting_point TEXT,
  ADD COLUMN IF NOT EXISTS min_participants INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS cancellation_policy TEXT,
  ADD COLUMN IF NOT EXISTS language_info TEXT;

CREATE INDEX IF NOT EXISTS idx_tours_guide_id ON public.tours(tour_guide_id);
CREATE INDEX IF NOT EXISTS idx_tours_category_id ON public.tours(tour_category_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);

-- ============================================================================
-- 6. Tour Images
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tour_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  storage_path VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_images_tour_id ON public.tour_images(tour_id);

-- ============================================================================
-- 7. Tour Amenities
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tour_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  amenity_name VARCHAR(100) NOT NULL,
  amenity_icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_amenities_tour_id ON public.tour_amenities(tour_id);

-- ============================================================================
-- 8. Tour Pricing Rules
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tour_pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  rule_type VARCHAR(50) NOT NULL,
  season_name VARCHAR(100),
  season_start_date DATE,
  season_end_date DATE,
  min_group_size INT,
  max_group_size INT,
  days_before_tour INT,
  price_adjustment NUMERIC(10, 2),
  price_adjustment_percent NUMERIC(5, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_rules_tour_id ON public.tour_pricing_rules(tour_id);

-- ============================================================================
-- 9. Seed Example Guide
-- ============================================================================
INSERT INTO public.tour_guides (user_id, operator_id, full_name, bio, experience_years, is_active, is_available)
SELECT
  p.id,
  o.id,
  p.full_name,
  'Deneyimli İstanbul rehberi, 10+ yıl tecrübesi',
  10,
  true,
  true
FROM public.profiles p
JOIN public.tour_operators o ON o.user_id = p.id
WHERE p.email = 'dogusyaman402@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM public.tour_guides g WHERE g.user_id = p.id)
LIMIT 1;

INSERT INTO public.guide_languages (guide_id, language_code, language_name, proficiency_level)
SELECT g.id, 'tr', 'Türkçe', 'native'
FROM public.tour_guides g
WHERE NOT EXISTS (
  SELECT 1 FROM public.guide_languages gl
  WHERE gl.guide_id = g.id AND gl.language_code = 'tr'
);

INSERT INTO public.guide_languages (guide_id, language_code, language_name, proficiency_level)
SELECT g.id, 'en', 'English', 'fluent'
FROM public.tour_guides g
WHERE NOT EXISTS (
  SELECT 1 FROM public.guide_languages gl
  WHERE gl.guide_id = g.id AND gl.language_code = 'en'
);
