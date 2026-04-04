'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plane, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featuredRoutes = [
  {
    from: 'İstanbul',
    to: 'Paris',
    label: 'Uçuş millerinle konaklamada ekstra avantaj',
    badge: 'Miles + Rotaly',
    saving: 'SkyWings millerini Rotaly üzerinden kiralamada kullan, %15\'e varan tasarruf et.',
  },
  {
    from: 'İzmir',
    to: 'Amsterdam',
    label: 'Tek seferde uçuş + ev kiralama',
    badge: 'Tek seferde planla',
    saving:
      'SkyWings bileti aldıktan sonra Amsterdam’da Rotaly konaklaması yap, kombine rezervasyonda ek indirim yakala.',
  },
  {
    from: 'Ankara',
    to: 'Londra',
    label: 'İş seyahatini şehir deneyimine dönüştür',
    badge: 'Business + Stay',
    saving:
      'Aynı PNR ile Londra uçuşu sonrası Rotaly\'den iş merkezlerine yakın daireler kiralayarak konaklama puanı kazan.',
  },
  {
    from: 'Antalya',
    to: 'Berlin',
    label: 'Festival sezonunda akıllı konaklama',
    badge: 'Sezon fırsatı',
    saving:
      'Festival uçuşunu SkyWings ile al, Rotaly listelerinden konaklama yaptığında ekstra sadakat puanı topla.',
  },
];

export function AirlineRoutesSection() {
  return (
    <section className="bg-background px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Plane className="h-3.5 w-3.5" />
              <span>Uçuşunuzdan sonra konaklamanızı Rotaly ile tamamlayın</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Seçili havayolu rotalarında{' '}
                <span className="text-primary">Rotaly ile çapraz avantajlar</span>.
              </h2>
              <p className="max-w-xl text-sm sm:text-base text-muted-foreground">
                SkyWings ile uçtuğunuzda, varış şehrinizde Rotaly üzerinden ev veya daire kiralayarak ekstra puan,
                indirim ve kampanyalardan yararlanabilirsiniz. Uçuş deneyimini, konaklama ile akıllıca eşleştiriyoruz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Uçuş sonrası konaklamalarda ekstra Rotaly Puan kazan</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl backdrop-blur">
          <motion.div
            className="flex gap-4 px-6 py-6 sm:px-8"
            initial={{ x: 0 }}
            animate={{ x: '-50%' }}
            transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
          >
            {[...featuredRoutes, ...featuredRoutes].map((route, idx) => (
              <motion.div
                key={`${route.from}-${route.to}-${idx}`}
                className="min-w-[260px] sm:min-w-[280px] rounded-2xl border bg-background/70 px-4 py-4 shadow-sm"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Plane className="h-3.5 w-3.5" />
                    <span>
                      {route.from} → {route.to}
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {route.badge}
                  </span>
                </div>
                <p className="text-sm font-semibold">{route.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{route.saving}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Seçili konaklama & uçuşlarda geçerli</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Sınırlı kontenjan</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />

          <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-4">
            <div className="min-w-0 flex-1 text-sm text-muted-foreground">
              <p className="text-balance leading-relaxed">
                <span className="font-medium text-foreground">Nasıl çalışır?</span> SkyWings ile bilet aldıktan sonra
                aynı destinasyonda Rotaly üzerinden konaklama rezervasyonu yap, uçuş + konaklama kombininde ekstra
                avantajlardan yararlan.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="w-full shrink-0 rounded-full px-4 text-sm sm:w-auto"
              variant="outline"
            >
              <Link href="/airline-partners">Uyumlu uçuş & konaklamaları gör</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

