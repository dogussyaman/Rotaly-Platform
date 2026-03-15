'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass, MapPin, Star, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LocalizedTour } from './types';

interface TourCardProps {
  tour: LocalizedTour;
  index: number;
  formatCurrency: (value: number) => string;
  maxGuestsLabel: (maxGuests: number) => string;
  perPersonLabel: string;
  reserveCta: string;
}

export function TourCard({
  tour,
  index,
  formatCurrency,
  maxGuestsLabel,
  perPersonLabel,
  reserveCta,
}: TourCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
        {!imgError ? (
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient} flex items-center justify-center`}>
            <MapPin className="w-16 h-16 text-white/40" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-foreground border-none font-black px-4 py-1.5 rounded-2xl shadow-lg">
            {tour.badge}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <button type="button" className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95">
            <Compass className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="space-y-3 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">
            <MapPin className="w-3 h-3" />
            {tour.location}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-sm">{tour.rating}</span>
            <span className="text-muted-foreground text-xs">({tour.reviews})</span>
          </div>
        </div>
        <h3 className="text-xl font-black group-hover:text-amber-600 transition-colors leading-tight line-clamp-2">
          {tour.title}
        </h3>
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Clock className="w-4 h-4" />
            {tour.duration}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Users className="w-4 h-4" />
            {maxGuestsLabel(tour.maxGuests)}
          </div>
        </div>
        <div className="pt-4 flex items-center justify-between border-t border-dashed">
          <div>
            <span className="text-2xl font-black">{formatCurrency(tour.price)}</span>
            <span className="text-muted-foreground text-xs font-bold ml-1">{perPersonLabel}</span>
          </div>
          <Button size="sm" className="rounded-xl font-black px-4 bg-foreground hover:bg-foreground/90">
            {reserveCta}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
