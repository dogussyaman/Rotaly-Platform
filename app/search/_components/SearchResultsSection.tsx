'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { ListingCard } from '@/components/listings/listing-card';
import type { ListingRow } from '@/lib/supabase/listings';
import type { SearchFilters } from '@/lib/store/search-store';

interface SearchResultsSectionProps {
  showFilters: boolean;
  loading: boolean;
  sortedListings: ListingRow[];
  viewMode: 'grid' | 'list';
  showMap: boolean;
  t: Record<string, unknown>;
  mapNode: React.ReactNode;
  filters: SearchFilters;
  emptyState?: { title: string; subtitle?: string };
}

export function SearchResultsSection({
  showFilters,
  loading,
  sortedListings,
  viewMode,
  showMap,
  t,
  mapNode,
  filters,
  emptyState,
}: SearchResultsSectionProps) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 flex gap-6 items-start">
        <AnimatePresence mode="popLayout">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -20 }}
              animate={{ opacity: 1, width: 280, x: 0 }}
              exit={{ opacity: 0, width: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden shrink-0"
            >
              <div className="w-[280px]">
                <FilterSidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0"
        >
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedListings.length > 0 ? (
            <motion.div
              layout
              className={
                viewMode === 'list'
                  ? 'space-y-4'
                  : showMap
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'
              }
            >
              {sortedListings.map((listing) => (
                <motion.div
                  layout
                  key={listing.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={{
                      pathname: `/listing/${listing.id}`,
                      query: {
                        ...(filters.location ? { location: filters.location } : {}),
                        ...(filters.checkIn ? { checkin: filters.checkIn.toISOString() } : {}),
                        ...(filters.checkOut ? { checkout: filters.checkOut.toISOString() } : {}),
                        adults: String(filters.guests.adults),
                        children: String(filters.guests.children),
                        infants: String(filters.guests.infants),
                        guests: String(filters.guests.adults + filters.guests.children),
                      },
                    }}
                  >
                    <ListingCard {...listing} layout={viewMode} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <p className="text-lg font-semibold text-foreground mb-2">
                {emptyState?.title ?? (t.searchNoResultsTitle as string)}
              </p>
              <p className="text-muted-foreground">
                {emptyState?.subtitle ?? (t.searchNoResultsSubtitle as string)}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {showMap && mapNode}
      </AnimatePresence>
    </div>
  );
}
