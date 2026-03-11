import { createClient } from '@/lib/supabase/client';

export interface WishlistSummary {
  id: string;
  name: string;
  itemsCount: number;
  createdAt: string;
}

export interface LoyaltySummary {
  pointsBalance: number;
  lifetimePoints: number;
  lastTransactions: {
    id: string;
    type: string;
    points: number;
    description: string | null;
    createdAt: string;
  }[];
}

export interface TourBookingSummary {
  id: string;
  tourTitle: string | null;
  city: string | null;
  country: string | null;
  participants: number;
  totalPrice: number;
  status: string;
  startTime: string | null;
}

export interface UpdateProfileInput {
  fullName?: string | null;
  phone?: string | null;
  bio?: string | null;
}

export async function fetchWishlists(userId: string): Promise<WishlistSummary[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('wishlists')
    .select(
      `
        id,
        name,
        created_at,
        wishlist_items ( id )
      `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchWishlists error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    itemsCount: Array.isArray(row.wishlist_items) ? row.wishlist_items.length : 0,
  }));
}

export async function fetchLoyaltySummary(userId: string): Promise<LoyaltySummary | null> {
  const supabase = createClient();

  const [accountRes, txRes] = await Promise.all([
    supabase
      .from('loyalty_accounts')
      .select('id, points_balance, lifetime_points_earned')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('loyalty_point_transactions')
      .select('id, type, points, description, created_at, account_id')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  if (accountRes.error) {
    console.error('fetchLoyaltySummary account error:', accountRes.error.message);
    return null;
  }

  const account = accountRes.data;
  if (!account) return null;

  const transactions = (txRes.data ?? []).filter((tx: any) => tx.account_id === account.id);

  return {
    pointsBalance: account.points_balance ?? 0,
    lifetimePoints: account.lifetime_points_earned ?? 0,
    lastTransactions: transactions.map((tx: any) => ({
      id: tx.id,
      type: tx.type,
      points: tx.points,
      description: tx.description ?? null,
      createdAt: tx.created_at,
    })),
  };
}

export async function fetchTourBookings(userId: string): Promise<TourBookingSummary[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tour_bookings')
    .select(
      `
        id,
        tour_id,
        schedule_id,
        participants_count,
        total_price,
        status,
        tours (
          title,
          city,
          country
        ),
        tour_schedules (
          start_time
        )
      `
    )
    .eq('guest_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchTourBookings error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    tourTitle: row.tours?.title ?? null,
    city: row.tours?.city ?? null,
    country: row.tours?.country ?? null,
    participants: row.participants_count ?? 0,
    totalPrice: Number(row.total_price ?? 0),
    status: row.status,
    startTime: row.tour_schedules?.start_time ?? null,
  }));
}

export async function updateUserProfile(input: UpdateProfileInput): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('updateUserProfile getUser error:', userError?.message);
    return false;
  }

  const payload: Record<string, any> = {};
  if (input.fullName !== undefined) {
    payload.full_name = input.fullName;
  }
  if (input.phone !== undefined) {
    payload.phone = input.phone;
  }
  if (input.bio !== undefined) {
    payload.bio = input.bio;
  }

  if (Object.keys(payload).length === 0) {
    return true;
  }

  const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);

  if (error) {
    console.error('updateUserProfile error:', error.message);
    return false;
  }

  return true;
}

export async function requestPasswordReset(email: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    console.error('requestPasswordReset error:', error.message);
    return false;
  }

  return true;
}

export async function deleteAccount(): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('deleteAccount getUser error:', userError?.message);
    return false;
  }

  const { error } = await supabase.from('profiles').delete().eq('id', user.id);

  if (error) {
    console.error('deleteAccount error:', error.message);
    return false;
  }

  await supabase.auth.signOut();

  return true;
}

