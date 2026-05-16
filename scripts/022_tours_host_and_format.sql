-- ============================================================================
-- TOURS: Host optional tours + operator types + tour format (individual/group)
-- Run AFTER 005_tours.sql and 021_tours_system.sql
-- Does NOT modify existing 005/021 files.
-- ============================================================================

-- Host can opt-in to tour management from dashboard (self-service)
ALTER TABLE public.hosts
  ADD COLUMN IF NOT EXISTS tours_enabled BOOLEAN NOT NULL DEFAULT false;

-- Link tour operator to a host record (host-linked operators)
ALTER TABLE public.tour_operators
  ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES public.hosts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS operator_type TEXT NOT NULL DEFAULT 'company';

-- Backfill operator_type for existing rows before CHECK
UPDATE public.tour_operators
SET operator_type = 'company'
WHERE operator_type IS NULL OR operator_type NOT IN ('host', 'company');

ALTER TABLE public.tour_operators
  DROP CONSTRAINT IF EXISTS tour_operators_operator_type_check;

ALTER TABLE public.tour_operators
  ADD CONSTRAINT tour_operators_operator_type_check
  CHECK (operator_type IN ('host', 'company'));

-- One tour operator profile per host
CREATE UNIQUE INDEX IF NOT EXISTS idx_tour_operators_host_id_unique
  ON public.tour_operators(host_id)
  WHERE host_id IS NOT NULL;

-- Explicit tour format: individual vs group
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS tour_format TEXT NOT NULL DEFAULT 'group';

UPDATE public.tours
SET tour_format = 'group'
WHERE tour_format IS NULL OR tour_format NOT IN ('individual', 'group');

ALTER TABLE public.tours
  DROP CONSTRAINT IF EXISTS tours_tour_format_check;

ALTER TABLE public.tours
  ADD CONSTRAINT tours_tour_format_check
  CHECK (tour_format IN ('individual', 'group'));

CREATE INDEX IF NOT EXISTS idx_tours_tour_format ON public.tours(tour_format);
CREATE INDEX IF NOT EXISTS idx_tour_operators_host_id ON public.tour_operators(host_id);
CREATE INDEX IF NOT EXISTS idx_tour_operators_operator_type ON public.tour_operators(operator_type);

-- ============================================================================
-- updated_at triggers for 021 extension tables
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tour_categories_set_updated_at ON public.tour_categories;
CREATE TRIGGER tour_categories_set_updated_at
  BEFORE UPDATE ON public.tour_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tour_guides_set_updated_at ON public.tour_guides;
CREATE TRIGGER tour_guides_set_updated_at
  BEFORE UPDATE ON public.tour_guides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS guide_certifications_set_updated_at ON public.guide_certifications;
CREATE TRIGGER guide_certifications_set_updated_at
  BEFORE UPDATE ON public.guide_certifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tour_pricing_rules_set_updated_at ON public.tour_pricing_rules;
CREATE TRIGGER tour_pricing_rules_set_updated_at
  BEFORE UPDATE ON public.tour_pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
