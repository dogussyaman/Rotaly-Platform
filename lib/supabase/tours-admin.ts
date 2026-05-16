import { createClient } from '@/lib/supabase/client';

export type TourFormat = 'individual' | 'group';
export type TourOperatorType = 'host' | 'company';

export interface MyTourOperator {
  id: string;
  userId: string;
  hostId: string | null;
  operatorType: TourOperatorType;
  companyName: string | null;
  phone: string | null;
  website: string | null;
}

export interface MyTourRow {
  id: string;
  title: string;
  city: string | null;
  country: string | null;
  tourFormat: TourFormat;
  durationMinutes: number | null;
  minParticipants: number | null;
  maxParticipants: number | null;
  basePrice: number;
  currency: string;
  isActive: boolean;
  rating: number | null;
  tourGuideId: string | null;
  tourCategoryId: string | null;
  tourGuideName: string | null;
}

export interface MyTourGuideRow {
  id: string;
  fullName: string;
  phone: string | null;
  bio: string | null;
  experienceYears: number;
  isActive: boolean;
  isAvailable: boolean;
  averageRating: number;
}

export interface TourCategoryOption {
  id: string;
  name: string;
}

export interface CreateTourInput {
  title: string;
  description?: string | null;
  city?: string | null;
  country?: string | null;
  tourFormat: TourFormat;
  durationMinutes?: number | null;
  minParticipants?: number | null;
  maxParticipants?: number | null;
  basePrice: number;
  currency?: string;
  tourCategoryId?: string | null;
  tourGuideId?: string | null;
  meetingPoint?: string | null;
  detailedItinerary?: string | null;
  isActive?: boolean;
}

export interface UpdateTourInput extends Partial<CreateTourInput> {
  id: string;
}

export interface CreateTourGuideInput {
  fullName: string;
  phone?: string | null;
  bio?: string | null;
  experienceYears?: number;
  isActive?: boolean;
  isAvailable?: boolean;
}

export interface CreateTourScheduleInput {
  tourId: string;
  startTime: string;
  availableSpots?: number | null;
  priceOverride?: number | null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);
}

async function getAuthUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function fetchHostToursMenuState(userId: string): Promise<{ showTourMenus: boolean; toursEnabled: boolean }> {
  const supabase = createClient();
  const { data: host } = await supabase
    .from('hosts')
    .select('id, tours_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (!host) {
    return { showTourMenus: false, toursEnabled: false };
  }

  const toursEnabled = !!host.tours_enabled;

  if (toursEnabled) {
    return { showTourMenus: true, toursEnabled: true };
  }

  const { data: operator } = await supabase
    .from('tour_operators')
    .select('id')
    .eq('host_id', host.id)
    .maybeSingle();

  if (!operator) {
    return { showTourMenus: false, toursEnabled: false };
  }

  const { count } = await supabase
    .from('tours')
    .select('id', { count: 'exact', head: true })
    .eq('operator_id', operator.id);

  return {
    showTourMenus: (count ?? 0) > 0,
    toursEnabled: false,
  };
}

export async function fetchHostRecord(userId: string): Promise<{ hostId: string; toursEnabled: boolean } | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('hosts')
    .select('id, tours_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return { hostId: data.id, toursEnabled: !!data.tours_enabled };
}

export async function ensureCompanyTourOperator(userId: string, companyName?: string | null): Promise<MyTourOperator | null> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from('tour_operators')
    .select('id, user_id, host_id, operator_type, company_name, phone, website')
    .eq('user_id', userId)
    .is('host_id', null)
    .maybeSingle();

  if (existing) {
    return mapOperator(existing);
  }

  const { data: profile } = await supabase.from('profiles').select('full_name, email, phone').eq('id', userId).maybeSingle();

  const { data: created, error } = await supabase
    .from('tour_operators')
    .insert({
      user_id: userId,
      operator_type: 'company',
      company_name: companyName ?? profile?.full_name ?? profile?.email ?? 'Tur Şirketi',
      phone: profile?.phone ?? null,
    })
    .select('id, user_id, host_id, operator_type, company_name, phone, website')
    .single();

  if (error) {
    console.error('ensureCompanyTourOperator error:', error.message);
    return null;
  }

  return mapOperator(created);
}

