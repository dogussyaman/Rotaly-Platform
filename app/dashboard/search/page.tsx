'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostByUserId, fetchHostBookingsPage, fetchHostListingsPage, type HostBooking, type HostListingCard } from '@/lib/supabase/host';
import { fetchUserBookingsPage, type BookingWithListing } from '@/lib/supabase/bookings';
import { fetchConversations, type ConversationSummary } from '@/lib/supabase/messages';
import { SearchResultsTabs } from './_components/SearchResultsTabs';

function DashboardSearchContent() {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();
  const { profile } = useAppSelector((s) => s.user);
  const role: 'admin' | 'host' | 'guest' = useMemo(() => {
    if (!profile) return 'guest';
    return profile.isAdmin ? 'admin' : profile.isHost ? 'host' : 'guest';
  }, [profile]);

  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'messages'>('bookings');
  const [loading, setLoading] = useState(true);
  const [listingsPage, setListingsPage] = useState(1);
  const [listings, setListings] = useState<{ rows: HostListingCard[]; total: number; pageSize: number }>({ rows: [], total: 0, pageSize: 10 });
  const [bookingsPage, setBookingsPage] = useState(1);
  const [hostBookings, setHostBookings] = useState<{ rows: HostBooking[]; total: number; pageSize: number }>({ rows: [], total: 0, pageSize: 10 });
  const [guestBookings, setGuestBookings] = useState<{ rows: BookingWithListing[]; total: number; pageSize: number }>({ rows: [], total: 0, pageSize: 10 });
  const [messagesPage, setMessagesPage] = useState(1);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    setListingsPage(1);
    setBookingsPage(1);
    setMessagesPage(1);
  }, [q]);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      setLoading(true);
      try {
        if (role === 'host') {
          const host = await fetchHostByUserId(profile.id);
          if (!host) {
            setListings({ rows: [], total: 0, pageSize: 10 });
            setHostBookings({ rows: [], total: 0, pageSize: 10 });
          } else {
            const [l, b] = await Promise.all([
              fetchHostListingsPage(host.hostId, { page: listingsPage, pageSize: 10, query: q }),
              fetchHostBookingsPage(host.hostId, { page: bookingsPage, pageSize: 10, query: q, status: 'all' }),
            ]);
            setListings({ rows: l.rows, total: l.total, pageSize: l.pageSize });
            setHostBookings({ rows: b.rows, total: b.total, pageSize: b.pageSize });
          }
        } else {
          const b = await fetchUserBookingsPage(profile.id, { page: bookingsPage, pageSize: 10, query: q, status: 'all' });
          setGuestBookings({ rows: b.rows, total: b.total, pageSize: b.pageSize });
        }
        const convs = await fetchConversations(profile.id);
        setConversations(q.length >= 2 ? convs.filter((c) => (c.otherUserName ?? '').toLowerCase().includes(q.toLowerCase())) : convs);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [profile?.id, role, q, listingsPage, bookingsPage]);

  const conversationsPaged = useMemo(() => {
    const pageSize = 10;
    const total = conversations.length;
    const start = (messagesPage - 1) * pageSize;
    return { rows: conversations.slice(start, start + pageSize), total, pageSize };
  }, [conversations, messagesPage]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <SearchResultsTabs
        q={q}
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        listings={listings}
        listingsPage={listingsPage}
        setListingsPage={setListingsPage}
        hostBookings={hostBookings}
        guestBookings={guestBookings}
        bookingsPage={bookingsPage}
        setBookingsPage={setBookingsPage}
        conversationsPaged={conversationsPaged}
        messagesPage={messagesPage}
        setMessagesPage={setMessagesPage}
      />
    </div>
  );
}

export default function DashboardSearchPage() {
  return (
    <Suspense fallback={<div className="flex h-[400px] w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <DashboardSearchContent />
    </Suspense>
  );
}
