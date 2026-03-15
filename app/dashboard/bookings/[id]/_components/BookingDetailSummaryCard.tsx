'use client';

import { ContentCard, StatusBadge } from '@/components/dashboard/dashboard-ui';
import type { BookingDetail } from '@/lib/supabase/bookings';
import { formatDate, formatCurrency } from './utils';

interface BookingDetailSummaryCardProps {
  booking: BookingDetail;
  location: string;
}

export function BookingDetailSummaryCard({ booking, location }: BookingDetailSummaryCardProps) {
  return (
    <ContentCard title="Özet" description="Durum, fiyat ve tarihler">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Durum</span>
          <StatusBadge status={booking.status} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">İlan</span>
          <span className="font-medium">{booking.listing?.title ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Konum</span>
          <span className="font-medium">{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Giriş</span>
          <span>{formatDate(booking.checkIn)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Çıkış</span>
          <span>{formatDate(booking.checkOut)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Misafir sayısı</span>
          <span>{booking.guestsCount}</span>
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <span className="font-medium">Toplam</span>
          <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
        </div>
        {booking.specialRequests && (
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
            <p className="text-xs font-medium text-[#6b7280]">Özel istekler</p>
            <p className="mt-1 text-sm">{booking.specialRequests}</p>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