export async function ensureHostTourOperator(userId: string): Promise<MyTourOperator | null> {
  const supabase = createClient();
  const host = await fetchHostRecord(userId);
  if (!host) {
    console.error('ensureHostTourOperator: no host record');
    return null;
  }

  const { data: existing } = await supabase
    .from('tour_operators')
    .select('id, user_id, host_id, operator_type, company_name, phone, website')
    .eq('host_id', host.hostId)
    .maybeSingle();

  if (existing) {
    return mapOperator(existing);
  }

  const { data: profile } = await supabase.from('profiles').select('full_name, email, phone').eq('id', userId).maybeSingle();

  const { data: created, error } = await supabase
    .from('tour_operators')
    .insert({
      user_id: userId,
      host_id: host.hostId,
      operator_type: 'host',
      company_name: profile?.full_name ?? profile?.email ?? 'Ev Sahibi Turları',
      phone: profile?.phone ?? null,
    })
    .select('id, user_id, host_id, operator_type, company_name, phone, website')
    .single();

  if (error) {
    console.error('ensureHostTourOperator error:', error.message);
    return null;
  }

  return mapOperator(created);
}

export async function enableHostTours(userId: string): Promise<boolean> {
  const supabase = createClient();
  const host = await fetchHostRecord(userId);
  if (!host) return false;

  const { error: hostError } = await supabase
    .from('hosts')
    .update({ tours_enabled: true })
    .eq('id', host.hostId);

  if (hostError) {
    console.error('enableHostTours host update error:', hostError.message);
    return false;
  }

  const operator = await ensureHostTourOperator(userId);
  return !!operator;
}

export async function fetchMyTourOperator(userId: string, options?: { isHost?: boolean }): Promise<MyTourOperator | null> {
  const supabase = createClient();

  if (options?.isHost) {
    const host = await fetchHostRecord(userId);
    if (!host) return null;
    const { data } = await supabase
      .from('tour_operators')
      .select('id, user_id, host_id, operator_type, company_name, phone, website')
      .eq('host_id', host.hostId)
      .maybeSingle();
    return data ? mapOperator(data) : null;
  }

  const { data } = await supabase
    .from('tour_operators')
    .select('id, user_id, host_id, operator_type, company_name, phone, website')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (!data?.length) return null;

  const company = data.find((row) => row.operator_type === 'company' && !row.host_id);
  const hostLinked = data.find((row) => row.host_id);
  return mapOperator(company ?? hostLinked ?? data[0]);
}

export async function resolveTourOperatorForUser(
  userId: string,
  opts: { isHost?: boolean; isTourOperator?: boolean },
): Promise<MyTourOperator | null> {
  if (opts.isHost) {
    const host = await fetchHostRecord(userId);
    if (host?.toursEnabled) {
      return ensureHostTourOperator(userId);
    }
    const hostOp = await fetchMyTourOperator(userId, { isHost: true });
    if (hostOp) return hostOp;
  }
  if (opts.isTourOperator) {
    return ensureCompanyTourOperator(userId);
  }
  return fetchMyTourOperator(userId);
}

