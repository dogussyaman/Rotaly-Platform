'use client';

import { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  images: string[];
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  checkIn?: Date | null;
  checkOut?: Date | null;
  isFavorite?: boolean;
}

export function ListingCard({
  id,
  title,
  location,
  pricePerNight,
  rating,
  totalReviews,
  images,
  propertyType,
  maxGuests,
  bedrooms,
  checkIn,
  checkOut,
  isFavorite = false,
}: ListingCardProps) {
  const [wishlisted, setWishlisted] = useState(isFavorite);
  const [imgIndex, setImgIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setImgIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  const formatDateRange = () => {
    if (!checkIn || !checkOut) return null;
    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { range: `${fmt(checkIn)} – ${fmt(checkOut)}`, nights };
  };

  const dateInfo = formatDateRange();
  const totalPrice = dateInfo ? pricePerNight * dateInfo.nights : null;

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-3">
        {images.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === imgIndex ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={src}
              alt={`${title} photo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        ))}

        {/* Prev / Next Arrows — show on hover */}
        {images.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-card/90 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-card/90 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </motion.button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  i === imgIndex ? 'w-2 h-2 bg-card' : 'w-1.5 h-1.5 bg-card/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(w => !w); }}
          className="absolute top-3 right-3 z-10 transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-5 h-5 drop-shadow-sm transition-colors ${
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-card fill-foreground/30'
            }`}
          />
        </button>

        {/* Guest favorite badge */}
        {rating >= 4.9 && (
          <div className="absolute top-3 left-3 z-10 bg-card text-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Guest favorite
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-foreground leading-snug flex-1 truncate">
            {location}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(2)}
              </span>
              {totalReviews > 0 && (
                <span className="text-sm text-muted-foreground">({totalReviews})</span>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground truncate">{title}</p>
        <p className="text-sm text-muted-foreground">
          {bedrooms} bedroom{bedrooms !== 1 ? 's' : ''} · {maxGuests} guests
        </p>

        {dateInfo ? (
          <p className="text-sm text-muted-foreground">{dateInfo.range}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Available now</p>
        )}

        <div className="pt-1 flex items-baseline gap-1">
          <span className="text-sm font-semibold text-foreground underline decoration-foreground/30">
            ₺{pricePerNight.toLocaleString('tr-TR')}
          </span>
          <span className="text-sm text-muted-foreground">per night</span>
          {totalPrice && (
            <span className="text-sm text-muted-foreground ml-auto">
              ₺{totalPrice.toLocaleString('tr-TR')} total
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
