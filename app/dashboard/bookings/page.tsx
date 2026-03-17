'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

const STATUS_TABS = [
  { value: 'all', label: 'Tümü' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'confirmed', label: 'Onaylı' },
  { value: 'cancelled', label: 'İptal' },
  { value: 'completed', label: 'Tamamlandı' },
] as const;

type StatusValue = (typeof STATUS_TABS)[number]['value'];

export default function BookingsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();

  const role: 'admin' | 'host' | 'guest' = useMemo(() => {
    if (!profile) return 'guest';
    return profile.isAdmin ? 'admin' : profile.isHost ? 'host' : 'guest';
  }, [profile]);

  const [status, setStatus] = useState<StatusValue>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
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
            `id, guest_id, check_in, check_out, guests_count, total_price, final_price, status,
             listings!inner (id, title),
             profiles:profiles!guest_id (full_name)`,
            { count: 'exact' },
          )
          .order('check_in', { ascending: true });

        if (status && status !== 'all') baseQuery = baseQuery.eq('status', status);

        const qValue = q.trim();
        const filteredQuery = qValue ? baseQuery.ilike('listings.title', `%${qValue}%`) : baseQuery;
        let res = await filteredQuery.range(from, to);
        if (res.error && qValue) {
          res = await baseQuery.range(from, to);
        }

        const { data, error, count } = res;
        if (error) {
          setAdminBookings({ rows: [], total: 0 });
          return;
        }

        const rows = (data ?? []).map((row: any) => {
          const diffMs = Math.abs(new Date(row.check_out).getTime() - new Date(row.check_in).getTime());
          return {
            id: row.id,
            guestId: row.guest_id ?? null,
            guestName: row.profiles?.full_name ?? null,
            listingTitle: row.listings?.title ?? null,
            checkIn: row.check_in,
            checkOut: row.check_out,
            nights: Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24))),
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
        if (!host) { setHostBookings({ rows: [], total: 0 }); return; }
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

  useEffect(() => { void refresh(); }, [profile?.id, role, page, status, q]);

  const handleStatusChange = (val: string) => {
    startTransition(() => setStatus(val as StatusValue));
  };

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

  const isTransitioning = isPending || loading;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Tabs value={status} onValueChange={handleStatusChange}>
          <TabsList className="h-10 rounded-xl bg-white border border-[#e5e7eb] p-1 shadow-sm gap-0.5">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'rounded-lg px-4 text-sm font-medium transition-all duration-150',
                  'data-[state=active]:bg-[#1c1c21] data-[state=active]:text-white data-[state=active]:shadow-sm',
                  'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground',
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {q && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg h-9"
            onClick={() => router.push('/dashboard/bookings')}
          >
            Filtreyi temizle
          </Button>
        )}
      </div>

      {/* Table card with transition overlay */}
      <div className={cn('transition-opacity duration-200', isTransitioning ? 'opacity-60' : 'opacity-100')}>
        <BookingsTableCard
          role={role}
          status={status}
          setStatus={setStatus}
          hostBookings={hostBookings}
          adminBookings={adminBookings}
          guestBookings={guestBookings}
          loading={loading}
          isTransitioning={isTransitioning}
          page={page}
          setPage={setPage}
          messagingBookingId={messagingBookingId}
          onMessageGuest={handleMessageGuest}
          onConfirmHost={handleConfirmHost}
          onCancelHost={handleCancelHost}
          onCancelGuest={handleCancelGuest}
          hasQuery={!!q}
        />
      </div>

      {role === 'host' && hostId && (
        <div className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm flex items-center gap-2">
          <span className="font-medium text-foreground">Host ID</span>
          <span className="font-mono text-xs bg-[#f3f4f6] px-2 py-0.5 rounded">{hostId}</span>
        </div>
      )}
    </div>
  );
}
