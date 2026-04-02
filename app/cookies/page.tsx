'use client';

import { useMemo } from 'react';
import { ContentLayout } from '@/components/layout/content-layout';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/locale-context';

export default function CookiesPage() {
  const { t } = useLocale();

  const sections = useMemo(
    () => [
      {
        title: t.cookiesS1Title as string,
        content: t.cookiesS1Content as string,
        examples: t.cookiesS1Examples as string[],
      },
      {
        title: t.cookiesS2Title as string,
        content: t.cookiesS2Content as string,
        examples: t.cookiesS2Examples as string[],
      },
      {
        title: t.cookiesS3Title as string,
        content: t.cookiesS3Content as string,
        examples: t.cookiesS3Examples as string[],
      },
      {
        title: t.cookiesS4Title as string,
        content: t.cookiesS4Content as string,
        examples: t.cookiesS4Examples as string[],
      },
      {
        title: t.cookiesS5Title as string,
        content: t.cookiesS5Content as string,
        examples: t.cookiesS5Examples as string[],
      },
    ],
    [t],
  );

  return (
    <ContentLayout title={t.cookiesPageTitle as string} subtitle={t.cookiesPageSubtitle as string}>
      <div className="space-y-16 py-10">
        <section className="prose prose-slate prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed">{t.cookiesIntro as string}</p>
        </section>

        <div className="grid gap-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-full bg-foreground text-background text-sm flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                {section.title}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed pl-11">{section.content}</p>
              {section.examples && (
                <ul className="pl-11 space-y-1.5">
                  {section.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-foreground/40" />
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <section className="bg-muted p-10 rounded-[2.5rem] mt-20 text-center space-y-6">
          <h4 className="text-xl font-bold">{t.cookiesQuestionsTitle as string}</h4>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.cookiesQuestionsBody as string}
          </p>
        </section>
      </div>
    </ContentLayout>
  );
}
