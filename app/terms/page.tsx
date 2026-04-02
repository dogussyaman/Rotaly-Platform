'use client';

import { useMemo } from 'react';
import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const { t } = useLocale();

  const terms = useMemo(
    () => [
      { title: t.termsS1Title as string, content: t.termsS1Content as string },
      { title: t.termsS2Title as string, content: t.termsS2Content as string },
      { title: t.termsS3Title as string, content: t.termsS3Content as string },
      { title: t.termsS4Title as string, content: t.termsS4Content as string },
      { title: t.termsS5Title as string, content: t.termsS5Content as string },
      { title: t.termsS6Title as string, content: t.termsS6Content as string },
    ],
    [t],
  );

  return (
    <ContentLayout title={t.termsTitle as string} subtitle={t.termsPageSubtitle as string}>
      <div className="py-10 space-y-16">
        <section className="bg-foreground text-background rounded-[2.5rem] p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4">
              <Badge className="bg-emerald-400 text-foreground font-bold border-none px-3 py-1 uppercase tracking-wider text-[10px]">
                {t.termsBadge as string}
              </Badge>
              <h2 className="text-3xl font-bold text-white max-w-md">{t.termsBannerTitle as string}</h2>
              <p className="text-gray-400 max-w-sm leading-relaxed">{t.termsBannerBody as string}</p>
            </div>
            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
              <svg className="w-20 h-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3 6-6M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0z" />
              </svg>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-10">
          {terms.map((term, index) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 border border-border/60 bg-card rounded-3xl hover:border-foreground/20 transition-all shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4 text-foreground">{term.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{term.content}</p>
            </motion.div>
          ))}
        </div>

        <section className="prose prose-slate max-w-none text-muted-foreground italic text-center text-sm pt-8">
          <p>{t.termsFootnote as string}</p>
        </section>
      </div>
    </ContentLayout>
  );
}
