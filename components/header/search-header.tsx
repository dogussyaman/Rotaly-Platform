'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from '@/lib/store/search-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function SearchHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { filters, setLocation, setCheckIn, setCheckOut, setGuests } =
    useSearchStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    // TODO: Navigate to search results page
    console.log('[v0] Search with filters:', filters);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Add dates';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: 0,
        boxShadow: isScrolled
          ? '0 4px 20px rgba(0, 0, 0, 0.1)'
          : '0 0px 0px rgba(0, 0, 0, 0)',
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StayHub
          </div>

          {/* Search Bar - Compact when scrolled */}
          <motion.div
            animate={{
              maxWidth: isScrolled ? '300px' : '500px',
            }}
            transition={{ duration: 0.3 }}
            className="flex-1 max-w-[500px] hidden md:block"
          >
            <div
              className={`flex items-center gap-2 rounded-full transition-all ${
                isScrolled
                  ? 'bg-card border border-border px-3 py-1.5'
                  : 'bg-white dark:bg-card border-2 border-border px-4 py-2.5'
              }`}
            >
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Where to?"
                value={filters.location}
                onChange={(e) => setLocation(e.target.value)}
                className={`border-0 bg-transparent placeholder:text-muted-foreground text-sm focus-visible:ring-0 p-0 h-auto ${
                  isScrolled ? 'text-xs' : ''
                }`}
              />
              {!isScrolled && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground min-w-fit">
                    {formatDate(filters.checkIn)}
                  </span>
                  <span className="text-xs text-muted-foreground">–</span>
                  <span className="text-xs text-muted-foreground min-w-fit">
                    {formatDate(filters.checkOut)}
                  </span>
                  <div className="h-4 w-px bg-border" />
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground min-w-fit">
                    {filters.guests} guests
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSearch}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 p-0 flex-shrink-0"
              size="icon"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Become a host
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
