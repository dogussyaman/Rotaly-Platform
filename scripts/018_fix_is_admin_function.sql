-- Hotfix for environments where public.is_admin() was created against a non-existent profiles.is_admin column.
-- Replaces function body to read admin role from public.user_roles.

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id
      AND role = 'admin'
  );
$$;
