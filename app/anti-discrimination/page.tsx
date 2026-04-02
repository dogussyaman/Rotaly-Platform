'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { Heart, Shield, Users } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';

export default function AntiDiscriminationPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-4 bg-rose-500/10 rounded-3xl mb-6">
            <Heart className="w-12 h-12 text-rose-500" />
          </div>
          <h1 className="text-5xl font-black mb-6">{t.antiHeroTitle as string}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{t.antiHeroSubtitle as string}</p>
        </motion.div>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
          <section className="bg-card p-10 rounded-[2.5rem] border border-border">
            <h2 className="text-2xl font-black text-foreground mb-4">{t.antiCommitmentTitle as string}</h2>
            <p className="leading-relaxed">{t.antiCommitmentBody as string}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-10 rounded-[2.5rem] border border-border">
              <Users className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-3">{t.antiInclusiveTitle as string}</h3>
              <p className="text-sm leading-relaxed">{t.antiInclusiveBody as string}</p>
            </div>
            <div className="bg-card p-10 rounded-[2.5rem] border border-border">
              <Shield className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-3">{t.antiZeroTitle as string}</h3>
              <p className="text-sm leading-relaxed">{t.antiZeroBody as string}</p>
            </div>
          </div>

          <section className="bg-muted p-10 rounded-[2.5rem]">
            <h2 className="text-2xl font-black text-foreground mb-4">{t.antiReportTitle as string}</h2>
            <p className="leading-relaxed mb-6">{t.antiReportBody as string}</p>
            <Link href="/contact" className="text-rose-600 font-bold hover:underline">
              {t.antiReportCta as string}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
