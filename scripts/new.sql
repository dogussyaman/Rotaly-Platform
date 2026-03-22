-- ===================================================================
-- 1) Bu admin için host kaydı oluştur
--    Admin user_id: 57c246c7-7115-4210-b700-de34f44cbeb2
-- ===================================================================

-- Aynı user_id için host zaten varsa tekrar eklememek için kontrol
INSERT INTO public.hosts (id, user_id, response_rate, response_time, superhost, total_reviews, languages)
SELECT
  '11111111-1111-1111-1111-111111111111'::uuid AS id,
  '57c246c7-7115-4210-b700-de34f44cbeb2'::uuid AS user_id,
  98.50::decimal(5,2) AS response_rate,
  'within an hour'::text AS response_time,
  true AS superhost,
  245 AS total_reviews,
  ARRAY['Türkçe','English']::text[] AS languages
WHERE NOT EXISTS (
  SELECT 1 FROM public.hosts WHERE user_id = '57c246c7-7115-4210-b700-de34f44cbeb2'::uuid
);

-- Host id (listingler için kullanacağımız sabit id)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.hosts WHERE id = '11111111-1111-1111-1111-111111111111') THEN
    INSERT INTO public.hosts (id, user_id, response_rate, response_time, superhost, total_reviews, languages)
    VALUES (
      '11111111-1111-1111-1111-111111111111',
      '57c246c7-7115-4210-b700-de34f44cbeb2',
      98.50,
      'within an hour',
      true,
      245,
      ARRAY['Türkçe','English']
    );
  END IF;
END;
$$;

-- İsteğe bağlı: partner profile (otel partneri)
INSERT INTO public.partner_profiles (id, user_id, partner_type, company_name, tax_number, address, website)
SELECT
  '22222222-2222-2222-2222-222222222222'::uuid,
  '57c246c7-7115-4210-b700-de34f44cbeb2'::uuid,
  'hotel',
  'Rotaly Hotels & Apartments',
  'TR1234567890',
  'İstanbul, Türkiye',
  'https://rotaly.example.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.partner_profiles
  WHERE user_id = '57c246c7-7115-4210-b700-de34f44cbeb2'::uuid
);

-- ===================================================================
-- 2) 20 adet daire ilanı (10 Türkiye, 10 Yurtdışı)
--    property_type = 'apartment'
--    base_guests + extra_guest_fee ile dinamik fiyat
-- ===================================================================

