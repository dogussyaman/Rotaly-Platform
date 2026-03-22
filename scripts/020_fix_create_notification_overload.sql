-- Fix notification function signature mismatch for trigger calls using text literals.
-- Some environments resolve literals as unknown/text and fail to match the enum/smallint signature.

DROP FUNCTION IF EXISTS public.create_notification(
  uuid,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  uuid,
  uuid,
  text,
  integer
);

CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_actor_id uuid DEFAULT NULL,
  p_booking_id uuid DEFAULT NULL,
  p_listing_id uuid DEFAULT NULL,
  p_conversation_id uuid DEFAULT NULL,
  p_action_url text DEFAULT NULL,
  p_priority integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_type public.notification_type;
  v_priority smallint;
BEGIN
  v_type := p_type::public.notification_type;
  v_priority := COALESCE(p_priority, 0)::smallint;

  RETURN public.create_notification(
    p_user_id,
    v_type,
    p_title,
    p_body,
    COALESCE(p_metadata, '{}'::jsonb),
    p_actor_id,
    p_booking_id,
    p_listing_id,
    p_conversation_id,
    p_action_url,
    v_priority
  );
END;
$$;
