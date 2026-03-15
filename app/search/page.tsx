'use client';

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { SearchHeader } from '@/components/header/search-header';
import { HeroSearchBar } from '@/components/search/hero-search-bar';
import { useSearchStore } from '@/lib/store/search-store';
import { useLocale } from '@/lib/i18n/locale-context';
import { useSearchParams } from 'next/navigation';
import { fetchListings, type ListingRow } from '@/lib/supabase/listings';
import { SearchToolbar } from './_components/SearchToolbar';
import { SearchResultsSection } from './_components/SearchResultsSection';

const SearchMap = dynamic(() => import('@/components/search/search-map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-3xl" />,
});

function SearchPageContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilters, setShowFilters] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [wasFiltersOpen, setWasFiltersOpen] = useState(true);
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const { filters, setLocation, setGuests, setCheckIn, setCheckOut } = useSearchStore();

  useEffect(() => {
    const loc = searchParams.get('location');
    const gst = searchParams.get('guests');
    const cin = searchParams.get('checkin');
    const cout = searchParams.get('checkout');
    if (loc) setLocation(loc);
    if (gst) setGuests(parseInt(gst));
    if (cin) setCheckIn(new Date(cin));
    if (cout) setCheckOut(new Date(cout));
  }, [searchParams, setLocation, setGuests, setCheckIn, setCheckOut]);

  const loadListings = useCallback(async () => {
    setLoading(true);
    const data = await fetchListings({
      location: filters.location,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      propertyType: filters.propertyType,
      guests: filters.guests,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      discountOnly: filters.discountOnly || undefined,
    });
    setListings(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const sortedListings = useMemo(() => {
    const sorted = [...listings];
    switch (sortBy) {
      case 'price-asc': return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price-desc': return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
      default: return sorted;
    }
  }, [listings, sortBy]);

  const toggleMap = useCallback(() => {
    setShowMap((prev) => {
      const isOpening = !prev;
      if (isOpening) {
        setWasFiltersOpen(showFilters);
        setShowFilters(false);
      } else if (wasFiltersOpen) {
        setShowFilters(true);
      }
      return isOpening;
    });
  }, [showFilters, wasFiltersOpen]);

  const mapNode = (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, width: 0 }}
      animate={{ opacity: 1, x: 0, width: showFilters ? 420 : 600 }}
      exit={{ opacity: 0, x: 20, width: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:block h-[calc(100vh-220px)] sticky top-28 rounded-3xl border border-border overflow-hidden bg-card shadow-xl"
    >
      <SearchMap listings={sortedListings} />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <motion.div
            id="hero-search-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-5xl mx-auto">
              <HeroSearchBar />
            </div>
          </motion.div>
          <SearchToolbar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filtersLocation={filters.location}
            resultsCount={sortedListings.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showMap={showMap}
            onToggleMap={toggleMap}
            t={t}
          />
          <SearchResultsSection
            showFilters={showFilters}
            loading={loading}
            sortedListings={sortedListings}
            viewMode={viewMode}
            showMap={showMap}
            t={t}
            mapNode={mapNode}
          />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
