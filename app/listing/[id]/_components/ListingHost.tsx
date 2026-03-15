'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface ListingHostProps {
  listing: ListingDetail;
  memberSinceLabel: string;
  contactHostLabel: string;
  reviewsLabel: string;
  hostRatingLabel: string;
}

export function ListingHost({
  listing,
  memberSinceLabel,
  contactHostLabel,
  reviewsLabel,
  hostRatingLabel,
}: ListingHostProps) {
  const host = listing.host;
  if (!host) return null;

  return (
    <div className="p-8 bg-muted/40 rounded-[2.5rem] border border-border/60">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <Image
              src={host.avatarUrl ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'}
              alt={host.fullName ?? 'Ev Sahibi'}
              width={80}
              height={80}
              className="object-cover h-full w-full"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Ev Sahibi: {host.fullName ?? 'Ev Sahibi'}</h3>
            <p className="text-muted-foreground font-medium">{memberSinceLabel}: 2021</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl px-6 py-6 font-bold border-2">
            {contactHostLabel}
          </Button>
        </div>
      </div>
      <div className="mt-8 grid sm:grid-cols-3 gap-6 pt-8 border-t border-border/60">
        <div>
          <div className="text-2xl font-bold">{listing.totalReviews}</div>
          <div className="text-xs font-bold text-muted-foreground uppercase">{reviewsLabel}</div>
        </div>
        <div>
          <div className="text-2xl font-bold underline cursor-pointer">{listing.rating.toFixed(2)} ★</div>
          <div className="text-xs font-bold text-muted-foreground uppercase">{hostRatingLabel}</div>
        </div>
        <div>
          <div className="text-2xl font-bold">Çok Hızlı</div>
          <div className="text-xs font-bold text-muted-foreground uppercase">Yanıt Süresi</div>
        </div>
      </div>
    </div>
  );
}
