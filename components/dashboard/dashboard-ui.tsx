import type { ReactNode } from 'react';
import { Star, type LucideIcon } from 'lucide-react';

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
    <section id={id} className="scroll-mt-24 space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-2">
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight">{title}</h2>
          {description ? <p className="text-[11px] text-muted-foreground font-medium">{description}</p> : null}
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
    <Card className="overflow-hidden border-none bg-white shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] rounded-[18px]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{title}</p>
            <div className="text-2xl font-black text-[#1A1A1A] tracking-tighter">{value}</div>
            <p className="text-[10px] flex items-center gap-1.5 mt-1.5">
              <span className="text-[#0F3D3E] font-extrabold bg-[#CFE8E4]/60 px-1.5 py-0.5 rounded-md">{change}</span>
              <span className="text-muted-foreground/50 font-bold uppercase">{helper}</span>
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#F4F7F6] flex items-center justify-center text-[#0F3D3E]">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; className: string }
  > = {
    confirmed: { label: 'Onaylandı', className: 'bg-[#CFE8E4] text-[#0F3D3E] hover:bg-[#CFE8E4]/80' },
    pending: { label: 'Beklemede', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100/80' },
    cancelled: { label: 'İptal', className: 'bg-rose-100 text-rose-700 hover:bg-rose-100/80' },
    completed: { label: 'Tamamlandı', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100/80' },
  };

  const state = map[status] ?? { label: status, className: 'bg-slate-100 text-slate-700' };
  return (
    <Badge className={`capitalize border-none shadow-none rounded-lg px-2.5 py-0.5 font-bold text-[11px] ${state.className}`}>
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
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">İlan</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">Tür</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">Konum</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">Fiyat/Gün</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4 text-center">Misafir</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">Durum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.title} className="hover:bg-[#F4F7F6]/50 transition-colors border-b border-slate-100 last:border-0 group">
              <TableCell className="py-5">
                <div className="font-bold text-[#1A1A1A] group-hover:text-[#0F3D3E] transition-colors">{listing.title}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                   <Star className="size-3 fill-amber-400 text-amber-400" />
                   {listing.rating.toFixed(1)} Puan
                </div>
              </TableCell>
              <TableCell className="capitalize text-sm font-medium text-slate-600">{listing.propertyType}</TableCell>
              <TableCell className="text-sm font-medium text-slate-500">
                {listing.city}, {listing.country}
              </TableCell>
              <TableCell className="font-bold text-[#1A1A1A]">{formatCurrency(listing.pricePerNight)}</TableCell>
              <TableCell className="text-center font-bold text-slate-600">{listing.maxGuests}</TableCell>
              <TableCell>
                <Badge className={`border-none shadow-none rounded-lg px-2.5 py-0.5 font-bold text-[11px] ${listing.isActive ? 'bg-[#CFE8E4] text-[#0F3D3E]' : 'bg-slate-100 text-slate-500'}`}>
                  {listing.isActive ? 'Aktif' : 'Pasif'}
                </Badge>
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
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">Misafir</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">İlan / Tarih</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4">Durum</TableHead>
            <TableHead className="text-[#0F3D3E]/50 font-bold uppercase text-[11px] tracking-wider py-4 text-right">Toplam</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-[#F4F7F6]/50 transition-colors border-b border-slate-100 last:border-0 group">
              <TableCell className="py-5">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-[#F4F7F6] flex items-center justify-center font-bold text-[#0F3D3E]">
                      {booking.guest.charAt(0)}
                   </div>
                   <div>
                      <div className="font-bold text-[#1A1A1A] group-hover:text-[#0F3D3E] transition-colors">{booking.guest}</div>
                      <div className="text-[11px] text-muted-foreground font-medium">{booking.guestsCount} Misafir</div>
                   </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-bold text-slate-700">{booking.listing}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                   {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="text-right">
                 <div className="font-black text-[#1A1A1A]">{formatCurrency(booking.finalPrice)}</div>
                 <div className="text-[10px] text-[#0F3D3E] font-bold uppercase tracking-tighter">İşlem Tamam</div>
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
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[22px] overflow-hidden ${className}`}>
      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold text-[#1A1A1A] tracking-tight">{title}</CardTitle>
            {description ? <CardDescription className="text-[11px] mt-0.5 font-medium">{description}</CardDescription> : null}
          </div>
          <div className="h-1 w-8 rounded-full bg-[#0F3D3E]/10" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">{children}</CardContent>
    </Card>
  );
}
