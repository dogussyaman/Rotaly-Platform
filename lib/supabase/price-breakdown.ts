import { fetchAvailabilityByListing } from '@/lib/supabase/availability';
import { fetchSeasonalPricingForListing } from '@/lib/supabase/seasonal-pricing';
import {
  computeBookingPrice,
  type ListingPricingParams,
  type PriceBreakdown,
} from '@/lib/supabase/pricing';
import type { ListingDetail } from '@/lib/supabase/bookings';

/**
 * İlan + tarih + misafir sayısı için fiyat kırılımını getirir.
 * Takvim özel fiyatları ve sezonluk kurallar dahil.
 */
export async function getPriceBreakdown(
  listing: ListingDetail,
  checkIn: string,
  checkOut: string,
  guestsCount: number,
): Promise<PriceBreakdown | null> {
  const availability = await fetchAvailabilityByListing(
    listing.id,
    checkIn,
    checkOut,
  );
  const seasonalRules = await fetchSeasonalPricingForListing(listing.id);

  const availabilityByDate = new Map<string, number | null>();
  for (const day of availability) {
    availabilityByDate.set(day.date, day.customPrice);
  }

  const params: ListingPricingParams = {
    pricePerNight: listing.pricePerNight,
    cleaningFee: listing.cleaningFee ?? 0,
    serviceFeeFixed: listing.serviceFee ?? 0,
    serviceFeePercent: 12,
    maxGuests: listing.maxGuests,
    baseGuests: listing.baseGuests ?? 1,
    extraGuestFee: listing.extraGuestFee ?? 0,
  };

  return computeBookingPrice(
    params,
    checkIn,
    checkOut,
    guestsCount,
    availabilityByDate,
    seasonalRules,
  );
}
