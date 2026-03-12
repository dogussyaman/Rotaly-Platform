'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { BookOpen, Camera, Shield, Star, DollarSign, Layout } from 'lucide-react';

export default function HostResourcesPage() {
  const resources = [
    { icon: BookOpen, title: "Başlangıç Rehberi", color: "bg-blue-500/10 text-blue-600" },
    { icon: Camera, title: "Fotoğraf İpuçları", color: "bg-purple-500/10 text-purple-600" },
    { icon: Shield, title: "Güvenlik Rehberi", color: "bg-green-500/10 text-green-600" },
    { icon: Star, title: "Mükemmel Misafir Deneyimi", color: "bg-amber-500/10 text-amber-600" },
    { icon: DollarSign, title: "Fiyatlandırma Stratejileri", color: "bg-emerald-500/10 text-emerald-600" },
    { icon: Layout, title: "İlanınızı Optimize Edin", color: "bg-rose-500/10 text-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-black mb-6">Ev Sahibi Kaynakları</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Başarılı bir ev sahibi olmanız için ihtiyacınız olan tüm ipuçları, rehberler ve araçlar burada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card p-8 rounded-[2rem] border border-border hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${res.color}`}>
                <res.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{res.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Bu konuda uzmanlaşmak için hazırladığımız detaylı içeriği inceleyin ve ilanınızı bir üst seviyeye taşıyın.
              </p>
              <span className="text-primary font-bold text-sm">Daha Fazla Bilgi →</span>
            </motion.div>
          ))}
        </div>
      </main>
      <MainFooter />
    </div>
  );
}
