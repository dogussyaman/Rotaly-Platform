'use client';

import Link from 'next/link';
import { Loader2, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContentCard, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { formatCurrency, formatDate } from '@/lib/format';
import type { HostBooking } from '@/lib/supabase/host';
import type { BookingWithListing } from '@/lib/supabase/bookings';
import { ConfirmAction } from './ConfirmAction';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;
const SKELETON_ROWS = 6;

interface BookingsTableCardProps {
  role: 'admin' | 'host' | 'guest';
  status: string;
  setStatus: (v: 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed') => void;
  hostBookings: { rows: HostBooking[]; total: number };
  adminBookings?: { rows: HostBooking[]; total: number };
  guestBookings: { rows: BookingWithListing[]; total: number };
  loading: boolean;
  isTransitioning?: boolean;
  page: number;
  setPage: (n: number) => void;
  messagingBookingId: string | null;
  onMessageGuest: (guestId: string) => void;
  onConfirmHost: (bookingId: string) => Promise<void>;
  onCancelHost: (bookingId: string) => Promise<void>;
  onCancelGuest: (bookingId: string) => Promise<void>;
  hasQuery?: boolean;
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <TableRow key={i} className="border-border/40">
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className={cn('h-4 rounded-md', j === 0 ? 'w-40' : j === cols - 1 ? 'w-16' : 'w-24')} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function BookingsTableCard({
  role,
  hostBookings,
  adminBookings,
  guestBookings,
  loading,
  isTransitioning,
  page,
  setPage,
  messagingBookingId,
  onMessageGuest,
  onConfirmHost,
  onCancelHost,
  onCancelGuest,
  hasQuery,
}: BookingsTableCardProps) {
  const emptyMessage = hasQuery
    ? 'Filtreyle eşleşen rezervasyon bulunamadı.'
    : 'Henüz rezervasyon bulunmuyor.';
  const isHostView = role === 'host' || role === 'admin';
  const effectiveHostBookings = role === 'admin' ? (adminBookings ?? hostBookings) : hostBookings;
  const total = isHostView ? effectiveHostBookings.total : guestBookings.total;
  const colCount = isHostView ? 6 : 5;

  const isInitialLoad = loading && (isHostView ? effectiveHostBookings.rows.length === 0 : guestBookings.rows.length === 0);

  return (
    <ContentCard
      title="Rezervasyon Listesi"
      description={`Toplam ${total} kayıt`}
      className="overflow-hidden rounded-2xl border-border/60 bg-white shadow-sm"
    >
      {/* Refreshing bar */}
      {isTransitioning && !isInitialLoad && (
        <div className="mb-3 h-0.5 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
          <div className="h-full w-1/2 animate-[shimmer_1s_ease-in-out_infinite] rounded-full bg-linear-to-r from-transparent via-[#1c1c21]/20 to-transparent" />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="border-border/40 hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">İlan</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Tarihler</TableHead>
            {isHostView ? (
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Misafir</TableHead>
            ) : (
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Durum</TableHead>
            )}
            {isHostView && (
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Durum</TableHead>
            )}
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Toplam</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isInitialLoad ? (
            <SkeletonRows cols={colCount} />
          ) : isHostView ? (
            effectiveHostBookings.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-32 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              effectiveHostBookings.rows.map((b) => (
                <TableRow
                  key={b.id}
                  className="border-border/40 transition-colors hover:bg-[#f9fafb]"
                >
                  <TableCell className="font-medium text-foreground">
                    {b.listingTitle ?? 'İlan'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground/80">
                      {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                    </div>
                    <div className="text-xs text-muted-foreground">{b.nights} gece</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground/90">{b.guestName ?? 'Misafir'}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {formatCurrency(b.totalPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-primary hover:bg-[#f0fdfa] hover:text-[#0d9488]"
                      >
                        <Link href={`/dashboard/bookings/${b.id}`}>Detay</Link>
                      </Button>
                      {role === 'host' && b.guestId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-primary hover:bg-[#f0fdfa]"
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
                      {role === 'host' && b.status === 'pending' && (
                        <ConfirmAction
                          label="Onayla"
                          title="Rezervasyonu onayla"
                          description="Bu rezervasyonu onaylamak istiyor musunuz?"
                          onConfirm={() => onConfirmHost(b.id)}
                        />
                      )}
                      {role === 'host' && (b.status === 'pending' || b.status === 'confirmed') ? (
                        <ConfirmAction
                          label="İptal"
                          title="Rezervasyonu iptal et"
                          description="Bu rezervasyonu iptal etmek istiyor musunuz?"
                          variant="destructive"
                          onConfirm={() => onCancelHost(b.id)}
                        />
                      ) : role === 'host' ? (
                        <Badge variant="outline" className="text-muted-foreground">—</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : guestBookings.rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colCount} className="h-32 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            guestBookings.rows.map((b) => (
              <TableRow
                key={b.id}
                className="border-border/40 transition-colors hover:bg-[#f9fafb]"
              >
                <TableCell className="font-medium text-foreground">
                  {b.listing?.title ?? 'İlan'}
                </TableCell>
                <TableCell className="text-sm text-foreground/80">
                  {formatDate(b.checkIn)} – {formatDate(b.checkOut)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={b.status} />
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {formatCurrency(b.totalPrice)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg text-primary hover:bg-[#f0fdfa] hover:text-[#0d9488]"
                    >
                      <Link href={`/dashboard/bookings/${b.id}`}>Detay</Link>
                    </Button>
                    {(b.status === 'pending' || b.status === 'confirmed') ? (
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

      <div className="border-t border-border/40 pt-4 pb-2 flex justify-center">
        <PaginationControls page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
      </div>
    </ContentCard>
  );
}
