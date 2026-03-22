-- Dynamic pricing: seasonal rules + extra guest fee
-- Ev sahibi sezonluk yüzde/indirim ve ek kişi ücreti tanımlayabilir.

-- Listings: ek kişi ücreti, fiyata dahil kişi sayısı, liste/kart için indirim oranı
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS base_guests INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS extra_guest_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) NULL;

COMMENT ON COLUMN public.listings.discount_percent IS 'Liste ve kartta gösterilecek indirim oranı (örn. 10 = %%10 indirim). NULL = indirim rozeti yok.';

COMMENT ON COLUMN public.listings.base_guests IS 'Fiyata dahil misafir sayısı (bunun üzeri ek ücret).';
COMMENT ON COLUMN public.listings.extra_guest_fee IS 'base_guests üzeri her misafir için gece başı ek ücret (TL).';

-- Sezonluk fiyat kuralları (tarih aralığına göre yüzde veya sabit değişim)
CREATE TABLE IF NOT EXISTS public.listing_seasonal_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  modifier_type TEXT NOT NULL CHECK (modifier_type IN ('percent', 'fixed')),
  modifier_value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

COMMENT ON TABLE public.listing_seasonal_pricing IS 'Sezonluk fiyat: percent = yüzde değişim (örn. 20 = %%20 artış, -10 = %%10 indirim); fixed = gece başı sabit TL ekleme/indirim.';
COMMENT ON COLUMN public.listing_seasonal_pricing.modifier_type IS 'percent: base * (1 + value/100); fixed: base + value per night.';
COMMENT ON COLUMN public.listing_seasonal_pricing.modifier_value IS 'percent: -100..500; fixed: TL per night (negatif = indirim).';

CREATE INDEX IF NOT EXISTS idx_listing_seasonal_pricing_listing_dates
  ON public.listing_seasonal_pricing(listing_id, start_date, end_date);

-- RLS
ALTER TABLE public.listing_seasonal_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "listing_seasonal_pricing_select_all"
  ON public.listing_seasonal_pricing FOR SELECT USING (true);

CREATE POLICY "listing_seasonal_pricing_insert_host"
  ON public.listing_seasonal_pricing FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.listings l
    JOIN public.hosts h ON l.host_id = h.id
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

CREATE POLICY "listing_seasonal_pricing_update_host"
  ON public.listing_seasonal_pricing FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.listings l
    JOIN public.hosts h ON l.host_id = h.id
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

CREATE POLICY "listing_seasonal_pricing_delete_host"
  ON public.listing_seasonal_pricing FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.listings l
    JOIN public.hosts h ON l.host_id = h.id
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));
