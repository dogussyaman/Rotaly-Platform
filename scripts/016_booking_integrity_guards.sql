-- Booking integrity guards
-- Prevents double booking race conditions and enforces blocked-date availability.

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE INDEX IF NOT EXISTS idx_bookings_listing_date_status
  ON public.bookings (listing_id, check_in, check_out, status);

CREATE OR REPLACE FUNCTION public.prevent_invalid_or_overlapping_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $booking_guard$
BEGIN
  IF NEW.check_in IS NULL OR NEW.check_out IS NULL THEN
    RAISE EXCEPTION 'BOOKING_INVALID_DATES';
  END IF;

  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'BOOKING_INVALID_DATE_RANGE';
  END IF;

  IF COALESCE(NEW.guests_count, 0) <= 0 THEN
    RAISE EXCEPTION 'BOOKING_INVALID_GUESTS';
  END IF;

  IF NEW.status IN ('pending', 'confirmed', 'completed') THEN
    IF EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.listing_id = NEW.listing_id
        AND b.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND b.status IN ('pending', 'confirmed', 'completed')
        AND daterange(b.check_in, b.check_out, '[)') && daterange(NEW.check_in, NEW.check_out, '[)')
    ) THEN
      RAISE EXCEPTION 'BOOKING_OVERLAP';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM public.availability_calendar ac
      WHERE ac.listing_id = NEW.listing_id
        AND ac.is_available = false
        AND ac.date >= NEW.check_in
        AND ac.date < NEW.check_out
    ) THEN
      RAISE EXCEPTION 'BOOKING_UNAVAILABLE_DATES';
    END IF;
  END IF;

  RETURN NEW;
END;
$booking_guard$;

DROP TRIGGER IF EXISTS trg_prevent_invalid_or_overlapping_booking ON public.bookings;
CREATE TRIGGER trg_prevent_invalid_or_overlapping_booking
BEFORE INSERT OR UPDATE OF listing_id, check_in, check_out, guests_count, status
ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_invalid_or_overlapping_booking();
