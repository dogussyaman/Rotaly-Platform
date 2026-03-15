import { createClient } from '@/lib/supabase/client';
import { fetchHostByUserId } from '@/lib/supabase/host';

export type NotificationSummary = {
  unreadMessages: number;
  upcomingHostCheckins: number;
  upcomingTrips: number;
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

