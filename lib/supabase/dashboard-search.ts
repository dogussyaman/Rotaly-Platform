import { createClient } from '@/lib/supabase/client';
import { fetchHostByUserId } from '@/lib/supabase/host';
import { fetchConversations, type ConversationSummary } from '@/lib/supabase/messages';

export type DashboardSearchListing = {
  id: string;
  title: string;
  location: string;
};

export type DashboardSearchBooking = {
  id: string;
  listingTitle: string | null;
  guestName: string | null;
  checkIn: string;
  checkOut: string;
  status: string;
};

export type DashboardSearchConversation = {
  id: string;
  otherUserName: string | null;
  unreadCount: number;
};

export type DashboardSearchResults = {
  listings: DashboardSearchListing[];
  bookings: DashboardSearchBooking[];
  conversations: DashboardSearchConversation[];
};

export async function dashboardSearch(params: {
  userId: string;
  role: 'admin' | 'host' | 'guest';
  query: string;
  limit?: number;
}): Promise<DashboardSearchResults> {
  const supabase = createClient();
  const q = params.query.trim();
  const limit = Math.max(1, Math.min(10, params.limit ?? 5));

  if (q.length < 2) {
    return { listings: [], bookings: [], conversations: [] };
  }

  if (params.role === 'host') {
    const host = await fetchHostByUserId(params.userId);
    if (!host) return { listings: [], bookings: [], conversations: [] };

    const [listingRes, bookingRes, convs] = (await Promise.all([
      supabase
        .from('listings')
        .select('id, title, city, country')
        .eq('host_id', host.hostId)
        .ilike('title', `%${q}%`)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('bookings')
        .select(
          `
            id,
            check_in,
            check_out,
            status,
            listings!inner (
              host_id,
              title
            ),
            profiles:profiles!guest_id (
              full_name
            )
          `,
        )
        .eq('listings.host_id', host.hostId)
        .order('check_in', { ascending: true })
        .limit(25),
      fetchConversations(params.userId),
    ])) as [any, any, ConversationSummary[]];

    const listings = (listingRes.data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      location: [row.city, row.country].filter(Boolean).join(', '),
    }));

    const bookings = (bookingRes.data ?? [])
      .map((row: any) => ({
        id: row.id,
        listingTitle: row.listings?.title ?? null,
        guestName: row.profiles?.full_name ?? null,
        checkIn: row.check_in,
        checkOut: row.check_out,
        status: row.status,
      }))
      .filter((b: any) => {
        const haystack = `${b.listingTitle ?? ''} ${b.guestName ?? ''}`.toLowerCase();
        return haystack.includes(q.toLowerCase());
      })
      .slice(0, limit);

    const conversations = convs
      .filter((c) => (c.otherUserName ?? '').toLowerCase().includes(q.toLowerCase()))
      .slice(0, limit)
      .map((c) => ({
        id: c.id,
        otherUserName: c.otherUserName,
        unreadCount: c.unreadCount,
      }));

    return { listings, bookings, conversations };
  }

  // Guest/admin: focus on user's bookings + messages. (Admin global search can be added later.)
  const [bookingRes, convs] = (await Promise.all([
    supabase
      .from('bookings')
      .select(
        `
          id,
          check_in,
          check_out,
          status,
          listings (
            title
          )
        `,
      )
      .eq('guest_id', params.userId)
      .order('created_at', { ascending: false })
      .limit(25),
    fetchConversations(params.userId),
  ])) as [any, ConversationSummary[]];

  const bookings = (bookingRes.data ?? [])
    .map((row: any) => ({
      id: row.id,
      listingTitle: row.listings?.title ?? null,
      guestName: null,
      checkIn: row.check_in,
      checkOut: row.check_out,
      status: row.status,
    }))
    .filter((b: any) => `${b.listingTitle ?? ''}`.toLowerCase().includes(q.toLowerCase()))
    .slice(0, limit);

  const conversations = convs
    .filter((c) => (c.otherUserName ?? '').toLowerCase().includes(q.toLowerCase()))
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      otherUserName: c.otherUserName,
      unreadCount: c.unreadCount,
    }));

  return { listings: [], bookings, conversations };
}
