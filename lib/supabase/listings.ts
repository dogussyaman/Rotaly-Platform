import { createClient } from '@/lib/supabase/client';
import { isListingAvailable } from '@/lib/supabase/bookings';

export interface LocationSuggestion {
  label: string;  // "İstanbul, Türkiye"
  city: string;
  country: string;
  count: number;
}

/**
 * Kullanıcı yazdıkça Supabase listings tablosundan eşleşen
 * şehir/ülke kombinasyonlarını döndürür.
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const supabase = createClient();

  if (!query || query.trim().length < 1) {
    // Boşken tüm şehirleri göster (popüler destinasyonlar gibi)
    const { data } = await supabase
      .from('listings')
      .select('city, country')
      .eq('is_active', true)
      .not('city', 'is', null)
      .limit(50);

    if (!data) return [];
    return aggregateLocations(data);
  }

  // Kullanıcı "İstanbul, Türkiye" gibi seçilmiş label yazmış olabilir
  // → sadece şehir kısmını al (virgülden önce)
  const rawQ = query.trim();
  const q = rawQ.includes(',') ? rawQ.split(',')[0].trim() : rawQ;

  const { data } = await supabase
    .from('listings')
    .select('city, country')
    .eq('is_active', true)
    .or(`city.ilike.%${q}%,country.ilike.%${q}%`)
    .limit(50);

  if (!data) return [];
  return aggregateLocations(data);
}

function aggregateLocations(
  rows: { city: string | null; country: string | null }[]
): LocationSuggestion[] {
  const map = new Map<string, LocationSuggestion>();

  for (const row of rows) {
    const city = row.city ?? '';
    const country = row.country ?? '';
    const key = `${city}|||${country}`;

    if (map.has(key)) {
      map.get(key)!.count += 1;
    } else {
      map.set(key, {
        label: [city, country].filter(Boolean).join(', '),
        city,
        country,
        count: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 8);
}

export interface ListingRow {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  images: string[];
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  lat: number;
  lng: number;
}

export interface FetchListingsParams {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string[];
  guests?: number;
  checkIn?: Date | null;
  checkOut?: Date | null;
}

export async function fetchListings(params: FetchListingsParams = {}): Promise<ListingRow[]> {
  const supabase = createClient();

  let query = supabase
    .from('listings')
    .select(`
      id,
      title,
      city,
      country,
      price_per_night,
      rating,
      total_reviews,
      property_type,
      max_guests,
      bedrooms,
      latitude,
      longitude,
      listing_images (
        url,
        is_primary,
        sort_order
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (params.location && params.location.trim() !== '') {
    const parts = params.location.trim().split(',').map((p) => p.trim()).filter(Boolean);
    const cityTerm = parts[0];   // "İstanbul"
    const countryTerm = parts[1]; // "Türkiye" (varsa)

    if (countryTerm) {
      // "İstanbul, Türkiye" → city=İstanbul AND country=Türkiye
      query = query
        .ilike('city', `%${cityTerm}%`)
        .ilike('country', `%${countryTerm}%`);
    } else {
      // Tek kelime → city veya country içinde ara (virgül yok, or güvenli)
      query = query.or(`city.ilike.%${cityTerm}%,country.ilike.%${cityTerm}%`);
    }
  }

  if (params.priceMin !== undefined) {
    query = query.gte('price_per_night', params.priceMin);
  }
  if (params.priceMax !== undefined && params.priceMax < 10000) {
    query = query.lte('price_per_night', params.priceMax);
  }

  if (params.propertyType && params.propertyType.length > 0) {
    const dbTypes = params.propertyType.map((t) => t.toLowerCase());
    query = query.in('property_type', dbTypes);
  }

  if (params.guests && params.guests > 1) {
    query = query.gte('max_guests', params.guests);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchListings error:', error.message);
    return [];
  }

  let mapped = (data ?? []).map((row) => {
    const images = (row.listing_images as { url: string; is_primary: boolean; sort_order: number }[])
      .sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.sort_order - b.sort_order;
      })
      .map((img) => img.url);

    return {
      id: row.id,
      title: row.title,
      location: [row.city, row.country].filter(Boolean).join(', '),
      pricePerNight: Number(row.price_per_night),
      rating: Number(row.rating) || 0,
      totalReviews: row.total_reviews || 0,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      propertyType: row.property_type ?? 'apartment',
      maxGuests: row.max_guests ?? 2,
      bedrooms: row.bedrooms ?? 1,
      lat: Number(row.latitude) || 0,
      lng: Number(row.longitude) || 0,
    };
  });

  if (params.checkIn && params.checkOut) {
    const checkIn = params.checkIn;
    const checkOut = params.checkOut;

    const availabilityResults = await Promise.all(
      mapped.map(async (listing) => ({
        listing,
        available: await isListingAvailable(listing.id, checkIn, checkOut),
      }))
    );

    mapped = availabilityResults.filter((r) => r.available).map((r) => r.listing);
  }

  return mapped;
}
