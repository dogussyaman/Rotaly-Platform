-- =============================================================================
-- 019_host_coupon_policies.sql
-- Host kullanıcıların kendi otelleri için kupon tanımlayabilmesini sağlar.
--
-- Mantık:
--   coupons.host_id → hosts.id → hosts.user_id = auth.uid()
--   Bir host, kendi host kaydına bağlı tüm otel ilanlarında geçerli olacak
--   kupon oluşturabilir, güncelleyebilir ve silebilir.
--   Platform admini ise her kuponu yönetebilir (mevcut politikalar korunuyor).
--
-- ÖNEMLİ: Bu dosya eski "coupons_manage_own" politikasını kaldırır.
--   O politika tüm kullanıcıların (misafirler dahil) created_by = auth.uid()
--   koşuluyla kupon yönetmesine izin veriyordu – bu bir güvenlik açığıydı.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. is_host helper (benzeri is_admin gibi çalışır)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_host(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hosts WHERE user_id = uid
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Eski güvensiz politikayı kaldır
--    "coupons_manage_own" → created_by = auth.uid() koşulu çok genişti,
--    misafir kullanıcılar da kupon oluşturabiliyordu.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_manage_own" ON public.coupons;

-- ---------------------------------------------------------------------------
-- 3. HOST: kendi host_id'sine ait kupon INSERT
--    Host, yalnızca kendi hosts.id değeriyle eşleşen host_id'li kupon ekleyebilir.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_insert_host" ON public.coupons;
CREATE POLICY "coupons_insert_host" ON public.coupons
  FOR INSERT
  WITH CHECK (
    -- İstekte gönderilen host_id, oturum açan kullanıcının hosts kaydına ait olmalı
    host_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.hosts h
      WHERE h.id = host_id
        AND h.user_id = auth.uid()
    )
    -- Admin bu politikadan bağımsız olarak ayrı politikayla (coupons_insert_admin) ekleyebilir
    AND NOT public.is_admin(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 4. HOST: kendi kuponlarını UPDATE
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_update_host" ON public.coupons;
CREATE POLICY "coupons_update_host" ON public.coupons
  FOR UPDATE
  USING (
    NOT public.is_admin(auth.uid())
    AND host_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.hosts h
      WHERE h.id = host_id
        AND h.user_id = auth.uid()
    )
  )
  WITH CHECK (
    NOT public.is_admin(auth.uid())
    AND host_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.hosts h
      WHERE h.id = host_id
        AND h.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 5. HOST: kendi kuponlarını DELETE
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_delete_host" ON public.coupons;
CREATE POLICY "coupons_delete_host" ON public.coupons
  FOR DELETE
  USING (
    NOT public.is_admin(auth.uid())
    AND host_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.hosts h
      WHERE h.id = host_id
        AND h.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 6. HOST: kendi host_id'sine ait kuponları SELECT
--    (Mevcut admin SELECT politikası zaten var; buna ek olarak host görebilir)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupons_select_host" ON public.coupons;
CREATE POLICY "coupons_select_host" ON public.coupons
  FOR SELECT
  USING (
    host_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.hosts h
      WHERE h.id = host_id
        AND h.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 7. Kupon doğrulama: kupon'un host_id'si rezervasyon yapılan ilanın
--    host_id'siyle eşleşmeli.
--    Uygulama katmanı (validateCoupon) bu kontrolü yapar; ayrıca bir DB
--    fonksiyonu olarak da tanımlıyoruz.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_coupon_for_listing(
  p_coupon_id  uuid,
  p_listing_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      -- Kupona host_id bağlı değilse platform genelinde geçerlidir
      WHEN c.host_id IS NULL THEN true
      -- Kupona host_id bağlıysa, ilanın aynı hosta ait olması gerekir
      ELSE c.host_id = l.host_id
    END
  FROM public.coupons  c
  JOIN public.listings l ON l.id = p_listing_id
  WHERE c.id = p_coupon_id
  LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- 8. coupon_usages'ta host Select politikası (eğer yoksa ekle)
--    Host, kendi kuponlarının kullanım kayıtlarını görebilir.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "coupon_usages_select_host" ON public.coupon_usages;
CREATE POLICY "coupon_usages_select_host" ON public.coupon_usages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.coupons c
      JOIN public.hosts h ON h.id = c.host_id
      WHERE c.id = coupon_id
        AND h.user_id = auth.uid()
    )
  );
