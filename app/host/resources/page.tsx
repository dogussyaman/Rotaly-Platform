'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { BookOpen, Camera, Shield, Star, DollarSign, Layout, ArrowRight, CircleCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HostResourcesPage() {
  const [query, setQuery] = useState('');

  const resources = [
    {
      icon: BookOpen,
      title: 'Başlangıç Rehberi',
      summary: 'İlk ilanınızı açmadan önce temel süreçler, kurallar ve panel kullanımı.',
      href: '/host/support',
      tags: ['başlangıç', 'rehber', 'host'],
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: Camera,
      title: 'Fotoğraf İpuçları',
      summary: 'Dönüşüm getiren kapak görseli, ışık kullanımı ve oda açıları.',
      href: '/dashboard/listings',
      tags: ['fotoğraf', 'kapak', 'ilan'],
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      icon: Shield,
      title: 'Güvenlik Rehberi',
      summary: 'Check-in güvenliği, kimlik doğrulama, acil durum ve ev kuralları.',
      href: '/safety',
      tags: ['güvenlik', 'kimlik', 'kural'],
      color: 'bg-green-500/10 text-green-600',
    },
    {
      icon: Star,
      title: 'Mükemmel Misafir Deneyimi',
      summary: 'Yorum puanını artıran iletişim, temizlik standardı ve karşılama akışı.',
      href: '/dashboard/reviews',
      tags: ['misafir', 'yorum', 'deneyim'],
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      icon: DollarSign,
      title: 'Fiyatlandırma Stratejileri',
      summary: 'Sezonluk fiyat, minimum gece ve kampanya kurgusu ile doluluk artışı.',
      href: '/dashboard/availability',
      tags: ['fiyat', 'sezon', 'kampanya'],
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: Layout,
      title: 'İlanınızı Optimize Edin',
      summary: 'Başlık, açıklama, imkanlar ve kuralları SEO + dönüşüm odaklı düzenleyin.',
      href: '/dashboard/listings',
      tags: ['seo', 'ilan', 'optimizasyon'],
      color: 'bg-rose-500/10 text-rose-600',
    },
  ];

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((resource) =>
      resource.title.toLowerCase().includes(q) ||
      resource.summary.toLowerCase().includes(q) ||
      resource.tags.some((tag) => tag.includes(q)),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-black">Ev Sahibi Kaynak Merkezi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Başarılı bir ev sahibi olmanız için gerekli rehberleri tek sayfada toplayın, arayın ve doğrudan ilgili aksiyona gidin.
          </p>

          <div className="max-w-xl">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kaynak ara: fiyat, güvenlik, fotoğraf..."
              className="h-12 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl">
              <Link href="/dashboard/listings/new">Yeni İlan Oluştur</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/dashboard/availability">Takvim & Fiyat Yönetimi</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/dashboard/bookings">Rezervasyonları Gör</Link>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <Link
                href={res.href}
                className="block bg-card p-8 rounded-4xl border border-border hover:border-primary/50 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${res.color}`}>
                  <res.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{res.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{res.summary}</p>
                <span className="text-primary font-bold text-sm inline-flex items-center gap-2">
                  Kaynağa Git <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Arama kriterine uygun kaynak bulunamadı.
          </div>
        )}

        <section className="rounded-4xl border border-border bg-card p-8 md:p-10">
          <h2 className="text-2xl font-black mb-5">Ev sahiplerinin dikkat etmesi gerekenler</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Takvim güncelliği: overbooking riskini önlemek için müsaitliği günlük kontrol edin.',
              'Temizlik standardı: check-in öncesi tutarlı kontrol listesi uygulayın.',
              'Yanıt süresi: misafir sorularına mümkünse 1 saat içinde dönüş yapın.',
              'Fiyat disiplini: sezon ve etkinlik dönemlerinde özel fiyat kuralı tanımlayın.',
              'Kuralların şeffaflığı: ev kurallarını kısa, net ve ilan üzerinde görünür tutun.',
              'Güvenli ödeme: platform dışı ödeme taleplerini asla kabul etmeyin.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
                <CircleCheck className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
