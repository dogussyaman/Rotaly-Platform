'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import Image from 'next/image';

const posts = [
  {
    title: "2026 Yazı İçin En İyi 10 Rota",
    category: "Seyahat",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    date: "12 Mart 2026"
  },
  {
    title: "Ev Sahipliğinde Başarının Sırları",
    category: "Hosting",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
    date: "10 Mart 2026"
  },
  {
    title: "Dijital Göçebeler İçin En İyi Evler",
    category: "Yaşam",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
    date: "8 Mart 2026"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h1 className="text-6xl font-black mb-6">Haberler & Blog</h1>
          <p className="text-xl text-muted-foreground">Rotaly dünyasından en son haberler, seyahat ipuçları ve ilham verici hikayeler.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 mb-6 rounded-[2rem] overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{post.category}</span>
                </div>
              </div>
              <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-muted-foreground text-sm font-medium">{post.date} · 5 dk okuma</p>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
