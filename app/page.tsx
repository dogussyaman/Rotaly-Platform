'use client';

import { useState, useRef } from 'react';
import { SearchHeader } from '@/components/header/search-header';
import { ListingCard } from '@/components/listings/listing-card';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';

// ─── Category icons ──────────────────────────────────────────────────────────

const CategoryIcon = ({ id }: { id: string }) => {
  const icons: Record<string, JSX.Element> = {
    beachfront: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 36c0-8.837 7.163-16 16-16s16 7.163 16 16" strokeLinecap="round"/>
        <path d="M24 20V10M20 14l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 36h40" strokeLinecap="round"/>
      </svg>
    ),
    lakefront: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0" strokeLinecap="round"/>
        <path d="M6 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0" strokeLinecap="round"/>
        <circle cx="24" cy="16" r="6"/>
      </svg>
    ),
    tropical: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 40V20" strokeLinecap="round"/>
        <path d="M24 24c-4-8-12-10-16-6 4 2 10 4 16 6z" strokeLinejoin="round"/>
        <path d="M24 28c4-8 12-10 16-6-4 2-10 4-16 6z" strokeLinejoin="round"/>
        <path d="M24 20c0-8-6-14-10-12 2 4 6 8 10 12z" strokeLinejoin="round"/>
      </svg>
    ),
    castles: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="20" width="32" height="20" rx="1"/>
        <path d="M8 20v-6h6v6M22 20v-6h4v6M34 20v-6h6v6" strokeLinejoin="round"/>
        <rect x="18" y="30" width="12" height="10"/>
      </svg>
    ),
    farmhouse: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 24l18-14 18 14" strokeLinejoin="round"/>
        <rect x="10" y="24" width="28" height="16" rx="1"/>
        <rect x="20" y="30" width="8" height="10"/>
      </svg>
    ),
    city: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <rect x="16" y="10" width="16" height="30"/>
        <rect x="6" y="20" width="10" height="20"/>
        <rect x="32" y="16" width="10" height="24"/>
        <path d="M4 40h40" strokeLinecap="round"/>
      </svg>
    ),
    mountain: (
      <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 40l16-28 8 14 4-6 12 20H4z" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return icons[id] || null;
};

const CATEGORY_BADGES: Record<string, { color: string; key: 'topRated' | 'trending' }> = {
  beachfront: { color: 'bg-amber-100 text-amber-700', key: 'topRated' },
  lakefront: { color: 'bg-rose-100 text-rose-600', key: 'trending' },
  tropical: { color: 'bg-emerald-100 text-emerald-700', key: 'topRated' },
  castles: { color: 'bg-amber-100 text-amber-700', key: 'topRated' },
  farmhouse: { color: 'bg-rose-100 text-rose-600', key: 'trending' },
  city: { color: 'bg-rose-100 text-rose-600', key: 'trending' },
  mountain: { color: 'bg-amber-100 text-amber-700', key: 'topRated' },
};

const CATEGORY_COUNTS: Record<string, string> = {
  beachfront: '316',
  lakefront: '196',
  tropical: '248',
  castles: '74',
  farmhouse: '126',
  city: '294',
  mountain: '183',
};

const CATEGORY_IDS = ['beachfront', 'lakefront', 'tropical', 'castles', 'farmhouse', 'city', 'mountain'];

// ─── Listings data ───────────────────────────────────────────────────────────

