'use client';

import { useMemo } from 'react';
import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const { t } = useLocale();

  const sections = useMemo(
    () => [
      { title: t.privacyS1Title as string, content: t.privacyS1Content as string },
      { title: t.privacyS2Title as string, content: t.privacyS2Content as string },
      { title: t.privacyS3Title as string, content: t.privacyS3Content as string },
      { title: t.privacyS4Title as string, content: t.privacyS4Content as string },
      { title: t.privacyS5Title as string, content: t.privacyS5Content as string },
    ],
    [t],
  );

  return (
    <ContentLayout title={t.privacyTitle as string} subtitle={t.privacyPageSubtitle as string}>
      <div className="space-y-16 py-10">
        <section className="prose prose-slate prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed">{t.privacyIntro as string}</p>
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
            </motion.div>
          ))}
        </div>

        <section className="bg-muted p-10 rounded-[2.5rem] mt-20 text-center space-y-6">
          <h4 className="text-xl font-bold">{t.privacyQuestionsTitle as string}</h4>
          <p className="text-muted-foreground max-w-xl mx-auto">{t.privacyQuestionsBody as string}</p>
        </section>
      </div>
    </ContentLayout>
  );
}
