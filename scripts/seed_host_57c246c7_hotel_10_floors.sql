-- Seed data for host user: 57c246c7-7115-4210-b700-de34f44cbeb2
-- Scenario: 10-floor boutique hotel, each floor has 4 rentable rooms (40 listings).
--
-- Safe to run multiple times:
-- - `listing_amenities` uses PK(listing_id, amenity_id) so duplicates are prevented.
-- - `availability_calendar` uses UNIQUE(listing_id, date) so duplicates are prevented.
-- - Other inserts (listings/images/house_rules/bookings) may duplicate if re-run.

DO $$
DECLARE
  v_user_id UUID := '57c246c7-7115-4210-b700-de34f44cbeb2';
  v_guest_user_id UUID := '1dbaca10-d38d-479b-8543-5fe02fda1877';
  v_host_id UUID;
  v_listing_id UUID;
  v_booking_id UUID;
  v_floor INT;
  v_room INT;
  v_room_no INT;
  v_title TEXT;
  v_price NUMERIC(10,2);
  v_is_suite BOOLEAN;
BEGIN
  -- Ensure profiles exist
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

  -- Ensure hosts row exists
  SELECT id INTO v_host_id FROM public.hosts WHERE user_id = v_user_id ORDER BY created_at ASC NULLS LAST LIMIT 1;
  IF v_host_id IS NULL THEN
    INSERT INTO public.hosts (user_id, response_rate, response_time, superhost, total_reviews, languages)
    VALUES (v_user_id, 99.0, 'within an hour', true, 0, ARRAY['Türkçe','English','Deutsch'])
    RETURNING id INTO v_host_id;
  END IF;

  -- Partner profile (hotel)
  IF NOT EXISTS (SELECT 1 FROM public.partner_profiles WHERE user_id = v_user_id) THEN
    INSERT INTO public.partner_profiles (user_id, partner_type, company_name, tax_number, address, website)
    VALUES (
      v_user_id,
      'hotel',
      'Rotaly Anatolian Boutique Hotels',
      'TR-0600-57C2',
      'Atatürk Blv. No:122, Çankaya, Ankara',
      'https://rotaly.example/anatolian-hotels'
    );
  END IF;

  -- 40 room listings (10 floors x 4 rooms. Each floor assigned to a different City)
  FOR v_floor IN 1..10 LOOP
    DECLARE
      v_city_name TEXT;
      v_city_lat NUMERIC;
      v_city_long NUMERIC;
      v_neighborhood TEXT;
      v_base_price NUMERIC;
    BEGIN
      -- Distribution of cities by floor
      CASE v_floor
        WHEN 1 THEN v_city_name := 'Ankara'; v_city_lat := 39.9334; v_city_long := 32.8597; v_neighborhood := 'Çankaya'; v_base_price := 2200;
        WHEN 2 THEN v_city_name := 'İzmir'; v_city_lat := 38.4237; v_city_long := 27.1428; v_neighborhood := 'Alsancak'; v_base_price := 2500;
        WHEN 3 THEN v_city_name := 'Bursa'; v_city_lat := 40.1826; v_city_long := 29.0660; v_neighborhood := 'Osmangazi'; v_base_price := 1900;
        WHEN 4 THEN v_city_name := 'Antalya'; v_city_lat := 36.8841; v_city_long := 30.7056; v_neighborhood := 'Kaleiçi'; v_base_price := 2800;
        WHEN 5 THEN v_city_name := 'Çanakkale'; v_city_lat := 40.1467; v_city_long := 26.4086; v_neighborhood := 'Kordon'; v_base_price := 1850;
        WHEN 6 THEN v_city_name := 'Eskişehir'; v_city_lat := 39.7767; v_city_long := 30.5206; v_neighborhood := 'Odunpazarı'; v_base_price := 1700;
        WHEN 7 THEN v_city_name := 'Trabzon'; v_city_lat := 41.0027; v_city_long := 39.7168; v_neighborhood := 'Ortahisar'; v_base_price := 2000;
        WHEN 8 THEN v_city_name := 'Muğla'; v_city_lat := 37.0344; v_city_long := 27.4305; v_neighborhood := 'Bodrum'; v_base_price := 3500;
        WHEN 9 THEN v_city_name := 'Nevşehir'; v_city_lat := 38.6431; v_city_long := 34.7121; v_neighborhood := 'Göreme'; v_base_price := 3200;
        WHEN 10 THEN v_city_name := 'Gaziantep'; v_city_lat := 37.0662; v_city_long := 37.3833; v_neighborhood := 'Şahinbey'; v_base_price := 2100;
      END CASE;

      FOR v_room IN 1..4 LOOP
        v_room_no := (v_floor * 100) + v_room;
        v_is_suite := (v_room = 4);
        v_title := format('Rotaly %s Luxury Hotel | Oda %s', v_city_name, v_room_no);
        v_price := v_base_price + (CASE WHEN v_is_suite THEN 750 ELSE 0 END);

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
            '%s şehrinin kalbinde, %s bölgesinde yer alan butik otel. %s konseptinde oda. 24 saat resepsiyon, yüksek hızlı WiFi, klima ve yöresel kahvaltı dahil. %s.',
            v_city_name,
            v_neighborhood,
            CASE WHEN v_is_suite THEN 'Premium Suite' ELSE 'Deluxe Double' END,
            CASE WHEN v_is_suite THEN 'Geniş manzara ve jakuzi seçeneği ile' ELSE 'Konforlu ve modern dizayn' END
          ),
          'hotel',
          format('%s No: %s, %s', v_neighborhood, v_room_no, v_city_name),
          v_city_name, 'Türkiye',
          v_city_lat + (random() * 0.01 - 0.005), v_city_long + (random() * 0.01 - 0.005),
          v_price, 0, 200,
          CASE WHEN v_is_suite THEN 3 ELSE 2 END,
          1,
          CASE WHEN v_is_suite THEN 2 ELSE 1 END,
          1.0,
          '14:00', '12:00',
          true, true, 4.90, 0
        )
        RETURNING id INTO v_listing_id;

        -- Images (3 per room - randomized using floor/room)
        INSERT INTO public.listing_images (listing_id, url, alt_text, is_primary, sort_order) VALUES
          (v_listing_id, format('https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=1200&q=80', 
            CASE (v_floor + v_room) % 5 
              WHEN 0 THEN '1542314831-068cd1dbfeeb' 
              WHEN 1 THEN '1566073771279-6a5aafd08c48'
              WHEN 2 THEN '1582719478250-c89cae4dc85b'
              WHEN 3 THEN '1595576508898-0ad5c879a061'
              ELSE '1520250497591-112f2f40a3f4' 
            END), 'Oda konsepti', true, 0),
          (v_listing_id, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80', 'Banyo ve konfor', false, 1),
          (v_listing_id, 'https://images.unsplash.com/photo-1551887373-6f6d74c72bf5?auto=format&fit=crop&w=1200&q=80', 'Lobi alanı', false, 2);

        -- House rules
        INSERT INTO public.house_rules (listing_id, smoking_allowed, pets_allowed, parties_allowed, additional_rules)
        VALUES (v_listing_id, false, false, false, 'Kimlik bildirimi zorunludur. Sessiz saatler 23:00-08:00.');

        -- Amenities
        INSERT INTO public.listing_amenities (listing_id, amenity_id)
        SELECT v_listing_id, a.id FROM public.amenities a
        WHERE a.name IN ('WiFi', 'Air Conditioning', 'Heating', 'TV', 'Elevator', 'Breakfast Included', '24h Check-in', 'Security Cameras')
        ON CONFLICT DO NOTHING;

        -- Availability (next 120 days)
        INSERT INTO public.availability_calendar (listing_id, date, is_available)
        SELECT v_listing_id, d::date, true
        FROM generate_series(current_date, current_date + interval '120 days', interval '1 day') d
        ON CONFLICT DO NOTHING;
      END LOOP;
    END;
  END LOOP;

  -- Sample booking for a specific room (e.g. Antalya Room 404)
  SELECT l.id INTO v_listing_id FROM public.listings l WHERE l.host_id = v_host_id AND l.city = 'Antalya' LIMIT 1;
  IF v_listing_id IS NOT NULL THEN
    INSERT INTO public.bookings (listing_id, guest_id, check_in, check_out, guests_count, total_price, status, check_in_slot_start, check_in_slot_end)
    VALUES (v_listing_id, v_guest_user_id, current_date + 5, current_date + 8, 2, 0, 'confirmed', '14:00', '16:00')
    RETURNING id INTO v_booking_id;

    UPDATE public.bookings SET total_price = (SELECT (price_per_night * 3) + service_fee FROM public.listings WHERE id = v_listing_id),
                               final_price = (SELECT (price_per_night * 3) + service_fee FROM public.listings WHERE id = v_listing_id)
    WHERE id = v_booking_id;

    INSERT INTO public.reviews (booking_id, listing_id, reviewer_id, rating, comment)
    VALUES (v_booking_id, v_listing_id, v_guest_user_id, 5.0, 'Harika bir konaklamaydı, her şey tertemizdi.');
  END IF;
END $$;

