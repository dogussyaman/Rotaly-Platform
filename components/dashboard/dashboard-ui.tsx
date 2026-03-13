import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { formatCurrency, formatDate } from '@/lib/mock/dashboard';
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
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions}
      </div>
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
    <Card className="border-none bg-muted/30 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-xs uppercase tracking-widest">{title}</CardDescription>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-emerald-500 font-semibold">{change}</span> • {helper}
        </p>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
  > = {
    confirmed: { label: 'Onaylandı', variant: 'default' },
    pending: { label: 'Beklemede', variant: 'secondary' },
    cancelled: { label: 'İptal', variant: 'destructive' },
    completed: { label: 'Tamamlandı', variant: 'outline' },
  };

  const state = map[status] ?? { label: status, variant: 'outline' };
  return (
    <Badge variant={state.variant} className="capitalize">
      {state.label}
    </Badge>
  );
}

export function BooleanBadge({ value }: { value: boolean }) {
  return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Evet' : 'Hayır'}</Badge>;
}

export function ListingsTable({ listings }: { listings: ListingRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>İlan</TableHead>
          <TableHead>Tür</TableHead>
          <TableHead>Konum</TableHead>
          <TableHead>Fiyat/Gün</TableHead>
          <TableHead>Misafir</TableHead>
          <TableHead>Puan</TableHead>
          <TableHead>Durum</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => (
          <TableRow key={listing.title}>
            <TableCell className="font-medium">{listing.title}</TableCell>
            <TableCell className="capitalize">{listing.propertyType}</TableCell>
            <TableCell>
              {listing.city}, {listing.country}
            </TableCell>
            <TableCell>{formatCurrency(listing.pricePerNight)}</TableCell>
            <TableCell>{listing.maxGuests}</TableCell>
            <TableCell>{listing.rating.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={listing.isActive ? 'default' : 'secondary'}>
                {listing.isActive ? 'Aktif' : 'Pasif'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rezervasyon</TableHead>
          <TableHead>İlan</TableHead>
          <TableHead>Tarih</TableHead>
          <TableHead>Misafir</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Final</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">{booking.id}</TableCell>
            <TableCell>{booking.listing}</TableCell>
            <TableCell>
              {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
              <div className="text-xs text-muted-foreground">
                {booking.checkInSlotStart} - {booking.checkInSlotEnd}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{booking.guest}</div>
              <div className="text-xs text-muted-foreground">{booking.guestsCount} kişi</div>
            </TableCell>
            <TableCell>
              <StatusBadge status={booking.status} />
            </TableCell>
            <TableCell className="font-semibold">{formatCurrency(booking.finalPrice)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
              <Badge variant={conversation.unread > 0 ? 'destructive' : 'outline'}>
                {conversation.unread}
              </Badge>
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
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-none bg-card/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
