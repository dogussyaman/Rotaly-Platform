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
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Gecelik fiyat</span>
          {listing.discountPercent && listing.discountPercent > 0 ? (
            <span className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-muted-foreground line-through">
                ₺{listing.pricePerNight.toLocaleString('tr-TR')}
              </span>
              <span className="font-semibold text-emerald-700">
                ₺
                {Math.round(
                  listing.pricePerNight * (1 - (listing.discountPercent ?? 0) / 100),
                ).toLocaleString('tr-TR')}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                %{Math.round(listing.discountPercent)} indirim
              </span>
            </span>
          ) : (
            <span className="font-semibold">₺{listing.pricePerNight.toLocaleString('tr-TR')}</span>
          )}
        </div>
        {(listing.cleaningFee ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Temizlik ücreti</span>
            <span className="font-medium">₺{listing.cleaningFee!.toLocaleString('tr-TR')}</span>
          </div>
        )}
        {(listing.extraGuestFee ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ek misafir (₺/gece)</span>
            <span className="font-medium">₺{listing.extraGuestFee!.toLocaleString('tr-TR')} ({(listing.baseGuests ?? 1)}+ kişi)</span>
          </div>
        )}
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
