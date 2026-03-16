'use client';

import { Suspense, lazy, useState, useRef } from 'react';
import { useLocale } from '@/lib/i18n/locale-context';
import { MainFooter } from '@/components/footer/main-footer';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { OffersSectionSkeleton } from '@/components/home/offers-skeleton';
import { ListingsSection } from '@/components/home/listings-section';
import { HostCtaSection } from '@/components/home/host-cta-section';

const OffersSection = lazy(() =>
  import('@/components/home/offers-section').then((mod) => ({ default: mod.OffersSection })),
);

export default function Home() {
  const { t } = useLocale();
  const [activeCategory, setActiveCategory] = useState('beachfront');
  const catScrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--background)' }}>
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

      <ListingsSection t={t} />

      <HostCtaSection t={t} />

      <MainFooter />
    </div>
  );
}