-- Önce aynı title’lara sahip ilanları temizlemek istersen (opsiyonel):
-- DELETE FROM public.listing_images WHERE listing_id IN (SELECT id FROM public.listings WHERE host_id = '11111111-1111-1111-1111-111111111111');
-- DELETE FROM public.house_rules WHERE listing_id IN (SELECT id FROM public.listings WHERE host_id = '11111111-1111-1111-1111-111111111111');
-- DELETE FROM public.listing_amenities WHERE listing_id IN (SELECT id FROM public.listings WHERE host_id = '11111111-1111-1111-1111-111111111111');
-- DELETE FROM public.listings WHERE host_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO public.listings (
  id,
  host_id,
  title,
  description,
  property_type,
  address,
  city,
  country,
  latitude,
  longitude,
  price_per_night,
  cleaning_fee,
  service_fee,
  max_guests,
  bedrooms,
  beds,
  bathrooms,
  check_in_time,
  check_out_time,
  instant_booking,
  is_active,
  rating,
  total_reviews,
  base_guests,
  extra_guest_fee,
  discount_percent
) VALUES
-- =======================
-- TÜRKİYE (10 DAİRE)
-- =======================
(
  'aaaa0001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'Boğaz Manzaralı Modern Daire',
  'İstanbul Beşiktaş''ta, boğaz manzaralı, yüksek kat, modern döşenmiş, metro ve vapura yürüme mesafesinde geniş bir daire.',
  'apartment',
  'Beşiktaş, İstanbul',
  'İstanbul',
  'Türkiye',
  41.0430,
  29.0030,
  3200.00,        -- fiyat / gece (TL)
  350.00,         -- temizlik ücreti
  0.00,           -- service_fee: 0 → %12 komisyon algoritmadan
  4,              -- max_guests
  2,              -- bedrooms
  3,              -- beds
  1.5,            -- bathrooms
  '15:00',
  '11:00',
  true,           -- instant_booking
  true,           -- is_active
  4.85,           -- rating
  132,            -- total_reviews
  2,              -- base_guests (2 kişiye kadar aynı fiyat)
  350.00,         -- extra_guest_fee (kişi başı / gece)
  15.00           -- discount_percent (örn: %15 kampanya)
),
(
  'aaaa0001-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'Nişantaşı Loft Daire',
  'Nişantaşı''nın kalbinde, kafeler ve butikler arasında yüksek tavanlı loft daire.',
  'apartment',
  'Teşvikiye, İstanbul',
  'İstanbul',
  'Türkiye',
  41.0460,
  28.9870,
  2800.00,
  300.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '14:00',
  '11:00',
  true,
  true,
  4.70,
  98,
  2,
  300.00,
  0.00          -- indirim yok
),
(
  'aaaa0001-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Karşıyaka Deniz Kenarı Daire',
  'İzmir Karşıyaka sahilinde, yürüyüş yoluna ve tramvaya birkaç adım mesafede ferah daire.',
  'apartment',
  'Karşıyaka, İzmir',
  'İzmir',
  'Türkiye',
  38.4590,
  27.0910,
  1900.00,
  250.00,
  0.00,
  4,
  2,
  3,
  1.0,
  '15:00',
  '11:00',
  true,
  true,
  4.60,
  64,
  2,
  250.00,
  10.00        -- %10 indirim
),
(
  'aaaa0001-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'Antalya Konyaaltı Sahil Dairesi',
  'Konyaaltı sahiline 5 dk yürüme mesafesinde, site içinde güvenlikli, havuzlu daire.',
  'apartment',
  'Konyaaltı, Antalya',
  'Antalya',
  'Türkiye',
  36.8750,
  30.6500,
  2100.00,
  250.00,
  0.00,
  5,
  2,
  4,
  1.5,
  '15:00',
  '10:30',
  true,
  true,
  4.55,
  72,
  3,
  300.00,
  5.00         -- %5 indirim
),
(
  'aaaa0001-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  'Ankara Çankaya Geniş Aile Dairesi',
  'Kızılay ve üniversitelere yakın, sessiz bir sokakta geniş aile dairesi.',
  'apartment',
  'Çankaya, Ankara',
  'Ankara',
  'Türkiye',
  39.9090,
  32.8590,
  1600.00,
  200.00,
  0.00,
  5,
  3,
  4,
  2.0,
  '14:00',
  '11:00',
  false,
  true,
  4.40,
  41,
  3,
  200.00,
  0.00
),
(
  'aaaa0001-0000-0000-0000-000000000006',
  '11111111-1111-1111-1111-111111111111',
  'Bursa Uludağ Manzaralı Daire',
  'Şehir merkezine yakın, Uludağ manzaralı, aileler için ideal daire.',
  'apartment',
  'Osmangazi, Bursa',
  'Bursa',
  'Türkiye',
  40.1950,
  29.0600,
  1500.00,
  180.00,
  0.00,
  4,
  2,
  3,
  1.0,
  '15:00',
  '11:00',
  false,
  true,
  4.30,
  29,
  2,
  200.00,
  12.00
),
(
  'aaaa0001-0000-0000-0000-000000000007',
  '11111111-1111-1111-1111-111111111111',
  'Trabzon Sahil Yürüyüş Yolu Dairesi',
  'Karadeniz sahil yoluna yakın, balkonlu ve ferah bir daire.',
  'apartment',
  'Ortahisar, Trabzon',
  'Trabzon',
  'Türkiye',
  41.0020,
  39.7160,
  1400.00,
  150.00,
  0.00,
  4,
  2,
  3,
  1.0,
  '14:00',
  '11:00',
  false,
  true,
  4.25,
  21,
  2,
  150.00,
  0.00
),
(
  'aaaa0001-0000-0000-0000-000000000008',
  '11111111-1111-1111-1111-111111111111',
  'Kapadokya Taş Ev Daire',
  'Göreme yakınlarında, taş yapı geleneksel dokuya sahip modern konforlu daire.',
  'apartment',
  'Göreme, Nevşehir',
  'Nevşehir',
  'Türkiye',
  38.6430,
  34.8290,
  2300.00,
  220.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '15:00',
  '10:30',
  true,
  true,
  4.80,
  57,
  2,
  350.00,
  20.00
),
(
  'aaaa0001-0000-0000-0000-000000000009',
  '11111111-1111-1111-1111-111111111111',
  'Bodrum Marina Yakını Daire',
  'Bodrum merkez marina bölgesine yürüyerek 7 dk, klimalı ve balkonlu konforlu daire.',
  'apartment',
  'Merkez, Bodrum',
  'Muğla',
  'Türkiye',
  37.0350,
  27.4240,
  2600.00,
  260.00,
  0.00,
  4,
  2,
  3,
  1.0,
  '15:00',
  '11:00',
  true,
  true,
  4.65,
  88,
  2,
  350.00,
  8.00
),
(
  'aaaa0001-0000-0000-0000-000000000010',
  '11111111-1111-1111-1111-111111111111',
  'Eskişehir Porsuk Kenarı Daire',
  'Porsuk Çayı manzaralı, tramvaya ve kafelere çok yakın modern daire.',
  'apartment',
  'Odunpazarı, Eskişehir',
  'Eskişehir',
  'Türkiye',
  39.7760,
  30.5200,
  1350.00,
  150.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '14:00',
  '11:00',
  true,
  true,
  4.35,
  33,
  2,
  200.00,
  0.00
),

