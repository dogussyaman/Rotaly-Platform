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
  checkInSlotStart?: string | null;
  checkInSlotEnd?: string | null;
  extras?: Record<string, any> | null;
}

export interface BookingWithListing {
  id: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  checkInSlotStart?: string | null;
  checkInSlotEnd?: string | null;
  extras?: Record<string, any> | null;
  listing: {
    id: string;
    title: string;
    city: string | null;
    country: string | null;
    imageUrl: string | null;
    hostUserId?: string | null;
  } | null;
}

export interface UpdateBookingInput {
  checkIn?: Date;
  checkOut?: Date;
  guestsCount?: number;
  specialRequests?: string | null;
  checkInSlotStart?: string | null;
  checkInSlotEnd?: string | null;
  extras?: Record<string, any> | null;
}

export async function isListingAvailable(
  listingId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const supabase = createClient();

  const checkInStr = checkIn.toISOString().slice(0, 10);
  const checkOutStr = checkOut.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('bookings')
    .select('id, check_in, check_out, status')
    .eq('listing_id', listingId)
    .in('status', ['pending', 'confirmed'])
    .lt('check_in', checkOutStr)
    .gt('check_out', checkInStr);

  if (error) {
    console.error('isListingAvailable error:', error.message);
    return true;
  }

  return !data || data.length === 0;
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

  const hostProfile = Array.isArray(data.hosts) ? data.hosts[0]?.profiles : (data.hosts as any)?.profiles;

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
    rules: data.house_rules && Array.isArray(data.house_rules) && data.house_rules[0]
      ? {
          smokingAllowed: !!data.house_rules[0].smoking_allowed,
          petsAllowed: !!data.house_rules[0].pets_allowed,
          partiesAllowed: !!data.house_rules[0].parties_allowed,
          additionalRules: data.house_rules[0].additional_rules ?? null,
        }
      : (data.house_rules as any)
      ? {
          smokingAllowed: !!(data.house_rules as any).smoking_allowed,
          petsAllowed: !!(data.house_rules as any).pets_allowed,
          partiesAllowed: !!(data.house_rules as any).parties_allowed,
          additionalRules: (data.house_rules as any).additional_rules ?? null,
        }
      : null,
    host: data.hosts && Array.isArray(data.hosts) && data.hosts[0]
      ? {
          id: data.hosts[0].id,
          fullName: (data.hosts[0].profiles as any)?.full_name ?? null,
          avatarUrl: (data.hosts[0].profiles as any)?.avatar_url ?? null,
        }
      : (data.hosts as any)
      ? {
          id: (data.hosts as any).id,
          fullName: (data.hosts as any).profiles?.full_name ?? null,
          avatarUrl: (data.hosts as any).profiles?.avatar_url ?? null,
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
      check_in_slot_start: input.checkInSlotStart ?? null,
      check_in_slot_end: input.checkInSlotEnd ?? null,
      extras: input.extras ?? null,
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
        check_in_slot_start,
        check_in_slot_end,
        extras,
        listings (
          id,
          title,
          city,
          country,
          hosts (user_id),
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
      checkInSlotStart: row.check_in_slot_start ?? null,
      checkInSlotEnd: row.check_in_slot_end ?? null,
      extras: (row.extras as Record<string, any> | null) ?? null,
      listing: row.listings
        ? {
            id: row.listings.id,
            title: row.listings.title,
            city: row.listings.city ?? null,
            country: row.listings.country ?? null,
            imageUrl,
            hostUserId: Array.isArray(row.listings.hosts) 
              ? row.listings.hosts[0]?.user_id 
              : row.listings.hosts?.user_id ?? null,
          }
        : null,
    } as BookingWithListing;
  });
}

export async function updateBooking(
  bookingId: string,
  input: UpdateBookingInput,
): Promise<boolean> {
  const supabase = createClient();

  const payload: Record<string, any> = {};

  if (input.checkIn) {
    payload.check_in = input.checkIn.toISOString().slice(0, 10);
  }
  if (input.checkOut) {
    payload.check_out = input.checkOut.toISOString().slice(0, 10);
  }
  if (typeof input.guestsCount === 'number') {
    payload.guests_count = input.guestsCount;
  }
  if (input.specialRequests !== undefined) {
    payload.special_requests = input.specialRequests;
  }
  if (input.checkInSlotStart !== undefined) {
    payload.check_in_slot_start = input.checkInSlotStart;
  }
  if (input.checkInSlotEnd !== undefined) {
    payload.check_in_slot_end = input.checkInSlotEnd;
  }
  if (input.extras !== undefined) {
    payload.extras = input.extras;
  }

  if (Object.keys(payload).length === 0) {
    return true;
  }

  const { error } = await supabase
    .from('bookings')
    .update(payload)
    .eq('id', bookingId);

  if (error) {
    console.error('updateBooking error:', error.message);
    return false;
  }

  return true;
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) {
    console.error('cancelBooking error:', error.message);
    return false;
  }

  return true;
}

export async function deleteBooking(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  // We use .select() to confirm the row was actually found and deleted
  // If RLS prevents deletion, it will return an empty array without an error
  const { data, error, status } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .select('id');

  if (error) {
    console.error('deleteBooking error:', error.message, 'Status:', status);
    return false;
  }

  // If data is empty, it means no row was deleted (likely RLS)
  if (!data || data.length === 0) {
    console.warn(`deleteBooking: Row not found or RLS prevented deletion for ID: ${bookingId}. Status: ${status}`);
    return false;
  }

  return true;
}

