'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { useLocale } from '@/lib/i18n/locale-context';
import { GuideHero } from './_components/GuideHero';
import { GuideSidebar, type GuideSection } from './_components/GuideSidebar';
import { GuideContent } from './_components/GuideContent';

export default function GuidePage() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('booking');

  const query = searchQuery.trim().toLowerCase();
  const includesQuery = (text: string) => (!query ? true : text.toLowerCase().includes(query));

  const faqQuestions = (t.guideFaqQuestions as string[]) ?? [];
  const faqAnswers = (t.guideFaqAnswers as string[]) ?? [];

  const sections: GuideSection[] = useMemo(() => [
    { id: 'booking', icon: Search, title: t.guideBookingTitle as string, intro: t.guideBookingIntro as string, bullets: (t.guideBookingBullets as string[]) ?? [] },
    { id: 'payment', icon: CreditCard, title: t.guidePaymentTitle as string, intro: t.guidePaymentIntro as string, bullets: (t.guidePaymentBullets as string[]) ?? [] },
    { id: 'cancellation', icon: Zap, title: t.guideCancellationTitle as string, intro: t.guideCancellationIntro as string, bullets: (t.guideCancellationBullets as string[]) ?? [] },
    { id: 'rules', icon: Home, title: t.guideRulesTitle as string, intro: t.guideRulesIntro as string, bullets: (t.guideRulesBullets as string[]) ?? [] },
    { id: 'safety', icon: ShieldCheck, title: t.guideSafetyTitle as string, intro: t.guideSafetyIntro as string, bullets: (t.guideSafetyBullets as string[]) ?? [] },
    { id: 'types', icon: Coffee, title: t.guideTypesTitle as string, intro: t.guideTypesIntro as string, bullets: (t.guideTypesBullets as string[]) ?? [] },
    { id: 'tips', icon: MessageSquare, title: t.guideTipsTitle as string, intro: t.guideTipsIntro as string, bullets: (t.guideTipsBullets as string[]) ?? [] },
    { id: 'faq', icon: HelpCircle, title: t.guideFaqTitle as string, intro: t.guideFaqIntro as string, bullets: [] },
  ], [t]);

  const filteredSections = useMemo(() => {
    if (!query) return sections;
    return sections.filter((s) => {
      if (includesQuery(s.title) || includesQuery(s.intro)) return true;
      if (s.id === 'faq') return faqQuestions.some((q, i) => includesQuery(q) || includesQuery(faqAnswers[i] ?? ''));
      return s.bullets.some((b) => includesQuery(b));
    });
  }, [sections, query, faqQuestions, faqAnswers]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const nodes = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
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
        <GuideHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} t={t} />
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <GuideSidebar sections={filteredSections} activeSection={activeSection} onSectionClick={scrollTo} t={t} />
          <GuideContent sections={filteredSections} faqQuestions={faqQuestions} faqAnswers={faqAnswers} includesQuery={includesQuery} t={t} />
        </div>
      </main>
    </div>
  );
}
