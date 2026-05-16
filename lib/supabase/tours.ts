import { createClient } from '@/lib/supabase/client';
import { recordCouponUsage, validateCoupon } from '@/lib/supabase/coupons';

export type TourPricingRuleType = 'season' | 'group_size' | 'early_booking' | 'custom';

export interface TourCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

export interface TourGuide {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  experienceYears: number;
  averageRating: number;
  totalReviews: number;
}

export interface TourImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface TourAmenity {
  id: string;
  amenityName: string;
  amenityIcon: string | null;
  description: string | null;
}

export interface TourPricingRule {
  id: string;
  ruleType: TourPricingRuleType;
  seasonName: string | null;
  seasonStartDate: string | null;
  seasonEndDate: string | null;
  minGroupSize: number | null;
  maxGroupSize: number | null;
  daysBeforeTour: number | null;
  priceAdjustment: number;
  priceAdjustmentPercent: number;
  isActive: boolean;
}

export interface TourSchedule {
  id: string;
  tourId: string;
  startTime: string;
  availableSpots: number | null;
  priceOverride: number | null;
  isCancelled: boolean;
}

export interface TourReview {
  id: string;
  rating: number;
  comment: string | null;
  reviewerId: string;
  bookingId: string;
  createdAt: string;
}

export interface TourSummary {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  country: string | null;
  durationMinutes: number | null;
  minParticipants: number | null;
  maxParticipants: number | null;
  basePrice: number;
  currency: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  slug: string | null;
  meetingPoint: string | null;
  category: TourCategory | null;
  guide: TourGuide | null;
  previewImage: string | null;
}

export interface TourDetail extends TourSummary {
  detailedItinerary: string | null;
  amenities: TourAmenity[];
  pricingRules: TourPricingRule[];
  schedules: TourSchedule[];
  images: TourImage[];
}

export interface TourSearchParams {
  city?: string;
  country?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  limit?: number;
  offset?: number;
}

export interface TourQuote {
  tourId: string;
  scheduleId: string;
  participants: number;
  basePrice: number;
  schedulePrice: number;
  totalPrice: number;
  discountTotal: number;
  finalPrice: number;
  couponId: string | null;
  couponCode: string | null;
  couponError: string | null;
  appliedRuleIds: string[];
}

export interface CreateTourBookingInput {
  tourId: string;
  scheduleId: string;
  guestId: string;
  participantsCount: number;
  couponCode?: string | null;
  specialRequests?: string | null;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

const TOUR_SUMMARY_SELECT = `
  id,
  title,
  description,
  city,
  country,
  duration_minutes,
  min_participants,
  max_participants,
  base_price,
  currency,
  rating,
  total_reviews,
  is_active,
  slug,
  meeting_point,
  tour_categories (
    id,
    name,
    description,
    icon,
    color
  ),
  tour_guides (
    id,
    full_name,
    avatar_url,
    bio,
    experience_years,
    average_rating,
    total_reviews
  ),
  tour_images (
    id,
    url,
    alt_text,
    is_primary,
    sort_order
  )
`;

function mapTourSummary(row: any): TourSummary {
  const images = Array.isArray(row.tour_images)
    ? row.tour_images.map((image: any) => ({
        id: image.id,
        url: image.url,
        altText: image.alt_text ?? null,
        isPrimary: image.is_primary ?? false,
        sortOrder: image.sort_order ?? 0,
      }))
    : [];

  const primaryImage = images.find((image: TourImage) => image.isPrimary) ?? images[0];

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    city: row.city ?? null,
    country: row.country ?? null,
    durationMinutes: row.duration_minutes ?? null,
    minParticipants: row.min_participants ?? null,
    maxParticipants: row.max_participants ?? null,
    basePrice: Number(row.base_price ?? 0),
    currency: row.currency ?? 'TRY',
    rating: Number(row.rating ?? 0),
    totalReviews: row.total_reviews ?? 0,
    isActive: row.is_active ?? false,
    slug: row.slug ?? null,
    meetingPoint: row.meeting_point ?? null,
    category: row.tour_categories
      ? {
          id: row.tour_categories.id,
          name: row.tour_categories.name,
          description: row.tour_categories.description ?? null,
          icon: row.tour_categories.icon ?? null,
          color: row.tour_categories.color ?? null,
        }
      : null,
    guide: row.tour_guides
      ? {
          id: row.tour_guides.id,
          fullName: row.tour_guides.full_name,
          avatarUrl: row.tour_guides.avatar_url ?? null,
          bio: row.tour_guides.bio ?? null,
          experienceYears: row.tour_guides.experience_years ?? 0,
          averageRating: Number(row.tour_guides.average_rating ?? 0),
          totalReviews: row.tour_guides.total_reviews ?? 0,
        }
      : null,
    previewImage: primaryImage?.url ?? null,
  };
}

