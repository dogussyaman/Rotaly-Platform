'use client';

import { SearchHeader } from '@/components/header/search-header';
import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

const FEATURED_LISTINGS = [
  {
    id: '1',
    title: 'Luxurious Beachfront Villa',
    location: 'Bali, Indonesia',
    pricePerNight: 450,
    rating: 4.95,
    totalReviews: 128,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=600&h=400&fit=crop',
    propertyType: 'Villa',
    maxGuests: 8,
    bedrooms: 4,
  },
  {
    id: '2',
    title: 'Modern Apartment in Downtown',
    location: 'New York, USA',
    pricePerNight: 320,
    rating: 4.88,
    totalReviews: 95,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    propertyType: 'Apartment',
    maxGuests: 4,
    bedrooms: 2,
  },
  {
    id: '3',
    title: 'Cozy Mountain Cabin',
    location: 'Colorado, USA',
    pricePerNight: 280,
    rating: 4.92,
    totalReviews: 156,
    imageUrl: 'https://images.unsplash.com/photo-1537671608828-cc564c51e25d?w=600&h=400&fit=crop',
    propertyType: 'Cabin',
    maxGuests: 6,
    bedrooms: 3,
  },
  {
    id: '4',
    title: 'Historic Parisian Apartment',
    location: 'Paris, France',
    pricePerNight: 380,
    rating: 4.9,
    totalReviews: 203,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    propertyType: 'Apartment',
    maxGuests: 3,
    bedrooms: 1,
  },
  {
    id: '5',
    title: 'Tropical Island Bungalow',
    location: 'Maldives',
    pricePerNight: 520,
    rating: 4.97,
    totalReviews: 87,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
    propertyType: 'Bungalow',
    maxGuests: 2,
    bedrooms: 1,
  },
  {
    id: '6',
    title: 'Desert Luxury Estate',
    location: 'Phoenix, USA',
    pricePerNight: 420,
    rating: 4.86,
    totalReviews: 142,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
    propertyType: 'Villa',
    maxGuests: 10,
    bedrooms: 5,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <SearchHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Discover Your Next Adventure
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Explore unique accommodations around the world. From cozy cottages to luxurious villas,
              find your perfect stay.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span>Instant Confirmations</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>50,000+ Properties</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Featured Stays
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked accommodations for the best value
              </p>
            </div>
            <Link href="/search">
              <Button variant="outline" className="gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURED_LISTINGS.map((listing) => (
              <motion.div key={listing.id} variants={item}>
                <Link href={`/listing/${listing.id}`}>
                  <ListingCard {...listing} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              List Your Home & Earn Money
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Join thousands of hosts earning extra income by sharing their properties
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              asChild
            >
              <Link href="/become-host">
                Get Started <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Safety</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Hosts</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Community</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2024 StayHub. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Twitter</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Facebook</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
