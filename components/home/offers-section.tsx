'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ListingCard } from '@/components/listings/listing-card';
import { fetchListingsByIds, type ListingRow } from '@/lib/supabase/listings';
import {
  fetchUpcomingDiscountOffers,
  type SeasonalDiscountHit,
} from '@/lib/supabase/seasonal-pricing';
import { OffersHeader, OffersSkeletonGrid } from '@/components/home/offers-skeleton';

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
        if (a.startDate !== b.startDate) return (a.startDate ?? '').localeCompare(b.startDate ?? '');
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

        if (!offer.startDate || !offer.endDate) continue;
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

  return (
    <section className="bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <OffersHeader title={title} subtitle={subtitle} />

        {loading ? (
          <OffersSkeletonGrid />
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
          <div className="space-y-12 py-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent px-6 py-12 sm:px-12 sm:py-16">
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Büyük Fırsatlar Çok Yakında!
                </h3>
                <p className="mb-8 text-sm text-muted-foreground sm:text-base">
                  Şu an için aktif bir sezon indirimi bulunmuyor ancak yeni kampanyalarımız yolda. 
                  Sıradaki seyahatinizi planlamak için popüler destinasyonlardaki öne çıkan evleri inceleyebilirsiniz.
                </p>
              </div>
              <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold tracking-tight">İlham Alın: Popüler Destinasyonlar</h4>
                <Link href="/search" className="text-sm font-medium text-primary hover:underline">
                  Tümünü Gör →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                {[
                  {
                    id: 'mock-1',
                    title: 'Lüks Deniz Manzaralı Villa',
                    location: 'Bodrum, Muğla',
                    pricePerNight: 4500,
                    rating: 4.96,
                    totalReviews: 124,
                    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'],
                  },
                  {
                    id: 'mock-2',
                    title: 'Tarihi Taş Ev Şehir Merkezinde',
                    location: 'Alaçatı, İzmir',
                    pricePerNight: 2800,
                    rating: 4.85,
                    totalReviews: 89,
                    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'],
                  },
                  {
                    id: 'mock-3',
                    title: 'Doğa İle İç İçe Ahşap Bungalov',
                    location: 'Sapanca, Sakarya',
                    pricePerNight: 3200,
                    rating: 4.92,
                    totalReviews: 210,
                    images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800'],
                  },
                  {
                    id: 'mock-4',
                    title: 'Panoramik Boğaz Manzaralı Daire',
                    location: 'Beşiktaş, İstanbul',
                    pricePerNight: 5500,
                    rating: 4.98,
                    totalReviews: 340,
                    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'],
                  }
                ].map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <Link href={`/search?location=${encodeURIComponent(item.location)}`}>
                      <ListingCard
                        id={item.id}
                        title={item.title}
                        location={item.location}
                        pricePerNight={item.pricePerNight}
                        rating={item.rating}
                        totalReviews={item.totalReviews}
                        images={item.images}
                        guestFavoriteLabel={t.guestFavorite as string}
                        isFavorite={i % 2 === 0}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
