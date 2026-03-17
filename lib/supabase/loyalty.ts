import { createClient } from '@/lib/supabase/client';

export interface LoyaltyAccount {
  id: string;
  userId: string;
  pointsBalance: number;
  lifetimePointsEarned: number;
}

export interface LoyaltyTransaction {
  id: string;
  accountId: string;
  bookingId: string | null;
  type: 'earn' | 'redeem' | 'adjust';
  points: number;
  description: string | null;
  createdAt: string;
}

/** Fetch the loyalty account for a user (returns null if not yet created) */
export async function fetchLoyaltyAccount(userId: string): Promise<LoyaltyAccount | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('loyalty_accounts')
    .select('id, user_id, points_balance, lifetime_points_earned')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('fetchLoyaltyAccount error:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    pointsBalance: data.points_balance ?? 0,
    lifetimePointsEarned: data.lifetime_points_earned ?? 0,
  };
}

/** Fetch recent transactions for a user's loyalty account */
export async function fetchLoyaltyTransactions(
  userId: string,
  limit = 20,
): Promise<LoyaltyTransaction[]> {
  const supabase = createClient();

  const accountRes = await supabase
    .from('loyalty_accounts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (accountRes.error || !accountRes.data) return [];

  const { data, error } = await supabase
    .from('loyalty_point_transactions')
    .select('id, account_id, booking_id, type, points, description, created_at')
    .eq('account_id', accountRes.data.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchLoyaltyTransactions error:', error.message);
    return [];
  }

  return (data ?? []).map((tx: any) => ({
    id: tx.id,
    accountId: tx.account_id,
    bookingId: tx.booking_id ?? null,
    type: tx.type,
    points: tx.points,
    description: tx.description ?? null,
    createdAt: tx.created_at,
  }));
}

/**
 * Mark a booking as completed.
 * The DB trigger `trg_apply_loyalty_for_booking` will automatically
 * create/update the loyalty account and add an "earn" transaction.
 */
export async function completeBookingWithLoyalty(bookingId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId);

  if (error) {
    console.error('completeBookingWithLoyalty error:', error.message);
    return false;
  }

  return true;
}

/**
 * Validate that the user has enough points and return max redeemable.
 * Returns 0 if user has no loyalty account.
 */
export async function getRedeemablePoints(userId: string): Promise<number> {
  const account = await fetchLoyaltyAccount(userId);
  return account?.pointsBalance ?? 0;
}
