'use client';

import { Button } from '@/components/ui/button';
import { Wifi, Utensils, Wind, Waves, ShieldCheck } from 'lucide-react';

interface ListingAmenitiesProps {
  amenitiesTitle: string;
  wifiLabel: string;
  kitchenLabel: string;
  acLabel: string;
  poolLabel: string;
}

const AMENITY_ICONS = [Wifi, Utensils, Wind, Waves, ShieldCheck];

export function ListingAmenities({
  amenitiesTitle,
  wifiLabel,
  kitchenLabel,
  acLabel,
  poolLabel,
}: ListingAmenitiesProps) {
  const labels = [wifiLabel, kitchenLabel, acLabel, poolLabel, 'Güvenlik'];

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-4">{amenitiesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
          {AMENITY_ICONS.map((Icon, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium text-foreground">{labels[i]}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="rounded-2xl px-8 py-6 font-bold border-2">
          Tüm Olanakları Gör
        </Button>
    </div>
  );
}
