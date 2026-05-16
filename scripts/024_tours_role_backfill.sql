-- ============================================================================
-- TOURS backfill: host-linked operators + auth role metadata sync
-- Run AFTER 023_tours_rls_extensions.sql
-- ============================================================================

-- Ensure existing operators are typed as company unless already host-linked
UPDATE public.tour_operators
SET operator_type = 'company'
WHERE operator_type IS NULL
   OR operator_type NOT IN ('host', 'company');

UPDATE public.tour_operators
SET operator_type = 'host'
WHERE host_id IS NOT NULL
  AND operator_type <> 'host';

-- Backfill host-linked tour operators for hosts with tours_enabled
INSERT INTO public.tour_operators (user_id, host_id, operator_type, company_name, phone, website)
SELECT
  h.user_id,
  h.id,
  'host',
  COALESCE(p.full_name, p.email, 'Ev Sahibi Turları'),
  p.phone,
  NULL
FROM public.hosts h
JOIN public.profiles p ON p.id = h.user_id
WHERE h.tours_enabled = true
  AND NOT EXISTS (
    SELECT 1
    FROM public.tour_operators o
    WHERE o.host_id = h.id
  )
ON CONFLICT DO NOTHING;

-- Sync user_id on host-linked operators if host user changed (safety)
UPDATE public.tour_operators o
SET user_id = h.user_id
FROM public.hosts h
WHERE o.host_id = h.id
  AND o.operator_type = 'host'
  AND o.user_id IS DISTINCT FROM h.user_id;

-- Auth metadata: tour_operator role users (idempotent, 007-style)
UPDATE auth.users u
SET raw_user_meta_data =
  jsonb_set(COALESCE(u.raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('tour_operator'::text), true)
WHERE EXISTS (
  SELECT 1
  FROM public.user_roles r
  WHERE r.user_id = u.id
    AND r.role = 'tour_operator'
)
AND COALESCE(u.raw_user_meta_data ->> 'role', '') NOT IN ('admin');
