# Supabase Roller + Seed (Rotaly / StayHub)

Bu doküman, projedeki kullanıcı tiplerini (guest/host/admin/tour_operator), bunların nerede tutulduğunu ve Supabase’de seed SQL’lerini nasıl çalıştıracağını anlatır.

## 1) Projede kaç kullanıcı tipi var?

Projede iki farklı “sınıflandırma” var:

### A) Uygulama rolleri (dashboard rolü)
Uygulama, dashboard tarafında bu üç rolden birini türetiyor:

- `admin`: `public.user_roles` içinde `admin` varsa
- `host`: `public.profiles.is_host = true` ise
- `guest`: yukarıdakiler yoksa

Ek bir bayrak daha var:

- `tour_operator`: `public.user_roles` içinde `tour_operator` varsa (`profile.isTourOperator`)

Not: Uygulama bu rolü `auth.users.raw_user_meta_data.role` üzerinden okumuyor; `profiles` ve `user_roles` tablosundan türetiyor.

### B) Partner tipi (kurumsal profil)
Kurumsal kayıtlar için `public.partner_profiles.partner_type` kullanılıyor:

- `hotel`
- `agency`
- `property_manager`

## 2) “Role bazılarında var bazılarında yok” sorunu neden oluyor?

Sende görünen `role`, Supabase Auth tarafındaki meta data alanı:

- `auth.users.raw_user_meta_data.role`

Email/password signup’ta `role: 'guest'` eklenmiş.
Google OAuth ile gelen kullanıcılarda bu alan bazen hiç set edilmediği için boş kalıyor.

Bu repo’da bunun için iki çözüm eklendi:

1) OAuth callback’te `role` boşsa `guest` set ediliyor: `app/auth/callback/route.ts`
2) Mevcut kullanıcıları topluca düzeltmek için backfill script: `scripts/007_backfill_profiles_and_roles.sql`

## 3) Profil yoksa “host yaptım ama guest görünüyor” problemi

`scripts/hotel.sql` gibi scriptler `public.profiles.is_host` alanını güncelliyor.
Ama eğer kullanıcı `auth.users` tablosunda varken trigger sonradan eklendiyse, `public.profiles` kaydı hiç oluşmamış olabilir.
Bu durumda uygulama `profiles` satırını bulamadığı için `is_host` false görünür ve kullanıcı “guest” kalır.

Çözüm:
- `scripts/007_backfill_profiles_and_roles.sql` çalıştır (eksik profilleri oluşturur).

## 4) Script çalışma sırası (önerilen)

Supabase SQL Editor’da sırayla:

1) `scripts/001_create_tables.sql`
2) `scripts/002_create_rls_policies.sql`
3) `scripts/003_create_triggers_and_seed.sql`
4) `scripts/004_loyalty_and_coupons.sql`
5) `scripts/005_tours.sql`
6) `scripts/006_booking_checkin_and_extras.sql`
7) (Önemli) `scripts/007_backfill_profiles_and_roles.sql`

Sonrasında seed dataları:

- Ev sahibi #1 (10 kat apartman / 20 daire): `scripts/seed_host_592a7f5a_apartment_10_floors.sql`
- Ev sahibi #2 (10 kat otel / 40 oda): `scripts/seed_host_57c246c7_hotel_10_floors.sql`

## 5) Seed scriptleri hangi kullanıcıları kullanıyor?

Bu iki script, host olarak şu Auth user id’lerini kullanır:

- `592a7f5a-a254-4803-8c8f-5e9790c78bad` (host)
- `57c246c7-7115-4210-b700-de34f44cbeb2` (host)

Örnek rezervasyon/review’lar için guest olarak şunu kullanır:

- `1dbaca10-d38d-479b-8543-5fe02fda1877` (guest)

## 6) Hızlı kontrol SQL’leri

### Kullanıcıların “primary role” alanı (Auth meta)
```sql
select
  u.id,
  u.email,
  u.raw_user_meta_data ->> 'role' as auth_primary_role,
  u.created_at
from auth.users u
order by u.created_at desc;
```

### `profiles` var mı? `is_host` doğru mu?
```sql
select
  p.id as user_id,
  p.email,
  p.is_host,
  p.is_verified,
  u.raw_user_meta_data ->> 'role' as auth_primary_role
from public.profiles p
join auth.users u on u.id = p.id
order by p.created_at desc;
```

### Host mapping (user_id -> hosts.id)
`public.listings.host_id`, `public.hosts.id`’ye bağlıdır (profiles.id değildir).
```sql
select
  p.id as user_id,
  h.id as host_id,
  p.email,
  p.is_host
from public.profiles p
left join public.hosts h on h.user_id = p.id
order by p.created_at desc;
```

### Bu host’un kaç ilanı var?
```sql
select
  h.user_id,
  count(*) as listing_count
from public.hosts h
join public.listings l on l.host_id = h.id
group by h.user_id;
```

## 7) Admin / Tour operator nasıl atanır?

`public.user_roles` tablosuna rol ekleyebilirsin:

```sql
insert into public.user_roles (user_id, role)
values ('<USER_UUID>', 'admin');
```

Sonra Auth “primary role” alanını da senkronlamak istersen tekrar çalıştır:
- `scripts/007_backfill_profiles_and_roles.sql`

