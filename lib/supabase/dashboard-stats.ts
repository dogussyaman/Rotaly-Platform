import { createClient } from '@/lib/supabase/client';

export type AdminStatRow = {
  title: string;
  value: string;
  change: string;
  helper: string;
};

export type GuestStatRow = {
  title: string;
  value: string;
  change: string;
  helper: string;
};

/** Admin genel bakış istatistikleri (backend). */
export async function fetchAdminStats(): Promise<AdminStatRow[]> {
  const supabase = createClient();

  const [profilesRes, listingsRes, bookingsRes, reviewsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'confirmed']),
    supabase.from('reviews').select('rating'),
  ]);

  const totalUsers = profilesRes.count ?? 0;
  const activeListings = listingsRes.count ?? 0;
  const openBookings = bookingsRes.count ?? 0;

  let avgRating = 0;
  if (reviewsRes.data?.length) {
    const sum = (reviewsRes.data as { rating: number }[]).reduce((a, r) => a + Number(r.rating ?? 0), 0);
    avgRating = sum / reviewsRes.data.length;
  }

  return [
    { title: 'Toplam Kullanıcı', value: totalUsers.toLocaleString('tr-TR'), change: '—', helper: 'Kayıtlı' },
    { title: 'Aktif İlan', value: activeListings.toLocaleString('tr-TR'), change: '—', helper: 'Yayında' },
    { title: 'Açık Rezervasyon', value: openBookings.toLocaleString('tr-TR'), change: '—', helper: 'Bekleyen + onaylı' },
    { title: 'Ortalama Puan', value: avgRating.toFixed(2), change: '—', helper: 'Tüm yorumlar' },
  ];
}

/** Misafir genel bakış istatistikleri (backend). */
export async function fetchGuestStats(userId: string): Promise<GuestStatRow[]> {
  const supabase = createClient();

  const now = new Date().toISOString().slice(0, 10);
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const in30Str = in30Days.toISOString().slice(0, 10);

  const [bookingsRes, wishlistsRes, loyaltyRes, couponsRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('guest_id', userId)
      .in('status', ['pending', 'confirmed'])
      .gte('check_in', now)
      .lte('check_in', in30Str),
    supabase.from('wishlists').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase
      .from('loyalty_accounts')
      .select('points_balance')
      .eq('user_id', userId)
      .single(),
    supabase.from('coupons').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  const upcomingTrips = bookingsRes.count ?? 0;
  const wishlistsCount = wishlistsRes.count ?? 0;
  const pointsBalance = (loyaltyRes.data as { points_balance?: number } | null)?.points_balance ?? 0;
  const activeCoupons = couponsRes.count ?? 0;

  return [
    { title: 'Yaklaşan Seyahat', value: String(upcomingTrips), change: '—', helper: '30 gün içinde' },
    { title: 'Favoriler', value: String(wishlistsCount), change: '—', helper: 'Liste sayısı' },
    { title: 'Sadakat Puanı', value: pointsBalance.toLocaleString('tr-TR'), change: '—', helper: 'Bakiye' },
    { title: 'Kuponlar', value: String(activeCoupons), change: '—', helper: 'Aktif kampanya' },
  ];
}