export async function fetchMyTours(operatorId: string): Promise<MyTourRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tours')
    .select(
      `
      id,
      title,
      city,
      country,
      tour_format,
      duration_minutes,
      min_participants,
      max_participants,
      base_price,
      currency,
      is_active,
      rating,
      tour_guide_id,
      tour_category_id,
      tour_guides ( full_name )
    `,
    )
    .eq('operator_id', operatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchMyTours error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    city: row.city,
    country: row.country,
    tourFormat: (row.tour_format ?? 'group') as TourFormat,
    durationMinutes: row.duration_minutes,
    minParticipants: row.min_participants,
    maxParticipants: row.max_participants,
    basePrice: Number(row.base_price ?? 0),
    currency: row.currency ?? 'TRY',
    isActive: !!row.is_active,
    rating: row.rating != null ? Number(row.rating) : null,
    tourGuideId: row.tour_guide_id,
    tourCategoryId: row.tour_category_id,
    tourGuideName: row.tour_guides?.full_name ?? null,
  }));
}

export async function fetchMyTourById(tourId: string): Promise<(MyTourRow & {
  description: string | null;
  meetingPoint: string | null;
  detailedItinerary: string | null;
  operatorId: string;
}) | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tours')
    .select(
      `
      id,
      operator_id,
      title,
      description,
      city,
      country,
      tour_format,
      duration_minutes,
      min_participants,
      max_participants,
      base_price,
      currency,
      is_active,
      rating,
      tour_guide_id,
      tour_category_id,
      meeting_point,
      detailed_itinerary,
      tour_guides ( full_name )
    `,
    )
    .eq('id', tourId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    operatorId: data.operator_id,
    title: data.title,
    description: data.description,
    city: data.city,
    country: data.country,
    tourFormat: (data.tour_format ?? 'group') as TourFormat,
    durationMinutes: data.duration_minutes,
    minParticipants: data.min_participants,
    maxParticipants: data.max_participants,
    basePrice: Number(data.base_price ?? 0),
    currency: data.currency ?? 'TRY',
    isActive: !!data.is_active,
    rating: data.rating != null ? Number(data.rating) : null,
    tourGuideId: data.tour_guide_id,
    tourCategoryId: data.tour_category_id,
    tourGuideName: (data as any).tour_guides?.full_name ?? null,
    meetingPoint: data.meeting_point,
    detailedItinerary: data.detailed_itinerary,
  };
}

export async function fetchMyTourGuides(operatorId: string): Promise<MyTourGuideRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tour_guides')
    .select('id, full_name, phone, bio, experience_years, is_active, is_available, average_rating')
    .eq('operator_id', operatorId)
    .order('full_name');

  if (error) {
    console.error('fetchMyTourGuides error:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    bio: row.bio,
    experienceYears: row.experience_years ?? 0,
    isActive: !!row.is_active,
    isAvailable: !!row.is_available,
    averageRating: Number(row.average_rating ?? 0),
  }));
}

export async function fetchTourCategories(): Promise<TourCategoryOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tour_categories')
    .select('id, name')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('fetchTourCategories error:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({ id: row.id, name: row.name }));
}

