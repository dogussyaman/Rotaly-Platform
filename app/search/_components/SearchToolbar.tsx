'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, LayoutList, Sliders, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchToolbarProps {
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  filtersLocation: string;
  resultsCount: number;
  sortBy: string;
  setSortBy: (v: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  showMap: boolean;
  onToggleMap: () => void;
  t: Record<string, unknown>;
}

export function SearchToolbar({
  showFilters,
  setShowFilters,
  filtersLocation,
  resultsCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  showMap,
  onToggleMap,
  t,
}: SearchToolbarProps) {
  return (
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
          <span className="opacity-60">{filtersLocation || (t.searchAllStays as string)}</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <span>{resultsCount} {t.searchResultsSuffix as string}</span>
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
                {[
                  { value: 'relevant', label: t.searchSortRelevant as string },
                  { value: 'price-asc', label: t.searchSortPriceAsc as string },
                  { value: 'price-desc', label: t.searchSortPriceDesc as string },
                  { value: 'rating', label: t.searchSortRating as string },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`rounded-xl px-3 py-2 font-medium flex items-center justify-between cursor-pointer ${sortBy === option.value ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    {option.label}
                    {sortBy === option.value && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                  </DropdownMenuItem>
                ))}
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
          onClick={onToggleMap}
        >
          {showMap ? (t.searchShowList as string) : (t.searchShowMap as string)}
        </Button>
      </div>
    </motion.div>
  );
}
