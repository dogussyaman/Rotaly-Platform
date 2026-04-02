'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { BookOpen, Camera, Shield, Star, DollarSign, Layout, ArrowRight, CircleCheck, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n/locale-context';

type ResourceItem = {
  icon: LucideIcon;
  title: string;
  summary: string;
  href: string;
  tags: string[];
  color: string;
};

export default function HostResourcesPage() {
  const { t } = useLocale();
  const [query, setQuery] = useState('');

  const resources = useMemo((): ResourceItem[] => {
    return [
      {
        icon: BookOpen,
        title: t.hostRes1Title as string,
        summary: t.hostRes1Summary as string,
        href: '/host/support',
        tags: t.hostRes1Tags as string[],
        color: 'bg-blue-500/10 text-blue-600',
      },
      {
        icon: Camera,
        title: t.hostRes2Title as string,
        summary: t.hostRes2Summary as string,
        href: '/dashboard/listings',
        tags: t.hostRes2Tags as string[],
        color: 'bg-purple-500/10 text-purple-600',
      },
      {
        icon: Shield,
        title: t.hostRes3Title as string,
        summary: t.hostRes3Summary as string,
        href: '/safety',
        tags: t.hostRes3Tags as string[],
        color: 'bg-green-500/10 text-green-600',
      },
      {
        icon: Star,
        title: t.hostRes4Title as string,
        summary: t.hostRes4Summary as string,
        href: '/dashboard/reviews',
        tags: t.hostRes4Tags as string[],
        color: 'bg-amber-500/10 text-amber-600',
      },
      {
        icon: DollarSign,
        title: t.hostRes5Title as string,
        summary: t.hostRes5Summary as string,
        href: '/dashboard/availability',
        tags: t.hostRes5Tags as string[],
        color: 'bg-emerald-500/10 text-emerald-600',
      },
      {
        icon: Layout,
        title: t.hostRes6Title as string,
        summary: t.hostRes6Summary as string,
        href: '/dashboard/listings',
        tags: t.hostRes6Tags as string[],
        color: 'bg-rose-500/10 text-rose-600',
      },
    ];
  }, [t]);

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(q) ||
        resource.summary.toLowerCase().includes(q) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [query, resources]);

  const checklistItems = t.hostResourcesChecklistItems as string[];

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-black">{t.hostResourcesTitle as string}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{t.hostResourcesSubtitle as string}</p>

          <div className="max-w-xl">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hostResourcesSearchPlaceholder as string}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl">
              <Link href="/dashboard/listings/new">{t.hostResourcesNewListing as string}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/dashboard/availability">{t.hostResourcesCalendar as string}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/dashboard/bookings">{t.hostResourcesBookings as string}</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <Link
                href={res.href}
                className="block bg-card p-8 rounded-4xl border border-border hover:border-primary/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${res.color}`}>
                  <res.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{res.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{res.summary}</p>
                <span className="text-primary font-bold text-sm inline-flex items-center gap-2">
                  {t.hostResourcesGoResource as string} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            {t.hostResourcesEmpty as string}
          </div>
        )}

        <section className="rounded-4xl border border-border bg-card p-8 md:p-10">
          <h2 className="text-2xl font-black mb-5">{t.hostResourcesChecklistTitle as string}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {checklistItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
                <CircleCheck className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