-- =======================
-- YURT DIŞI (10 DAİRE)
-- =======================
(
  'bbbb0002-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'Paris Marais Butik Daire',
  'Le Marais bölgesinde, tarihi binada yenilenmiş şık bir daire. Kafeler ve galerilerle çevrili.',
  'apartment',
  'Le Marais, Paris',
  'Paris',
  'Fransa',
  48.8570,
  2.3610,
  220.00,    -- EUR benzeri fiyat, ama numeric olarak kaydolur
  30.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '15:00',
  '11:00',
  true,
  true,
  4.90,
  187,
  2,
  25.00,
  12.00
),
(
  'bbbb0002-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'Roma Tarihi Merkez Daire',
  'Piazza Navona ve Pantheon''a yürüme mesafesinde, yüksek tavanlı tarihi daire.',
  'apartment',
  'Centro Storico, Roma',
  'Roma',
  'İtalya',
  41.8980,
  12.4730,
  200.00,
  25.00,
  0.00,
  4,
  2,
  3,
  1.0,
  '15:00',
  '10:30',
  true,
  true,
  4.75,
  103,
  2,
  30.00,
  10.00
),
(
  'bbbb0002-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Barselona Eixample Teraslı Daire',
  'Eixample bölgesinde, geniş teraslı, modern ve aydınlık bir daire.',
  'apartment',
  'Eixample, Barcelona',
  'Barselona',
  'İspanya',
  41.3890,
  2.1610,
  185.00,
  22.00,
  0.00,
  4,
  2,
  3,
  1.0,
  '15:00',
  '11:00',
  true,
  true,
  4.70,
  89,
  2,
  25.00,
  5.00
),
(
  'bbbb0002-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'Berlin Kreuzberg Nehir Kenarı Daire',
  'Kreuzberg''de, Spree nehrine yakın, freelancer ve çiftler için ideal modern daire.',
  'apartment',
  'Kreuzberg, Berlin',
  'Berlin',
  'Almanya',
  52.4970,
  13.4230,
  160.00,
  20.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '14:00',
  '11:00',
  true,
  true,
  4.60,
  54,
  2,
  20.00,
  0.00
),
(
  'bbbb0002-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  'Londra Shoreditch Endüstriyel Loft',
  'Shoreditch''te, endüstriyel loft tasarım, barlar ve restoranlara çok yakın.',
  'apartment',
  'Shoreditch, London',
  'Londra',
  'Birleşik Krallık',
  51.5240,
  -0.0780,
  230.00,
  28.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '15:00',
  '11:00',
  false,
  true,
  4.65,
  77,
  2,
  30.00,
  8.00
),
(
  'bbbb0002-0000-0000-0000-000000000006',
  '11111111-1111-1111-1111-111111111111',
  'New York Soho Studio Daire',
  'SoHo bölgesinde, tasarım odaklı küçük ama fonksiyonel bir stüdyo daire.',
  'apartment',
  'SoHo, Manhattan',
  'New York',
  'Amerika Birleşik Devletleri',
  40.7230,
  -74.0020,
  260.00,
  35.00,
  0.00,
  2,
  1,
  1,
  1.0,
  '15:00',
  '11:00',
  true,
  true,
  4.80,
  165,
  1,
  35.00,
  15.00
),
(
  'bbbb0002-0000-0000-0000-000000000007',
  '11111111-1111-1111-1111-111111111111',
  'Dubai Marina Yüksek Kat Daire',
  'Dubai Marina manzaralı, rezidans içinde havuz ve spor salonu erişimli lüks daire.',
  'apartment',
  'Dubai Marina',
  'Dubai',
  'Birleşik Arap Emirlikleri',
  25.0800,
  55.1410,
  240.00,
  30.00,
  0.00,
  4,
  2,
  3,
  2.0,
  '15:00',
  '11:00',
  true,
  true,
  4.55,
  52,
  2,
  30.00,
  10.00
),
(
  'bbbb0002-0000-0000-0000-000000000008',
  '11111111-1111-1111-1111-111111111111',
  'Tokyo Shibuya Kompakt Daire',
  'Shibuya istasyonuna çok yakın, kompakt ama son derece fonksiyonel bir daire.',
  'apartment',
  'Shibuya, Tokyo',
  'Tokyo',
  'Japonya',
  35.6590,
  139.7000,
  170.00,
  18.00,
  0.00,
  2,
  1,
  1,
  1.0,
  '16:00',
  '10:00',
  true,
  true,
  4.75,
  94,
  1,
  20.00,
  5.00
),
(
  'bbbb0002-0000-0000-0000-000000000009',
  '11111111-1111-1111-1111-111111111111',
  'Amsterdam Kanal Manzaralı Daire',
  'Kanal kenarında, büyük pencereli, bisikletle her yere ulaşılabilen konumda bir daire.',
  'apartment',
  'Grachtengordel, Amsterdam',
  'Amsterdam',
  'Hollanda',
  52.3720,
  4.8950,
  190.00,
  22.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '15:00',
  '11:00',
  true,
  true,
  4.80,
  120,
  2,
  22.00,
  0.00
),
(
  'bbbb0002-0000-0000-0000-000000000010',
  '11111111-1111-1111-1111-111111111111',
  'Prag Eski Şehir Meydanı Daire',
  'Old Town Square''e birkaç dakika, tarihi binada yüksek tavanlı konforlu daire.',
  'apartment',
  'Staré Město, Prague',
  'Prag',
  'Çekya',
  50.0870,
  14.4210,
  150.00,
  18.00,
  0.00,
  3,
  1,
  2,
  1.0,
  '14:00',
  '11:00',
  false,
  true,
  4.50,
  61,
  2,
  18.00,
  7.00
);

