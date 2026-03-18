import type { DashboardModuleKey } from '@/lib/dashboard/admin-structure';
import type { ApplicationStatus, HostApplication } from '@/lib/supabase/host-applications';
import { updateApplicationStatus, fetchHostApplications } from '@/lib/supabase/host-applications';
import { createClient } from '@/lib/supabase/client';
import { deleteListing, updateListing, type UpdateListingInput } from '@/lib/supabase/listings';

export type AdminSidebarBadgeMap = Partial<Record<DashboardModuleKey, number>>;

export type AdminManageableRole = 'admin' | 'host' | 'tour_operator';

export interface AdminRoleUserRow {
  id: string;
  fullName: string | null;
  email: string | null;
  isHost: boolean;
  isVerified: boolean;
  createdAt: string;
  roles: string[];
}

export interface FirstSignupCouponConfig {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiresAt: string | null;
  isActive: boolean;
}

async function safeCount(
  run: () => Promise<{ count: number | null; error: { message?: string } | null }>,
): Promise<number> {
  try {
    const { count, error } = await run();
    if (error) {
      console.error('safeCount error:', error.message ?? error);
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    console.error('safeCount unexpected error:', error);
    return 0;
  }
}

export async function fetchAdminSidebarBadges(): Promise<AdminSidebarBadgeMap> {
  const supabase = createClient();

  const [
    users,
    roles,
    hosts,
    listings,
    bookings,
    unreadMessages,
    coupons,
    pendingApplications,
  ] = await Promise.all([
    safeCount(async () => await supabase.from('profiles').select('id', { count: 'exact', head: true })),
    safeCount(async () => await supabase.from('user_roles').select('id', { count: 'exact', head: true })),
    safeCount(async () => await supabase.from('hosts').select('id', { count: 'exact', head: true })),
    safeCount(async () => await supabase.from('listings').select('id', { count: 'exact', head: true })),
    safeCount(async () => await supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
    safeCount(async () => await supabase.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false)),
    safeCount(async () => await supabase.from('coupons').select('id', { count: 'exact', head: true }).eq('is_active', true)),
    safeCount(
      async () =>
        await supabase
          .from('host_applications')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'in_review']),
    ),
  ]);

  return {
    users,
    roles,
    hosts,
    applications: pendingApplications,
    listings,
    bookings,
    messages: unreadMessages,
    coupons,
  };
}

export async function fetchRoleUsersForAdmin(): Promise<AdminRoleUserRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, is_host, is_verified, created_at, user_roles(role)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchRoleUsersForAdmin error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    isHost: !!row.is_host,
    isVerified: !!row.is_verified,
    createdAt: row.created_at,
    roles: (row.user_roles ?? []).map((r: any) => String(r.role)),
  }));
}

export async function setUserRoleActiveByAdmin(
  userId: string,
  role: AdminManageableRole,
  active: boolean,
): Promise<boolean> {
  const supabase = createClient();

  if (active) {
    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role });
    if (error && !String(error.message ?? '').toLowerCase().includes('duplicate')) {
      console.error('setUserRoleActiveByAdmin insert error:', error.message);
      return false;
    }
  } else {
    const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', role);
    if (error) {
      console.error('setUserRoleActiveByAdmin delete error:', error.message);
      return false;
    }
  }

  if (role === 'host') {
    const { error: profileError } = await supabase.from('profiles').update({ is_host: active }).eq('id', userId);
    if (profileError) {
      console.error('setUserRoleActiveByAdmin profile update error:', profileError.message);
      return false;
    }
  }

  return true;
}

export async function setUserVerifiedByAdmin(userId: string, verified: boolean): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('profiles').update({ is_verified: verified }).eq('id', userId);
  if (error) {
    console.error('setUserVerifiedByAdmin error:', error.message);
    return false;
  }
  return true;
}

export async function fetchFirstSignupCouponForAdmin(): Promise<FirstSignupCouponConfig | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('id, code, discount_type, discount_value, expires_at, is_active, host_id, per_user_limit')
    .is('host_id', null)
    .eq('per_user_limit', 1)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('fetchFirstSignupCouponForAdmin error:', error.message);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    code: data.code,
    discountType: data.discount_type === 'fixed_amount' ? 'fixed' : 'percentage',
    discountValue: Number(data.discount_value ?? 0),
    expiresAt: data.expires_at,
    isActive: !!data.is_active,
  };
}

export async function upsertFirstSignupCouponByAdmin(input: {
  code: string;
  discountValue: number;
  expiresAt?: string | null;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const adminId = auth.user?.id;
  if (!adminId) return false;

  const code = input.code.trim().toUpperCase();
  if (!code || !Number.isFinite(input.discountValue) || input.discountValue <= 0) return false;

  const payload = {
    code,
    host_id: null,
    discount_type: 'percentage',
    discount_value: input.discountValue,
    per_user_limit: 1,
    usage_limit: null,
    starts_at: new Date().toISOString(),
    expires_at: input.expiresAt ?? null,
    min_booking_total: null,
    is_active: true,
    created_by: adminId,
  };

  const { data: existing, error: existingErr } = await supabase
    .from('coupons')
    .select('id')
    .eq('code', code)
    .maybeSingle();

  if (existingErr) {
    console.error('upsertFirstSignupCouponByAdmin existing error:', existingErr.message);
    return false;
  }

  if (existing?.id) {
    const { error } = await supabase.from('coupons').update(payload).eq('id', existing.id);
    if (error) {
      console.error('upsertFirstSignupCouponByAdmin update error:', error.message);
      return false;
    }
    return true;
  }

  const { error } = await supabase.from('coupons').insert(payload);
  if (error) {
    console.error('upsertFirstSignupCouponByAdmin insert error:', error.message);
    return false;
  }
  return true;
}

export async function setFirstSignupCouponActiveByAdmin(couponId: string, isActive: boolean): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('coupons').update({ is_active: isActive }).eq('id', couponId);
  if (error) {
    console.error('setFirstSignupCouponActiveByAdmin error:', error.message);
    return false;
  }
  return true;
}

export async function fetchHostApplicationsForAdmin(): Promise<HostApplication[]> {
  return fetchHostApplications();
}

export async function reviewHostApplicationByAdmin(
  applicationId: string,
  status: ApplicationStatus,
  reviewerNotes?: string,
): Promise<boolean> {
  return updateApplicationStatus(applicationId, status, reviewerNotes);
}

export async function updateListingByAdmin(
  listingId: string,
  input: UpdateListingInput,
): Promise<boolean> {
  return updateListing(listingId, input);
}

export async function setListingActiveByAdmin(listingId: string, isActive: boolean): Promise<boolean> {
  return updateListingByAdmin(listingId, { isActive });
}

export async function deleteListingByAdmin(listingId: string): Promise<boolean> {
  return deleteListing(listingId);
}
