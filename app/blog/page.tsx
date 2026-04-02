'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import Image from 'next/image';
import { useLocale } from '@/lib/i18n/locale-context';

export default function BlogPage() {
  const { t } = useLocale();

  const posts = useMemo(
    () => [
      {
        title: t.blogPost1Title as string,
        category: t.blogPost1Cat as string,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
        date: t.blogPost1Date as string,
      },
      {
        title: t.blogPost2Title as string,
        category: t.blogPost2Cat as string,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
        date: t.blogPost2Date as string,
      },
      {
        title: t.blogPost3Title as string,
        category: t.blogPost3Cat as string,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',
        date: t.blogPost3Date as string,
      },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h1 className="text-6xl font-black mb-6">{t.blogTitle as string}</h1>
          <p className="text-xl text-muted-foreground">{t.blogSubtitle as string}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 mb-6 rounded-[2rem] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                    {post.category}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-muted-foreground text-sm font-medium">
                {post.date} · {t.blogReadTime as string}
              </p>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
