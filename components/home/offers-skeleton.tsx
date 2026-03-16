'use client';

import { Sparkles } from 'lucide-react';

interface OffersHeaderProps {
  title: string;
  subtitle: string;
}

export function OffersHeader({ title, subtitle }: OffersHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-black text-foreground/80 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          {title}
        </div>
        <p className="mt-3 text-2xl font-bold text-foreground tracking-tight">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export function OffersSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`offers-skeleton-${i}`}
          className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-sm animate-pulse"
        >
          <div className="aspect-[4/3] rounded-2xl bg-muted/60" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-3/4 rounded-full bg-muted/60" />
            <div className="h-3 w-1/2 rounded-full bg-muted/60" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-4 w-20 rounded-full bg-muted/60" />
            <div className="h-4 w-10 rounded-full bg-muted/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OffersSectionSkeleton({ t }: { t: any }) {
  const title = (t.offersTitle as string) || 'Firsatlar';
  const subtitle =
    (t.offersSubtitle as string) || 'Belirli tarihlerde indirimli konaklamalar';

  return (
    <section className="bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <OffersHeader title={title} subtitle={subtitle} />
        <OffersSkeletonGrid />
      </div>
    </section>
  );
}
