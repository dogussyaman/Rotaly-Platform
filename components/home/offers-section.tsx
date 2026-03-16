'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { ListingCard } from '@/components/listings/listing-card';
import { fetchListingsByIds, type ListingRow } from '@/lib/supabase/listings';
import {
  fetchUpcomingDiscountOffers,
  type SeasonalDiscountHit,
} from '@/lib/supabase/seasonal-pricing';

interface OffersSectionProps {
  t: any;
}

type OfferCardItem = {
  offer: SeasonalDiscountHit;
  listing: ListingRow;
  discountPercent?: number;
  discountLabel?: string;
  checkIn: Date;
  checkOut: Date;
};

function parseYmd(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  // Noon UTC avoids DST/day-boundary surprises when formatting in local timezones.
  return new Date(Date.UTC(y, mo, d, 12, 0, 0));
}

export function OffersSection({ t }: OffersSectionProps) {
  const [items, setItems] = useState<OfferCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const offers = await fetchUpcomingDiscountOffers({ limit: 60 });

      // Bir ilan için en yakın (ve en güçlü) fırsatı seç
      const sorted = [...offers].sort((a, b) => {
        if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
        return Math.abs(b.modifierValue) - Math.abs(a.modifierValue);
      });

      const chosenByListing = new Map<string, SeasonalDiscountHit>();
      for (const o of sorted) {
        if (!chosenByListing.has(o.listingId)) chosenByListing.set(o.listingId, o);
      }

      const chosen = Array.from(chosenByListing.values()).slice(0, 8);
      const listingIds = chosen.map((o) => o.listingId);
      const listings = await fetchListingsByIds(listingIds);
      const listingById = new Map(listings.map((l) => [l.id, l] as const));

      const nextItems: OfferCardItem[] = [];
      for (const offer of chosen) {
        const listing = listingById.get(offer.listingId);
        if (!listing) continue;

        const checkIn = parseYmd(offer.startDate);
        const checkOut = parseYmd(offer.endDate);
        if (!checkIn || !checkOut) continue;

        const absVal = Math.abs(offer.modifierValue);
        const isPercent = offer.modifierType === 'percent';
        const discountPercent = isPercent ? absVal : undefined;
        const discountLabel = !isPercent
          ? `₺${Math.round(absVal).toLocaleString('tr-TR')} indirim / gece`
          : undefined;

        nextItems.push({
          offer,
          listing,
          discountPercent,
          discountLabel,
          checkIn,
          checkOut,
        });
      }

      if (!cancelled) {
        setItems(nextItems);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasItems = items.length > 0;
  const title = (t.offersTitle as string) || 'Fırsatlar';
  const subtitle =
    (t.offersSubtitle as string) || 'Belirli tarihlerde indirimli konaklamalar';

  const headerNode = useMemo(() => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-black text-foreground/80 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {title}
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground tracking-tight">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    );
  }, [subtitle, title]);

  return (
    <section className="bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        {headerNode}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
          </div>
        ) : hasItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {items.map((item, i) => (
              <motion.div
                key={item.offer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link href={`/listing/${item.listing.id}?from=${item.offer.startDate}&to=${item.offer.endDate}`}>
                  <ListingCard
                    id={item.listing.id}
                    title={item.listing.title}
                    location={item.listing.location}
                    pricePerNight={item.listing.pricePerNight}
                    discountPercent={item.discountPercent}
                    discountLabel={item.discountLabel}
                    rating={item.listing.rating}
                    totalReviews={item.listing.totalReviews}
                    images={item.listing.images}
                    checkIn={item.checkIn}
                    checkOut={item.checkOut}
                    nights={undefined}
                    guestFavoriteLabel={t.guestFavorite as string}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Şu anda aktif bir indirimli konaklama bulunmuyor.
          </div>
        )}
      </div>
    </section>
  );
}

