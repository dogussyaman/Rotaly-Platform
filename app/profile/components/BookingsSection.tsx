'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { MapPin, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Rezervasyonlarım</h2>
        <Link href="/search">
          <Button variant="outline" size="sm" className="rounded-2xl px-4">
            Yeni konaklama ara
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
        <div className="border border-dashed border-border rounded-3xl py-10 px-6 text-center">
          <p className="text-muted-foreground mb-2">Henüz bir rezervasyonunuz yok.</p>
          <p className="text-xs text-muted-foreground">
            İlk seyahatinizi planlamak için arama sayfasını kullanabilirsiniz.
          </p>
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

            return (
              <div key={booking.id} className="space-y-3">
                <div className="rounded-3xl border border-border bg-card/50 hover:bg-card/80 transition-colors p-4 md:p-5">
                  <div className="flex gap-4 md:gap-6 w-full text-left">
                    {booking.listing?.imageUrl && (
                      <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0">
                        <Image src={booking.listing.imageUrl} alt={booking.listing.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm md:text-base truncate">
                          {booking.listing?.title ?? 'Silinmiş ilan'}
                        </h3>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5">
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
                        {booking.listing && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {[booking.listing.city, booking.listing.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(checkIn, 'dd MMM', { locale: tr })} - {format(checkOut, 'dd MMM yyyy', { locale: tr })} ({nights} gece)
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {booking.guestsCount} misafir
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold">
                          Toplam: <span className="font-bold">₺{booking.totalPrice.toLocaleString('tr-TR')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`rounded-2xl px-3 ${showChat ? 'bg-amber-500/10 border-amber-500' : ''}`}
                      onClick={() => setActiveChatBookingId(showChat ? null : booking.id)}
                      disabled={!booking.listing?.hostUserId}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      {showChat ? 'Mesajları Kapat' : 'Ev Sahibine Yaz'}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-2xl px-3" onClick={() => onViewDetail(booking)}>
                      Detay
                    </Button>
                    <Link href={`/bookings/${booking.id}/edit`}>
                      <Button variant="outline" size="sm" className="rounded-2xl px-3" disabled={bookingActionId === booking.id}>
                        Düzenle
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
                        İptal Et
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
                        Sil
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