function mapPricingRule(row: any): TourPricingRule {
  const ruleType: TourPricingRuleType = row.rule_type === 'season'
    ? 'season'
    : row.rule_type === 'group_size'
    ? 'group_size'
    : row.rule_type === 'early_booking'
    ? 'early_booking'
    : 'custom';

  return {
    id: row.id,
    ruleType,
    seasonName: row.season_name ?? null,
    seasonStartDate: row.season_start_date ?? null,
    seasonEndDate: row.season_end_date ?? null,
    minGroupSize: row.min_group_size ?? null,
    maxGroupSize: row.max_group_size ?? null,
    daysBeforeTour: row.days_before_tour ?? null,
    priceAdjustment: Number(row.price_adjustment ?? 0),
    priceAdjustmentPercent: Number(row.price_adjustment_percent ?? 0),
    isActive: row.is_active ?? true,
  };
}

function toTourSchedule(row: any): TourSchedule {
  return {
    id: row.id,
    tourId: row.tour_id,
    startTime: row.start_time,
    availableSpots: row.available_spots ?? null,
    priceOverride: row.price_override ?? null,
    isCancelled: row.is_cancelled ?? false,
  };
}

function toTourAmenity(row: any): TourAmenity {
  return {
    id: row.id,
    amenityName: row.amenity_name,
    amenityIcon: row.amenity_icon ?? null,
    description: row.description ?? null,
  };
}

