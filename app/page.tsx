'use client';

import { useState, useRef } from 'react';
import { SearchHeader } from '@/components/header/search-header';
import { ListingCard } from '@/components/listings/listing-card';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, SlidersHorizontal, ChevronRight as Arrow } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  {
    id: 'beachfront',
    label: 'Beachfront',
    count: '316 Properties',
    badge: 'Top rated',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 36c0-8.837 7.163-16 16-16s16 7.163 16 16" strokeLinecap="round"/>
        <path d="M24 20V10M20 14l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 36h40" strokeLinecap="round"/>
        <path d="M12 28c2-2 4-3 6-2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'lakefront',
    label: 'Lakefront',
    count: '196 Properties',
    badge: 'Trending',
    badgeColor: 'bg-rose-100 text-rose-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0" strokeLinecap="round"/>
        <path d="M6 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0" strokeLinecap="round"/>
        <circle cx="24" cy="16" r="6"/>
      </svg>
    ),
  },
  {
    id: 'tropical',
    label: 'Tropical',
    count: '248 Properties',
    badge: 'Guest favorite',
    badgeColor: 'bg-green-100 text-green-700',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 40V20" strokeLinecap="round"/>
        <path d="M24 24c-4-8-12-10-16-6 4 2 10 4 16 6z" strokeLinejoin="round"/>
        <path d="M24 28c4-8 12-10 16-6-4 2-10 4-16 6z" strokeLinejoin="round"/>
        <path d="M24 20c0-8-6-14-10-12 2 4 6 8 10 12z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'castles',
    label: 'Castles',
    count: '74 Properties',
    badge: 'Top rated',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="20" width="32" height="20" rx="1"/>
        <path d="M8 20v-6h6v6M22 20v-6h4v6M34 20v-6h6v6" strokeLinejoin="round"/>
        <rect x="18" y="30" width="12" height="10"/>
        <path d="M8 28h4M36 28h4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'farmhouse',
    label: 'Farmhouse',
    count: '126 Properties',
    badge: 'Trending',
    badgeColor: 'bg-rose-100 text-rose-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 24l18-14 18 14" strokeLinejoin="round"/>
        <rect x="10" y="24" width="28" height="16" rx="1"/>
        <rect x="20" y="30" width="8" height="10"/>
        <path d="M16 28h4v6h-4zM28 28h4v6h-4z"/>
      </svg>
    ),
  },
  {
    id: 'city',
    label: 'City',
    count: '294 Properties',
    badge: 'Trending',
    badgeColor: 'bg-rose-100 text-rose-600',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="16" y="10" width="16" height="30"/>
        <rect x="6" y="20" width="10" height="20"/>
        <rect x="32" y="16" width="10" height="24"/>
        <path d="M4 40h40" strokeLinecap="round"/>
        <path d="M20 20h2v4h-2zM26 20h2v4h-2zM20 30h2v4h-2zM26 30h2v4h-2z"/>
      </svg>
    ),
  },
  {
    id: 'mountain',
    label: 'Mountain',
    count: '183 Properties',
    badge: 'Top rated',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 40l16-28 8 14 4-6 12 20H4z" strokeLinejoin="round"/>
        <path d="M28 26l3-3 2 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const LISTINGS = [
  {
    id: '1',
    title: 'Sıcak Jakuzi, Tam Müstakil Bahçe, Tiny House',
    location: 'Kamp aracı/Karavan · Çekmeköy',
    pricePerNight: 7578,
    rating: 4.96,
    totalReviews: 47,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    ],
    propertyType: 'Cabin',
    maxGuests: 4,
    bedrooms: 1,
    checkIn: new Date('2026-03-12'),
    checkOut: new Date('2026-03-17'),
  },
  {
    id: '2',
    title: 'Deniz Manzaralı Özel Jakuzi/Ottomare Lüks Suit',
    location: 'Daire · Zeytinburnu',
    pricePerNight: 6666,
    rating: 5.0,
    totalReviews: 69,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
    propertyType: 'Apartment',
    maxGuests: 2,
    bedrooms: 1,
    checkIn: new Date('2026-03-22'),
    checkOut: new Date('2026-03-27'),
  },
  {
    id: '3',
    title: 'Boğaz Manzaralı Lüks Penthouse',
    location: 'Villa · Bebek',
    pricePerNight: 12400,
    rating: 4.97,
    totalReviews: 88,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
    ],
    propertyType: 'Villa',
    maxGuests: 6,
    bedrooms: 3,
    checkIn: new Date('2026-04-01'),
    checkOut: new Date('2026-04-06'),
  },
  {
    id: '4',
    title: 'Tarihi Taş Ev, Şarap Mahzeni',
    location: 'Ev · Kapadokya',
    pricePerNight: 4250,
    rating: 4.93,
    totalReviews: 134,
    images: [
      'https://images.unsplash.com/photo-1537671608828-cc564c51e25d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    ],
    propertyType: 'House',
    maxGuests: 4,
    bedrooms: 2,
  },
  {
    id: '5',
    title: 'Ahşap Villa, Özel Havuz, Doğa İçinde',
    location: 'Villa · Bodrum',
    pricePerNight: 9800,
    rating: 4.95,
    totalReviews: 62,
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540541338537-1220205ac293?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    ],
    propertyType: 'Villa',
    maxGuests: 8,
    bedrooms: 4,
  },
  {
    id: '6',
    title: 'Modern Studio, Metrobüs 2 Dk, Merkezi Konum',
    location: 'Daire · Şişli',
    pricePerNight: 1850,
    rating: 4.84,
    totalReviews: 211,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    ],
    propertyType: 'Apartment',
    maxGuests: 2,
    bedrooms: 1,
  },
  {
    id: '7',
    title: 'Ege\'nin İncisi, Yat Limanı Manzarası',
    location: 'Daire · İzmir',
    pricePerNight: 3200,
    rating: 4.91,
    totalReviews: 77,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    ],
    propertyType: 'Apartment',
    maxGuests: 4,
    bedrooms: 2,
  },
  {
    id: '8',
    title: 'Çam Ormanı İçinde Bungalov',
    location: 'Bungalov · Abant',
    pricePerNight: 2900,
    rating: 4.88,
    totalReviews: 45,
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    ],
    propertyType: 'Bungalow',
    maxGuests: 3,
    bedrooms: 1,
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('beachfront');
  const catScrollRef = useRef<HTMLDivElement>(null);

  const scrollCats = (dir: 'left' | 'right') => {
    if (!catScrollRef.current) return;
    catScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative min-h-[540px] flex flex-col items-center justify-center overflow-hidden pt-24 pb-36"
        style={{
          background: 'linear-gradient(180deg, oklch(0.82 0.06 220 / 0.5) 0%, oklch(0.98 0.002 95) 100%)',
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=800&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/30 to-background" />

        {/* Floating card — top left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute left-12 top-32 hidden lg:flex items-center gap-3 bg-card/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-border"
        >
          <div
            className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=80&h=80&fit=crop)', backgroundSize: 'cover' }}
          />
          <div>
            <div className="text-xs font-semibold text-foreground">Istanbul, Turkey</div>
            <div className="text-xs text-muted-foreground">595 km away</div>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="text-center px-4 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-none mb-4 text-balance"
          >
            Find Your Stay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg text-muted-foreground text-balance"
          >
            Discover unique places to stay around the world
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
              ].map((src, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-card overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">Loved by 500k+ travelers</span>
          </motion.div>
        </div>

        {/* The SearchHeader renders the expanded search bar here via fixed positioning */}
      </section>

      <SearchHeader />

      {/* ─── CATEGORIES ────────────────────────────────────────── */}
      <section className="pt-8 pb-10 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Select Category</h2>
              <p className="text-sm text-muted-foreground mt-1">Uncover the Perfect Match in Every Category</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={() => scrollCats('left')}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => scrollCats('right')}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          <div
            ref={catScrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 w-44 p-4 rounded-2xl border text-left transition-all ${
                  activeCategory === cat.id
                    ? 'border-foreground bg-card shadow-sm'
                    : 'border-border bg-card hover:border-foreground/30 hover:shadow-sm'
                }`}
              >
                <div className="relative mb-3">
                  <div className={`inline-block text-foreground ${activeCategory === cat.id ? 'opacity-100' : 'opacity-60'}`}>
                    {cat.icon}
                  </div>
                  <span className={`absolute top-0 right-0 text-xs font-medium px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>
                <div className="font-semibold text-sm text-foreground">{cat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{cat.count}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LISTINGS GRID ─────────────────────────────────────── */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                1.000'den fazla konaklama yeri
              </h2>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-foreground/20" />
                Fiyatlara tüm ücretler dahildir
              </p>
            </div>
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Tümünü gör <Arrow className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8"
          >
            {LISTINGS.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={`/listing/${listing.id}`}>
                  <ListingCard {...listing} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOST CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-foreground rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-card mb-3 text-balance">
                List your place and start earning
              </h2>
              <p className="text-card/60 max-w-md text-balance">
                Join thousands of hosts sharing their homes and earning extra income with StayHub.
              </p>
            </div>
            <Link
              href="/become-host"
              className="flex-shrink-0 bg-secondary text-foreground font-semibold px-8 py-4 rounded-full hover:bg-secondary/90 transition-colors text-sm whitespace-nowrap"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { title: 'Support', links: ['Help Center', 'AirCover', 'Safety information', 'Disability support'] },
              { title: 'Community', links: ['StayHub.org', 'Combating discrimination', 'Invite friends'] },
              { title: 'Hosting', links: ['StayHub your home', 'AirCover for Hosts', 'Explore hosting resources'] },
              { title: 'StayHub', links: ['Newsroom', 'New features', 'Careers', 'Investors'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-muted-foreground">© 2026 StayHub, Inc. · Privacy · Terms · Sitemap</p>
            <div className="flex items-center gap-4">
              {['Twitter', 'Facebook', 'Instagram'].map(s => (
                <Link key={s} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
