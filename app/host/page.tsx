'use client';

import { motion } from 'framer-motion';
import { Home, Shield, Zap, TrendingUp, Users, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';

export default function HostLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556912177-c54030639a4c?w=1600&h=900&fit=crop&auto=format"
            alt="Hosting on Rotaly"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white mb-6"
            >
              Rotaly ile Ev Sahibi Olun
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/90 mb-8 font-medium"
            >
              Dünyanın her yerinden misafirleri ağırlayın ve ek gelir elde edin.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-7 rounded-2xl text-xl font-bold">
                Hemen Başlayın
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Neden Rotaly'de Ev Sahibi Olmalısınız?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Size güvenli, kolay ve kârlı bir ev sahipliği deneyimi sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "Güvenli Koruma",
                description: "Misafirleriniz ve eviniz için kapsamlı sigorta ve güvenlik önlemleri sağlıyoruz."
              },
              {
                icon: Zap,
                title: "Kolay Yönetim",
                description: "Kullanıcı dostu panelimizle rezervasyonları ve takviminizi kolayca yönetin."
              },
              {
                icon: TrendingUp,
                title: "Ek Gelir",
                description: "Boş alanınızı değerlendirerek düzenli ve yüksek kazanç elde edin."
              }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-[2.5rem] border border-border hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-muted py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden bg-foreground text-background flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-12 md:p-20">
              <h2 className="text-4xl font-black mb-6">Hala Sorularınız mı Var?</h2>
              <p className="text-background/70 text-lg mb-8">
                Ev sahipliği hakkında daha fazla bilgi almak için rehberimize göz atın veya destek ekibimizle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="border-background text-background hover:bg-background hover:text-foreground rounded-2xl font-bold px-8">
                  <Link href="/host/resources">Kaynaklar</Link>
                </Button>
                <Button variant="outline" className="border-background text-background hover:bg-background hover:text-foreground rounded-2xl font-bold px-8">
                  <Link href="/host/support">Destek Al</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative h-[400px] w-full">
              <Image
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=800&fit=crop&auto=format"
                alt="Support"
                fill
                className="object-cover opacity-80"
              />
            </div>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
