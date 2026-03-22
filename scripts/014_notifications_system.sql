-- Notifications system: tables, functions, and triggers

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM (
      'message_received',
      'booking_request',
      'booking_request_sent',
      'booking_confirmed',
      'booking_cancelled',
      'booking_completed',
      'trip_reminder_24h',
      'trip_reminder_3h',
      'host_checkin_24h',
      'host_checkin_3h',
      'review_reminder'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_job_status') THEN
    CREATE TYPE public.notification_job_status AS ENUM (
      'pending',
      'processed',
      'cancelled',
      'failed'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  priority SMALLINT DEFAULT 0,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications(user_id, is_read)
  WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_booking
  ON public.notifications(booking_id);

CREATE TABLE IF NOT EXISTS public.notification_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  action_url TEXT,
  priority SMALLINT DEFAULT 0,
  run_at TIMESTAMPTZ NOT NULL,
  status public.notification_job_status DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS notification_jobs_dedupe
  ON public.notification_jobs(user_id, booking_id, type, run_at);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_due
  ON public.notification_jobs(status, run_at);

-- Helper: is_admin(user_id) - used in RLS policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'is_admin'
      AND pg_function_is_visible(oid)
  ) THEN
    CREATE FUNCTION public.is_admin(p_user_id uuid)
    RETURNS boolean
    LANGUAGE sql
    STABLE
    SECURITY DEFINER
    SET search_path = public
    AS $fn$
      SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = p_user_id
          AND role = 'admin'
      );
    $fn$;
  END IF;
