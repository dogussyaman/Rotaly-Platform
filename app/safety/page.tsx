'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Lock, Eye, LifeBuoy, AlertTriangle, type LucideIcon } from 'lucide-react';
import { SearchHeader } from '@/components/header/search-header';
import { useLocale } from '@/lib/i18n/locale-context';

export default function SafetyPage() {
  const { t } = useLocale();

  const items: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: UserCheck, title: t.safetyS1Title as string, text: t.safetyS1Text as string },
    { icon: Lock, title: t.safetyS2Title as string, text: t.safetyS2Text as string },
    { icon: Eye, title: t.safetyS3Title as string, text: t.safetyS3Text as string },
    { icon: LifeBuoy, title: t.safetyS4Title as string, text: t.safetyS4Text as string },
    { icon: AlertTriangle, title: t.safetyS5Title as string, text: t.safetyS5Text as string },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-6">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">{t.safetyHeroTitle as string}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{t.safetyHeroSubtitle as string}</p>
        </motion.div>

        <div className="space-y-16">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 items-start"
            >
              <div className="p-4 bg-muted rounded-2xl shrink-0">
                <item.icon className="w-8 h-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-foreground text-background rounded-[3rem] text-center">
          <h2 className="text-3xl font-black mb-6">{t.safetyCtaTitle as string}</h2>
          <p className="opacity-80 mb-8 text-lg">{t.safetyCtaSubtitle as string}</p>
          <Link
            href="/guide"
            className="inline-block bg-primary text-white font-bold px-10 py-5 rounded-2xl hover:bg-primary/90 transition-all"
          >
            {t.safetyCtaButton as string}
          </Link>
        </div>
      </main>
    </div>
  );
}
