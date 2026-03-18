'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GuideHeroProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  t: Record<string, unknown>;
}

export function GuideHero({ searchQuery, setSearchQuery, t }: GuideHeroProps) {
  const heroTitleParts = (t.guideHeroTitleParts as string[]) ?? [];
  return (
    <section
      className="relative min-h-130 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #b8d4e8 0%, #cfe2f0 40%, #deeaf5 70%, #eef4f9 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
      
      style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&h=900&fit=crop)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 20%',
                    opacity: 0.25,
                }}>
       
      </div>
      <div className="relative z-10 text-center px-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Badge className="bg-foreground text-background border-none px-5 py-2 rounded-full font-black tracking-widest uppercase">
            {t.guideBadge as string}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
            {heroTitleParts?.[0] ?? ''}
            <br />
            <span className="text-amber-600">{heroTitleParts?.[1] ?? ''}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-foreground/60 text-base md:text-lg font-medium">
            {t.guideHeroSubtitle as string}
          </p>
        </motion.div>
        <div className="relative max-w-2xl mx-auto mt-8 mb-4">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/40" />
          <input
            type="text"
            placeholder={t.guideSearchPlaceholder as string}
            className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white/60 border border-black/5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-base md:text-lg font-bold shadow-xl backdrop-blur-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
