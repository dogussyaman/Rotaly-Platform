'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Heart, Shield, Users } from 'lucide-react';

export default function AntiDiscriminationPage() {
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
          <h1 className="text-5xl font-black mb-6">Ayrımcılıkla Mücadele Politikamız</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Rotaly, herkesin kendini evinde hissettiği kapsayıcı bir topluluktur.
          </p>
        </motion.div>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
          <section className="bg-card p-10 rounded-[2.5rem] border border-border">
            <h2 className="text-2xl font-black text-foreground mb-4">Taahhüdümüz</h2>
            <p className="leading-relaxed">
              Rotaly topluluğunun tüm üyeleri; ırk, din, ulusal köken, engellilik hali, cinsiyet, cinsel yönelim veya medeni durum gibi nedenlerle ayrımcılığa uğramadan, saygı ve nezaketle karşılanmayı hak eder.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-10 rounded-[2.5rem] border border-border">
              <Users className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-3">Kapsayıcı Topluluk</h3>
              <p className="text-sm leading-relaxed">Farklılıklarımızı kutluyor ve her kökenden gelen misafir ve ev sahibini destekliyoruz.</p>
            </div>
            <div className="bg-card p-10 rounded-[2.5rem] border border-border">
              <Shield className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-3">Sıfır Tolerans</h3>
              <p className="text-sm leading-relaxed">Ayrımcı davranışlara veya nefret söylemine platformumuzda asla yer yoktur.</p>
            </div>
          </div>

          <section className="bg-muted p-10 rounded-[2.5rem]">
            <h2 className="text-2xl font-black text-foreground mb-4">Sorun Bildirme</h2>
            <p className="leading-relaxed mb-6">
              Herhangi bir ayrımcılık vakasıyla karşılaşırsanız, lütfen bunu derhal ekibimize bildirin. Tüm şikayetler gizlilikle ve ciddiyetle incelenir.
            </p>
            <button className="text-rose-600 font-bold hover:underline">Bir sorun bildir →</button>
          </section>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
