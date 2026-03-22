-- Admin management policies for real operational control
-- Enables admin write actions for role management and first-signup coupon management.

-- Profiles: admin can update verification and host flags
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- User roles: admin can fully manage role records
DROP POLICY IF EXISTS "user_roles_insert_admin" ON public.user_roles;
CREATE POLICY "user_roles_insert_admin" ON public.user_roles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;
CREATE POLICY "user_roles_update_admin" ON public.user_roles
  FOR UPDATE USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "user_roles_delete_admin" ON public.user_roles;
CREATE POLICY "user_roles_delete_admin" ON public.user_roles
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Coupons: admin can create/update/delete any coupon (including platform-level welcome coupon)
DROP POLICY IF EXISTS "coupons_insert_admin" ON public.coupons;
CREATE POLICY "coupons_insert_admin" ON public.coupons
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "coupons_update_admin" ON public.coupons;
CREATE POLICY "coupons_update_admin" ON public.coupons
  FOR UPDATE USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "coupons_delete_admin" ON public.coupons;
CREATE POLICY "coupons_delete_admin" ON public.coupons
  FOR DELETE USING (public.is_admin(auth.uid()));
