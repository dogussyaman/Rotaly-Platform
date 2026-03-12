'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Coffee,
  HelpCircle,
  Home,
  MessageSquare,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n/locale-context';

type GuideSection = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  intro: string;
  bullets: string[];
};

export default function GuidePage() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('booking');

  const query = searchQuery.trim().toLowerCase();
  const includesQuery = (text: string) => (!query ? true : text.toLowerCase().includes(query));

  const heroTitleParts = (t.guideHeroTitleParts as string[]) ?? [];
  const faqQuestions = (t.guideFaqQuestions as string[]) ?? [];
  const faqAnswers = (t.guideFaqAnswers as string[]) ?? [];

  const sections: GuideSection[] = useMemo(() => {
    return [
      {
        id: 'booking',
        icon: Search,
        title: t.guideBookingTitle as string,
        intro: t.guideBookingIntro as string,
        bullets: (t.guideBookingBullets as string[]) ?? [],
      },
      {
        id: 'payment',
        icon: CreditCard,
        title: t.guidePaymentTitle as string,
        intro: t.guidePaymentIntro as string,
        bullets: (t.guidePaymentBullets as string[]) ?? [],
      },
      {
        id: 'cancellation',
        icon: Zap,
        title: t.guideCancellationTitle as string,
        intro: t.guideCancellationIntro as string,
        bullets: (t.guideCancellationBullets as string[]) ?? [],
      },
      {
        id: 'rules',
        icon: Home,
        title: t.guideRulesTitle as string,
        intro: t.guideRulesIntro as string,
        bullets: (t.guideRulesBullets as string[]) ?? [],
      },
      {
        id: 'safety',
        icon: ShieldCheck,
        title: t.guideSafetyTitle as string,
        intro: t.guideSafetyIntro as string,
        bullets: (t.guideSafetyBullets as string[]) ?? [],
      },
      {
        id: 'types',
        icon: Coffee,
        title: t.guideTypesTitle as string,
        intro: t.guideTypesIntro as string,
        bullets: (t.guideTypesBullets as string[]) ?? [],
      },
      {
        id: 'tips',
        icon: MessageSquare,
        title: t.guideTipsTitle as string,
        intro: t.guideTipsIntro as string,
        bullets: (t.guideTipsBullets as string[]) ?? [],
      },
      {
        id: 'faq',
        icon: HelpCircle,
        title: t.guideFaqTitle as string,
        intro: t.guideFaqIntro as string,
        bullets: [],
      },
    ];
  }, [t]);

  const filteredSections = useMemo(() => {
    if (!query) return sections;
    return sections.filter((s) => {
      if (includesQuery(s.title) || includesQuery(s.intro)) return true;
      if (s.id === 'faq') {
        return faqQuestions.some((q, i) => includesQuery(q) || includesQuery(faqAnswers[i] ?? ''));
      }
      return s.bullets.some((b) => includesQuery(b));
    });
  }, [sections, query, faqQuestions, faqAnswers]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0.05, 0.1, 0.2] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SearchHeader />

      <main className="pb-24">
        <section
          className="relative min-h-[420px] flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #f4ede5 0%, #f3f3f3 40%, #ffffff 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1542315192-1f61a6cfa1c9?w=1800&h=900&fit=crop&auto=format"
              alt={t.guideHeroImageAlt as string}
              fill
              className="object-cover opacity-15"
            />
          </div>

          <div className="relative z-10 text-center px-6 pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Badge className="bg-foreground text-background border-none px-5 py-2 rounded-full font-black tracking-widest uppercase">
                {t.guideBadge as string}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                {heroTitleParts?.[0] ?? ''}
                <br />
                <span className="text-amber-600">{heroTitleParts?.[1] ?? ''}</span>
              </h1>
              <p className="max-w-2xl mx-auto text-foreground/60 text-base md:text-lg font-medium">
                {t.guideHeroSubtitle as string}
              </p>
            </motion.div>

            <div className="relative max-w-2xl mx-auto mt-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40" />
              <input
                type="text"
                placeholder={t.guideSearchPlaceholder as string}
                className="w-full h-16 pl-16 pr-6 rounded-[2rem] bg-white/60 border border-black/5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base md:text-lg font-bold shadow-xl backdrop-blur-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 pl-4">
                {t.guideSidebarTitle as string}
              </h3>
              {filteredSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                    activeSection === s.id
                      ? 'bg-amber-500 text-foreground shadow-lg shadow-amber-500/20'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <s.icon
                    className={`w-4 h-4 ${
                      activeSection === s.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  />
                  {s.title}
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-24">
            {filteredSections.length === 0 ? (
              <div className="rounded-[2.5rem] border border-dashed border-border bg-muted/30 p-10 text-center">
                <h2 className="text-xl font-black text-foreground">{t.guideNoResultsTitle as string}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t.guideNoResultsSubtitle as string}</p>
              </div>
            ) : (
              filteredSections.map((s, idx) => (
                <section key={s.id} id={s.id} className="scroll-mt-32 space-y-8">
                  <div className="flex items-center gap-4 text-foreground">
                    <div className="p-3 rounded-2xl bg-muted">
                      <s.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-foreground">{s.title}</h2>
                      <p className="text-sm md:text-base text-muted-foreground font-medium mt-1">{s.intro}</p>
                    </div>
                  </div>

                  {s.id !== 'faq' ? (
                    <div className="rounded-[2.5rem] border border-border bg-card/60 p-8 md:p-10 shadow-sm">
                      <ul className="space-y-3 text-sm md:text-base text-muted-foreground font-medium">
                        {s.bullets.map((b, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {faqQuestions
                        .map((q, i) => ({ q, a: faqAnswers[i] ?? '' }))
                        .filter((item) => includesQuery(item.q) || includesQuery(item.a))
                        .map((item, i) => (
                          <div
                            key={`${item.q}-${i}`}
                            className="rounded-[2.5rem] border border-border bg-card/60 p-8 md:p-10 shadow-sm space-y-2"
                          >
                            <h3 className="text-base md:text-lg font-black text-foreground">{item.q}</h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.a}</p>
                          </div>
                        ))}
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="rounded-[2.5rem] bg-foreground text-background p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <p className="text-xs font-black tracking-widest uppercase text-amber-400">
                          {t.guideProTipBadge as string}
                        </p>
                      </div>
                      <p className="text-sm md:text-base opacity-85 leading-relaxed">
                        {t.guideProTipText as string}
                      </p>
                    </div>
                  )}
                </section>
              ))
            )}
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