function toTourImage(row: any): TourImage {
  return {
    id: row.id,
    url: row.url,
    altText: row.alt_text ?? null,
    isPrimary: row.is_primary ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

function toTourReview(row: any): TourReview {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment ?? null,
    reviewerId: row.reviewer_id,
    bookingId: row.booking_id,
    createdAt: row.created_at,
  };
}

function parseRuleMatch(rule: TourPricingRule, scheduleStart: string, participants: number): boolean {
  if (!rule.isActive) return false;

  const startDate = scheduleStart ? new Date(scheduleStart) : null;
  if (rule.seasonStartDate && rule.seasonEndDate && startDate) {
    const seasonStart = new Date(rule.seasonStartDate);
    const seasonEnd = new Date(rule.seasonEndDate);
    if (startDate < seasonStart || startDate > seasonEnd) return false;
  }

  if (rule.minGroupSize != null && participants < rule.minGroupSize) return false;
  if (rule.maxGroupSize != null && participants > rule.maxGroupSize) return false;

  if (rule.daysBeforeTour != null && startDate) {
    const today = new Date();
    const diffMs = startDate.getTime() - today.getTime();
    const daysUntilTour = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (daysUntilTour < rule.daysBeforeTour) return false;
  }

  return true;
}

export async function fetchTours(params: TourSearchParams = {}): Promise<TourSummary[]> {
  const supabase = createClient();

  let query = supabase.from('tours').select(TOUR_SUMMARY_SELECT).eq('is_active', true).order('created_at', { ascending: false });

  if (params.city && params.city.trim() !== '') {
    const match = params.city.trim();
    query = query.or(`city.ilike.%${match}%,country.ilike.%${match}%`);
  }

  if (params.country && params.country.trim() !== '') {
    query = query.eq('country', params.country.trim());
  }

  if (params.categoryId) {
    query = query.eq('tour_category_id', params.categoryId);
  }

  if (params.minPrice != null) {
    query = query.gte('base_price', params.minPrice);
  }

  if (params.maxPrice != null) {
    query = query.lte('base_price', params.maxPrice);
  }

  if (params.minRating != null) {
    query = query.gte('rating', params.minRating);
  }

  if (params.limit != null) {
    query = query.limit(params.limit);
  }

  if (params.offset != null) {
    query = query.range(params.offset, params.offset + (params.limit ?? 20) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchTours error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => mapTourSummary(row));
}

export async function fetchTourById(tourId: string): Promise<TourDetail | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tours')
    .select(`
      ${TOUR_SUMMARY_SELECT},
      detailed_itinerary,
      tour_amenities (id, amenity_name, amenity_icon, description),
      tour_pricing_rules (id, rule_type, season_name, season_start_date, season_end_date, min_group_size, max_group_size, days_before_tour, price_adjustment, price_adjustment_percent, is_active),
      tour_schedules (id, tour_id, start_time, available_spots, price_override, is_cancelled),
      tour_images (id, url, alt_text, is_primary, sort_order),
      tour_reviews (id, rating, comment, reviewer_id, booking_id, created_at)
    `)
    .eq('id', tourId)
    .maybeSingle();

  if (error) {
    console.error('fetchTourById error:', error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const baseSummary = mapTourSummary(data);

  return {
    ...baseSummary,
    detailedItinerary: data.detailed_itinerary ?? null,
    amenities: Array.isArray(data.tour_amenities) ? data.tour_amenities.map(toTourAmenity) : [],
    pricingRules: Array.isArray(data.tour_pricing_rules) ? data.tour_pricing_rules.map(mapPricingRule) : [],
    schedules: Array.isArray(data.tour_schedules) ? data.tour_schedules.map(toTourSchedule) : [],
    images: Array.isArray(data.tour_images) ? data.tour_images.map(toTourImage) : [],
  };
}

export async function fetchTourSchedules(tourId: string): Promise<TourSchedule[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tour_schedules')
    .select('id, tour_id, start_time, available_spots, price_override, is_cancelled')
    .eq('tour_id', tourId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('fetchTourSchedules error:', error.message);
    return [];
  }

  return (data ?? []).map(toTourSchedule);
}

export async function fetchTourPricingRules(tourId: string): Promise<TourPricingRule[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tour_pricing_rules')
    .select('id, rule_type, season_name, season_start_date, season_end_date, min_group_size, max_group_size, days_before_tour, price_adjustment, price_adjustment_percent, is_active')
    .eq('tour_id', tourId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('fetchTourPricingRules error:', error.message);
    return [];
  }

  return (data ?? []).map(mapPricingRule);
}

export async function fetchTourAmenities(tourId: string): Promise<TourAmenity[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tour_amenities')
    .select('id, amenity_name, amenity_icon, description')
    .eq('tour_id', tourId)
    .order('amenity_name', { ascending: true });

  if (error) {
    console.error('fetchTourAmenities error:', error.message);
    return [];
  }

  return (data ?? []).map(toTourAmenity);
}

export async function fetchTourReviews(tourId: string): Promise<TourReview[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tour_reviews')
    .select('id, rating, comment, reviewer_id, booking_id, created_at')
    .eq('tour_id', tourId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchTourReviews error:', error.message);
    return [];
  }

  return (data ?? []).map(toTourReview);
}

export async function calculateTourQuote(options: {
  tourId: string;
  scheduleId: string;
  participants: number;
  couponCode?: string | null;
  guestId?: string;
}): Promise<TourQuote | null> {
  const supabase = createClient();

  const scheduleRes = await supabase
    .from('tour_schedules')
    .select('id, tour_id, start_time, available_spots, price_override, is_cancelled')
    .eq('id', options.scheduleId)
    .maybeSingle();

  if (scheduleRes.error || !scheduleRes.data) {
    console.error('calculateTourQuote schedule error:', scheduleRes.error?.message);
    return null;
  }

  const schedule = toTourSchedule(scheduleRes.data);
  if (schedule.isCancelled) {
    console.warn('calculateTourQuote: schedule is cancelled');
    return null;
  }

  const tourRes = await supabase
    .from('tours')
    .select('id, base_price, currency, rating, total_reviews, min_participants, max_participants')
    .eq('id', schedule.tourId)
    .maybeSingle();

  if (tourRes.error || !tourRes.data) {
    console.error('calculateTourQuote tour error:', tourRes.error?.message);
    return null;
  }

  if (tourRes.data.min_participants != null && options.participants < tourRes.data.min_participants) {
    console.warn('calculateTourQuote: participants below minimum');
    return null;
  }

  if (tourRes.data.max_participants != null && options.participants > tourRes.data.max_participants) {
    console.warn('calculateTourQuote: participants exceed maximum');
    return null;
  }

  const basePrice = Number(tourRes.data.base_price ?? 0);
  const schedulePrice = schedule.priceOverride ?? basePrice;
  const pricingRules = await fetchTourPricingRules(schedule.tourId);

  const appliedRuleIds: string[] = [];
  let priceAdjustmentPerPerson = 0;

  pricingRules.forEach((rule) => {
    if (parseRuleMatch(rule, schedule.startTime, options.participants)) {
      appliedRuleIds.push(rule.id);
      priceAdjustmentPerPerson += Number(rule.priceAdjustment || 0);
      priceAdjustmentPerPerson += (Number(rule.priceAdjustmentPercent || 0) / 100) * schedulePrice;
    }
  });

  const effectiveUnitPrice = schedulePrice + priceAdjustmentPerPerson;
  const totalPrice = Math.max(0, effectiveUnitPrice * options.participants);

  let discountTotal = 0;
  let couponId: string | null = null;
  let couponError: string | null = null;

  if (options.couponCode) {
    if (!options.guestId) {
      couponError = 'Kuponu değerlendirmek için kullanıcı kimliği gerekli.';
    } else {
      const couponResult = await validateCoupon(options.couponCode, options.guestId, totalPrice);
      if (!couponResult.valid) {
        couponError = couponResult.error;
      } else {
        const couponTotal = Number(couponResult.discountAmount);
        discountTotal = Math.min(couponTotal, totalPrice);
        couponId = couponResult.coupon.id;
      }
    }
  }

  return {
    tourId: schedule.tourId,
    scheduleId: schedule.id,
    participants: options.participants,
    basePrice,
    schedulePrice,
    totalPrice,
    discountTotal,
    finalPrice: Math.max(0, totalPrice - discountTotal),
    couponId,
    couponCode: options.couponCode ?? null,
    couponError,
    appliedRuleIds,
  };
}

export async function createTourBooking(input: CreateTourBookingInput): Promise<{ id: string } | null> {
  const supabase = createClient();

  const quote = await calculateTourQuote({
    tourId: input.tourId,
    scheduleId: input.scheduleId,
    participants: input.participantsCount,
    couponCode: input.couponCode ?? null,
    guestId: input.guestId,
  });

  if (!quote) {
    console.error('createTourBooking error: quote could not be calculated');
    return null;
  }

  if (input.couponCode && quote.couponError) {
    console.error('createTourBooking invalid coupon:', quote.couponError);
    return null;
  }

  const scheduleRes = await supabase
    .from('tour_schedules')
    .select('available_spots')
    .eq('id', input.scheduleId)
    .maybeSingle();

  if (scheduleRes.error || !scheduleRes.data) {
    console.error('createTourBooking schedule lookup error:', scheduleRes.error?.message);
    return null;
  }

  if (scheduleRes.data.available_spots != null && input.participantsCount > scheduleRes.data.available_spots) {
    console.error('createTourBooking error: not enough available spots');
    return null;
  }

  const { data, error } = await supabase
    .from('tour_bookings')
    .insert({
      tour_id: input.tourId,
      schedule_id: input.scheduleId,
      guest_id: input.guestId,
      participants_count: input.participantsCount,
      total_price: quote.totalPrice,
      discount_total: quote.discountTotal,
      final_price: quote.finalPrice,
      coupon_id: quote.couponId,
      special_requests: input.specialRequests ?? null,
      status: input.status ?? 'pending',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('createTourBooking error:', error?.message);
    return null;
  }

  if (quote.couponId) {
    await recordCouponUsage(quote.couponId, input.guestId, data.id, quote.discountTotal);
  }

  if (scheduleRes.data.available_spots != null) {
    const newAvailability = Math.max(0, scheduleRes.data.available_spots - input.participantsCount);
    const { error: availabilityError } = await supabase
      .from('tour_schedules')
      .update({ available_spots: newAvailability })
      .eq('id', input.scheduleId);

    if (availabilityError) {
      console.error('createTourBooking availability update error:', availabilityError.message);
    }
  }

  return { id: data.id };
}
