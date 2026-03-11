import { createClient } from '@/lib/supabase/client';

// Listing detail model used by listing page & checkout
export interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  rules: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
    partiesAllowed: boolean;
    additionalRules: string | null;
  } | null;
  host: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface CreateBookingInput {
  listingId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  guestsCount: number;
  totalPrice: number;
  specialRequests?: string | null;
}

export interface BookingWithListing {
  id: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    city: string | null;
    country: string | null;
    imageUrl: string | null;
  } | null;
}

export async function fetchListingById(id: string): Promise<ListingDetail | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(
      `
        id,
        title,
        description,
        address,
        city,
        country,
        price_per_night,
        rating,
        total_reviews,
        max_guests,
        bedrooms,
        bathrooms,
        latitude,
        longitude,
        host_id,
        listing_images (
          url,
          is_primary,
          sort_order
        ),
        house_rules (
          smoking_allowed,
          pets_allowed,
          parties_allowed,
          additional_rules
        ),
        hosts:hosts!inner (
          id,
          profiles:profiles!inner (
            full_name,
            avatar_url
          )
        )
      `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('fetchListingById error:', error.message);
    return null;
  }

  const images = (data.listing_images ?? [])
    .sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .map((img: any) => img.url as string);

  const hostProfile = data.hosts?.profiles;

  return {
    id: data.id,
    title: data.title,
    description: data.description ?? null,
    address: data.address ?? null,
    city: data.city ?? null,
    country: data.country ?? null,
    pricePerNight: Number(data.price_per_night),
    rating: Number(data.rating ?? 0),
    totalReviews: data.total_reviews ?? 0,
    maxGuests: data.max_guests ?? 1,
    bedrooms: data.bedrooms ?? 1,
    bathrooms: Number(data.bathrooms ?? 1),
    latitude: data.latitude ? Number(data.latitude) : null,
    longitude: data.longitude ? Number(data.longitude) : null,
    images,
    rules: data.house_rules
      ? {
          smokingAllowed: !!data.house_rules.smoking_allowed,
          petsAllowed: !!data.house_rules.pets_allowed,
          partiesAllowed: !!data.house_rules.parties_allowed,
          additionalRules: data.house_rules.additional_rules ?? null,
        }
      : null,
    host: data.hosts
      ? {
          id: data.hosts.id,
          fullName: hostProfile?.full_name ?? null,
          avatarUrl: hostProfile?.avatar_url ?? null,
        }
      : null,
  };
}

export async function createBooking(input: CreateBookingInput): Promise<{ id: string } | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      listing_id: input.listingId,
      guest_id: input.guestId,
      check_in: input.checkIn.toISOString().slice(0, 10),
      check_out: input.checkOut.toISOString().slice(0, 10),
      guests_count: input.guestsCount,
      total_price: input.totalPrice,
      special_requests: input.specialRequests ?? null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.error('createBooking error:', error.message);
    return null;
  }

  return { id: data.id as string };
}

export async function fetchUserBookings(userId: string): Promise<BookingWithListing[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
        id,
        listing_id,
        check_in,
        check_out,
        guests_count,
        total_price,
        status,
        created_at,
        listings (
          id,
          title,
          city,
          country,
          listing_images (
            url,
            is_primary,
            sort_order
          )
        )
      `
    )
    .eq('guest_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchUserBookings error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => {
    let imageUrl: string | null = null;
    if (row.listings?.listing_images?.length) {
      const sorted = [...row.listings.listing_images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
      imageUrl = sorted[0].url;
    }

    return {
      id: row.id,
      checkIn: row.check_in,
      checkOut: row.check_out,
      guestsCount: row.guests_count,
      totalPrice: Number(row.total_price),
      status: row.status,
      createdAt: row.created_at,
      listing: row.listings
        ? {
            id: row.listings.id,
            title: row.listings.title,
            city: row.listings.city ?? null,
            country: row.listings.country ?? null,
            imageUrl,
          }
        : null,
    } as BookingWithListing;
  });
}

