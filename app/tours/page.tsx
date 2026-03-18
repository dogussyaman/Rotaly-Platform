'use client';

import { useLocale } from '@/lib/i18n/locale-context';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';
import { MOCK_TOURS_BASE } from './_components/constants';
import type { LocalizedTour } from './_components/types';
import { TourCard } from './_components/TourCard';
import { ToursHero } from './_components/ToursHero';
import { ToursCategories } from './_components/ToursCategories';
import { ToursCtaSection } from './_components/ToursCtaSection';

export default function ToursPage() {
  const { t, locale } = useLocale();

  const localeTag =
    locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : locale === 'fr' ? 'fr-FR' : 'en-US';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(localeTag, {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(value);

  const maxGuestsLabel = (maxGuests: number) => {
    const prefix = (t.toursMaxGuestsPrefix as string) ?? 'Max.';
    const suffix = (t.toursMaxGuestsSuffix as string) ?? '';
    return `${prefix} ${maxGuests}${suffix ? ` ${suffix}` : ''}`.trim();
  };

  const categories = t.toursCategories as string[];
  const heroTitleParts = t.toursHeroTitleParts as string[];
  const titles = t.toursMockTitles as string[];
  const locations = t.toursMockLocations as string[];
  const durations = t.toursMockDurations as string[];
  const badges = t.toursMockBadges as string[];

  const mockTours: LocalizedTour[] = MOCK_TOURS_BASE.map((base) => ({
    id: base.id,
    price: base.price,
    rating: base.rating,
    reviews: base.reviews,
    maxGuests: base.maxGuests,
    image: base.image,
    gradient: base.gradient,
    title: titles[base.titleIndex] ?? '',
    location: locations[base.locationIndex] ?? '',
    duration: durations[base.durationIndex] ?? '',
    badge: badges[base.badgeIndex] ?? '',
  }));

  return (
    <div className="min-h-screen bg-background font-sans">
      <SearchHeader />
      <main className="pb-20">
        <ToursHero
          heroTitleParts={heroTitleParts}
          heroSubtitle={t.toursHeroSubtitle as string}
        />
        <ToursCategories categories={categories} />
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2">{t.toursFeaturedTitle as string}</h2>
              <p className="text-muted-foreground font-medium">{t.toursFeaturedSubtitle as string}</p>
            </div>
            <Button variant="outline" className="rounded-2xl font-bold px-6">
              {t.toursViewAll as string}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mockTours.map((tour, i) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={i}
                formatCurrency={formatCurrency}
                maxGuestsLabel={maxGuestsLabel}
                perPersonLabel={t.toursPerPersonLabel as string}
                reserveCta={t.toursReserveCta as string}
              />
            ))}
          </div>
        </section>
        <ToursCtaSection
          ctaBadge={t.toursCtaBadge as string}
          ctaTitle={t.toursCtaTitle as string}
          ctaSubtitle={t.toursCtaSubtitle as string}
          feature1Title={t.toursCtaFeature1Title as string}
          feature1Subtitle={t.toursCtaFeature1Subtitle as string}
          feature2Title={t.toursCtaFeature2Title as string}
          feature2Subtitle={t.toursCtaFeature2Subtitle as string}
          ctaButton={t.toursCtaButton as string}
          ctaImageAlt={t.toursCtaImageAlt as string}
        />
      </main>
    </div>
  );
}
