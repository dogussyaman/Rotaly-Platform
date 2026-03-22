-- ═══════════════════════════════════════════════════
-- ADIM 1: Kullanıcıyı ev sahibi yap
-- ═══════════════════════════════════════════════════
-- NOTE: Bu script `public.profiles.is_host` alanını günceller.
-- Eğer bu kullanıcı için `public.profiles` kaydı yoksa (trigger sonradan eklendiyse),
-- önce `auth.users` üzerinden profile kaydını backfill eder.

INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(NULLIF(u.raw_user_meta_data ->> 'full_name', ''), NULLIF(u.raw_user_meta_data ->> 'name', ''), u.email),
  COALESCE(NULLIF(u.raw_user_meta_data ->> 'avatar_url', ''), NULLIF(u.raw_user_meta_data ->> 'picture', '')),
  u.created_at,
  NOW()
FROM auth.users u
WHERE u.id = '1dbaca10-d38d-479b-8543-5fe02fda1877'
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
  avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
  updated_at = NOW();

-- Auth meta data'da da "primary role" alanını tutarlı tut (debug için)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', to_jsonb('host'::text), true)
WHERE id = '1dbaca10-d38d-479b-8543-5fe02fda1877';

UPDATE public.profiles
SET is_host = true, updated_at = NOW()
WHERE id = '1dbaca10-d38d-479b-8543-5fe02fda1877';

-- ═══════════════════════════════════════════════════
-- ADIM 2: hosts tablosuna satır ekle (listings için gerekli)
-- ═══════════════════════════════════════════════════
INSERT INTO public.hosts (user_id, response_rate, response_time, superhost, languages)
SELECT
  '1dbaca10-d38d-479b-8543-5fe02fda1877',
  98.0,
  'within an hour',
  false,
  ARRAY['Türkçe', 'English']
WHERE NOT EXISTS (
  SELECT 1 FROM public.hosts WHERE user_id = '1dbaca10-d38d-479b-8543-5fe02fda1877'
);

-- ═══════════════════════════════════════════════════
-- ADIM 3: 5 İstanbul ilanı ekle
-- ═══════════════════════════════════════════════════
DO $$
DECLARE
  v_host_id UUID;
  l1 UUID; l2 UUID; l3 UUID; l4 UUID; l5 UUID;
