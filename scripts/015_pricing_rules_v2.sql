-- Extend seasonal pricing rules to support month-based and minimum-night discounts
-- Tarih aralığı, ay bazlı ve minimum gece kuralı için ek alanlar.

ALTER TABLE public.listing_seasonal_pricing
  ADD COLUMN IF NOT EXISTS rule_type TEXT NOT NULL DEFAULT 'date_range'
    CHECK (rule_type IN ('date_range', 'month', 'min_nights')),
  ADD COLUMN IF NOT EXISTS month_of_year INTEGER,
  ADD COLUMN IF NOT EXISTS min_nights INTEGER;

ALTER TABLE public.listing_seasonal_pricing
  ALTER COLUMN start_date DROP NOT NULL,
  ALTER COLUMN end_date DROP NOT NULL;

ALTER TABLE public.listing_seasonal_pricing
  DROP CONSTRAINT IF EXISTS listing_seasonal_pricing_rule_shape,
  ADD CONSTRAINT listing_seasonal_pricing_rule_shape CHECK (
    (rule_type = 'date_range' AND start_date IS NOT NULL AND end_date IS NOT NULL)
    OR (rule_type = 'month' AND month_of_year BETWEEN 1 AND 12)
    OR (rule_type = 'min_nights' AND min_nights IS NOT NULL AND min_nights >= 1)
  );

CREATE INDEX IF NOT EXISTS idx_listing_seasonal_pricing_listing_rule
  ON public.listing_seasonal_pricing(listing_id, rule_type, month_of_year, min_nights);
