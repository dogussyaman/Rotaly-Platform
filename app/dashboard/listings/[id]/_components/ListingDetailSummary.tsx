'use client';

import { ContentCard } from '@/components/dashboard/dashboard-ui';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface ListingDetailSummaryProps {
  listing: ListingDetail;
}

export function ListingDetailSummary({ listing }: ListingDetailSummaryProps) {
  return (
    <ContentCard title="Özet" description="Fiyat ve kapasite">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gecelik fiyat</span>
          <span className="font-semibold">₺{listing.pricePerNight.toLocaleString('tr-TR')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Misafir</span>
          <span className="font-medium">{listing.maxGuests} kişi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Yatak odası</span>
          <span className="font-medium">{listing.bedrooms}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Banyo</span>
          <span className="font-medium">{listing.bathrooms}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Puan</span>
          <span className="font-medium">
            {listing.rating.toFixed(1)} ({listing.totalReviews} yorum)
          </span>
        </div>
      </div>
    </ContentCard>
  );
}
