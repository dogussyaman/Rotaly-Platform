import { createClient } from '@/lib/supabase/client';

export interface HostProfile {
  hostId: string;
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  responseRate: number;
  responseTime: string | null;
  superhost: boolean;
  totalReviews: number;
  languages: string[];
}

export interface HostListingCard {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  imageUrl: string | null;
  propertyType: string | null;
  maxGuests: number | null;
  isActive: boolean;
  bookingsCount: number;
  earnings: number;
}

export interface HostStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  bookings: number;
  averageRating: number;
  reviewCount: number;
  responseRate: number;
  upcomingCheckins: number;
  unreadMessages: number;
}

export interface HostBooking {
  id: string;
  guestId: string | null;
  guestName: string | null;
  listingTitle: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: string;
}

export async function fetchHostByUserId(userId: string): Promise<HostProfile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hosts')
    .select(
      `
        id,
        user_id,
        response_rate,
        response_time,
        superhost,
        total_reviews,
        languages,
        profiles:profiles!inner (
          full_name,
          avatar_url
        )
      `
    )
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('fetchHostByUserId error:', error.message);
    return null;
  }

  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;

  return {
    hostId: data.id,
    userId: data.user_id,
    fullName: profile?.full_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    responseRate: Number(data.response_rate ?? 0),
    responseTime: data.response_time ?? null,
    superhost: !!data.superhost,
    totalReviews: data.total_reviews ?? 0,
    languages: data.languages ?? [],
  };
}

export async function fetchHostListings(hostId: string): Promise<HostListingCard[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(
      `
        id,
        title,
        city,
        country,
        price_per_night,
        rating,
        total_reviews,
        property_type,
        max_guests,
        is_active,
        listing_images (
          url,
          is_primary,
          sort_order
        )
      `
    )
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchHostListings error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => {
    let imageUrl: string | null = null;
    if (row.listing_images?.length) {
      const sorted = [...row.listing_images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
      imageUrl = sorted[0].url;
    }

    return {
      id: row.id,
      title: row.title,
      location: [row.city, row.country].filter(Boolean).join(', '),
      pricePerNight: Number(row.price_per_night),
      rating: Number(row.rating ?? 0),
      totalReviews: row.total_reviews ?? 0,
      imageUrl,
      propertyType: row.property_type ?? null,
      maxGuests: row.max_guests ?? null,
      isActive: row.is_active ?? true,
      bookingsCount: 0,
      earnings: 0,
    } as HostListingCard;
  });
}

export type PagedResult<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
};

