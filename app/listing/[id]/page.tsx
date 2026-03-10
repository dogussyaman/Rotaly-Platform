'use client';

import { useState } from 'react';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Wifi,
  Utensils,
  Wind,
  UtensilsCrossed,
  Share2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

interface ListingDetailsProps {
  params: {
    id: string;
  };
}

// Mock listing data
const LISTING_DATA = {
  id: '1',
  title: 'Luxurious Beachfront Villa',
  location: 'Bali, Indonesia',
  pricePerNight: 450,
  rating: 4.95,
  totalReviews: 128,
  propertyType: 'Villa',
  maxGuests: 8,
  bedrooms: 4,
  bathrooms: 3,
  description:
    'Experience luxury living in this stunning beachfront villa. With direct access to a private beach, infinity pool overlooking the ocean, and modern amenities, this is the perfect destination for an unforgettable vacation.',
  images: [
    'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
  ],
  amenities: [
    { icon: Wifi, name: 'WiFi' },
    { icon: Utensils, name: 'Kitchen' },
    { icon: Wind, name: 'Air Conditioning' },
    { icon: UtensilsCrossed, name: 'Pool' },
  ],
  host: {
    name: 'David Johnson',
    rating: 4.9,
    reviews: 284,
    superhost: true,
    responseTime: 'within an hour',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  checkInTime: '3:00 PM',
  checkOutTime: '11:00 AM',
  notes: 'This villa is perfect for families and groups. Minimum 3-night stay required.',
};

export default function ListingDetailsPage({ params }: ListingDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const { t } = useLocale();

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? LISTING_DATA.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === LISTING_DATA.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <div className="pt-24 pb-16">
        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-96 md:h-[32rem] bg-muted overflow-hidden"
        >
          <Image
            src={LISTING_DATA.images[selectedImageIndex]}
            alt={LISTING_DATA.title}
            fill
            className="object-cover"
            priority
          />

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/60 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/60 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </motion.button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {LISTING_DATA.images.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedImageIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/60 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted
                    ? 'fill-red-500 text-red-500'
                    : 'text-foreground'
                }`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/60 transition-colors"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Title Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium px-2 py-1 bg-muted rounded-full text-muted-foreground">
                    {LISTING_DATA.propertyType}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {LISTING_DATA.title}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{LISTING_DATA.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">
                      {LISTING_DATA.rating}
                    </span>
                    <span>({LISTING_DATA.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-4 gap-4 border-y border-border py-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Guests</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {LISTING_DATA.maxGuests}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Bedrooms
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {LISTING_DATA.bedrooms}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Baths</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {LISTING_DATA.bathrooms}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p className="text-lg font-semibold text-foreground">
                    {LISTING_DATA.propertyType}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  About this space
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {LISTING_DATA.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {LISTING_DATA.amenities.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <motion.div
                        key={amenity.name}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                          {amenity.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Check In/Out */}
              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="text-2xl font-bold text-foreground">
                  House Rules
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-semibold text-foreground">
                      {LISTING_DATA.checkInTime}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-semibold text-foreground">
                      {LISTING_DATA.checkOutTime}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {LISTING_DATA.notes}
                </p>
              </div>
            </motion.div>

            {/* Sidebar - Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32 space-y-6">
                {/* Booking Card */}
                <div className="border border-border rounded-xl p-6 space-y-6 bg-card">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        ${LISTING_DATA.pricePerNight}
                      </span>
                      <span className="text-muted-foreground">per night</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Guests
                      </label>
                      <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                        {Array.from({ length: LISTING_DATA.maxGuests }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base">
                    Reserve
                  </Button>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>${LISTING_DATA.pricePerNight} × 3 nights</span>
                      <span>${LISTING_DATA.pricePerNight * 3}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>$75</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>$105</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
                      <span>Total</span>
                      <span>${LISTING_DATA.pricePerNight * 3 + 75 + 105}</span>
                    </div>
                  </div>
                </div>

                {/* Host Card */}
                <div className="border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={LISTING_DATA.host.avatar}
                      alt={LISTING_DATA.host.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {LISTING_DATA.host.name}
                      </h3>
                      {LISTING_DATA.host.superhost && (
                        <p className="text-xs font-medium text-accent">
                          ⭐ Superhost
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <Star className="w-4 h-4 fill-accent text-accent inline mr-1" />
                      {LISTING_DATA.host.rating} ({LISTING_DATA.host.reviews}{' '}
                      reviews)
                    </div>
                    <div>Responds within {LISTING_DATA.host.responseTime}</div>
                  </div>
                  <Button variant="outline" className="w-full border-border">
                    Contact Host
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
