'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  Ticket,
  Tag,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DealListing {
  id: string;
  title: string;
  city: string;
  country: string;
  pricePerNight: number;
  discountPercent: number;
  rating: number;
  image: string;
}

type TicketState = 'idle' | 'visible' | 'minimized' | 'dismissed';

function buildDates() {
  const today = new Date();
  const offsetDays = 7 + ((today.getDate() * 3 + today.getMonth() * 7) % 38);
  const nights = 2 + (today.getDate() % 4);

  const ci = new Date(today);
  ci.setDate(today.getDate() + offsetDays);
  const co = new Date(ci);
  co.setDate(ci.getDate() + nights);

  const fmt = (d: Date) =>
    d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

  return {
    checkIn: ci.toISOString().slice(0, 10),
    checkOut: co.toISOString().slice(0, 10),
    checkInFmt: fmt(ci),
    checkOutFmt: fmt(co),
    nights,
  };
}

function seatsLeft(id: string) {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (code % 4) + 1;
}

async function fetchRandomDeal(): Promise<DealListing | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('listings')
    .select(
      `id, title, city, country, price_per_night, discount_percent, rating,
       listing_images ( url, is_primary, sort_order )`,
    )
    .eq('is_active', true)
    .gt('rating', 4)
    .limit(40);

  if (error || !data || data.length === 0) return null;

  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const row = data[weekNum % data.length] as {
    id: string;
    title: string;
    city: string;
    country: string;
    price_per_night: number;
    discount_percent: number | null;
    rating: number;
    listing_images: { url: string; is_primary: boolean; sort_order: number }[];
  };

  const images = (row.listing_images ?? [])
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.sort_order - b.sort_order;
    })
    .map((img) => img.url);

  const rawDiscount = row.discount_percent ? Number(row.discount_percent) : 0;
  const discount =
    rawDiscount > 0 ? rawDiscount : 8 + (row.id.charCodeAt(0) % 15);

  return {
    id: row.id,
    title: row.title,
    city: row.city,
    country: row.country,
    pricePerNight: Number(row.price_per_night),
    discountPercent: discount,
    rating: Number(row.rating) || 4.8,
    image:
      images[0] ??
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
  };
}

const spring = { type: 'spring', stiffness: 300, damping: 32 } as const;

