'use client';

import { Users, Bed, Bath, Info } from 'lucide-react';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface ListingKeyFactsProps {
  listing: ListingDetail;
  guestsLabel: string;
  guestsUnit: string;
  bedroomsLabel: string;
  bathsLabel: string;
  typeLabel: string;
}

export function ListingKeyFacts({
  listing,
  guestsLabel,
  guestsUnit,
  bedroomsLabel,
  bathsLabel,
  typeLabel,
}: ListingKeyFactsProps) {
  const propertyType = (listing as { property_type?: string }).property_type ?? 'Stay';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-card border rounded-[2rem] shadow-sm">
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Users className="w-4 h-4" /> {guestsLabel}
        </div>
        <div className="text-xl font-bold">{listing.maxGuests} {guestsUnit}</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Bed className="w-4 h-4" /> {bedroomsLabel}
        </div>
        <div className="text-xl font-bold">{listing.bedrooms}</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Bath className="w-4 h-4" /> {bathsLabel}
        </div>
        <div className="text-xl font-bold">{listing.bathrooms}</div>
      </div>
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" /> {typeLabel}
        </div>
        <div className="text-xl font-bold">{propertyType}</div>
      </div>
    </div>
  );
}
