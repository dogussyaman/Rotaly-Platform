'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { formatCurrency, formatDate } from '@/lib/mock/dashboard';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostBookings, fetchHostByUserId, HostBooking } from '@/lib/supabase/host';

export default function BookingsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      if (profile?.id) {
        const host = await fetchHostByUserId(profile.id);
        if (host) {
          const data = await fetchHostBookings(host.hostId);
          setBookings(data);
        }
      }
      setLoading(false);
    }
    loadBookings();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Rezervasyonlar" description="Giriş/çıkış, ödeme ve durum takibi.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Rezervasyon Listesi" description="Giriş ve çıkış tarihleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İlan</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Misafir</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Toplam</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Henüz rezervasyon bulunmuyor.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.listingTitle}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {booking.nights} gece
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-xs">{booking.guestName ?? 'Misafir'}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="font-semibold text-xs">
                        {formatCurrency(booking.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Son Durumlar" description="Giriş bekleyen veya tamamlananlar">
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-2 last:border-0 text-sm">
                  <div>
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-xs text-muted-foreground">{booking.listingTitle}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={booking.status} />
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(booking.checkIn)}</p>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-sm text-center text-muted-foreground">Henüz veri yok.</p>
              )}
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
