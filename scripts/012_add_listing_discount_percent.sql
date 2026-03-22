-- Sadece discount_percent kolonunu ekler.
-- "column listings.discount_percent does not exist" hatası alıyorsan bu dosyayı Supabase SQL Editor'da çalıştır.

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) NULL;

COMMENT ON COLUMN public.listings.discount_percent IS 'Liste ve kartta gösterilecek indirim oranı (örn. 10 = %10 indirim). NULL = indirim rozeti yok.';
