'use client';

import { ContentCard } from '@/components/dashboard/dashboard-ui';
import type { BookingDetail } from '@/lib/supabase/bookings';

interface BookingDetailGuestCardProps {
  booking: BookingDetail;
}

export function BookingDetailGuestCard({ booking }: BookingDetailGuestCardProps) {
  const guest = booking.guest;
  return (
    <ContentCard title="Misafir bilgisi" description="Rezervasyonu yapan misafir">
      {guest ? (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0fdfa] text-lg font-semibold text-[#0d9488]">
            {guest.fullName?.charAt(0) ?? guest.email?.charAt(0) ?? '?'}
          </div>
          <div>
            <p className="font-medium">{guest.fullName ?? 'İsimsiz'}</p>
            <p className="text-xs text-muted-foreground">{guest.email ?? '—'}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Misafir bilgisi yüklenemedi.</p>
      )}
    </ContentCard>
  );
}
