'use client';

import { motion } from 'framer-motion';
import { TOUR_CATEGORY_META } from './constants';

interface ToursCategoriesProps {
  categories: string[];
}

export function ToursCategories({ categories }: ToursCategoriesProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-20 overflow-x-auto no-scrollbar">
      <div className="flex gap-4 pb-2">
        {TOUR_CATEGORY_META.map((cat, i) => (
          <motion.button
            key={categories?.[i] ?? i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            type="button"
            className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-card border border-border hover:border-foreground/20 transition-all hover:shadow-lg shrink-0 group"
          >
            <div className={`p-3 rounded-2xl ${cat.color}`}>
              <cat.icon className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm whitespace-nowrap">{categories?.[i] ?? ''}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