export async function fetchHostListingsPage(
  hostId: string,
  params: { page: number; pageSize: number; query?: string },
): Promise<PagedResult<HostListingCard>> {
  const supabase = createClient();
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, Math.min(50, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('listings')
    .select(
      `
        id,
        title,
        city,
        country,
        price_per_night,
        rating,
        total_reviews,
        property_type,
        max_guests,
        is_active,
        listing_images (
          url,
          is_primary,
          sort_order
        )
      `,
      { count: 'exact' },
    )
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  const q = params.query?.trim();
  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) {
    console.error('fetchHostListingsPage error:', error.message);
    return { rows: [], total: 0, page, pageSize };
  }

  const rows = (data ?? []).map((row: any) => {
    let imageUrl: string | null = null;
    if (row.listing_images?.length) {
      const sorted = [...row.listing_images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
      imageUrl = sorted[0].url;
    }

    return {
      id: row.id,
      title: row.title,
      location: [row.city, row.country].filter(Boolean).join(', '),
      pricePerNight: Number(row.price_per_night),
      rating: Number(row.rating ?? 0),
      totalReviews: row.total_reviews ?? 0,
      imageUrl,
      propertyType: row.property_type ?? null,
      maxGuests: row.max_guests ?? null,
      isActive: row.is_active ?? true,
      bookingsCount: 0,
      earnings: 0,
    } as HostListingCard;
  });

  return { rows, total: count ?? rows.length, page, pageSize };
}

export async function fetchHostStats(hostId: string, userId: string): Promise<HostStats> {
  const supabase = createClient();

  // Toplam kazanç ve rezervasyonlar
  const { data: bookingAgg, error: bookingError } = await supabase
    .from('bookings')
    .select(
      `
        total_price,
        final_price,
        status,
        check_in,
        listings!inner (
          host_id
        )
      `
    )
    .eq('listings.host_id', hostId);

  let totalEarnings = 0;
  let thisMonthEarnings = 0;
  let bookings = 0;
  let upcomingCheckins = 0;

  if (!bookingError && bookingAgg) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Gelecek 7 günü hesapla
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999); // End of the 7th day

    for (const row of bookingAgg as any[]) {
      const amount = Number(row.final_price ?? row.total_price ?? 0);
      const checkInDate = new Date(row.check_in);

      if (row.status === 'confirmed' || row.status === 'completed') {
        totalEarnings += amount;
        bookings += 1;

        if (checkInDate.getFullYear() === currentYear && checkInDate.getMonth() === currentMonth) {
          thisMonthEarnings += amount;
        }

        // Önümüzdeki 7 gün içindeki girişler
        if (row.status === 'confirmed' && checkInDate >= now && checkInDate <= nextWeek) {
          upcomingCheckins += 1;
        }
      }
    }
  }

  // Ortalama rating ve review sayısı listings üzerinden
  const { data: listingAgg, error: listingError } = await supabase
    .from('listings')
    .select('rating, total_reviews')
    .eq('host_id', hostId);

  let reviewCount = 0;
  let ratingSum = 0;

  if (!listingError && listingAgg) {
    for (const row of listingAgg as any[]) {
      const count = row.total_reviews ?? 0;
      reviewCount += count;
      ratingSum += Number(row.rating ?? 0) * count;
    }
  }

  const averageRating = reviewCount > 0 ? ratingSum / reviewCount : 0;

  // Okunmamış mesaj sayısı
  const { count: unreadMessages, error: unreadError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);

  if (unreadError) {
    console.error('fetchHostStats unreadMessages error:', unreadError.message);
  }

  // Host response rate bilgisini getir
  const { data: hostData } = await supabase
    .from('hosts')
    .select('response_rate')
    .eq('id', hostId)
    .single();

  return {
    totalEarnings,
    thisMonthEarnings,
    bookings,
    averageRating,
    reviewCount,
    responseRate: Number(hostData?.response_rate ?? 98),
    upcomingCheckins,
    unreadMessages: unreadMessages ?? 0,
  };
}

