import { createClient } from '@/lib/supabase/client';
import type { HostAvailability } from '@/lib/supabase/host';

export type PagedResult<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type AvailabilityDay = {
  date: string;
  isAvailable: boolean;
  customPrice: number | null;
};

export async function fetchHostAvailabilityPage(
  hostId: string,
  params: { page: number; pageSize: number },
): Promise<PagedResult<HostAvailability>> {
  const supabase = createClient();
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, Math.min(50, params.pageSize));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('availability_calendar')
    .select(
      `
        listing_id,
        date,
        is_available,
        custom_price,
        listings!inner (
          title,
          host_id
        )
      `,
      { count: 'exact' },
    )
    .eq('listings.host_id', hostId)
    .order('date', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('fetchHostAvailabilityPage error:', error.message);
    return { rows: [], total: 0, page, pageSize };
  }

  const rows = (data ?? []).map((row: any) => ({
    listingId: row.listing_id,
    listingTitle: row.listings?.title ?? 'Adsız İlan',
    date: row.date,
    isAvailable: row.is_available,
    customPrice: row.custom_price ? Number(row.custom_price) : null,
  }));

  return { rows, total: count ?? rows.length, page, pageSize };
}

/**
 * İlan için verilen aralıkta rezervasyon (pending/confirmed/completed) ile dolu olan
 * tarihleri döndürür. check_in <= tarih < check_out olan günler "dolu".
 */
export async function fetchBookedDatesForListing(
  listingId: string,
  startDate: string,
  endDate: string,
): Promise<Set<string>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('listing_id', listingId)
    .in('status', ['pending', 'confirmed', 'completed'])
    .lte('check_in', endDate)
    .gt('check_out', startDate);

  if (error) {
    console.error('fetchBookedDatesForListing error:', error.message);
    return new Set();
  }

  const booked = new Set<string>();

  for (const row of data ?? []) {
    const checkInStr = (row as { check_in: string }).check_in;
    const checkOutStr = (row as { check_out: string }).check_out;
    let d = new Date(checkInStr + 'T12:00:00Z');
    const end = new Date(checkOutStr + 'T12:00:00Z');
    while (d < end) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      if (dateStr >= startDate && dateStr <= endDate) booked.add(dateStr);
      d.setUTCDate(d.getUTCDate() + 1);
    }
  }
  return booked;
}

/** İlan bazında tarih aralığında uygunluk getirir (takvim için). */
export async function fetchAvailabilityByListing(
  listingId: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityDay[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('availability_calendar')
    .select('date, is_available, custom_price')
    .eq('listing_id', listingId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchAvailabilityByListing error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    date: row.date,
    isAvailable: row.is_available ?? true,
    customPrice: row.custom_price ? Number(row.custom_price) : null,
  }));
}

/** Tek tarih için uygunluk açar/kapatır veya özel fiyat set eder. */
export async function upsertAvailability(
  listingId: string,
  date: string,
  payload: { isAvailable?: boolean; customPrice?: number | null },
): Promise<boolean> {
  const supabase = createClient();

  const row: Record<string, unknown> = {
    listing_id: listingId,
    date,
  };
  if (payload.isAvailable !== undefined) row.is_available = payload.isAvailable;
  if (payload.customPrice !== undefined) row.custom_price = payload.customPrice;

  const { error } = await supabase
    .from('availability_calendar')
    .upsert(row, { onConflict: 'listing_id,date' });

  if (error) {
    console.error('upsertAvailability error:', error.message);
    return false;
  }
  return true;
}

/** Tarih aralığı için toplu uygunluk açar veya kapatır. */
export async function setAvailabilityRange(
  listingId: string,
  startDate: string,
  endDate: string,
  isAvailable: boolean,
): Promise<boolean> {
  const supabase = createClient();
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().slice(0, 10));
  }

  const rows = dates.map((date) => ({
    listing_id: listingId,
    date,
    is_available: isAvailable,
  }));

  const { error } = await supabase
    .from('availability_calendar')
    .upsert(rows, { onConflict: 'listing_id,date' });

  if (error) {
    console.error('setAvailabilityRange error:', error.message);
    return false;
  }
  return true;
}

