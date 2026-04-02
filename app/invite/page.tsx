'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { Gift, Share2, Copy } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';

export default function InvitePage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex p-5 bg-amber-500/10 rounded-full mb-8">
            <Gift className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="text-5xl font-black mb-6">{t.inviteTitle as string}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.inviteSubtitle as string}</p>
        </motion.div>

        <div className="bg-card p-12 rounded-[3rem] border border-border shadow-2xl space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t.inviteCodeLabel as string}</p>
            <div className="flex items-center justify-center gap-4 bg-muted p-6 rounded-2xl">
              <span className="text-3xl font-black tracking-widest">ROTALY-SUMMER-26</span>
              <button
                type="button"
                className="p-3 bg-white rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                aria-label={t.inviteCodeLabel as string}
              >
                <Copy className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              className="bg-primary text-white font-black px-12 py-5 rounded-2xl text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" /> {t.inviteShareNow as string}
            </button>
          </div>

          <div className="pt-8 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="font-bold mb-2">{t.inviteStep1Title as string}</h4>
              <p className="text-sm text-muted-foreground">{t.inviteStep1Desc as string}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">{t.inviteStep2Title as string}</h4>
              <p className="text-sm text-muted-foreground">{t.inviteStep2Desc as string}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">{t.inviteStep3Title as string}</h4>
              <p className="text-sm text-muted-foreground">{t.inviteStep3Desc as string}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
