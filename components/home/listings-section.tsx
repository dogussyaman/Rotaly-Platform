'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ListingCard } from '@/components/listings/listing-card';
import { fetchListings, type ListingRow } from '@/lib/supabase/listings';
import { Loader2 } from 'lucide-react';

interface ListingsSectionProps {
  t: any;
}

export function ListingsSection({ t }: ListingsSectionProps) {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchListings();
      setListings(data.slice(0, 8)); // ana sayfada ilk 8
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section className="bg-background py-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t.listingsTitle as string}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t.listingsSubtitle as string}</p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors shrink-0 self-start sm:self-auto"
          >
            {t.viewAll as string}
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link href={`/listing/${listing.id}`}>
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    location={listing.location}
                    pricePerNight={listing.pricePerNight}
                    rating={listing.rating}
                    totalReviews={listing.totalReviews}
                    images={listing.images}
                    nights={undefined}
                    guestFavoriteLabel={t.guestFavorite as string}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

