'use client';

import { useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
}

export function ListingCard({
  id,
  title,
  location,
  pricePerNight,
  rating,
  totalReviews,
  imageUrl,
  propertyType,
  maxGuests,
  bedrooms,
}: ListingCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
    >
      <div className="space-y-3">
        {/* Image Container */}
        <div className="relative h-64 rounded-2xl overflow-hidden bg-muted">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              onLoadingComplete={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/60 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted
                  ? 'fill-red-500 text-red-500'
                  : 'text-foreground/60'
              }`}
            />
          </motion.button>

          {/* Property Type Badge */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-xs font-medium text-foreground">
            {propertyType}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate text-pretty">
                {title}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0 bg-muted px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="text-xs font-semibold text-foreground">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({totalReviews})
                </span>
              </div>
            )}
          </div>

          {/* Details Row */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{maxGuests} guests</span>
            <span>•</span>
            <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-lg font-bold text-foreground">
              ${pricePerNight}
            </span>
            <span className="text-sm text-muted-foreground">per night</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
