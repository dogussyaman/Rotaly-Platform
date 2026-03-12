'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n/locale-context';
import { dateFnsLocale, formatCurrencyTRY, formatNumber } from '@/lib/i18n/format';
import { type TourBookingSummary } from '@/lib/supabase/profile';

interface ToursSectionProps {
  loading: boolean;
  tourBookings: TourBookingSummary[];
}

export function ToursSection({ loading, tourBookings }: ToursSectionProps) {
  const { t, locale } = useLocale();
  const dateLocale = dateFnsLocale(locale);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.profileToursTitle as string}</h2>
        <Link href="/tours">
          <Button variant="outline" size="sm" className="rounded-2xl px-4">
            {t.profileToursCta as string}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : tourBookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.profileToursEmpty as string}</p>
      ) : (
        <div className="space-y-3">
          {tourBookings.map((tour) => (
            <div
              key={tour.id}
              className="rounded-2xl border border-border bg-card/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{tour.tourTitle ?? (t.profileTourFallback as string)}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[tour.city, tour.country].filter(Boolean).join(', ')}
                  </span>
                  {tour.startTime && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(tour.startTime), 'dd MMM yyyy HH:mm', { locale: dateLocale })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {formatNumber(tour.participants, locale)} {t.profilePeopleSuffix as string}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-black">{formatCurrencyTRY(tour.totalPrice, locale)}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{tour.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