END $$;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notifications_select_own ON public.notifications;
CREATE POLICY notifications_select_own ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS notifications_update_own ON public.notifications;
CREATE POLICY notifications_update_own ON public.notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Helper: insert a notification (used by triggers / jobs)
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type public.notification_type,
  p_title text,
  p_body text,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_actor_id uuid DEFAULT NULL,
  p_booking_id uuid DEFAULT NULL,
  p_listing_id uuid DEFAULT NULL,
  p_conversation_id uuid DEFAULT NULL,
  p_action_url text DEFAULT NULL,
  p_priority smallint DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    body,
    metadata,
    actor_id,
    booking_id,
    listing_id,
    conversation_id,
    action_url,
    priority
  )
  VALUES (
    p_user_id,
    p_type,
    p_title,
    p_body,
    COALESCE(p_metadata, '{}'::jsonb),
    p_actor_id,
    p_booking_id,
    p_listing_id,
    p_conversation_id,
    p_action_url,
    p_priority
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Helper: enqueue a scheduled notification job
CREATE OR REPLACE FUNCTION public.enqueue_notification_job(
  p_user_id uuid,
  p_type public.notification_type,
  p_title text,
  p_body text,
  p_run_at timestamptz,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_action_url text DEFAULT NULL,
  p_priority smallint DEFAULT 0,
  p_booking_id uuid DEFAULT NULL,
  p_listing_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.notification_jobs (
    user_id,
    type,
    title,
    body,
    run_at,
    metadata,
    action_url,
    priority,
    booking_id,
    listing_id
  )
  VALUES (
    p_user_id,
    p_type,
    p_title,
    p_body,
    p_run_at,
    COALESCE(p_metadata, '{}'::jsonb),
    p_action_url,
    p_priority,
    p_booking_id,
    p_listing_id
  )
  ON CONFLICT (user_id, booking_id, type, run_at) DO NOTHING
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

-- Cancel pending jobs for a booking (used on cancel/reschedule)
CREATE OR REPLACE FUNCTION public.cancel_booking_notification_jobs(
  p_booking_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notification_jobs
  SET status = 'cancelled',
      processed_at = NOW()
  WHERE booking_id = p_booking_id
    AND status = 'pending';
END;
$$;

-- Schedule reminder jobs (24h + 3h) for guest and host
CREATE OR REPLACE FUNCTION public.schedule_booking_reminders(
  p_booking_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_row record;
  checkin_ts timestamptz;
  run_24h timestamptz;
  run_3h timestamptz;
  guest_title text;
  host_title text;
BEGIN
  SELECT
    b.id,
    b.guest_id,
    b.check_in,
    l.id AS listing_id,
    l.title AS listing_title,
    COALESCE(l.check_in_time, '15:00'::time) AS check_in_time,
    h.user_id AS host_user_id
  INTO booking_row
  FROM public.bookings b
  JOIN public.listings l ON l.id = b.listing_id
  JOIN public.hosts h ON h.id = l.host_id
  WHERE b.id = p_booking_id;

  IF booking_row.id IS NULL THEN
    RETURN;
  END IF;

  checkin_ts := (booking_row.check_in::timestamp + booking_row.check_in_time)::timestamptz;
  run_24h := checkin_ts - INTERVAL '1 day';
  run_3h := checkin_ts - INTERVAL '3 hours';

  guest_title := 'Check-in reminder';
  host_title := 'Upcoming check-in';

  IF run_24h > NOW() THEN
    PERFORM public.enqueue_notification_job(
      booking_row.guest_id,
      'trip_reminder_24h',
      guest_title,
      'Your stay starts in 24 hours.',
      run_24h,
      jsonb_build_object('booking_id', booking_row.id, 'listing_id', booking_row.listing_id),
      '/profile?tab=bookings',
      1,
      booking_row.id,
      booking_row.listing_id
    );

    PERFORM public.enqueue_notification_job(
      booking_row.host_user_id,
      'host_checkin_24h',
      host_title,
      'A guest arrives in 24 hours.',
      run_24h,
      jsonb_build_object('booking_id', booking_row.id, 'listing_id', booking_row.listing_id),
      '/dashboard/bookings',
      1,
      booking_row.id,
      booking_row.listing_id
    );
  END IF;

  IF run_3h > NOW() THEN
    PERFORM public.enqueue_notification_job(
      booking_row.guest_id,
      'trip_reminder_3h',
      guest_title,
      'Check-in is in 3 hours.',
      run_3h,
      jsonb_build_object('booking_id', booking_row.id, 'listing_id', booking_row.listing_id),
      '/profile?tab=bookings',
      2,
      booking_row.id,
      booking_row.listing_id
    );

    PERFORM public.enqueue_notification_job(
      booking_row.host_user_id,
      'host_checkin_3h',
      host_title,
      'A guest arrives in 3 hours.',
      run_3h,
      jsonb_build_object('booking_id', booking_row.id, 'listing_id', booking_row.listing_id),
      '/dashboard/bookings',
      2,
      booking_row.id,
      booking_row.listing_id
    );
  END IF;
END;
$$;

-- Process due jobs into actual notifications
CREATE OR REPLACE FUNCTION public.process_due_notification_jobs(
  batch_size integer DEFAULT 100
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  job record;
  processed integer := 0;
BEGIN
  FOR job IN
    SELECT *
    FROM public.notification_jobs
    WHERE status = 'pending'
      AND run_at <= NOW()
    ORDER BY run_at
    LIMIT batch_size
    FOR UPDATE SKIP LOCKED
  LOOP
    BEGIN
      PERFORM public.create_notification(
        job.user_id,
        job.type,
        job.title,
        job.body,
        job.metadata,
        NULL,
        job.booking_id,
        job.listing_id,
        NULL,
        job.action_url,
        job.priority
      );

      UPDATE public.notification_jobs
      SET status = 'processed',
          processed_at = NOW()
      WHERE id = job.id;

      processed := processed + 1;
    EXCEPTION WHEN OTHERS THEN
      UPDATE public.notification_jobs
      SET status = 'failed',
          processed_at = NOW(),
          attempts = attempts + 1,
          last_error = SQLERRM
      WHERE id = job.id;
    END;
  END LOOP;

  RETURN processed;
END;
$$;

-- Message notifications
CREATE OR REPLACE FUNCTION public.notify_message_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_name text;
  listing_title text;
  body_text text;
BEGIN
  SELECT full_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
  SELECT title INTO listing_title FROM public.listings WHERE id = NEW.listing_id;

  body_text := COALESCE(sender_name, 'Someone') || ' sent you a message';
  IF listing_title IS NOT NULL THEN
    body_text := body_text || ' about ' || listing_title;
  END IF;

  PERFORM public.create_notification(
    NEW.receiver_id,
    'message_received',
    'New message',
    body_text,
    jsonb_build_object(
      'message_id', NEW.id,
      'conversation_id', NEW.conversation_id,
      'listing_id', NEW.listing_id,
      'booking_id', NEW.booking_id
    ),
    NEW.sender_id,
    NEW.booking_id,
    NEW.listing_id,
    NEW.conversation_id,
    CASE
      WHEN NEW.conversation_id IS NOT NULL THEN '/messages?conversation=' || NEW.conversation_id
      ELSE '/messages'
    END,
    1
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_message_created_notification ON public.messages;
CREATE TRIGGER on_message_created_notification
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_message_received();

-- Booking notifications (insert)
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  host_user_id uuid;
  guest_name text;
  listing_title text;
BEGIN
  SELECT h.user_id, l.title
  INTO host_user_id, listing_title
  FROM public.listings l
  JOIN public.hosts h ON h.id = l.host_id
  WHERE l.id = NEW.listing_id;

  SELECT full_name INTO guest_name FROM public.profiles WHERE id = NEW.guest_id;

  IF NEW.status = 'pending' THEN
    IF host_user_id IS NOT NULL THEN
      PERFORM public.create_notification(
        host_user_id,
        'booking_request',
        'New booking request',
        COALESCE(guest_name, 'A guest') || ' requested a booking for ' || COALESCE(listing_title, 'your listing') || '.',
        jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
        NEW.guest_id,
        NEW.id,
        NEW.listing_id,
        NULL,
        '/dashboard/bookings',
        2
      );
    END IF;

    PERFORM public.create_notification(
      NEW.guest_id,
      'booking_request_sent',
      'Booking request sent',
      'Your booking request was sent to the host.',
      jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
      host_user_id,
      NEW.id,
      NEW.listing_id,
      NULL,
      '/profile?tab=bookings',
      1
    );
  ELSIF NEW.status = 'confirmed' THEN
    IF host_user_id IS NOT NULL THEN
      PERFORM public.create_notification(
        host_user_id,
        'booking_confirmed',
        'Booking confirmed',
        'A booking has been confirmed.',
        jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
        NEW.guest_id,
        NEW.id,
        NEW.listing_id,
        NULL,
        '/dashboard/bookings',
        2
      );
    END IF;

    PERFORM public.create_notification(
      NEW.guest_id,
      'booking_confirmed',
      'Booking confirmed',
      'Your booking is confirmed.',
      jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
      host_user_id,
      NEW.id,
      NEW.listing_id,
      NULL,
      '/profile?tab=bookings',
      2
    );

    PERFORM public.schedule_booking_reminders(NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_booking_created_notification ON public.bookings;
CREATE TRIGGER on_booking_created_notification
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_booking_created();

-- Booking notifications (status change / reschedule)
CREATE OR REPLACE FUNCTION public.notify_booking_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  host_user_id uuid;
BEGIN
  SELECT h.user_id
  INTO host_user_id
  FROM public.listings l
  JOIN public.hosts h ON h.id = l.host_id
  WHERE l.id = NEW.listing_id;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'confirmed' THEN
      IF host_user_id IS NOT NULL THEN
        PERFORM public.create_notification(
          host_user_id,
          'booking_confirmed',
          'Booking confirmed',
          'A booking has been confirmed.',
          jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
          NEW.guest_id,
          NEW.id,
          NEW.listing_id,
          NULL,
          '/dashboard/bookings',
          2
        );
      END IF;

      PERFORM public.create_notification(
        NEW.guest_id,
        'booking_confirmed',
        'Booking confirmed',
        'Your booking is confirmed.',
        jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
        host_user_id,
        NEW.id,
        NEW.listing_id,
        NULL,
        '/profile?tab=bookings',
        2
      );

      PERFORM public.schedule_booking_reminders(NEW.id);
    ELSIF NEW.status = 'cancelled' THEN
      PERFORM public.cancel_booking_notification_jobs(NEW.id);

      IF host_user_id IS NOT NULL THEN
        PERFORM public.create_notification(
          host_user_id,
          'booking_cancelled',
          'Booking cancelled',
          'A booking was cancelled.',
          jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
          NEW.guest_id,
          NEW.id,
          NEW.listing_id,
          NULL,
          '/dashboard/bookings',
          2
        );
      END IF;

      PERFORM public.create_notification(
        NEW.guest_id,
        'booking_cancelled',
        'Booking cancelled',
        'Your booking was cancelled.',
        jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
        host_user_id,
        NEW.id,
        NEW.listing_id,
        NULL,
        '/profile?tab=bookings',
        2
      );
    ELSIF NEW.status = 'completed' THEN
      PERFORM public.create_notification(
        NEW.guest_id,
        'review_reminder',
        'Leave a review',
        'How was your stay? Share a review.',
        jsonb_build_object('booking_id', NEW.id, 'listing_id', NEW.listing_id),
        host_user_id,
        NEW.id,
        NEW.listing_id,
        NULL,
        '/profile?tab=bookings',
        1
      );
    END IF;
  END IF;

  IF NEW.status = 'confirmed'
     AND (
       NEW.check_in IS DISTINCT FROM OLD.check_in
       OR NEW.check_out IS DISTINCT FROM OLD.check_out
       OR NEW.listing_id IS DISTINCT FROM OLD.listing_id
     ) THEN
    PERFORM public.cancel_booking_notification_jobs(NEW.id);
    PERFORM public.schedule_booking_reminders(NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_booking_updated_notification ON public.bookings;
CREATE TRIGGER on_booking_updated_notification
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_booking_updated();

-- Optional: enable realtime for notifications
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
