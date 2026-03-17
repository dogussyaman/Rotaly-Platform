'use client';

import { motion } from 'framer-motion';
import { Plane, Percent, Sparkles, TicketPercent, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchHeader } from '@/components/header/search-header';

type RouteOption = {
  id: string;
  from: string;
  to: string;
  airlineCode: string;
  airlineName: string;
  tag: string;
  benefit: string;
};

const ROUTES: RouteOption[] = [
  {
    id: 'ist-par',
    from: 'İstanbul',
    to: 'Paris',
    airlineCode: 'SKW123',
    airlineName: 'SkyWings',
    tag: 'Hafta sonu kaçamağı',
    benefit: 'SkyWings ile Paris uçuşu + Rotaly konaklama = uçuşta %10 indirim kuponu',
  },
  {
    id: 'izm-ams',
    from: 'İzmir',
    to: 'Amsterdam',
    airlineCode: 'SKW452',
    airlineName: 'SkyWings',
    tag: 'Şehir keşfi',
    benefit: 'Tek PNR ile uçuş & ev kiralama, her ikisinde de sadakat puanı',
  },
  {
    id: 'ank-lon',
    from: 'Ankara',
    to: 'Londra',
    airlineCode: 'SKW890',
    airlineName: 'SkyWings',
    tag: 'İş + şehir deneyimi',
    benefit: 'İş seyahatinde şehir merkezine yakın dairelerde konaklayana ekstra uçuş mili',
  },
];

const STAYS = [
  {
    id: 'stay-1',
    title: 'Le Marais Loft by Rotaly',
    city: 'Paris',
    distance: 'Merkeze 5 dk',
    perk: 'Uçuş kuponu ile birlikte %8 ekstra indirim',
  },
  {
    id: 'stay-2',
    title: 'Canalside Apartment',
    city: 'Amsterdam',
    distance: 'Kanallara 2 dk',
    perk: 'Sadakat puanları ile birleştirilebilir',
  },
  {
    id: 'stay-3',
    title: 'City Bridge Residence',
    city: 'Londra',
    distance: 'Finans merkezine 7 dk',
    perk: 'İş seyahatleri için fatura dostu',
  },
];

export default function AirlinePartnersPage() {
  const selectedRoute = ROUTES[0];

  return (
    <div className="min-h-screen bg-background px-6 pb-16 pt-24">
      {/* Global nav */}
      <SearchHeader />

      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-10">
        {/* Hero row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Plane className="h-3.5 w-3.5" />
              <span>Uyumlu uçuş & konaklama</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Aynı rotada uçuşunuzu ve konaklamanızı{' '}
                <span className="text-primary">birlikte avantajlı planlayın.</span>
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                SkyWings ile belirli rotalara uçarken, varış şehrinizde Rotaly üzerinden ev veya daire kiraladığınızda
                havayolu tarafında kullanabileceğiniz ek kuponlar ve sadakat avantajları kazanırsınız.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                <TicketPercent className="h-3.5 w-3.5" />
                <span>Onaylanan her Rotaly rezervasyonunda uçuş için indirim kuponu</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Kupon kodları SkyWings hesabınızla eşleştirilir</span>
              </div>
            </div>
          </div>

          {/* Plane animation */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-48 w-full max-w-xs overflow-hidden rounded-3xl border bg-gradient-to-br from-sky-50 via-white to-amber-50 p-4 shadow-sm">
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-x-4 top-8 h-16 rounded-full bg-gradient-to-r from-sky-100/80 via-white/90 to-amber-50/80 blur-2" />
                <div className="absolute inset-x-6 bottom-10 h-px bg-gradient-to-r from-sky-200 via-slate-200 to-amber-200" />
              </motion.div>

              <motion.div
                className="relative flex h-full items-center justify-center"
                initial={{ x: -40, y: 10, rotate: -8 }}
                animate={{ x: 40, y: -4, rotate: 4 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 4,
                  ease: 'easeInOut',
                }}
              >
                <Plane className="h-16 w-16 text-sky-500 drop-shadow-md" />
              </motion.div>

              <motion.div
                className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-black/80 px-3 py-1 text-[11px] font-medium text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>Uçuş sonrası Rotaly indirimi</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Booking-like layout */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Route selector & booking summary */}
          <div className="space-y-4 rounded-3xl border bg-card/80 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">Rotaları keşfet</p>
              <span className="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
                3 uyumlu uçuş + konaklama örneği
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {ROUTES.map((route) => (
                <button
                  key={route.id}
                  className={`rounded-2xl border px-3 py-3 text-left text-xs transition-colors ${
                    route.id === selectedRoute.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-background/60 hover:border-primary/40'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-semibold">
                      {route.from} → {route.to}
                    </span>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {route.airlineCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{route.tag}</p>
                </button>
              ))}
            </div>

            <div className="mt-2 grid gap-4 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 px-4 py-4 text-xs sm:grid-cols-[1.5fr_1fr]">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-sky-700">
                  <Percent className="h-3.5 w-3.5" />
                  <span>Örnek senaryo: {selectedRoute.from} → {selectedRoute.to}</span>
                </div>
                <p className="font-semibold text-foreground">{selectedRoute.benefit}</p>
                <p className="text-[11px] text-muted-foreground">
                  Uçuşunuz SkyWings üzerinden, konaklamanız Rotaly üzerinden gerçekleşir. Rotaly rezervasyonu
                  onaylandığında, SkyWings hesabınıza otomatik olarak bir uçuş indirim kuponu tanımlanır.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-sky-100 bg-white/70 p-3">
                <p className="text-[11px] font-semibold text-sky-900">Kupon örneği</p>
                <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-sky-900">ROTALY-SKYWINGS-10</span>
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      %10 uçuş indirimi
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-sky-800">
                    Sadece SkyWings web sitesi ve mobil uygulamasında, seçili economy ve premium economy sınıflarında
                    geçerlidir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Curated stays list */}
          <div className="space-y-3 rounded-3xl border bg-card/80 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">Bu rotalarla eşleşen konaklamalar</p>
              <span className="text-[11px] text-muted-foreground">Konsept gösterim • Gerçek zamanlı değil</span>
            </div>

            <div className="space-y-3">
              {STAYS.map((stay) => (
                <div
                  key={stay.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border bg-background/60 px-3 py-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{stay.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {stay.city} • {stay.distance}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">{stay.perk}</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full px-3 text-[11px]">
                    Detayları gör
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-1 flex items-center justify-between gap-3 rounded-2xl bg-muted/60 px-3 py-3 text-[11px] text-muted-foreground">
              <p>
                Bu sayfadaki içerik,{' '}
                <span className="font-medium text-foreground">havayolu + Rotaly entegrasyonu için örnek akışı</span>{' '}
                gösterir. Gerçek entegrasyonda uçuş arama, PNR eşleştirme ve kupon üretimi backend tarafından
                yönetilecektir.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-3xl border bg-card/90 px-5 py-4 text-xs sm:flex-row sm:text-sm">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <TicketPercent className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Havayolu ortağınızla ortak kampanya planlayın</p>
              <p className="text-xs text-muted-foreground">
                Uçuş sonrası konaklama akışını sizin markanıza göre özelleştirip, Rotaly üzerinden çapraz kampanyalar
                oluşturabiliriz.
              </p>
            </div>
          </div>
          <Button className="w-full justify-center rounded-full px-5 text-xs sm:w-auto sm:text-sm">
            Ortak pazarlama için ekiple iletişime geçin
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

