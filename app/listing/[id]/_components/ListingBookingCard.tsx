'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Star, ShieldCheck } from 'lucide-react';
import type { ListingDetail } from '@/lib/supabase/bookings';
import type { Locale } from 'date-fns';

interface ListingBookingCardProps {
  listing: ListingDetail;
  listingId: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  guestCount: number;
  setGuestCount: (n: number) => void;
  totalNights: number;
  priceCalc: {
    subtotal: number;
    serviceFee: number;
    cleaningFee: number;
    extraGuestFee?: number;
    total: number;
  };
  priceLoading?: boolean;
  locale: string;
  t: {
    checkin: string;
    checkout: string;
    setDate: string;
    guests: string;
    listingReserve: string;
    listingPerNight: string;
    listingCleaningFee: string;
    listingServiceFee: string;
    listingTotal: string;
  };
}

export function ListingBookingCard({
  listing,
  listingId,
  dateRange,
  setDateRange,
  guestCount,
  setGuestCount,
  totalNights,
  priceCalc,
  priceLoading,
  locale,
  t,
}: ListingBookingCardProps) {
  const router = useRouter();
  const dateLocale: Locale = locale === 'tr' ? tr : enUS;
  const baseNightly = listing.pricePerNight;
  const discountedNightly =
    listing.discountPercent && listing.discountPercent > 0
      ? listing.pricePerNight * (1 - listing.discountPercent / 100)
      : listing.pricePerNight;

  // API'den gelen gerçek ortalama gecelik fiyat (sezon, özel fiyat vs. dahil)
  const calculatedNightly =
    totalNights > 0 && priceCalc.subtotal > 0
      ? priceCalc.subtotal / totalNights
      : discountedNightly;

  const effectiveNightly = Math.round(calculatedNightly);
  const discountPercent =
    Math.round(100 - (effectiveNightly / Math.max(1, baseNightly)) * 100);
  const hasDiscount = discountPercent > 0;

  const handleReserveClick = () => {
    const params = new URLSearchParams();
    if (dateRange.from) params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange.to) params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
    if (guestCount > 0) params.set('guests', String(guestCount));
    const query = params.toString();
    router.push(query ? `/checkout/${listingId}?${query}` : `/checkout/${listingId}`);
  };

  return (
    <aside className="sticky top-28">
      <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group min-h-130">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-500 to-amber-500" />

        <div className="flex items-baseline justify-between mb-8 min-h-24">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground line-through opacity-80">
              ₺{baseNightly.toLocaleString('tr-TR')} / {t.listingPerNight}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-emerald-700">
                ₺{effectiveNightly.toLocaleString('tr-TR')}
              </span>
              {hasDiscount && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                  %{discountPercent} indirim
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              İndirim, seçtiğiniz tarih ve misafir sayısına göre uygulanmıştır.
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {listing.rating.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 border rounded-2xl overflow-hidden mb-6 bg-muted/30">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-start p-4 hover:bg-white transition-colors text-left border-r border-border">
                <span className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">
                  {t.checkin}
                </span>
                <span className="text-sm font-bold truncate">
                  {dateRange.from
                    ? format(dateRange.from, 'dd MMM yyyy', { locale: dateLocale })
                    : t.setDate}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-3xl" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) =>
                  setDateRange({ from: range?.from, to: range?.to })
                }
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-start p-4 hover:bg-white transition-colors text-left">
                <span className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">
                  {t.checkout}
                </span>
                <span className="text-sm font-bold truncate">
                  {dateRange.to
                    ? format(dateRange.to, 'dd MMM yyyy', { locale: dateLocale })
                    : t.setDate}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-3xl" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.to || dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) =>
                  setDateRange({ from: range?.from, to: range?.to })
                }
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          <div className="col-span-2 border-t p-4 hover:bg-white transition-colors flex justify-between items-center cursor-pointer">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">
                {t.guests}
              </span>
              <span className="text-sm font-bold">
                {guestCount} {t.guests}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setGuestCount(Math.min(listing.maxGuests, guestCount + 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-16 rounded-2xl bg-foreground text-background font-black text-xl hover:bg-foreground/90 transition-transform active:scale-95 shadow-xl shadow-foreground/10"
          onClick={handleReserveClick}
        >
          {t.listingReserve}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4 font-medium italic">
          Henüz bir ödeme yapmayacaksınız
        </p>

        <div className="mt-8 space-y-4 pt-8 border-t border-border/60">
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
              {priceLoading
                ? '...'
                : `₺${effectiveNightly.toLocaleString('tr-TR')} x ${totalNights} gece`}
            </span>
            <span className="font-bold">₺{priceCalc.subtotal.toLocaleString('tr-TR')}</span>
          </div>
          {(priceCalc.extraGuestFee ?? 0) > 0 && (
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
                Ek misafir ücreti
              </span>
              <span className="font-bold">₺{priceCalc.extraGuestFee!.toLocaleString('tr-TR')}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
              {t.listingCleaningFee}
            </span>
            <span className="font-bold">₺{priceCalc.cleaningFee.toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">
              {t.listingServiceFee}
            </span>
            <span className="font-bold">₺{priceCalc.serviceFee.toLocaleString('tr-TR')}</span>
          </div>
          <div className="flex justify-between items-center text-2xl pt-6 border-t font-black text-foreground">
            <span>{t.listingTotal}</span>
            <span>₺{priceCalc.total.toLocaleString('tr-TR')}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-muted/40 rounded-3xl border border-border/60 flex gap-4 items-start">
        <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Rotaly Koruması</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Rezervasyonunuz acil durumlara ve ev sahibi iptallerine karşı tam güvence altındadır.
          </p>
        </div>
      </div>
    </aside>
  );
}
