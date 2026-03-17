'use client';

import Link from 'next/link';
import { Loader2, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import { StatusBadge } from '@/components/dashboard/dashboard-ui';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { formatCurrency, formatDate } from '@/lib/format';
import type { HostBooking } from '@/lib/supabase/host';
import type { BookingWithListing } from '@/lib/supabase/bookings';
import { ConfirmAction } from './ConfirmAction';

const PAGE_SIZE = 10;

interface BookingsTableCardProps {
  role: 'admin' | 'host' | 'guest';
  status: string;
  setStatus: (v: 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed') => void;
  hostBookings: { rows: HostBooking[]; total: number };
  adminBookings?: { rows: HostBooking[]; total: number };
  guestBookings: { rows: BookingWithListing[]; total: number };
  loading: boolean;
  page: number;
  setPage: (n: number) => void;
  messagingBookingId: string | null;
  onMessageGuest: (guestId: string) => void;
  onConfirmHost: (bookingId: string) => Promise<void>;
  onCancelHost: (bookingId: string) => Promise<void>;
  onCancelGuest: (bookingId: string) => Promise<void>;
  hasQuery?: boolean;
}

export function BookingsTableCard({
  role,
  status,
  setStatus,
  hostBookings,
  guestBookings,
  loading,
  page,
  setPage,
  messagingBookingId,
  onMessageGuest,
  onConfirmHost,
  onCancelHost,
  onCancelGuest,
  hasQuery,
}: BookingsTableCardProps) {
  const emptyMessage = hasQuery ? 'Filtreyle eşleşen rezervasyon bulunamadı.' : 'Henüz rezervasyon bulunmuyor.';
  const isHostView = role === 'host' || role === 'admin';
  const effectiveHostBookings = role === 'admin' ? (adminBookings ?? hostBookings) : hostBookings;
  const total = isHostView ? effectiveHostBookings.total : guestBookings.total;
  const rowsCount = isHostView ? effectiveHostBookings.rows.length : guestBookings.rows.length;
  const showListLoading = loading && rowsCount === 0;
  const showListRefreshing = loading && rowsCount > 0;

  return (
    <ContentCard
      title="Rezervasyon Listesi"
      description={showListRefreshing ? 'Güncelleniyor…' : `Sayfa başına ${PAGE_SIZE} kayıt`}
      className="overflow-hidden rounded-2xl border-border/70 shadow-sm"
    >
      {showListRefreshing && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
      <Table className={showListRefreshing ? 'opacity-70' : ''}>
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="font-semibold text-foreground/80">İlan</TableHead>
            <TableHead className="font-semibold text-foreground/80">Tarih</TableHead>
            {isHostView ? (
              <TableHead className="font-semibold text-foreground/80">Misafir</TableHead>
            ) : (
              <TableHead className="font-semibold text-foreground/80">Durum</TableHead>
            )}
            {isHostView ? <TableHead className="font-semibold text-foreground/80">Durum</TableHead> : null}
            <TableHead className="font-semibold text-foreground/80">Toplam</TableHead>
            <TableHead className="text-right font-semibold text-foreground/80">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showListLoading ? (
            <TableRow>
              <TableCell colSpan={isHostView ? 6 : 5} className="h-32 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Yükleniyor…</p>
              </TableCell>
            </TableRow>
          ) : isHostView ? (
            effectiveHostBookings.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Henüz rezervasyon bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              effectiveHostBookings.rows.map((b) => (
                <TableRow key={b.id} className="border-border/60 transition-colors hover:bg-accent/60">
                  <TableCell className="font-medium text-foreground">{b.listingTitle ?? 'İlan'}</TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground/80">
                      {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                    </div>
                    <div className="text-xs text-muted-foreground">{b.nights} gece</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{b.guestName ?? 'Misafir'}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{formatCurrency(b.totalPrice)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <Button asChild variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-accent h-8">
                        <Link href={`/dashboard/bookings/${b.id}`}>Detay</Link>
                      </Button>
                      {role === 'host' && b.guestId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-lg h-8 text-primary hover:bg-accent"
                          onClick={() => onMessageGuest(b.guestId!)}
                          disabled={messagingBookingId === b.guestId}
                        >
                          {messagingBookingId === b.guestId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MessageCircle className="h-4 w-4" />
                          )}
                          Mesaj
                        </Button>
                      )}
                      {role === 'host' && b.status === 'pending' ? (
                        <ConfirmAction
                          label="Onayla"
                          title="Rezervasyonu onayla"
                          description="Bu rezervasyonu onaylamak istiyor musunuz?"
                          onConfirm={() => onConfirmHost(b.id)}
                        />
                      ) : null}
                      {role === 'host' && (b.status === 'pending' || b.status === 'confirmed') ? (
                        <ConfirmAction
                          label="İptal"
                          title="Rezervasyonu iptal et"
                          description="Bu rezervasyonu iptal etmek istiyor musunuz?"
                          variant="destructive"
                          onConfirm={() => onCancelHost(b.id)}
                        />
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">—</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : guestBookings.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            guestBookings.rows.map((b) => (
              <TableRow key={b.id} className="border-border/60 transition-colors hover:bg-accent/60">
                <TableCell className="font-medium text-foreground">{b.listing?.title ?? 'İlan'}</TableCell>
                <TableCell className="text-sm text-foreground/80">
                  {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell className="font-semibold text-foreground">{formatCurrency(b.totalPrice)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-accent h-8">
                      <Link href={`/dashboard/bookings/${b.id}`}>Detay</Link>
                    </Button>
                    {b.status === 'pending' || b.status === 'confirmed' ? (
                      <ConfirmAction
                        label="İptal"
                        title="Rezervasyonu iptal et"
                        description="Bu rezervasyonu iptal etmek istiyor musunuz?"
                        variant="destructive"
                        onConfirm={() => onCancelGuest(b.id)}
                      />
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">—</Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="pt-4 flex justify-center">
        <PaginationControls page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
      </div>
    </ContentCard>
  );
}
