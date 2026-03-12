'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n/locale-context';
import { dateFnsLocale, formatCurrencyTRY, formatNumber } from '@/lib/i18n/format';
import { type BookingWithListing } from '@/lib/supabase/bookings';
import { BookingMessages } from './BookingMessages';
import { BookingSkeleton } from './ProfileSkeletons';

interface BookingsSectionProps {
  loading: boolean;
  bookings: BookingWithListing[];
  bookingMessage: string | null;
  bookingActionId: string | null;
  guestId: string;
  onViewDetail: (booking: BookingWithListing) => void;
  onCancelBooking: (booking: BookingWithListing) => void;
  onDeleteBooking: (booking: BookingWithListing) => void;
}

export function BookingsSection({
  loading,
  bookings,
  bookingMessage,
  bookingActionId,
  guestId,
  onViewDetail,
  onCancelBooking,
  onDeleteBooking
}: BookingsSectionProps) {
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const { t, locale } = useLocale();

  const statusLabel = (status: string) => {
    if (status === 'pending') return t.bookingStatusPending as string;
    if (status === 'confirmed') return t.bookingStatusConfirmed as string;
    if (status === 'cancelled') return t.bookingStatusCancelled as string;
    if (status === 'completed') return t.bookingStatusCompleted as string;
    return status;
  };

  const statusClass = (status: string) => {
    if (status === 'confirmed') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (status === 'pending') return 'border-amber-200 bg-amber-50 text-amber-700';
    if (status === 'cancelled') return 'border-border bg-muted/40 text-muted-foreground';
    if (status === 'completed') return 'border-sky-200 bg-sky-50 text-sky-700';
    return 'border-border bg-muted/40 text-muted-foreground';
  };

  const nightsLabel = (nights: number) => {
    if (locale === 'tr') return `${nights} ${t.profileNight as string}`;
    if (locale === 'de') return nights === 1 ? `1 ${(t.profileNight as string)}` : `${nights} ${(t.profileNights as string)}`;
    if (locale === 'fr') return nights === 1 ? `1 ${(t.profileNight as string)}` : `${nights} ${(t.profileNights as string)}`;
    return nights === 1 ? `1 ${(t.profileNight as string)}` : `${nights} ${(t.profileNights as string)}`;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.profileBookingsTitle as string}</h2>
        <Link href="/search">
          <Button variant="outline" size="sm" className="rounded-2xl px-4">
            {t.profileBookingsCta as string}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="border border-dashed border-border rounded-3xl py-10 px-6 text-center bg-muted/20">
          <p className="text-muted-foreground mb-2">{t.profileBookingsEmptyTitle as string}</p>
          <p className="text-xs text-muted-foreground">{t.profileBookingsEmptySubtitle as string}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookingMessage && <p className="text-xs text-muted-foreground px-1">{bookingMessage}</p>}
          {bookings.map((booking) => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            const nights = Math.max(1, Math.ceil(Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

            const isFuture = checkOut.getTime() > Date.now();
            const canCancel = isFuture && (booking.status === 'pending' || booking.status === 'confirmed');
            const canDelete = booking.status === 'cancelled' || booking.status === 'completed';

            const showChat = activeChatBookingId === booking.id;
            const dateLocale = dateFnsLocale(locale);

            return (
              <div key={booking.id} className="space-y-2">
                <div className="rounded-2xl border border-border bg-card/60 hover:bg-card/80 transition-all p-4 shadow-sm hover:shadow-md">
                  <div className="flex gap-4 w-full text-left">
                    {booking.listing?.imageUrl && (
                      <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-border/60">
                        <Image src={booking.listing.imageUrl} alt={booking.listing.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm md:text-base truncate leading-snug">
                          {booking.listing?.title ?? (t.profileDeletedListing as string)}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 ${statusClass(booking.status)}`}
                        >
                          {statusLabel(booking.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground mb-1">
                        {booking.listing && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[booking.listing.city, booking.listing.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(checkIn, 'dd MMM', { locale: dateLocale })} - {format(checkOut, 'dd MMM yyyy', { locale: dateLocale })} ({nightsLabel(nights)})
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {formatNumber(booking.guestsCount, locale)} {t.profileGuestsSuffix as string}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-sm font-semibold">
                          {t.profileTotalLabel as string}:{' '}
                          <span className="font-black">{formatCurrencyTRY(booking.totalPrice, locale)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`rounded-2xl px-3 ${showChat ? 'bg-amber-500/10 border-amber-500' : ''}`}
                      onClick={() => setActiveChatBookingId(showChat ? null : booking.id)}
                      disabled={!booking.listing?.hostUserId}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      {showChat ? (t.profileCloseMessages as string) : (t.profileMessageHost as string)}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-2xl px-3" onClick={() => onViewDetail(booking)}>
                      {t.profileDetail as string}
                    </Button>
                    <Link href={`/bookings/${booking.id}/edit`}>
                      <Button variant="outline" size="sm" className="rounded-2xl px-3" disabled={bookingActionId === booking.id}>
                        {t.profileEdit as string}
                      </Button>
                    </Link>
                    {canCancel && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-2xl px-3" 
                        disabled={bookingActionId === booking.id} 
                        onClick={() => onCancelBooking(booking)}
                      >
                        {t.profileCancel as string}
                      </Button>
                    )}
                    {canDelete && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-2xl px-3 text-destructive border-destructive" 
                        disabled={bookingActionId === booking.id} 
                        onClick={() => onDeleteBooking(booking)}
                      >
                        {t.profileDelete as string}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Mesajlasma Alani */}
                {showChat && booking.listing?.hostUserId && (
                  <div className="animate-in slide-in-from-top duration-300">
                    <BookingMessages 
                      bookingId={booking.id} 
                      guestId={guestId} 
                      hostUserId={booking.listing.hostUserId} 
                      onClose={() => setActiveChatBookingId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
