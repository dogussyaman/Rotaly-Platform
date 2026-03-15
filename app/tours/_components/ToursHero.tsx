'use client';

import { motion } from 'framer-motion';

interface ToursHeroProps {
  heroTitleParts: string[];
  heroSubtitle: string;
}

export function ToursHero({ heroTitleParts, heroSubtitle }: ToursHeroProps) {
  return (
    <section
      className="relative min-h-[520px] w-full flex items-center justify-center overflow-hidden mb-16"
      style={{
        background: 'linear-gradient(175deg, #b8d4e8 0%, #cfe2f0 40%, #deeaf5 70%, #eef4f9 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&h=900&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          opacity: 0.25,
        }}
      />
      <div className="relative z-10 text-center text-foreground px-6 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
        >
          {heroTitleParts?.[0] ?? ''}{' '}
          <span className="text-amber-600">{heroTitleParts?.[1] ?? ''}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-foreground/60"
        >
          {heroSubtitle}
        </motion.p>
      </div>
    </section>
  );
}