-- 3) Listing images (her ilan için farklı görseller)
-- ===================================================================

INSERT INTO public.listing_images (listing_id, url, alt_text, is_primary, sort_order) VALUES
-- İstanbul Boğaz Daire
('aaaa0001-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200',
 'Boğaz manzaralı oturma odası', true, 0),
('aaaa0001-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=1200',
 'Modern yatak odası', false, 1),
('aaaa0001-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1200',
 'Aydınlık mutfak', false, 2),

-- Nişantaşı Loft
('aaaa0001-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=1200',
 'Loft oturma alanı', true, 0),
('aaaa0001-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200',
 'Yatak odası', false, 1),
('aaaa0001-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200',
 'Mutfak ve yemek masası', false, 2),

-- Karşıyaka
('aaaa0001-0000-0000-0000-000000000003',
 'https://images.unsplash.com/photo-1600585154340-0ef3c08c0632?w=1200',
 'Deniz kenarı daire', true, 0),
('aaaa0001-0000-0000-0000-000000000003',
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
 'Salon', false, 1),
('aaaa0001-0000-0000-0000-000000000003',
 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200',
 'Yatak odası', false, 2),

-- Antalya
('aaaa0001-0000-0000-0000-000000000004',
 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200',
 'Havuz ve site', true, 0),
