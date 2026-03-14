'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { SearchHeader } from '@/components/header/search-header';
import { ListingCard } from '@/components/listings/listing-card';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { HeroSearchBar } from '@/components/search/hero-search-bar';
import { useSearchStore } from '@/lib/store/search-store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LayoutGrid, LayoutList, Sliders, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { fetchListings, type ListingRow } from '@/lib/supabase/listings';

const SearchMap = dynamic(() => import('@/components/search/search-map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-3xl" />,
});

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilters, setShowFilters] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const { filters, setLocation, setGuests, setCheckIn, setCheckOut } = useSearchStore();

  // Sync URL params to store on mount or when URL changes
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
      case 'price-asc':
        return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price-desc':
        return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [listings, sortBy]);

  const [wasFiltersOpen, setWasFiltersOpen] = useState(true);

  const toggleMap = useCallback(() => {
    setShowMap((prev) => {
      const isOpening = !prev;
      if (isOpening) {
        // Harita açılırken o anki filtre durumunu kaydet
        setWasFiltersOpen(showFilters);
        setShowFilters(false);
      } else {
        // Harita kapanırken eğer öncesinde filtreler açıksa geri aç
        if (wasFiltersOpen) {
          setShowFilters(true);
        }
      }
      return isOpening;
    });
  }, [showFilters, wasFiltersOpen]);

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 flex flex-wrap gap-4 items-center justify-between bg-card p-2 rounded-2xl border border-border/50"
          >
            <div className="flex items-center gap-3">
              <Button
                variant={showFilters ? 'secondary' : 'outline'}
                size="sm"
                className="gap-2 rounded-xl h-10 px-4 border-border/60 hover:bg-muted font-bold"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Sliders className="w-4 h-4" />
                {t.filters as string}
              </Button>

              <Badge variant="secondary" className="h-10 px-4 rounded-xl flex items-center gap-2 bg-muted/50 border-none text-foreground font-black">
                <span className="opacity-60">{filters.location || (t.searchAllStays as string)}</span>
                <span className="w-1 h-1 rounded-full bg-foreground/20" />
                <span>{sortedListings.length} {t.searchResultsSuffix as string}</span>
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-border/60 font-bold gap-2">
                      <span className="text-muted-foreground font-medium">{t.searchSortLabel as string}:</span>
                      <span>
                        {sortBy === 'relevant' && t.searchSortRelevant}
                        {sortBy === 'price-asc' && t.searchSortPriceAsc}
                        {sortBy === 'price-desc' && t.searchSortPriceDesc}
                        {sortBy === 'rating' && t.searchSortRating}
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-xl border-border/60 backdrop-blur-xl">
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuRadioItem value="relevant" className="rounded-xl px-3 py-2 font-medium">{t.searchSortRelevant as string}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-asc" className="rounded-xl px-3 py-2 font-medium">{t.searchSortPriceAsc as string}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-desc" className="rounded-xl px-3 py-2 font-medium">{t.searchSortPriceDesc as string}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="rating" className="rounded-xl px-3 py-2 font-medium">{t.searchSortRating as string}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-1 border border-border/60 rounded-xl p-1 bg-muted/20">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 p-0 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 p-0 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant={showMap ? 'secondary' : 'outline'}
                size="sm"
                className="h-10 px-4 rounded-xl border-border/60 font-bold gap-2 hidden sm:flex"
                onClick={toggleMap}
              >
                {showMap ? (t.searchShowList as string) : (t.searchShowMap as string)}
              </Button>
            </div>
          </motion.div>

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
                        <Link href={`/listing/${listing.id}`}>
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
                      {t.searchNoResultsTitle as string}
                    </p>
                    <p className="text-muted-foreground">
                      {t.searchNoResultsSubtitle as string}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <AnimatePresence>
              {showMap && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20, width: 0 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    width: showFilters ? 420 : 600 
                  }}
                  exit={{ opacity: 0, x: 20, width: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="hidden lg:block h-[calc(100vh-220px)] sticky top-28 rounded-3xl border border-border overflow-hidden bg-card shadow-xl"
                >
                  <SearchMap listings={sortedListings} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
