'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface ListingGalleryProps {
  listing: ListingDetail;
  selectedImageIndex: number;
  onPrev: () => void;
  onNext: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  staysLabel: string;
}

export function ListingGallery({
  listing,
  selectedImageIndex,
  onPrev,
  onNext,
  isWishlisted,
  onToggleWishlist,
  staysLabel,
}: ListingGalleryProps) {
  const images = listing.images?.length ? listing.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop'];
  const current = images[selectedImageIndex] ?? images[0];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {staysLabel}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground truncate">{listing.title}</span>
      </div>

      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden group shadow-2xl">
        <Image
          src={current}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <button
            onClick={onPrev}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-all transform hover:-translate-x-1"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={onNext}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-all transform hover:translate-x-1"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20">
          {selectedImageIndex + 1} / {images.length}
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2">
          <button
            onClick={onToggleWishlist}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
          </button>
          <button className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all">
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
