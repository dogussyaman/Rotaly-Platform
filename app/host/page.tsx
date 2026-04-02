'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, CheckCircle2, Clock3, BadgeDollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n/locale-context';

export default function HostLandingPage() {
  const { t } = useLocale();

  const highlights = useMemo(
    () => [
      {
        icon: Shield,
        title: t.hostLandingHl1Title as string,
        description: t.hostLandingHl1Desc as string,
      },
      {
        icon: Zap,
        title: t.hostLandingHl2Title as string,
        description: t.hostLandingHl2Desc as string,
      },
      {
        icon: TrendingUp,
        title: t.hostLandingHl3Title as string,
        description: t.hostLandingHl3Desc as string,
      },
    ],
    [t],
  );

  const steps = useMemo(
    () => [
      {
        icon: CheckCircle2,
        title: t.hostLandingStep1Title as string,
        description: t.hostLandingStep1Desc as string,
      },
      {
        icon: Clock3,
        title: t.hostLandingStep2Title as string,
        description: t.hostLandingStep2Desc as string,
      },
      {
        icon: BadgeDollarSign,
        title: t.hostLandingStep3Title as string,
        description: t.hostLandingStep3Desc as string,
      },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="pt-24 pb-20 space-y-20">
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-6 rounded-4xl border border-border/70 bg-card p-8 md:p-10 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.14)]"
            >
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {t.hostLandingBadge as string}
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-foreground">
                {t.hostLandingHeroTitle as string}
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t.hostLandingHeroSubtitle as string}
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="rounded-xl px-7 font-semibold">
                  <Link href="/dashboard/listings/new">{t.hostLandingCtaListing as string}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl px-7 font-semibold">
                  <Link href="/host/resources">{t.hostLandingCtaGuide as string}</Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                  <p className="text-lg font-black text-foreground">24/7</p>
                  <p className="text-xs text-muted-foreground">{t.hostLandingStat247Label as string}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                  <p className="text-lg font-black text-foreground">%0</p>
                  <p className="text-xs text-muted-foreground">{t.hostLandingStat0Label as string}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                  <p className="text-lg font-black text-foreground">1</p>
                  <p className="text-xs text-muted-foreground">{t.hostLandingStatPanelLabel as string}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="lg:col-span-6 relative min-h-105 rounded-4xl overflow-hidden border border-border/70"
            >
              <Image
                src="https://images.unsplash.com/photo-1556912177-c54030639a4c?w=1600&h=1100&fit=crop&auto=format"
                alt={t.hostLandingImageAlt as string}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 p-4">
                <p className="text-sm font-semibold text-foreground">{t.hostLandingCardTitle as string}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.hostLandingCardSubtitle as string}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                {t.hostLandingWhyTitle as string}
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">{t.hostLandingWhySubtitle as string}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_8px_20px_-16px_rgba(0,0,0,0.18)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-7xl mx-auto rounded-4xl border border-border/70 bg-muted/35 p-7 md:p-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {t.hostLandingStepsTitle as string}
            </h2>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.title} className="rounded-2xl bg-card border border-border/70 p-5">
                  <step.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-7xl mx-auto rounded-4xl overflow-hidden border border-border/70 bg-foreground text-background grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black">{t.hostLandingCta2Title as string}</h2>
              <p className="mt-3 text-background/75 max-w-2xl">{t.hostLandingCta2Desc as string}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-background/70 bg-transparent text-background hover:bg-background hover:text-foreground font-semibold"
                >
                  <Link href="/host/resources">{t.hostLandingResourcesBtn as string}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-background/70 bg-transparent text-background hover:bg-background hover:text-foreground font-semibold"
                >
                  <Link href="/host/support">{t.hostLandingSupportBtn as string}</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5 relative min-h-65 lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&h=900&fit=crop&auto=format"
                alt={t.hostLandingSupportImageAlt as string}
                fill
                className="object-cover opacity-85"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