const LISTINGS = [
  {
    id: '1',
    title: 'Sıcak Jakuzi, Tam Müstakil Bahçe, Tiny House',
    location: 'Kamp aracı · Çekmeköy',
    pricePerNight: 7578,
    rating: 4.96,
    totalReviews: 47,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    ],
    isFavorite: true,
    checkIn: new Date('2026-03-12'),
    checkOut: new Date('2026-03-17'),
    nights: 5,
  },
  {
    id: '2',
    title: 'Deniz Manzaralı Özel Jakuzi / Lüks Suit',
    location: 'Daire · Zeytinburnu',
    pricePerNight: 6666,
    rating: 5.0,
    totalReviews: 69,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ],
    isFavorite: true,
    checkIn: new Date('2026-03-22'),
    checkOut: new Date('2026-03-27'),
    nights: 5,
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
    nights: 5,
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
    ],
    nights: 5,
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
    ],
    nights: 5,
  },
  {
    id: '6',
    title: 'Modern Studio, Metrobüs 2 Dk',
    location: 'Daire · Şişli',
    pricePerNight: 1850,
    rating: 4.84,
    totalReviews: 211,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
    ],
    nights: 5,
  },
  {
    id: '7',
    title: "Ege'nin İncisi, Yat Limanı Manzarası",
    location: 'Daire · İzmir',
    pricePerNight: 3200,
    rating: 4.91,
    totalReviews: 77,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    ],
    nights: 5,
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
    ],
    nights: 5,
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useLocale();
  const [activeCategory, setActiveCategory] = useState('beachfront');
  const catScrollRef = useRef<HTMLDivElement>(null);

  const scrollCats = (dir: 'left' | 'right') => {
    catScrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const categoryLabels: Record<string, string> = {
    beachfront: t.beachfront as string,
    lakefront: t.lakefront as string,
    tropical: t.tropical as string,
    castles: t.castles as string,
    farmhouse: t.farmhouse as string,
    city: t.city as string,
    mountain: t.mountain as string,
  };

  const badgeLabels: Record<'topRated' | 'trending', string> = {
    topRated: t.topRated as string,
    trending: t.trending as string,
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--background)' }}>
      {/* ── HERO (full-screen, behind sticky header) ─────────────────── */}
      <section
        className="relative min-h-[88vh] flex flex-col"
        style={{
          background: 'linear-gradient(175deg, #c8dff0 0%, #deeaf5 35%, #eef4f9 65%, oklch(0.98 0.002 95) 100%)',
        }}
      >
        {/* Background building photo — blurred, behind text */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&h=900&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.18,
          }}
        />
        {/* Gradient fade to white at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--background))' }}
        />

        {/* SearchHeader sits at top (fixed), hero content below it */}
        <SearchHeader />

        {/* Hero text — pushed down to sit behind/under search bar */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-52 pb-32 relative z-10">
          {/* Floating location card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute left-12 top-48 hidden xl:flex items-center gap-3 bg-card/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-border/60"
          >
            <div
              className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-muted"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=80&h=80&fit=crop)',
                backgroundSize: 'cover',
              }}
            />
            <div className="text-left">
              <div className="text-xs font-bold text-foreground">Istanbul, Turkey</div>
              <div className="text-xs text-muted-foreground">595 km away</div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl sm:text-8xl lg:text-9xl font-bold text-foreground tracking-tighter leading-none text-balance mb-5"
          >
            {t.heroTitle as string}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground text-balance max-w-md"
          >
            {t.heroSubtitle as string}
          </motion.p>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-2.5 mt-5"
          >
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face',
              ].map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-card overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              500k+ {t.lovedBy as string}
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <section className="bg-background pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t.selectCategory as string}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t.categorySubtitle as string}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                {t.filters as string}
              </button>
              <button
                onClick={() => scrollCats('left')}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Geri"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => scrollCats('right')}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                aria-label="İleri"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          <div
            ref={catScrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORY_IDS.map(id => {
              const badge = CATEGORY_BADGES[id];
              const isActive = activeCategory === id;
              return (
                <motion.button
                  key={id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(id)}
                  className={`flex-shrink-0 w-44 p-4 rounded-2xl border text-left transition-all duration-200 ${
                    isActive
                      ? 'border-foreground bg-card shadow-md'
                      : 'border-border bg-card hover:border-foreground/40 hover:shadow-sm'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`text-foreground transition-opacity ${isActive ? 'opacity-100' : 'opacity-55'}`}>
                      <CategoryIcon id={id} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badgeLabels[badge.key]}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-foreground">{categoryLabels[id]}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {CATEGORY_COUNTS[id]} {(t.listingsTitle as string).includes('Property') ? 'Properties' : 'Mülk'}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ────────────────────────────────────────────────────── */}
      <section className="bg-background py-8 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t.listingsTitle as string}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t.listingsSubtitle as string}</p>
            </div>
            <Link
              href="/search"
              className="text-sm font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              {t.viewAll as string}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
            {LISTINGS.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <Link href={`/listing/${listing.id}`}>
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    location={listing.location}
                    pricePerNight={listing.pricePerNight}
                    rating={listing.rating}
                    totalReviews={listing.totalReviews}
                    images={listing.images}
                    checkIn={listing.checkIn}
                    checkOut={listing.checkOut}
                    nights={listing.nights}
                    isFavorite={(listing as any).isFavorite}
                    guestFavoriteLabel={t.guestFavorite as string}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOST CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-background px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-foreground rounded-3xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-card mb-3 text-balance">
                {t.hostTitle as string}
              </h2>
              <p className="text-card/60 max-w-md text-balance leading-relaxed">
                {t.hostSubtitle as string}
              </p>
            </div>
            <Link
              href="/become-host"
              className="flex-shrink-0 bg-secondary text-foreground font-bold px-8 py-4 rounded-full hover:bg-secondary/85 transition-colors text-sm whitespace-nowrap"
            >
              {t.getStarted as string}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              { title: t.support as string, links: ['Yardım Merkezi', 'AirCover', 'Güvenlik Bilgisi', 'Engelli Desteği'] },
              { title: t.community as string, links: ['StayHub.org', 'Ayrımcılıkla Mücadele', 'Arkadaşını Davet Et'] },
              { title: t.hosting as string, links: ['Evinizi Listeleyin', 'Ev Sahipleri için Destek', 'Kaynaklara Göz At'] },
              { title: t.company as string, links: ['Haberler', 'Yeni Özellikler', 'Kariyer', 'Yatırımcılar'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-muted-foreground">{t.privacyTerms as string}</p>
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
