'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Lock, Eye, LifeBuoy, AlertTriangle } from 'lucide-react';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';

export default function SafetyPage() {
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
          <h1 className="text-5xl md:text-6xl font-black mb-6">Önce Güvenlik</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Rotaly ailesi olarak güvenliğiniz bizim bir numaralı önceliğimizdir. Her seyahatin huzur içinde geçmesi için çalışıyoruz.
          </p>
        </motion.div>

        <div className="space-y-16">
          {[
            {
              icon: UserCheck,
              title: "Kimlik Doğrulama",
              text: "Tüm ev sahipleri ve misafirler, topluluğumuza katılmadan önce kapsamlı bir kimlik doğrulama sürecinden geçer."
            },
            {
              icon: Lock,
              title: "Güvenli Ödemeler",
              text: "Ödemeleriniz her zaman Rotaly üzerinden güvenle işlenir ve misafir giriş yapana kadar ev sahibine aktarılmaz."
            },
            {
              icon: Eye,
              title: "7/24 İzleme",
              text: "Sistemimiz şüpheli aktiviteleri tespit etmek için sürekli çalışır ve olası sorunları önceden engeller."
            },
            {
              icon: LifeBuoy,
              title: "Global Destek",
              text: "Dünyanın neresinde olursanız olun, acil durumlarda yanınızda olan bir destek ekibimiz var."
            },
            {
              icon: AlertTriangle,
              title: "Hasar Koruması",
              text: "Ev sahiplerimiz için her rezervasyonda geçerli olan geniş kapsamlı hasar ve sorumluluk koruması sağlıyoruz."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
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
          <h2 className="text-3xl font-black mb-6">Daha fazla yardıma mı ihtiyacınız var?</h2>
          <p className="opacity-80 mb-8 text-lg">Güvenlik ipuçlarını içeren detaylı rehberimize göz atın.</p>
          <button className="bg-primary text-white font-bold px-10 py-5 rounded-2xl hover:bg-primary/90 transition-all">
            Güvenlik Rehberi
          </button>
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
