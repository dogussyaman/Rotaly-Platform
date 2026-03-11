import { createClient } from '@/lib/supabase/client';

export interface TourCard {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  country: string | null;
  durationMinutes: number | null;
  maxParticipants: number | null;
  basePrice: number;
  currency: string;
  rating: number;
  totalReviews: number;
}

export interface FetchToursParams {
  city?: string;
}

export async function fetchTours(params: FetchToursParams = {}): Promise<TourCard[]> {
  const supabase = createClient();

  let query = supabase
    .from('tours')
    .select(
      `
        id,
        title,
        description,
        city,
        country,
        duration_minutes,
        max_participants,
        base_price,
        currency,
        rating,
        total_reviews
      `
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (params.city && params.city.trim() !== '') {
    const c = params.city.trim();
    query = query.or(`city.ilike.%${c}%,country.ilike.%${c}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchTours error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    city: row.city ?? null,
    country: row.country ?? null,
    durationMinutes: row.duration_minutes ?? null,
    maxParticipants: row.max_participants ?? null,
    basePrice: Number(row.base_price),
    currency: row.currency ?? 'TRY',
    rating: Number(row.rating ?? 0),
    totalReviews: row.total_reviews ?? 0,
  }));
}

