'use client';

import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface ListingHeaderProps {
  listing: ListingDetail;
  reviewsLabel: string;
}

export function ListingHeader({ listing, reviewsLabel }: ListingHeaderProps) {
  const propertyType = (listing as { property_type?: string }).property_type ?? 'Konaklama';
  const location = [listing.address, listing.city, listing.country].filter(Boolean).join(', ');

  return (
    <div className="space-y-4">
      <Badge variant="secondary" className="bg-secondary/50 text-foreground border-none px-3 py-1 font-bold">
        {propertyType}
      </Badge>
      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
        {listing.title}
      </h1>
      <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-foreground text-lg">{listing.rating.toFixed(2)}</span>
          <span className="underline font-medium hover:text-foreground cursor-pointer">
            {listing.totalReviews} {reviewsLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span className="font-medium">{location}</span>
        </div>
      </div>
    </div>
  );
}
