'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type TourBookingSummary } from '@/lib/supabase/profile';

interface ToursSectionProps {
  loading: boolean;
  tourBookings: TourBookingSummary[];
}

export function ToursSection({ loading, tourBookings }: ToursSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tur Rezervasyonlarım</h2>
        <Link href="/tours">
          <Button variant="outline" size="sm" className="rounded-2xl px-4">
            Turları keşfet
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
        <p className="text-sm text-muted-foreground">Henüz bir tur rezervasyonunuz yok.</p>
      ) : (
        <div className="space-y-3">
          {tourBookings.map((tour) => (
            <div
              key={tour.id}
              className="rounded-2xl border border-border bg-card/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{tour.tourTitle ?? 'Tur'}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[tour.city, tour.country].filter(Boolean).join(', ')}
                  </span>
                  {tour.startTime && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(tour.startTime), 'dd MMM yyyy HH:mm', { locale: tr })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {tour.participants} kişi
                  </span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-bold">₺{tour.totalPrice.toLocaleString('tr-TR')}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{tour.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