export async function fetchHostBookings(hostId: string): Promise<HostBooking[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
        id,
        guest_id,
        check_in,
        check_out,
        guests_count,
        total_price,
        final_price,
        status,
        listings!inner (
          id,
          host_id,
          title
        ),
        profiles:profiles!guest_id (
          full_name
        )
      `
    )
    .eq('listings.host_id', hostId)
    .order('check_in', { ascending: true });

  if (error) {
    console.error('fetchHostBookings error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => {
    const checkIn = new Date(row.check_in);
    const checkOut = new Date(row.check_out);
    const diffMs = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      id: row.id,
      guestId: row.guest_id ?? null,
      guestName: row.profiles?.full_name ?? null,
      listingTitle: row.listings?.title ?? null,
      checkIn: row.check_in,
      checkOut: row.check_out,
      nights,
      totalPrice: Number(row.final_price ?? row.total_price),
      status: row.status,
    } as HostBooking;
  });
}

export async function fetchHostBookingsPage(
  hostId: string,
  params: { page: number; pageSize: number; status?: string; query?: string },
): Promise<PagedResult<HostBooking>> {
  const supabase = createClient();
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, Math.min(50, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let baseQuery = supabase
    .from('bookings')
    .select(
      `
        id,
        guest_id,
        check_in,
        check_out,
        guests_count,
        total_price,
        final_price,
        status,
        listings!inner (
          id,
          host_id,
          title
        ),
        profiles:profiles!guest_id (
          full_name
        )
      `,
      { count: 'exact' },
    )
    .eq('listings.host_id', hostId)
    .order('check_in', { ascending: true });

  const status = params.status?.trim();
  if (status && status !== 'all') {
    baseQuery = baseQuery.eq('status', status);
  }

  const q = params.query?.trim();
  const filteredQuery = q ? baseQuery.ilike('listings.title', `%${q}%`) : baseQuery;

  let res = await filteredQuery.range(from, to);
  if (res.error && q) {
    console.warn('fetchHostBookingsPage: search filter failed, retrying without query. Error:', res.error.message);
    res = await baseQuery.range(from, to);
  }

  const { data, error, count } = res;
  if (error) {
    console.error('fetchHostBookingsPage error:', error.message);
    return { rows: [], total: 0, page, pageSize };
  }

  const rows = (data ?? []).map((row: any) => {
    const checkIn = new Date(row.check_in);
    const checkOut = new Date(row.check_out);
    const diffMs = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      id: row.id,
      guestId: row.guest_id ?? null,
      guestName: row.profiles?.full_name ?? null,
      listingTitle: row.listings?.title ?? null,
      checkIn: row.check_in,
      checkOut: row.check_out,
      nights,
      totalPrice: Number(row.final_price ?? row.total_price),
      status: row.status,
    } as HostBooking;
  });

  return { rows, total: count ?? rows.length, page, pageSize };
}

export async function updateHostBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'cancelled',
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    console.error('updateHostBookingStatus error:', error.message);
    return false;
  }

  return true;
}

export interface EarningsByMonth {
  month: string;
  year: number;
  label: string;
  total: number;
}

export interface EarningsByListing {
  listingId: string;
  listingTitle: string;
  total: number;
}

export async function fetchHostEarnings(
  hostId: string,
  params: { months?: number },
): Promise<{ byMonth: EarningsByMonth[]; byListing: EarningsByListing[] }> {
  const supabase = createClient();
  const months = params.months ?? 12;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  const startStr = startDate.toISOString().slice(0, 10);

  const { data: bookingRows, error } = await supabase
    .from('bookings')
    .select(
      `
        id,
        check_in,
        total_price,
        status,
        listings!inner (
          id,
          host_id,
          title
        )
      `
    )
    .eq('listings.host_id', hostId)
    .in('status', ['confirmed', 'completed'])
    .gte('check_in', startStr);

  if (error) {
    console.error('fetchHostEarnings error:', error.message);
    return { byMonth: [], byListing: [] };
  }

  const byMonthMap = new Map<string, number>();
  const byListingMap = new Map<string, { title: string; total: number }>();

  for (let i = 0; i < months; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonthMap.set(key, 0);
  }

  for (const row of (bookingRows ?? []) as any[]) {
    const amount = Number(row.total_price ?? 0);
    const checkIn = row.check_in as string;
    const y = checkIn.slice(0, 4);
    const m = checkIn.slice(5, 7);
    const monthKey = `${y}-${m}`;
    byMonthMap.set(monthKey, (byMonthMap.get(monthKey) ?? 0) + amount);

    const lid = row.listings?.id;
    const title = row.listings?.title ?? 'Adsız';
    if (lid) {
      const cur = byListingMap.get(lid);
      byListingMap.set(lid, {
        title,
        total: (cur?.total ?? 0) + amount,
      });
    }
  }

  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const byMonth: EarningsByMonth[] = Array.from(byMonthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, total]) => {
      const [y, m] = key.split('-');
      const monthIndex = parseInt(m, 10) - 1;
      return {
        month: key,
        year: parseInt(y, 10),
        label: `${monthNames[monthIndex]} ${y}`,
        total,
      };
    });

  const byListing: EarningsByListing[] = Array.from(byListingMap.entries()).map(([listingId, v]) => ({
    listingId,
    listingTitle: v.title,
    total: v.total,
  }));

  return { byMonth, byListing };
}

export interface HostAvailability {
  listingId: string;
  listingTitle: string;
  date: string;
  isAvailable: boolean;
  customPrice: number | null;
}

export async function fetchHostAvailability(hostId: string): Promise<HostAvailability[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('availability_calendar')
    .select(
      `
        listing_id,
        date,
        is_available,
        custom_price,
        listings!inner (
          title
        )
      `
    )
    .eq('listings.host_id', hostId)
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchHostAvailability error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    listingId: row.listing_id,
    listingTitle: row.listings?.title ?? 'Adsız İlan',
    date: row.date,
    isAvailable: row.is_available,
    customPrice: row.custom_price ? Number(row.custom_price) : null,
  }));
}
