'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, CheckCircle2, Clock3, BadgeDollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';

export default function HostLandingPage() {
  const highlights = [
    {
      icon: Shield,
      title: 'Güvenli Koruma',
      description: 'Rezervasyon süreçlerinde eviniz ve geliriniz için ek güvenlik katmanları.',
    },
    {
      icon: Zap,
      title: 'Kolay Yönetim',
      description: 'Uygunluk, fiyat, rezervasyon ve mesajları tek panelden hızlıca yönetin.',
    },
    {
      icon: TrendingUp,
      title: 'Daha Yüksek Kazanç',
      description: 'Dinamik fiyatlama ve kampanya araçlarıyla doluluğu artırın.',
    },
  ];

  const steps = [
    {
      icon: CheckCircle2,
      title: '1. İlanını Oluştur',
      description: 'Otel/oda bilgilerini, görselleri ve kuralları birkaç adımda tamamla.',
    },
    {
      icon: Clock3,
      title: '2. Takvim ve Fiyatı Ayarla',
      description: 'Müsaitlik, özel fiyat ve minimum gece kurallarını belirle.',
    },
    {
      icon: BadgeDollarSign,
      title: '3. Rezervasyonları Yönet',
      description: 'Onay, check-in ve misafir iletişimini profesyonel şekilde yönet.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="pt-24 pb-20 space-y-20">
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-6 rounded-4xl border border-border/70 bg-card p-8 md:p-10 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.14)]"
            >
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Host Programı
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Rotaly ile profesyonel ev sahipliğine başlayın
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Mülkünüzü doğru misafirlerle buluşturun, gelir akışınızı büyütün ve tüm operasyonu tek panelden yönetin.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="rounded-xl px-7 font-semibold">
                  <Link href="/dashboard/listings/new">İlan Oluştur</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl px-7 font-semibold">
                  <Link href="/host/resources">Host Rehberi</Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                  <p className="text-lg font-black text-foreground">24/7</p>
                  <p className="text-xs text-muted-foreground">Destek</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                  <p className="text-lg font-black text-foreground">%0</p>
                  <p className="text-xs text-muted-foreground">Başlangıç Ücreti</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/40 px-3 py-3">
                  <p className="text-lg font-black text-foreground">1 Panel</p>
                  <p className="text-xs text-muted-foreground">Tüm Operasyon</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="lg:col-span-6 relative min-h-105 rounded-4xl overflow-hidden border border-border/70"
            >
              <Image
                src="https://images.unsplash.com/photo-1556912177-c54030639a4c?w=1600&h=1100&fit=crop&auto=format"
                alt="Rotaly host experience"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute left-5 right-5 bottom-5 rounded-2xl bg-background/80 backdrop-blur-md border border-border/60 p-4">
                <p className="text-sm font-semibold text-foreground">Rezervasyon, uygunluk ve mesaj akışını aynı yerden yönetin.</p>
                <p className="text-xs text-muted-foreground mt-1">Daha hızlı karar, daha iyi misafir deneyimi.</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Neden Rotaly Host?</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">Profesyonel ev sahipliği için gereken araçları tek platformda topluyoruz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border/70 bg-card p-6 shadow-[0_8px_20px_-16px_rgba(0,0,0,0.18)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-7xl mx-auto rounded-4xl border border-border/70 bg-muted/35 p-7 md:p-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">3 adımda başlayın</h2>
            <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.title} className="rounded-2xl bg-card border border-border/70 p-5">
                  <step.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6">
          <div className="max-w-7xl mx-auto rounded-4xl overflow-hidden border border-border/70 bg-foreground text-background grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black">Sorularınız mı var?</h2>
              <p className="mt-3 text-background/75 max-w-2xl">
                Host kaynaklarını inceleyin veya destek ekibiyle iletişime geçerek hızlıca yayına alın.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="outline" className="rounded-xl border-background text-background hover:bg-background hover:text-foreground font-semibold">
                  <Link href="/host/resources">Kaynaklar</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-background text-background hover:bg-background hover:text-foreground font-semibold">
                  <Link href="/host/support">Destek Al</Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5 relative min-h-65 lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&h=900&fit=crop&auto=format"
                alt="Host support"
                fill
                className="object-cover opacity-85"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