export async function createTour(operatorId: string, input: CreateTourInput): Promise<string | null> {
  const supabase = createClient();
  const isIndividual = input.tourFormat === 'individual';
  const baseSlug = slugify(input.title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from('tours')
    .insert({
      operator_id: operatorId,
      title: input.title,
      description: input.description ?? null,
      city: input.city ?? null,
      country: input.country ?? null,
      tour_format: input.tourFormat,
      duration_minutes: input.durationMinutes ?? null,
      min_participants: isIndividual ? 1 : (input.minParticipants ?? 1),
      max_participants: isIndividual ? 1 : (input.maxParticipants ?? 20),
      base_price: input.basePrice,
      currency: input.currency ?? 'TRY',
      tour_category_id: input.tourCategoryId ?? null,
      tour_guide_id: input.tourGuideId ?? null,
      meeting_point: input.meetingPoint ?? null,
      detailed_itinerary: input.detailedItinerary ?? null,
      slug,
      is_active: input.isActive ?? false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('createTour error:', error.message);
    return null;
  }

  return data.id;
}

export async function updateTour(input: UpdateTourInput): Promise<boolean> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};

  if (input.title != null) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.city !== undefined) patch.city = input.city;
  if (input.country !== undefined) patch.country = input.country;
  if (input.tourFormat != null) {
    patch.tour_format = input.tourFormat;
    if (input.tourFormat === 'individual') {
      patch.min_participants = 1;
      patch.max_participants = 1;
    }
  }
  if (input.durationMinutes !== undefined) patch.duration_minutes = input.durationMinutes;
  if (input.minParticipants !== undefined) patch.min_participants = input.minParticipants;
  if (input.maxParticipants !== undefined) patch.max_participants = input.maxParticipants;
  if (input.basePrice != null) patch.base_price = input.basePrice;
  if (input.currency != null) patch.currency = input.currency;
  if (input.tourCategoryId !== undefined) patch.tour_category_id = input.tourCategoryId;
  if (input.tourGuideId !== undefined) patch.tour_guide_id = input.tourGuideId;
  if (input.meetingPoint !== undefined) patch.meeting_point = input.meetingPoint;
  if (input.detailedItinerary !== undefined) patch.detailed_itinerary = input.detailedItinerary;
  if (input.isActive != null) patch.is_active = input.isActive;

  const { error } = await supabase.from('tours').update(patch).eq('id', input.id);
  if (error) {
    console.error('updateTour error:', error.message);
    return false;
  }
  return true;
}

export async function deleteTour(tourId: string): Promise<boolean> {
  return updateTour({ id: tourId, isActive: false });
}

export async function assignTourGuide(tourId: string, guideId: string | null): Promise<boolean> {
  return updateTour({ id: tourId, tourGuideId: guideId });
}

export async function createTourGuide(operatorId: string, input: CreateTourGuideInput): Promise<string | null> {
  const supabase = createClient();
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('tour_guides')
    .insert({
      operator_id: operatorId,
      user_id: userId,
      full_name: input.fullName,
      phone: input.phone ?? null,
      bio: input.bio ?? null,
      experience_years: input.experienceYears ?? 0,
      is_active: input.isActive ?? true,
      is_available: input.isAvailable ?? true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('createTourGuide error:', error.message);
    return null;
  }

  return data.id;
}

export async function updateTourGuide(
  guideId: string,
  input: Partial<CreateTourGuideInput>,
): Promise<boolean> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.fullName != null) patch.full_name = input.fullName;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.bio !== undefined) patch.bio = input.bio;
  if (input.experienceYears != null) patch.experience_years = input.experienceYears;
  if (input.isActive != null) patch.is_active = input.isActive;
  if (input.isAvailable != null) patch.is_available = input.isAvailable;

  const { error } = await supabase.from('tour_guides').update(patch).eq('id', guideId);
  if (error) {
    console.error('updateTourGuide error:', error.message);
    return false;
  }
  return true;
}

export async function createTourSchedule(input: CreateTourScheduleInput): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tour_schedules')
    .insert({
      tour_id: input.tourId,
      start_time: input.startTime,
      available_spots: input.availableSpots ?? null,
      price_override: input.priceOverride ?? null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('createTourSchedule error:', error.message);
    return null;
  }

  return data.id;
}

export async function fetchTourSchedules(tourId: string): Promise<
  { id: string; startTime: string; availableSpots: number | null; priceOverride: number | null; isCancelled: boolean }[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tour_schedules')
    .select('id, start_time, available_spots, price_override, is_cancelled')
    .eq('tour_id', tourId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('fetchTourSchedules error:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    startTime: row.start_time,
    availableSpots: row.available_spots,
    priceOverride: row.price_override != null ? Number(row.price_override) : null,
    isCancelled: !!row.is_cancelled,
  }));
}

function mapOperator(row: any): MyTourOperator {
  return {
    id: row.id,
    userId: row.user_id,
    hostId: row.host_id ?? null,
    operatorType: (row.operator_type ?? 'company') as TourOperatorType,
    companyName: row.company_name,
    phone: row.phone,
    website: row.website,
  };
}