('aaaa0001-0000-0000-0000-000000000004',
 'https://images.unsplash.com/photo-1521782462922-9318be1cfd04?w=1200',
 'Salon ve balkon', false, 1),
('aaaa0001-0000-0000-0000-000000000004',
 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200',
 'Yatak odası', false, 2),

-- Ankara
('aaaa0001-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
 'Geniş salon', true, 0),
('aaaa0001-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200',
 'Aile yatak odası', false, 1),

-- Bursa
('aaaa0001-0000-0000-0000-000000000006',
 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1200',
 'Manzaralı salon', true, 0),

-- Trabzon
('aaaa0001-0000-0000-0000-000000000007',
 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200',
 'Karadeniz manzarası', true, 0),

-- Kapadokya
('aaaa0001-0000-0000-0000-000000000008',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
 'Taş ev dış cephe', true, 0),

-- Bodrum
('aaaa0001-0000-0000-0000-000000000009',
 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
 'Bodrum marina manzarası', true, 0),

-- Eskişehir
('aaaa0001-0000-0000-0000-000000000010',
 'https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=1200',
 'Porsuk kenarı daire', true, 0),

-- Paris
('bbbb0002-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1200',
 'Paris Marais iç mekan', true, 0),

-- Roma
('bbbb0002-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1200',
 'Roma tarihi daire', true, 0),

-- Barselona
('bbbb0002-0000-0000-0000-000000000003',
 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200',
 'Barselona teras', true, 0),

-- Berlin
('bbbb0002-0000-0000-0000-000000000004',
 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200',
 'Berlin daire içi', true, 0),

-- Londra
('bbbb0002-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200',
 'Shoreditch loft', true, 0),

-- New York
('bbbb0002-0000-0000-0000-000000000006',
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
 'NYC stüdyo', true, 0),

-- Dubai
('bbbb0002-0000-0000-0000-000000000007',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
 'Dubai marina manzarası', true, 0),

-- Tokyo
('bbbb0002-0000-0000-0000-000000000008',
 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200',
 'Tokyo kompakt daire', true, 0),

-- Amsterdam
('bbbb0002-0000-0000-0000-000000000009',
 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
 'Kanal manzaralı salon', true, 0),

-- Prag
('bbbb0002-0000-0000-0000-000000000010',
 'https://images.unsplash.com/photo-1512914890250-353c97c9e7e2?w=1200',
 'Prag eskişehir dairesi', true, 0);

-- ===================================================================
-- 4) House rules (her daire için ev kuralları)
-- ===================================================================

INSERT INTO public.house_rules (
  listing_id,
  smoking_allowed,
  pets_allowed,
  parties_allowed,
  additional_rules
) VALUES
('aaaa0001-0000-0000-0000-000000000001', false, false, false,
 'Gece 23:00 sonrası yüksek ses müzik yasaktır. Boğaz manzaralı balkonda sigara içilemez.'),
('aaaa0001-0000-0000-0000-000000000002', false, true, false,
 'Evcil hayvan kabul edilir; lütfen rezervasyon sırasında belirtin.'),
('aaaa0001-0000-0000-0000-000000000003', true, false, false,
 'Balkonda sigara içilebilir, iç mekanda içilemez.'),
('aaaa0001-0000-0000-0000-000000000004', false, false, false,
 'Site ortak alanlarında gürültü yapmayınız.'),
('aaaa0001-0000-0000-0000-000000000005', false, false, false,
 'Aile apartmanıdır, parti kabul edilmez.'),
('aaaa0001-0000-0000-0000-000000000006', false, true, false,
 'Küçük ırk evcil hayvanlara izin verilir.'),
('aaaa0001-0000-0000-0000-000000000007', false, false, false,
 'Gece 22:00 sonrası balkon kullanımı sessiz olmalıdır.'),
('aaaa0001-0000-0000-0000-000000000008', false, false, false,
 'Balon uçuş saatlerine saygı için erken saatte gürültü yapılmamalıdır.'),
