'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/lib/store/hooks';
import {
  fetchHostByUserId,
  fetchHostBookingsPage,
  updateHostBookingStatus,
  type HostBooking,
} from '@/lib/supabase/host';
import { cancelBooking, fetchUserBookingsPage, type BookingWithListing } from '@/lib/supabase/bookings';
import { createClient } from '@/lib/supabase/client';
import { getOrCreateConversation } from '@/lib/supabase/messages';
import { BookingsTableCard } from './_components/BookingsTableCard';

const PAGE_SIZE = 10;

export default function BookingsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();

  const role: 'admin' | 'host' | 'guest' = useMemo(() => {
    if (!profile) return 'guest';
    return profile.isAdmin ? 'admin' : profile.isHost ? 'host' : 'guest';
  }, [profile]);

  const [status, setStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hostId, setHostId] = useState<string | null>(null);
  const [hostBookings, setHostBookings] = useState<{ rows: HostBooking[]; total: number }>({ rows: [], total: 0 });
  const [adminBookings, setAdminBookings] = useState<{ rows: HostBooking[]; total: number }>({ rows: [], total: 0 });
  const [guestBookings, setGuestBookings] = useState<{ rows: BookingWithListing[]; total: number }>({ rows: [], total: 0 });
  const [messagingBookingId, setMessagingBookingId] = useState<string | null>(null);

  useEffect(() => setPage(1), [q, status]);

  const refresh = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      if (role === 'admin') {
        const supabase = createClient();
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let baseQuery = supabase
          .from('bookings')
          .select(
            `
              id,
              guest_id,
              check_in,
              check_out,
              guests_count,
              total_price,
              final_price,
              status,
              listings!inner (
                id,
                title
              ),
              profiles:profiles!guest_id (
                full_name
              )
            `,
            { count: 'exact' },
          )
          .order('check_in', { ascending: true });

        if (status && status !== 'all') {
          baseQuery = baseQuery.eq('status', status);
        }

        const qValue = q.trim();
        const filteredQuery = qValue ? baseQuery.ilike('listings.title', `%${qValue}%`) : baseQuery;

        let res = await filteredQuery.range(from, to);
        if (res.error && qValue) {
          console.warn('fetchAdminBookingsPage: search filter failed, retrying without query. Error:', res.error.message);
          res = await baseQuery.range(from, to);
        }

        const { data, error, count } = res;
        if (error) {
          console.error('fetchAdminBookingsPage error:', error.message);
          setAdminBookings({ rows: [], total: 0 });
          return;
        }

        const rows = (data ?? []).map((row: any) => {
          const checkIn = new Date(row.check_in);
          const checkOut = new Date(row.check_out);
          const diffMs = Math.abs(checkOut.getTime() - checkIn.getTime());
          const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

          return {
            id: row.id,
            guestId: row.guest_id ?? null,
            guestName: row.profiles?.full_name ?? null,
            listingTitle: row.listings?.title ?? null,
            checkIn: row.check_in,
            checkOut: row.check_out,
            nights,
            totalPrice: Number(row.final_price ?? row.total_price),
            status: row.status,
          } as HostBooking;
        });

        setAdminBookings({ rows, total: count ?? rows.length });
        setHostId(null);
        return;
      }

      if (role === 'host') {
        const host = await fetchHostByUserId(profile.id);
        setHostId(host?.hostId ?? null);
        if (!host) {
          setHostBookings({ rows: [], total: 0 });
          return;
        }
        const res = await fetchHostBookingsPage(host.hostId, { page, pageSize: PAGE_SIZE, status, query: q });
        setHostBookings({ rows: res.rows, total: res.total });
      } else {
        const res = await fetchUserBookingsPage(profile.id, { page, pageSize: PAGE_SIZE, status, query: q });
        setGuestBookings({ rows: res.rows, total: res.total });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [profile?.id, role, page, status, q]);

  const handleMessageGuest = async (guestId: string) => {
    if (!profile?.id || !guestId) return;
    setMessagingBookingId(guestId);
    const convId = await getOrCreateConversation(profile.id, guestId);
    setMessagingBookingId(null);
    if (convId) router.push(`/dashboard/messages?conversation=${encodeURIComponent(convId)}`);
  };

  const handleConfirmHost = async (bookingId: string) => {
    await updateHostBookingStatus(bookingId, 'confirmed');
    await refresh();
  };

  const handleCancelHost = async (bookingId: string) => {
    await updateHostBookingStatus(bookingId, 'cancelled');
    await refresh();
  };

  const handleCancelGuest = async (bookingId: string) => {
    await cancelBooking(bookingId);
    await refresh();
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section
        title=""
        description=""
        actions={
          q ? (
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => router.push('/dashboard/bookings')}>
              Filtreyi temizle
            </Button>
          ) : null
        }
      >
        <div className="space-y-6">
          <ContentCard title="Filtre" description="Duruma göre filtrele">
            <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <TabsList className="h-11 rounded-xl bg-[#f3f4f6] p-1">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Tümü</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Beklemede</TabsTrigger>
                <TabsTrigger value="confirmed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Onaylı</TabsTrigger>
                <TabsTrigger value="cancelled" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">İptal</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Tamamlandı</TabsTrigger>
              </TabsList>
            </Tabs>
          </ContentCard>

          <BookingsTableCard
            role={role}
            status={status}
            setStatus={setStatus}
            hostBookings={hostBookings}
            adminBookings={adminBookings}
            guestBookings={guestBookings}
            loading={loading}
            page={page}
            setPage={setPage}
            messagingBookingId={messagingBookingId}
            onMessageGuest={handleMessageGuest}
            onConfirmHost={handleConfirmHost}
            onCancelHost={handleCancelHost}
            onCancelGuest={handleCancelGuest}
            hasQuery={!!q}
          />

          {role === 'host' && (
            <ContentCard title="Özet" description="Hızlı durum görünümü">
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5">
                  <span className="text-muted-foreground text-xs font-medium">Host ID</span>
                  <span className="font-mono text-xs text-[#111]">{hostId ?? '—'}</span>
                </div>
              </div>
            </ContentCard>
          )}
        </div>
      </Section>
    </div>
  );
}
