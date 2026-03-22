-- Seed data for host user: 592a7f5a-a254-4803-8c8f-5e9790c78bad
-- Scenario: 10-floor apartment building, each floor has 2 rentable units (A/B).
--
-- Safe to run multiple times:
-- - `listing_amenities` uses PK(listing_id, amenity_id) so duplicates are prevented.
-- - `availability_calendar` uses UNIQUE(listing_id, date) so duplicates are prevented.
-- - Other inserts (listings/images/house_rules/bookings) may duplicate if re-run.

DO $$
DECLARE
  v_user_id UUID := '592a7f5a-a254-4803-8c8f-5e9790c78bad';
  v_guest_user_id UUID := '1dbaca10-d38d-479b-8543-5fe02fda1877';
  v_host_id UUID;
  v_listing_id UUID;
  v_booking_id UUID;
  v_floor INT;
  v_unit INT;
  v_unit_code TEXT;
  v_title TEXT;
  v_price NUMERIC(10,2);
  v_bedrooms INT;
  v_beds INT;
  v_max_guests INT;
BEGIN
  -- Ensure profiles exist (in case triggers were created after users)
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
  SELECT
    u.id,
    u.email,
    COALESCE(NULLIF(u.raw_user_meta_data ->> 'full_name', ''), NULLIF(u.raw_user_meta_data ->> 'name', ''), u.email),
    COALESCE(NULLIF(u.raw_user_meta_data ->> 'avatar_url', ''), NULLIF(u.raw_user_meta_data ->> 'picture', '')),
    u.created_at,
    NOW()
  FROM auth.users u
  WHERE u.id IN (v_user_id, v_guest_user_id)
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();

  -- Mark host + normalize primary role in Auth metadata
  UPDATE public.profiles SET is_host = true, updated_at = NOW() WHERE id = v_user_id;
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('host'::text), true)
  WHERE id = v_user_id;

  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('guest'::text), true)
  WHERE id = v_guest_user_id
    AND (NOT (COALESCE(raw_user_meta_data, '{}'::jsonb) ? 'role') OR NULLIF(raw_user_meta_data ->> 'role', '') IS NULL);

  -- Ensure hosts row exists (and grab hosts.id)
  SELECT id INTO v_host_id FROM public.hosts WHERE user_id = v_user_id ORDER BY created_at ASC NULLS LAST LIMIT 1;
  IF v_host_id IS NULL THEN
    INSERT INTO public.hosts (user_id, response_rate, response_time, superhost, total_reviews, languages)
    VALUES (v_user_id, 96.5, 'within a few hours', false, 0, ARRAY['Türkçe','English'])
    RETURNING id INTO v_host_id;
  END IF;

  -- Optional partner profile (property manager)
  IF NOT EXISTS (SELECT 1 FROM public.partner_profiles WHERE user_id = v_user_id) THEN
    INSERT INTO public.partner_profiles (user_id, partner_type, company_name, tax_number, address, website)
    VALUES (
      v_user_id,
      'property_manager',
      'Rotaly Global Residences',
      'INT-9000-592A',
      '123 Global Plaza, Canary Wharf, London, UK',
      'https://rotaly.example/global-residences'
    );
  END IF;

  -- Create building units as separate listings (20 units: 10 floors x 2 units)
  FOR v_floor IN 1..10 LOOP
    DECLARE
      v_city_name TEXT;
      v_country_name TEXT;
      v_city_lat NUMERIC;
      v_city_long NUMERIC;
      v_neighborhood TEXT;
      v_base_price NUMERIC;
    BEGIN
      -- Distribution of international cities by floor
      CASE v_floor
        WHEN 1 THEN v_city_name := 'Paris'; v_country_name := 'France'; v_city_lat := 48.8566; v_city_long := 2.3522; v_neighborhood := 'Le Marais'; v_base_price := 250;
        WHEN 2 THEN v_city_name := 'London'; v_country_name := 'UK'; v_city_lat := 51.5074; v_city_long := -0.1278; v_neighborhood := 'South Kensington'; v_base_price := 300;
        WHEN 3 THEN v_city_name := 'Berlin'; v_country_name := 'Germany'; v_city_lat := 52.5200; v_city_long := 13.4050; v_neighborhood := 'Mitte'; v_base_price := 180;
        WHEN 4 THEN v_city_name := 'Rome'; v_country_name := 'Italy'; v_city_lat := 41.9028; v_city_long := 12.4964; v_neighborhood := 'Trastevere'; v_base_price := 200;
        WHEN 5 THEN v_city_name := 'Amsterdam'; v_country_name := 'Netherlands'; v_city_lat := 52.3676; v_city_long := 4.9041; v_neighborhood := 'Jordaan'; v_base_price := 220;
        WHEN 6 THEN v_city_name := 'Barcelona'; v_country_name := 'Spain'; v_city_lat := 41.3851; v_city_long := 2.1734; v_neighborhood := 'Eixample'; v_base_price := 190;
        WHEN 7 THEN v_city_name := 'Vienna'; v_country_name := 'Austria'; v_city_lat := 48.2082; v_city_long := 16.3738; v_neighborhood := 'Leopoldstadt'; v_base_price := 170;
        WHEN 8 THEN v_city_name := 'Prague'; v_country_name := 'Czech Republic'; v_city_lat := 50.0755; v_city_long := 14.4378; v_neighborhood := 'Vinohrady'; v_base_price := 150;
        WHEN 9 THEN v_city_name := 'Budapest'; v_country_name := 'Hungary'; v_city_lat := 47.4979; v_city_long := 19.0402; v_neighborhood := 'Jewish Quarter'; v_base_price := 130;
        WHEN 10 THEN v_city_name := 'Lisbon'; v_country_name := 'Portugal'; v_city_lat := 38.7223; v_city_long := -9.1393; v_neighborhood := 'Alfama'; v_base_price := 160;
      END CASE;

      FOR v_unit IN 1..2 LOOP
        v_unit_code := CASE WHEN v_unit = 1 THEN 'A' ELSE 'B' END;
        v_title := format('Rotaly %s Residence | Unit %s%s', v_city_name, v_floor, v_unit_code);

        v_bedrooms := CASE WHEN v_floor <= 3 THEN 1 WHEN v_floor <= 7 THEN 2 ELSE 3 END;
        v_beds := v_bedrooms + 1;
        v_max_guests := CASE WHEN v_bedrooms = 1 THEN 3 WHEN v_bedrooms = 2 THEN 5 ELSE 7 END;
        v_price := v_base_price + (v_unit * 20);

        INSERT INTO public.listings (
          host_id, title, description, property_type,
          address, city, country,
          latitude, longitude,
          price_per_night, cleaning_fee, service_fee,
          max_guests, bedrooms, beds, bathrooms,
          check_in_time, check_out_time,
          instant_booking, is_active, rating, total_reviews
        )
        VALUES (
          v_host_id,
          v_title,
          format(
            'Modern apartment in the hearth of %s (%s). Located in %s neighborhood. Features %s bedrooms, high-speed WiFi, fully equipped kitchen and scenic views. Perfect for both short and long stays.',
            v_city_name, v_country_name, v_neighborhood, v_bedrooms
          ),
          'apartment',
          format('%s St. No: %s, %s', v_neighborhood, 10 + v_floor + v_unit, v_city_name),
          v_city_name, v_country_name,
          v_city_lat + (random() * 0.01 - 0.005), v_city_long + (random() * 0.01 - 0.005),
          v_price, 50, 30,
          v_max_guests, v_bedrooms, v_beds, 1.0 + (CASE WHEN v_bedrooms >= 3 THEN 1 ELSE 0 END),
          '15:00', '11:00',
          true, true, 4.85, 0
        )
        RETURNING id INTO v_listing_id;

        -- Images (3 per unit)
        INSERT INTO public.listing_images (listing_id, url, alt_text, is_primary, sort_order) VALUES
          (v_listing_id, format('https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=1200&q=80',
            CASE (v_floor + v_unit) % 4
              WHEN 0 THEN '1502672260266-1c1ef2d93688'
              WHEN 1 THEN '1522708323590-d5a0340d0571'
              WHEN 2 THEN '1484154218962-a197022b5858'
              ELSE '1493809842364-78817add7ffb'
            END), 'Living room', true, 0),
          (v_listing_id, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 'Bedroom', false, 1),
          (v_listing_id, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80', 'Kitchen', false, 2);

        -- House rules
        INSERT INTO public.house_rules (listing_id, smoking_allowed, pets_allowed, parties_allowed)
        VALUES (v_listing_id, false, true, false);

        -- Amenities
        INSERT INTO public.listing_amenities (listing_id, amenity_id)
        SELECT v_listing_id, a.id FROM public.amenities a
        WHERE a.name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Heating', 'Elevator', 'Washer', 'Workspace')
        ON CONFLICT DO NOTHING;

        -- Availability (next 90 days)
        INSERT INTO public.availability_calendar (listing_id, date, is_available)
        SELECT v_listing_id, d::date, true
        FROM generate_series(current_date, current_date + interval '90 days', interval '1 day') d
        ON CONFLICT DO NOTHING;
      END LOOP;
    END;
  END LOOP;

  -- A sample booking
  SELECT l.id INTO v_listing_id FROM public.listings l WHERE l.host_id = v_host_id AND l.city = 'London' LIMIT 1;
  IF v_listing_id IS NOT NULL THEN
    INSERT INTO public.bookings (listing_id, guest_id, check_in, check_out, guests_count, total_price, status)
    VALUES (v_listing_id, v_guest_user_id, current_date + 10, current_date + 15, 2, 0, 'confirmed')
    RETURNING id INTO v_booking_id;

    UPDATE public.bookings SET total_price = (SELECT (price_per_night * 5) + cleaning_fee + service_fee FROM public.listings WHERE id = v_listing_id),
                               final_price = (SELECT (price_per_night * 5) + cleaning_fee + service_fee FROM public.listings WHERE id = v_listing_id)
    WHERE id = v_booking_id;

    INSERT INTO public.reviews (booking_id, listing_id, reviewer_id, rating, comment)
    VALUES (v_booking_id, v_listing_id, v_guest_user_id, 4.9, 'Brilliant stay in the heart of London. Highly recommended!');
  END IF;
END $$;

