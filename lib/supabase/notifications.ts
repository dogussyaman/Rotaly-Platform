import { createClient } from '@/lib/supabase/client';
import { fetchHostByUserId } from '@/lib/supabase/host';

export type NotificationSummary = {
  unreadMessages: number;
  upcomingHostCheckins: number;
  upcomingTrips: number;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  metadata: Record<string, any> | null;
  isRead: boolean;
  createdAt: string;
  actionUrl: string | null;
  bookingId: string | null;
  listingId: string | null;
  conversationId: string | null;
  actorId: string | null;
  priority: number | null;
};

function toDateOnlyISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function fetchNotificationSummary(
  userId: string,
  role: 'admin' | 'host' | 'guest',
): Promise<NotificationSummary> {
  const supabase = createClient();

  const now = new Date();
  const today = toDateOnlyISO(now);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  const nextWeekStr = toDateOnlyISO(nextWeek);

  const unreadPromise = supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);

  const upcomingTripsPromise =
    role === 'guest'
      ? supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('guest_id', userId)
          .in('status', ['pending', 'confirmed'])
          .gte('check_in', today)
      : Promise.resolve({ count: 0 as number | null, error: null as any });

  const upcomingHostCheckinsPromise =
    role === 'host'
      ? (async () => {
          const host = await fetchHostByUserId(userId);
          if (!host) return { count: 0 as number | null, error: null as any };

          return await supabase
            .from('bookings')
            .select('id, listings!inner(host_id)', { count: 'exact', head: true })
            .eq('listings.host_id', host.hostId)
            .eq('status', 'confirmed')
            .gte('check_in', today)
            .lte('check_in', nextWeekStr);
        })()
      : Promise.resolve({ count: 0 as number | null, error: null as any });

  const [unreadRes, upcomingTripsRes, upcomingHostCheckinsRes] = await Promise.all([
    unreadPromise,
    upcomingTripsPromise,
    upcomingHostCheckinsPromise,
  ]);

  if (unreadRes.error) {
    console.error('fetchNotificationSummary unread error:', unreadRes.error.message);
  }
  if ((upcomingTripsRes as any).error) {
    console.error(
      'fetchNotificationSummary upcomingTrips error:',
      (upcomingTripsRes as any).error.message,
    );
  }
  if ((upcomingHostCheckinsRes as any).error) {
    console.error(
      'fetchNotificationSummary upcomingHostCheckins error:',
      (upcomingHostCheckinsRes as any).error.message,
    );
  }

  return {
    unreadMessages: unreadRes.count ?? 0,
    upcomingHostCheckins: (upcomingHostCheckinsRes as any).count ?? 0,
    upcomingTrips: (upcomingTripsRes as any).count ?? 0,
  };
}

export async function fetchNotifications(params: {
  userId: string;
  limit?: number;
  offset?: number;
}): Promise<NotificationItem[]> {
  const supabase = createClient();
  const limit = params.limit ?? 30;
  const offset = params.offset ?? 0;

  const { data, error } = await supabase
    .from('notifications')
    .select(
      'id, type, title, body, metadata, is_read, created_at, action_url, booking_id, listing_id, conversation_id, actor_id, priority',
    )
    .eq('user_id', params.userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('fetchNotifications error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body ?? null,
    metadata: row.metadata ?? null,
    isRead: !!row.is_read,
    createdAt: row.created_at,
    actionUrl: row.action_url ?? null,
    bookingId: row.booking_id ?? null,
    listingId: row.listing_id ?? null,
    conversationId: row.conversation_id ?? null,
    actorId: row.actor_id ?? null,
    priority: row.priority ?? null,
  }));
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('markNotificationRead error:', error.message);
    return false;
  }
  return true;
}

export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('markAllNotificationsRead error:', error.message);
    return false;
  }
  return true;
}
