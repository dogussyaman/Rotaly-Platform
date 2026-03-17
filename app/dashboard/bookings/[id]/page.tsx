'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Loader2, Pencil, Trash2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppSelector } from '@/lib/store/hooks';
import {
  fetchBookingById,
  cancelBooking,
  deleteBooking,
} from '@/lib/supabase/bookings';
import type { BookingDetail } from '@/lib/supabase/bookings';
import { updateHostBookingStatus } from '@/lib/supabase/host';
import { formatTime } from './_components/utils';
import { BookingDetailSummaryCard } from './_components/BookingDetailSummaryCard';
import { BookingDetailGuestCard } from './_components/BookingDetailGuestCard';
import { BookingDetailExtrasCard } from './_components/BookingDetailExtrasCard';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isGuest = !!profile?.id && !!booking?.guest && profile.id === booking.guest.id;
  const isHost = !!profile?.id && !!booking?.listing?.hostUserId && profile.id === booking.listing.hostUserId;
  const canEditOrCancel =
    (booking?.status === 'pending' || booking?.status === 'confirmed') && (isGuest || isHost);
  const canDelete = isGuest || isHost;

  useEffect(() => {
    (async () => {
      const data = await fetchBookingById(id);
      setBooking(data);
      setLoading(false);
    })();
  }, [id]);

  async function handleCancel() {
    if (!id || actionPending) return;
    setActionPending(true);
    const ok = await cancelBooking(id);
    setActionPending(false);
    setCancelDialogOpen(false);
    if (ok) {
      const next = await fetchBookingById(id);
      if (next) setBooking(next);
    }
  }

  async function handleHostConfirm() {
    if (!id || actionPending) return;
    setActionPending(true);
    const ok = await updateHostBookingStatus(id, 'confirmed');
    setActionPending(false);
    if (ok) {
      const next = await fetchBookingById(id);
      if (next) setBooking(next);
    }
  }

  async function handleHostCancel() {
    if (!id || actionPending) return;
    setActionPending(true);
    const ok = await updateHostBookingStatus(id, 'cancelled');
    setActionPending(false);
    setCancelDialogOpen(false);
    if (ok) {
      const next = await fetchBookingById(id);
      if (next) setBooking(next);
    }
  }

  async function handleDelete() {
    if (!id || actionPending) return;
    setActionPending(true);
    const ok = await deleteBooking(id);
    setActionPending(false);
    setDeleteDialogOpen(false);
    if (ok) router.push('/dashboard/bookings');
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  if (!booking) return notFound();

  const location = booking.listing
    ? [booking.listing.city, booking.listing.country].filter(Boolean).join(', ')
    : '—';

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section
        title=""
        description=""
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link href="/dashboard/bookings">Rezervasyonlara dön</Link>
            </Button>
            {/* Host view takes priority — show host actions when user is the host */}
            {isHost && (booking.status === 'pending' || booking.status === 'confirmed') && (
              <>
                {booking.status === 'pending' && (
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-lg bg-[#0d9488] hover:bg-[#0f766e]"
                    onClick={handleHostConfirm}
                    disabled={actionPending}
                  >
                    {actionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Onayla
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-red-600 hover:bg-red-50"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={actionPending}
                >
                  <XCircle className="mr-1.5 h-4 w-4" />
                  İptal et
                </Button>
              </>
            )}

            {/* Guest-only view — only when user is the guest but not the host */}
            {canEditOrCancel && isGuest && !isHost && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-amber-600 hover:bg-amber-50"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={actionPending}
                >
                  <XCircle className="mr-1.5 h-4 w-4" />
                  İptal et
                </Button>
                <Button asChild size="sm" className="rounded-lg bg-[#0d9488] hover:bg-[#0f766e]">
                  <Link href={`/bookings/${id}/edit`}>
                    <Pencil className="mr-1.5 h-4 w-4" />
                    Rezervasyonu düzenle
                  </Link>
                </Button>
              </>
            )}

            {canDelete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg text-red-600 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={actionPending}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Sil
              </Button>
            )}
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <BookingDetailSummaryCard booking={booking} location={location} />
          <BookingDetailGuestCard booking={booking} />
          <ContentCard title="Check-in penceresi" description="Giriş saati aralığı">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Başlangıç</span>
                <span>{formatTime(booking.checkInSlotStart)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bitiş</span>
                <span>{formatTime(booking.checkInSlotEnd)}</span>
              </div>
            </div>
          </ContentCard>
          <BookingDetailExtrasCard extras={booking.extras as Record<string, unknown> | null} />
        </div>
      </Section>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rezervasyonu iptal et</AlertDialogTitle>
            <AlertDialogDescription>
              Bu rezervasyonu iptal etmek istediğinize emin misiniz? İptal edilen rezervasyonlar listede &quot;İptal&quot; olarak görünür.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (isHost) handleHostCancel();
                else handleCancel();
              }}
              className="bg-amber-600 hover:bg-amber-700"
              disabled={actionPending}
            >
              {actionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              İptal et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rezervasyonu sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu rezervasyonu kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionPending}
            >
              {actionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
