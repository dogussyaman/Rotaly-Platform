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

