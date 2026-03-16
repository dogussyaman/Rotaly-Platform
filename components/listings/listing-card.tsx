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
  /** İndirim oranı (örn. 10 = %10). Gösterildiğinde kartta rozet çıkar. */
  discountPercent?: number;
  /** İndirim rozetini metin olarak basmak için (örn. "₺250 indirim / gece"). */
  discountLabel?: string;
  rating: number;
  totalReviews: number;
  images: string[];
  checkIn?: Date | null;
  checkOut?: Date | null;
  nights?: number;
  isFavorite?: boolean;
  guestFavoriteLabel?: string;
  layout?: 'grid' | 'list';
}

export function ListingCard({
  title,
  location,
  pricePerNight,
  discountPercent,
  discountLabel,
  rating,
  totalReviews,
  images,
  checkIn,
  checkOut,
  nights,
  isFavorite = false,
  guestFavoriteLabel = 'Misafirlerin Favorisi',
  layout = 'grid',
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

  const fmt = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  const totalNights = nights || (checkIn && checkOut
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
    : null);
  const totalPrice = totalNights ? pricePerNight * totalNights : null;
  const dateRange = checkIn && checkOut ? `${fmt(checkIn)} – ${fmt(checkOut)}` : null;
  const hasDiscountBadge =
    (discountLabel != null && discountLabel.trim().length > 0) ||
    (discountPercent != null && discountPercent > 0);

  const isList = layout === 'list';

  return (
    <div
      className={`group cursor-pointer ${isList ? 'flex flex-col md:flex-row gap-4' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image Carousel ── */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-muted ${
          isList ? 'w-full md:w-64 h-56 md:h-44 flex-shrink-0 mb-3 md:mb-0' : 'aspect-[4/3] mb-3'
        }`}
      >
        {images.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === imgIndex ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={src}
              alt={`${title} fotoğraf ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>
        ))}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              onClick={prev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-card/90 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
              aria-label="Önceki fotoğraf"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
            </motion.button>
            <motion.button
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              onClick={next}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-card/90 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
              aria-label="Sonraki fotoğraf"
            >
              <ChevronRight className="w-3.5 h-3.5 text-foreground" />
            </motion.button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === imgIndex ? 'w-2 h-2 bg-card' : 'w-1.5 h-1.5 bg-card/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); setWishlisted(w => !w); }}
          className="absolute top-3 right-3 z-10 transition-transform hover:scale-110 active:scale-95"
          aria-label="İstek listesine ekle"
        >
          <Heart
            className={`w-5 h-5 drop-shadow transition-colors ${
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-card fill-foreground/25'
            }`}
          />
        </button>

        {/* İndirim + Guest favorite rozetleri */}
        {hasDiscountBadge && (
          <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
            {discountLabel && discountLabel.trim().length > 0
              ? discountLabel
              : `%${Math.round(discountPercent ?? 0)} İndirim`}
          </div>
        )}
        {isFavorite && (
          <div
            className="absolute left-3 z-10 bg-card text-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm"
            style={{ top: hasDiscountBadge ? 40 : 12 }}
          >
            {guestFavoriteLabel}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className={isList ? 'flex-1 min-w-0' : ''}>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="font-semibold text-sm text-foreground leading-snug flex-1 line-clamp-1">
            {location}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="text-sm font-medium text-foreground">
                {rating === 5 ? '5,0' : rating.toFixed(2).replace('.', ',')}
              </span>
              {totalReviews > 0 && (
                <span className="text-sm text-muted-foreground ml-0.5">({totalReviews})</span>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-1">{title}</p>

        {dateRange ? (
          <p className="text-sm text-muted-foreground mt-0.5">{dateRange}</p>
        ) : null}

        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-sm font-semibold text-foreground underline decoration-foreground/25 underline-offset-2">
            ₺{pricePerNight.toLocaleString('tr-TR')}
          </span>
          <span className="text-sm text-muted-foreground">gece</span>
          {totalPrice && (
            <span className="text-sm text-muted-foreground ml-auto">
              ₺{totalPrice.toLocaleString('tr-TR')} toplam
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