BEGIN
  -- hosts tablosundaki id'yi al (profiles.id değil!)
  SELECT id INTO v_host_id
  FROM public.hosts
  WHERE user_id = '1dbaca10-d38d-479b-8543-5fe02fda1877'
  LIMIT 1;

  -- İlan 1: Beyoğlu Modern Loft
  INSERT INTO public.listings (
    host_id, title, description, property_type,
    address, city, country,
    latitude, longitude,
    price_per_night, cleaning_fee, service_fee,
    max_guests, bedrooms, beds, bathrooms,
    check_in_time, check_out_time,
    instant_booking, is_active, rating, total_reviews
  ) VALUES (
    v_host_id,
    'Beyoğlu''nda Boğaz Manzaralı Modern Loft',
    'İstiklal Caddesi''ne 5 dakika yürüme mesafesinde, tam donanımlı, ışık dolu modern loft. Geniş balkonundan Boğaz ve Galata Kulesi manzarası keyifli.',
    'apartment',
    'Beyoğlu, İstiklal Cd. yakınları, İstanbul',
    'İstanbul', 'Türkiye',
    41.0369, 28.9850,
    2200, 200, 150,
    3, 1, 1, 1.0,
    '14:00', '11:00',
    true, true, 4.92, 37
  ) RETURNING id INTO l1;

  -- İlan 2: Kadıköy Moda Deniz Manzarası
  INSERT INTO public.listings (
    host_id, title, description, property_type,
    address, city, country,
    latitude, longitude,
    price_per_night, cleaning_fee, service_fee,
    max_guests, bedrooms, beds, bathrooms,
    check_in_time, check_out_time,
    instant_booking, is_active, rating, total_reviews
  ) VALUES (
    v_host_id,
    'Kadıköy Moda''da Sahil Kenarı Daire',
    'Moda sahiline 2 dakika mesafede, geniş balkonu ve deniz manzarasıyla şehrin en keyifli semtinde bir daire. Kafelere, restoranlara ve vapur iskelesine yürüme mesafesi.',
    'apartment',
    'Kadıköy, Moda Sahili, İstanbul',
    'İstanbul', 'Türkiye',
    40.9790, 29.0260,
    2000, 180, 130,
    2, 1, 1, 1.0,
    '15:00', '11:00',
    true, true, 4.88, 24
  ) RETURNING id INTO l2;

  -- İlan 3: Beşiktaş Çarşı Dairesi
  INSERT INTO public.listings (
    host_id, title, description, property_type,
    address, city, country,
    latitude, longitude,
    price_per_night, cleaning_fee, service_fee,
    max_guests, bedrooms, beds, bathrooms,
    check_in_time, check_out_time,
    instant_booking, is_active, rating, total_reviews
  ) VALUES (
    v_host_id,
    'Beşiktaş Çarşı''da Şık ve Ferah Daire',
    'Beşiktaş çarşısına ve vapur iskelesine yürüme mesafesinde, yüksek tavanlı ve geniş ferah bir daire. İş seyahatleri ve kısa konaklamalar için mükemmel konum.',
    'apartment',
    'Beşiktaş, Çarşı, İstanbul',
    'İstanbul', 'Türkiye',
    41.0430, 29.0050,
    2100, 190, 140,
    3, 2, 2, 1.0,
    '14:00', '12:00',
    false, true, 4.90, 31
  ) RETURNING id INTO l3;

  -- İlan 4: Üsküdar Kuzguncuk Tarihi Ev
  INSERT INTO public.listings (
    host_id, title, description, property_type,
    address, city, country,
    latitude, longitude,
    price_per_night, cleaning_fee, service_fee,
    max_guests, bedrooms, beds, bathrooms,
    check_in_time, check_out_time,
    instant_booking, is_active, rating, total_reviews
  ) VALUES (
    v_host_id,
    'Üsküdar Kuzguncuk''ta Restore Edilmiş Tarihi Ev',
    'Boğaz kıyısındaki sakin Kuzguncuk Mahallesi''nde, özgün detayları korunmuş şekilde restore edilmiş iki katlı tarihi ev. Vapur iskelesine 5 dakika.',
    'cottage',
    'Üsküdar, Kuzguncuk Mah., İstanbul',
    'İstanbul', 'Türkiye',
    41.0445, 29.0280,
    2600, 250, 180,
    4, 2, 3, 2.0,
    '15:00', '11:00',
    false, true, 4.95, 18
  ) RETURNING id INTO l4;

  -- İlan 5: Şişli Bomonti Rezidans
  INSERT INTO public.listings (
    host_id, title, description, property_type,
    address, city, country,
    latitude, longitude,
    price_per_night, cleaning_fee, service_fee,
    max_guests, bedrooms, beds, bathrooms,
    check_in_time, check_out_time,
    instant_booking, is_active, rating, total_reviews
  ) VALUES (
    v_host_id,
    'Şişli Bomonti''de Şehir Manzaralı Rezidans',
    'Yeni inşaat rezidans içinde, şehir manzaralı yüksek kat daire. 24 saat güvenlik, spor salonu ve kapalı otopark dahil. Nişantaşı ve Taksim''e çok yakın.',
    'apartment',
    'Şişli, Bomonti, İstanbul',
    'İstanbul', 'Türkiye',
    41.0620, 28.9770,
    2400, 220, 160,
    2, 1, 1, 1.0,
    '14:00', '12:00',
    true, true, 4.87, 29
  ) RETURNING id INTO l5;

  -- ═══════════════════════════════════════════════
  -- ADIM 4: Her ilan için görsel ekle
  -- ═══════════════════════════════════════════════
  INSERT INTO public.listing_images (listing_id, url, alt_text, is_primary, sort_order) VALUES
    (l1, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'Beyoğlu Modern Loft', true, 0),
    (l1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', 'Loft oturma odası', false, 1),

    (l2, 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200', 'Kadıköy Deniz Manzarası', true, 0),
    (l2, 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200', 'Balkon manzara', false, 1),

    (l3, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200', 'Beşiktaş Daire', true, 0),
    (l3, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200', 'Oturma odası', false, 1),

    (l4, 'https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=1200', 'Kuzguncuk Tarihi Ev', true, 0),
    (l4, 'https://images.unsplash.com/photo-1537671608828-cc564c51e25d?w=1200', 'Arka bahçe', false, 1),

    (l5, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', 'Bomonti Rezidans', true, 0),
    (l5, 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1200', 'Şehir manzarası', false, 1);

  -- ═══════════════════════════════════════════════
  -- ADIM 5: Temel kuralları ekle
  -- ═══════════════════════════════════════════════
  INSERT INTO public.house_rules (listing_id, smoking_allowed, pets_allowed, parties_allowed, additional_rules) VALUES
    (l1, false, false, false, 'Saat 22:00 sonrası sessizlik'),
    (l2, false, true, false, 'Küçük evcil hayvanlar kabul edilir'),
    (l3, false, false, false, 'Komşulara saygı'),
    (l4, false, true, false, 'Tarihi yapıya özen gösteriniz'),
    (l5, false, false, false, '24 saat güvenlik kurallarına uyunuz');

END $$;
