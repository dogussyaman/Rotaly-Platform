-- Add check-in time window and extras metadata to bookings

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS check_in_slot_start TIME,
ADD COLUMN IF NOT EXISTS check_in_slot_end TIME,
ADD COLUMN IF NOT EXISTS extras JSONB;

