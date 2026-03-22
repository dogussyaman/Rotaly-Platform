-- Backfill existing Supabase Auth users into `public.profiles` and normalize `auth.users.raw_user_meta_data.role`.
-- Run this in Supabase SQL Editor (service role / postgres) AFTER you executed the base scripts.
--
-- What it does:
-- 1) Creates missing `public.profiles` rows for existing `auth.users`
-- 2) Ensures every user has `raw_user_meta_data.role` (defaults to 'guest')
-- 3) Updates `raw_user_meta_data.role` based on app tables (priority: admin > tour_operator > host > guest)
--
-- Notes:
-- - `raw_user_meta_data.role` is treated as a *primary* role for quick debugging.
-- - Multiple roles are modeled in `public.user_roles`.

-- 1) Backfill missing profiles for existing users
INSERT INTO public.profiles (id, email, full_name, avatar_url, phone, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(
    NULLIF(u.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(u.raw_user_meta_data ->> 'name', ''),
    NULLIF(u.raw_user_meta_data ->> 'preferred_username', ''),
    u.email
  ) AS full_name,
  COALESCE(
    NULLIF(u.raw_user_meta_data ->> 'avatar_url', ''),
    NULLIF(u.raw_user_meta_data ->> 'picture', '')
  ) AS avatar_url,
  u.phone,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 2) Ensure every auth user has a role (default: guest)
UPDATE auth.users
SET raw_user_meta_data =
  jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb('guest'::text),
    true
  )
WHERE NOT (COALESCE(raw_user_meta_data, '{}'::jsonb) ? 'role')
   OR NULLIF(raw_user_meta_data ->> 'role', '') IS NULL;

-- 3) Sync primary role from app tables (priority: admin > tour_operator > host > guest)

-- Host
UPDATE auth.users u
SET raw_user_meta_data =
  jsonb_set(COALESCE(u.raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('host'::text), true)
WHERE EXISTS (
  SELECT 1
  FROM public.profiles p
  WHERE p.id = u.id AND p.is_host = true
);

-- Tour operator
UPDATE auth.users u
SET raw_user_meta_data =
  jsonb_set(COALESCE(u.raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('tour_operator'::text), true)
WHERE EXISTS (
  SELECT 1
  FROM public.user_roles r
  WHERE r.user_id = u.id AND r.role = 'tour_operator'
);

-- Admin
UPDATE auth.users u
SET raw_user_meta_data =
  jsonb_set(COALESCE(u.raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('admin'::text), true)
WHERE EXISTS (
  SELECT 1
  FROM public.user_roles r
  WHERE r.user_id = u.id AND r.role = 'admin'
);

-- Quick check: users + primary role
-- SELECT u.id, u.email, u.raw_user_meta_data ->> 'role' AS role, u.created_at
-- FROM auth.users u
-- ORDER BY u.created_at DESC;

