import type { ReactNode } from 'react';
import { Star, type LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { formatCurrency, formatDate } from '@/lib/format';
import type { BookingRow, ConversationRow, ListingRow, ReviewRow } from '@/lib/mock/dashboard';

export function Section({
  id,
  title,
  description,
  actions,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const showHeader = title || description || actions;

  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      {showHeader ? (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  title,
  value,
  change,
  helper,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_6px_18px_-4px_rgba(0,0,0,0.08)]">
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/80 opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-3 pl-1">
        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className="text-xl font-bold tracking-tight text-foreground tabular-nums">{value}</div>
          <p className="flex items-center gap-2 text-[10px]">
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">{change}</span>
            <span className="text-muted-foreground">{helper}</span>
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    confirmed: { label: 'Onaylandı', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80 hover:bg-emerald-50' },
    pending: { label: 'Beklemede', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80 hover:bg-amber-50' },
    cancelled: { label: 'İptal', className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/80 hover:bg-rose-50' },
    completed: { label: 'Tamamlandı', className: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-100' },
  };

  const state = map[status] ?? { label: status, className: 'bg-muted text-muted-foreground ring-1 ring-border/70' };
  return (
    <Badge className={`capitalize rounded-lg border-none px-2.5 py-0.5 text-[11px] font-bold shadow-none ${state.className}`}>
      {state.label}
    </Badge>
  );
}

export function BooleanBadge({ value }: { value: boolean }) {
  return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Evet' : 'Hayır'}</Badge>;
}

export function ListingsTable({ listings }: { listings: ListingRow[] }) {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">İlan</TableHead>
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tür</TableHead>
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Konum</TableHead>
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fiyat/Gün</TableHead>
            <TableHead className="py-4 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Misafir</TableHead>
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Durum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.title} className="hover:bg-accent/50 transition-colors border-b border-border/60 last:border-0 group">
              <TableCell className="py-5">
                <div className="font-bold text-foreground group-hover:text-primary transition-colors">{listing.title}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Star className="size-3 fill-amber-400 stroke-amber-400" />
                  <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs font-semibold text-muted-foreground">{listing.propertyType}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{listing.city}, {listing.country}</TableCell>
              <TableCell className="text-xs font-bold text-foreground">{formatCurrency(listing.pricePerNight)}</TableCell>
              <TableCell className="text-center text-xs font-semibold">{listing.maxGuests}</TableCell>
              <TableCell>
                {listing.isActive ? <Badge>Aktif</Badge> : <Badge variant="secondary">Pasif</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Misafir</TableHead>
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">İlan / Tarih</TableHead>
            <TableHead className="py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Durum</TableHead>
            <TableHead className="py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Toplam</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-accent/50 transition-colors border-b border-border/60 last:border-0 group">
              <TableCell className="py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                    {booking.guest.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{booking.guest}</div>
                    <div className="text-[11px] text-muted-foreground font-medium">{booking.guestsCount} Misafir</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-bold text-foreground/90">{booking.listing}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="font-bold text-foreground">{formatCurrency(booking.finalPrice)}</div>
                <div className="text-[10px] font-semibold uppercase tracking-tighter text-primary">İşlem Tamam</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>İlan</TableHead>
          <TableHead>Yorumlayan</TableHead>
          <TableHead>Ortalama</TableHead>
          <TableHead>Temizlik</TableHead>
          <TableHead>İletişim</TableHead>
          <TableHead>Konum</TableHead>
          <TableHead>Değer</TableHead>
          <TableHead>Tarih</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={`${review.listing}-${review.reviewer}`}>
            <TableCell>{review.listing}</TableCell>
            <TableCell>{review.reviewer}</TableCell>
            <TableCell>{review.rating.toFixed(1)}</TableCell>
            <TableCell>{review.cleanliness.toFixed(1)}</TableCell>
            <TableCell>{review.communication.toFixed(1)}</TableCell>
            <TableCell>{review.location.toFixed(1)}</TableCell>
            <TableCell>{review.value.toFixed(1)}</TableCell>
            <TableCell>{formatDate(review.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ConversationsTable({ conversations }: { conversations: ConversationRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Konuşma</TableHead>
          <TableHead>Katılımcılar</TableHead>
          <TableHead>İlan</TableHead>
          <TableHead>Son Mesaj</TableHead>
          <TableHead>Okunmamış</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.map((conversation) => (
          <TableRow key={conversation.id}>
            <TableCell className="font-medium">{conversation.id}</TableCell>
            <TableCell>{conversation.participants}</TableCell>
            <TableCell>{conversation.listing}</TableCell>
            <TableCell>{conversation.lastMessageAt}</TableCell>
            <TableCell>
              <Badge variant={conversation.unread > 0 ? 'destructive' : 'outline'}>{conversation.unread}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ContentCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border/70 bg-card/95 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] ${className ?? ''}`}
    >
      <div className="border-b border-border/60 px-4 py-3 sm:px-5 sm:py-3.5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <div className="px-4 py-3 sm:px-5 sm:py-4">{children}</div>
    </div>
  );
}
