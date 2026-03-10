'use client';

import { useState, useMemo } from 'react';
import { SearchHeader } from '@/components/header/search-header';
import { ListingCard } from '@/components/listings/listing-card';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { useSearchStore } from '@/lib/store/search-store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LayoutGrid, LayoutList, Sliders } from 'lucide-react';
import { Metadata } from 'next';

// Mock data - In real app, this would come from Supabase
const ALL_LISTINGS = [
  {
    id: '1',
    title: 'Luxurious Beachfront Villa',
    location: 'Bali, Indonesia',
    pricePerNight: 450,
    rating: 4.95,
    totalReviews: 128,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop',
    propertyType: 'Villa',
    maxGuests: 8,
    bedrooms: 4,
  },
  {
    id: '2',
    title: 'Modern Apartment in Downtown',
    location: 'New York, USA',
    pricePerNight: 320,
    rating: 4.88,
    totalReviews: 95,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    propertyType: 'Apartment',
    maxGuests: 4,
    bedrooms: 2,
  },
  {
    id: '3',
    title: 'Cozy Mountain Cabin',
    location: 'Colorado, USA',
    pricePerNight: 280,
    rating: 4.92,
    totalReviews: 156,
    imageUrl: 'https://images.unsplash.com/photo-1537671608828-cc564c51e25d?w=600&h=400&fit=crop',
    propertyType: 'Cabin',
    maxGuests: 6,
    bedrooms: 3,
  },
  {
    id: '4',
    title: 'Historic Parisian Apartment',
    location: 'Paris, France',
    pricePerNight: 380,
    rating: 4.9,
    totalReviews: 203,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    propertyType: 'Apartment',
    maxGuests: 3,
    bedrooms: 1,
  },
  {
    id: '5',
    title: 'Tropical Island Bungalow',
    location: 'Maldives',
    pricePerNight: 520,
    rating: 4.97,
    totalReviews: 87,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
    propertyType: 'Bungalow',
    maxGuests: 2,
    bedrooms: 1,
  },
  {
    id: '6',
    title: 'Desert Luxury Estate',
    location: 'Phoenix, USA',
    pricePerNight: 420,
    rating: 4.86,
    totalReviews: 142,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
    propertyType: 'Villa',
    maxGuests: 10,
    bedrooms: 5,
  },
  {
    id: '7',
    title: 'Urban Loft in Tokyo',
    location: 'Tokyo, Japan',
    pricePerNight: 290,
    rating: 4.91,
    totalReviews: 167,
    imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop',
    propertyType: 'Apartment',
    maxGuests: 2,
    bedrooms: 1,
  },
  {
    id: '8',
    title: 'Charming London Cottage',
    location: 'London, UK',
    pricePerNight: 350,
    rating: 4.94,
    totalReviews: 234,
    imageUrl: 'https://images.unsplash.com/photo-1512207736139-e04b6ff91629?w=600&h=400&fit=crop',
    propertyType: 'Cottage',
    maxGuests: 4,
    bedrooms: 2,
  },
  {
    id: '9',
    title: 'Minimalist Barcelona Studio',
    location: 'Barcelona, Spain',
    pricePerNight: 220,
    rating: 4.87,
    totalReviews: 189,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    propertyType: 'Apartment',
    maxGuests: 2,
    bedrooms: 1,
  },
];

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevant');
  const [showFilters, setShowFilters] = useState(false);
  
  const { filters } = useSearchStore();

  // Filter listings based on search criteria
  const filteredListings = useMemo(() => {
    return ALL_LISTINGS.filter((listing) => {
      // Price filter
      if (
        listing.pricePerNight < filters.priceMin ||
        listing.pricePerNight > filters.priceMax
      ) {
        return false;
      }

      // Location filter
      if (
        filters.location &&
        !listing.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Property type filter
      if (
        filters.propertyType.length > 0 &&
        !filters.propertyType.includes(listing.propertyType)
      ) {
        return false;
      }

      // Guest count filter
      if (listing.maxGuests < filters.guests) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort listings
  const sortedListings = useMemo(() => {
    const sorted = [...filteredListings];
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
  }, [filteredListings, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {filters.location || 'All Stays'}
            </h1>
            <p className="text-muted-foreground">
              {sortedListings.length} properties available
            </p>
          </motion.div>

          {/* Filters & Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <Button
              variant="outline"
              size="sm"
              className="md:hidden gap-2 border-border"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Sliders className="w-4 h-4" />
              Filters
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="relevant">Most Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-2 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="w-10 h-10 p-0"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="w-10 h-10 p-0"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Sidebar Filters - Desktop */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-64 flex-shrink-0"
              >
                <FilterSidebar />
              </motion.div>
            )}

            {!showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:block w-64 flex-shrink-0"
              >
                <FilterSidebar />
              </motion.div>
            )}

            {/* Listings Grid/List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 min-w-0"
            >
              {sortedListings.length > 0 ? (
                <motion.div
                  layout
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {sortedListings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ListingCard {...listing} />
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
                    No properties found
                  </p>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
