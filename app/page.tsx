'use client';

import { Suspense, lazy, useState, useRef } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { OffersSectionSkeleton } from '@/components/home/offers-skeleton';
import { ListingsSection } from '@/components/home/listings-section';
import { AirlineRoutesSection } from '@/components/home/airline-routes-section';
import { HostCtaSection } from '@/components/home/host-cta-section';
import { LoyaltyPromoSection } from '@/components/home/loyalty-promo';

const OffersSection = lazy(() =>
  import('@/components/home/offers-section').then((mod) => ({ default: mod.OffersSection })),
);

export default function Home() {
  const { t } = useLocale();
  const [activeCategory, setActiveCategory] = useState('beachfront');
  const catScrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="min-h-screen font-sans space-y-20"
      style={{ background: 'var(--background)' }}
    >
      <HeroSection t={t} />

      <CategoriesSection
        t={t}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        catScrollRef={catScrollRef}
      />

      <Suspense fallback={<OffersSectionSkeleton t={t} />}>
        <OffersSection t={t} />
      </Suspense>

      <LoyaltyPromoSection />

      <ListingsSection t={t} />

      <AirlineRoutesSection />

      <HostCtaSection t={t} />
    </div>
  );
}