('aaaa0001-0000-0000-0000-000000000009', false, false, true,
 'Küçük kutlamalara izin verilir, yüksek sesli müzik 23:00 sonrası yasaktır.'),
('aaaa0001-0000-0000-0000-000000000010', false, false, false,
 'Apartman yönetmeliğine uygun davranılması gerekmektedir.'),
('bbbb0002-0000-0000-0000-000000000001', false, false, false,
 'Paris binasında asansör küçüktür; lütfen çöpü dışarıdaki konteynere atınız.'),
('bbbb0002-0000-0000-0000-000000000002', false, false, false,
 'Tarihi binada yüksek sesli parti yasaktır.'),
('bbbb0002-0000-0000-0000-000000000003', false, true, false,
 'Küçük evcil hayvanlar önceden bildirilmek koşuluyla kabul edilir.'),
('bbbb0002-0000-0000-0000-000000000004', false, false, false,
 'Sadece kayıtlı misafirlerin girişi serbesttir.'),
('bbbb0002-0000-0000-0000-000000000005', false, false, false,
 'Binada gürültü kuralları sıkıdır, parti kabul edilmez.'),
('bbbb0002-0000-0000-0000-000000000006', false, false, false,
 'New York binasında çamaşırhane bodrum kattadır; çalışma saatlerine dikkat ediniz.'),
('bbbb0002-0000-0000-0000-000000000007', false, false, false,
 'Havuz kullanım saatlerine ve giyim kurallarına uyunuz.'),
('bbbb0002-0000-0000-0000-000000000008', false, false, false,
 'Japon apartman görgü kurallarına (gürültü, temizlik) dikkat edilmelidir.'),
('bbbb0002-0000-0000-0000-000000000009', false, false, false,
 'Bisiklet park alanları sadece misafirler içindir.'),
('bbbb0002-0000-0000-0000-000000000010', false, false, false,
 'Merdiven boşluğunda bavul bırakmayınız.');

-- ===================================================================
-- 5) Listing amenities (mevcut amenities isimlerine göre bağla)
--    NOT: Amenity id’lerini bilmiyoruz, isimden seçiyoruz.
-- ===================================================================

-- Örnek: Boğaz Manzaralı Modern Daire → temel + manzara + iş
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000001'::uuid AS listing_id, id AS amenity_id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Washer', 'Workspace', 'Elevator', 'Security Cameras', 'Ocean View');

-- Nişantaşı Loft
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000002', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Heating', 'Workspace', 'Elevator');

-- Karşıyaka
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000003', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'TV', 'Washer', 'Free Parking', 'Garden View');

-- Antalya
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000004', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Pool', 'Free Parking', 'Balcony', 'Beach Access');

-- Ankara
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000005', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'TV', 'Workspace', 'Elevator');

-- Bursa
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000006', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'Washer', 'Free Parking', 'Mountain View');

-- Trabzon
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000007', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'TV', 'Free Parking', 'Ocean View');

-- Kapadokya
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000008', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'Breakfast Included', 'Fire Pit', 'Mountain View');

-- Bodrum
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000009', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Pool', 'Beach Access', 'Balcony', 'BBQ Grill');

-- Eskişehir
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'aaaa0001-0000-0000-0000-000000000010', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'TV', 'Workspace');

-- Paris
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000001', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'Elevator', 'Workspace', 'Security Cameras');

-- Roma
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000002', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'TV');

-- Barselona
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000003', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Balcony', 'Ocean View');

-- Berlin
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000004', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'Workspace');

-- Londra
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000005', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'Workspace', 'Elevator');

-- New York
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000006', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'Workspace');

-- Dubai
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000007', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'Pool', 'Gym', 'Elevator', 'Security Cameras');

-- Tokyo
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000008', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'Workspace', 'Elevator');

-- Amsterdam
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000009', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'Washer', 'Dryer', 'Garden View', 'Ocean View');

-- Prag
INSERT INTO public.listing_amenities (listing_id, amenity_id)
SELECT 'bbbb0002-0000-0000-0000-000000000010', id
FROM public.amenities
WHERE name IN ('WiFi', 'Kitchen', 'Heating', 'TV', 'Workspace');