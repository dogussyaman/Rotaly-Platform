'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Globe, Heart, Sparkles } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-linear-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-24 text-center text-white overflow-hidden mb-20"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Globe className="absolute -right-20 -top-20 w-96 h-96" />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 relative z-10"
          >
            Rotaly Topluluğu
          </motion.h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed relative z-10 font-medium">
            Birlikte daha güçlü, daha kapsayıcı ve daha sürdürülebilir bir gelecek inşa ediyoruz. Topluluğumuzun kalbi burada atıyor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-card p-12 rounded-[2.5rem] border border-border flex flex-col items-center text-center">
            <Sparkles className="w-16 h-16 text-amber-500 mb-8" />
            <h2 className="text-3xl font-black mb-6">StayHub.org</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Kar amacı gütmeyen kuruluşlar için konaklama çözümleri sunduğumuz projemiz. Dünyayı daha yaşanabilir kılmak için sosyal sorumluluk projelerini destekliyoruz.
            </p>
            <button className="bg-foreground text-background font-bold px-10 py-4 rounded-2xl hover:bg-primary hover:text-white transition-all">Daha Fazla Bilgi</button>
          </div>

          <div className="bg-card p-12 rounded-[2.5rem] border border-border flex flex-col items-center text-center">
            <Heart className="w-16 h-16 text-rose-500 mb-8" />
            <h2 className="text-3xl font-black mb-6">Sosyal Etki</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Yerel topluluklara doğrudan destek sağlıyoruz. Rotaly üzerinden her rezervasyon, sürdürülebilir turizm projelerine katkıda bulunuyor.
            </p>
            <button className="bg-foreground text-background font-bold px-10 py-4 rounded-2xl hover:bg-primary hover:text-white transition-all">Raporu Oku</button>
          </div>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