export function WeeklyDealTicket({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
}) {
  const [deal, setDeal] = useState<DealListing | null>(null);
  const [state, setState] = useState<TicketState>('idle');
  const dates = useMemo(() => buildDates(), []);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchRandomDeal().then(setDeal);
  }, []);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((prev) => (prev === 'dismissed' ? 'dismissed' : 'visible'));
        } else {
          setState((prev) => (prev === 'visible' ? 'minimized' : prev));
        }
      },
      { threshold: 0.15 },
    );

    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [targetRef]);

  if (!deal || state === 'idle' || state === 'dismissed') return null;

  const discounted = Math.round(
    deal.pricePerNight * (1 - deal.discountPercent / 100),
  );
  const total = discounted * dates.nights;
  const seats = seatsLeft(deal.id);

  return (
    <>
      {/* ── MINIMIZED TAB — own fixed container ── */}
      <AnimatePresence>
        {state === 'minimized' && (
          <motion.button
            key="tab"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={spring}
            className="fixed right-0 top-1/2 z-50 -translate-y-1/2 flex flex-col items-center gap-2 rounded-l-2xl border border-r-0 border-white/10 bg-zinc-900 px-3 py-5 text-white shadow-2xl dark:bg-zinc-800"
            onClick={() => setState('visible')}
            aria-label="Haftanın fırsatını aç"
          >
            <Ticket className="h-4 w-4 rotate-90" />
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ writingMode: 'vertical-rl' }}
            >
              Haftanın Fırsatı
            </span>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── FULL TICKET — own fixed container ── */}
      <AnimatePresence>
        {state === 'visible' && (
          <motion.div
            key="ticket"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ...spring, delay: 0.06 }}
            className="fixed right-0 top-1/2 z-50 w-[295px] -translate-y-1/2 overflow-hidden rounded-l-3xl bg-white shadow-2xl dark:bg-zinc-900"
            style={{
              boxShadow:
                '-8px 0 40px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            {/* Hero image */}
            <div className="relative h-[148px] w-full overflow-hidden">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
                sizes="295px"
                priority={false}
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

              {/* Discount pill */}
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-[3px] text-[11px] font-black text-white shadow-md">
                <Tag className="h-3 w-3" />
                %{deal.discountPercent} İndirim
              </div>

              {/* Dismiss */}
              <button
                onClick={() => setState('dismissed')}
                className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-[2px] transition-colors hover:bg-black/55"
                aria-label="Tamamen kapat"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Rating */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-[2px] text-[11px] font-semibold text-zinc-800 shadow">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {deal.rating.toFixed(2).replace('.', ',')}
              </div>
            </div>

            {/* Tear — top */}
            <TearLine />

            {/* Body */}
            <div className="space-y-3 px-4 pt-2 pb-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" />
                Haftanın Fırsatı
              </div>

              <div>
                <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-foreground">
                  {deal.title}
                </h3>
                <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {deal.city}, {deal.country}
                </div>
              </div>

              {/* Date bar */}
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-[7px] text-[12px]">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {dates.checkInFmt} – {dates.checkOutFmt}
                </span>
                <span className="ml-auto text-muted-foreground">
                  {dates.nights} gece
                </span>
              </div>

              {/* Price + seats */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-muted-foreground line-through">
                    ₺{deal.pricePerNight.toLocaleString('tr-TR')} / gece
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[18px] font-black text-foreground">
                      ₺{discounted.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      / gece
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Toplam ₺{total.toLocaleString('tr-TR')}
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 px-2.5 py-1.5 text-center dark:bg-emerald-950/40">
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    Son {seats} yer
                  </div>
                  <div className="text-[9px] text-emerald-600/70 dark:text-emerald-500/60">
                    bu tarihte
                  </div>
                </div>
              </div>
            </div>

            {/* Tear — bottom */}
            <TearLine />

            {/* CTA footer */}
            <div className="space-y-2 px-4 pt-2 pb-4">
              <Link
                href={`/listing/${deal.id}?from=${dates.checkIn}&to=${dates.checkOut}`}
                className="block w-full rounded-2xl bg-primary py-2.5 text-center text-[13px] font-bold text-primary-foreground transition hover:brightness-105 active:scale-[0.98]"
                onClick={() => setState('dismissed')}
              >
                Fırsatı Kapat ✓
              </Link>
              <button
                onClick={() => setState('minimized')}
                className="block w-full text-center text-[11px] text-muted-foreground transition hover:text-foreground"
              >
                Şimdilik gizle
              </button>
            </div>

            {/* Barcode */}
            <Barcode id={deal.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TearLine() {
  return (
    <div className="relative my-0 flex h-6 items-center overflow-hidden">
      <div className="absolute -left-3.5 h-7 w-7 rounded-full bg-background" />
      <div className="absolute -right-3.5 h-7 w-7 rounded-full bg-background" />
      <div className="mx-4 flex-1 border-t-[1.5px] border-dashed border-border/70" />
    </div>
  );
}

function Barcode({ id }: { id: string }) {
  const bars = id
    .slice(0, 24)
    .split('')
    .map((c) => c.charCodeAt(0));

  return (
    <div className="flex h-9 items-center gap-[2px] bg-muted/40 px-4">
      {bars.map((code, i) => (
        <div
          key={i}
          className="rounded-[1px] bg-foreground/20"
          style={{
            width: code % 3 === 0 ? 3 : 1.5,
            height: code % 5 === 0 ? 26 : code % 2 === 0 ? 18 : 12,
          }}
        />
      ))}
      <div className="ml-auto font-mono text-[8px] tracking-[0.2em] text-muted-foreground">
        RTL-{id.slice(0, 6).toUpperCase()}
      </div>
    </div>
  );
}
