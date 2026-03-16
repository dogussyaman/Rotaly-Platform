'use client';

import type { JSX } from 'react';
import { motion } from 'framer-motion';

const CategoryIcon = ({ id }: { id: string }) => {
    const icons: Record<string, JSX.Element> = {
        beachfront: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 36c0-8.837 7.163-16 16-16s16 7.163 16 16" strokeLinecap="round" />
                <path d="M24 20V10M20 14l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 36h40" strokeLinecap="round" />
            </svg>
        ),
        lakefront: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0" strokeLinecap="round" />
                <path d="M6 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0" strokeLinecap="round" />
                <circle cx="24" cy="16" r="6" />
            </svg>
        ),
        tropical: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <path d="M24 40V20" strokeLinecap="round" />
                <path d="M24 24c-4-8-12-10-16-6 4 2 10 4 16 6z" strokeLinejoin="round" />
                <path d="M24 28c4-8 12-10 16-6-4 2-10 4-16 6z" strokeLinejoin="round" />
                <path d="M24 20c0-8-6-14-10-12 2 4 6 8 10 12z" strokeLinejoin="round" />
            </svg>
        ),
        castles: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <rect x="8" y="20" width="32" height="20" rx="1" />
                <path d="M8 20v-6h6v6M22 20v-6h4v6M34 20v-6h6v6" strokeLinejoin="round" />
                <rect x="18" y="30" width="12" height="10" />
            </svg>
        ),
        farmhouse: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 24l18-14 18 14" strokeLinejoin="round" />
                <rect x="10" y="24" width="28" height="16" rx="1" />
                <rect x="20" y="30" width="8" height="10" />
            </svg>
        ),
        city: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <rect x="16" y="10" width="16" height="30" />
                <rect x="6" y="20" width="10" height="20" />
                <rect x="32" y="16" width="10" height="24" />
                <path d="M4 40h40" strokeLinecap="round" />
            </svg>
        ),
        mountain: (
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 40l16-28 8 14 4-6 12 20H4z" strokeLinejoin="round" />
            </svg>
        ),
    };
    return icons[id] || null;
};

const CATEGORY_BADGES: Record<string, { color: string; key: 'topRated' | 'trending' }> = {
    beachfront: { color: 'bg-amber-100 text-amber-700', key: 'topRated' },
    lakefront: { color: 'bg-rose-100 text-rose-600', key: 'trending' },
    tropical: { color: 'bg-emerald-100 text-emerald-700', key: 'topRated' },
    castles: { color: 'bg-amber-100 text-amber-700', key: 'topRated' },
    farmhouse: { color: 'bg-rose-100 text-rose-600', key: 'trending' },
    city: { color: 'bg-rose-100 text-rose-600', key: 'trending' },
    mountain: { color: 'bg-amber-100 text-amber-700', key: 'topRated' },
};

const CATEGORY_COUNTS: Record<string, string> = {
    beachfront: '316',
    lakefront: '196',
    tropical: '248',
    castles: '74',
    farmhouse: '126',
    city: '294',
    mountain: '183',
};

// Ana sayfada sadece 6 kategori kartı göster
const CATEGORY_IDS = ['beachfront', 'lakefront', 'tropical', 'castles', 'farmhouse', 'city'];

interface CategoriesSectionProps {
    t: any;
    activeCategory: string;
    setActiveCategory: (id: string) => void;
    catScrollRef: React.RefObject<HTMLDivElement | null>;
}

export function CategoriesSection({
    t,
    activeCategory,
    setActiveCategory,
    catScrollRef,
}: CategoriesSectionProps) {
    const categoryLabels: Record<string, string> = {
        beachfront: t.beachfront as string,
        lakefront: t.lakefront as string,
        tropical: t.tropical as string,
        castles: t.castles as string,
        farmhouse: t.farmhouse as string,
        city: t.city as string,
        mountain: t.mountain as string,
    };

    const badgeLabels: Record<'topRated' | 'trending', string> = {
        topRated: t.topRated as string,
        trending: t.trending as string,
    };

    return (
        <section className="bg-background pt-24 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground">{t.selectCategory as string}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t.categorySubtitle as string}</p>
                </div>

                <div className="py-4">
                    <div
                        ref={catScrollRef}
                        className="flex gap-4 overflow-x-auto pb-2 pr-6 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {CATEGORY_IDS.map(id => {
                            const badge = CATEGORY_BADGES[id];
                            const isActive = activeCategory === id;
                            return (
                                <motion.button
                                    key={id}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setActiveCategory(id)}
                                    className={`flex-shrink-0 w-44 p-4 rounded-2xl border text-left transition-all duration-200 ${
                                        isActive
                                            ? 'border-foreground bg-card shadow-md'
                                            : 'border-border bg-card hover:border-foreground/40 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div
                                            className={`text-foreground transition-opacity ${
                                                isActive ? 'opacity-100' : 'opacity-55'
                                            }`}
                                        >
                                            <CategoryIcon id={id} />
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                                            {badgeLabels[badge.key]}
                                        </span>
                                    </div>
                                    <div className="font-bold text-sm text-foreground">{categoryLabels[id]}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {CATEGORY_COUNTS[id]} {t.categoryPropertyLabel as string}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
