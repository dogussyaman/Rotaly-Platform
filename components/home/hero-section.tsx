'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { HeroSearchBar } from '@/components/search/hero-search-bar';
import { Badge } from '../ui/badge';

interface HeroSectionProps {
    t: any;
}

export function HeroSection({ t }: HeroSectionProps) {
    return (
        <section
            className="relative flex flex-col min-h-[460px] sm:min-h-[520px]"
            style={{
                background: 'linear-gradient(175deg, #b8d4e8 0%, #cfe2f0 40%, #deeaf5 70%, #eef4f9 100%)',
            }}
        >
            {/* Background building photo */}
            <div
                className="absolute inset-0 pointer-events-none select-none"
                aria-hidden="true"
                style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1800&h=900&fit=crop)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 20%',
                    opacity: 0.25,
                }}
            />

            {/* Nav (fixed, transparent over hero) */}
            <SearchHeader />

            {/* Hero text — centered in hero */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-20 relative z-10">
                {/* Floating location card — sol */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute left-16 top-32 hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/80"
                >
                    <div
                        className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=80&h=80&fit=crop)',
                            backgroundSize: 'cover',
                        }}
                    />
                    <div className="text-left">
                        <div className="text-xs font-bold text-foreground">Istanbul, Turkey</div>
                        <div className="text-xs text-gray-400">595 km uzakta</div>
                    </div>
                </motion.div>

                {/* Floating mini calendar card — sağ */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute right-12 top-28 hidden xl:block bg-white/90 backdrop-blur-md rounded-2xl px-3 py-2.5 shadow-md border border-white/80 select-none scale-90 origin-top-right"
                >
                    {/* Ay başlığı */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black text-foreground uppercase tracking-widest">
                            {new Date().toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    {/* Gün isimleri */}
                    <div className="grid grid-cols-7 gap-0.5 mb-0.5">
                        {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => (
                            <div key={d} className="text-[9px] font-bold text-gray-400 text-center w-6">{d}</div>
                        ))}
                    </div>
                    {/* Günler */}
                    <div className="grid grid-cols-7 gap-0.5">
                        {(() => {
                            const today = new Date();
                            const year = today.getFullYear();
                            const month = today.getMonth();
                            const todayDate = today.getDate();
                            const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
                            // Pazartesi başlangıçlı offset
                            const offset = (firstDay + 6) % 7;
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            const cells = [];
                            for (let i = 0; i < offset; i++) cells.push(null);
                            for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                            return cells.map((d, i) => {
                                // Basit sahte fiyat: sadece görsel amaçlı, daha sade görünüm
                                const basePrice = 1850;
                                const step = 100;
                                const price = d ? basePrice + (d % 4) * step : null;

                                const isToday = d === todayDate;
                                const isTomorrow = d === todayDate + 1;

                                return (
                                    <div
                                        key={i}
                                        className={`w-7 h-8 flex flex-col items-center justify-center rounded-full text-[8px] font-semibold transition-all
                                            ${isToday ? 'bg-foreground text-white font-black' : ''}
                                            ${isTomorrow ? 'bg-foreground/8 text-foreground font-black' : ''}
                                            ${d && !isToday && !isTomorrow ? 'text-gray-700 hover:bg-gray-100' : ''}
                                            ${!d ? '' : 'cursor-pointer'}
                                        `}
                                    >
                                        <span className="leading-tight">{d ?? ''}</span>
                                        {price && (
                                            <span
                                                className={`mt-0.5 text-[7px] text-bold leading-tight ${isToday ? 'text-white/80' : 'text-gray-400'
                                                    } ${price < 1900 ? 'text-green-600' : 'text-gray-400'}`}
                                            >
                                                {price.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                                            </span>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-foreground flex-shrink-0" />
                        <span className="text-[10px] font-bold text-foreground">Bugün müsait</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-7xl lg:text-[6.5rem] font-bold text-foreground tracking-tighter leading-[1.05] sm:leading-none text-balance mb-4 px-1"
                >
                    {t.heroTitle as string}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-sm sm:text-base text-foreground/60 text-balance max-w-sm mb-6 px-1"
                >
                    {t.heroSubtitle as string}
                </motion.p>

                {/* Social proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center justify-center gap-2.5"
                >
                    <div className="flex -space-x-2">
                        {[
                            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&crop=face',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face',
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=face',
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face',
                        ].map((src, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-foreground/60">
                        500k+ {t.lovedBy as string}
                    </span>
                </motion.div>
            </div>

            {/* ── Search bar — overlaps bottom of hero into content below ── */}
            <div id="hero-search-bar" className="relative z-20 px-3 sm:px-6 pb-0">
                <div className="max-w-7xl mx-auto translate-y-1/3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Suspense
                            fallback={
                                <div className="w-full h-20 rounded-2xl bg-white/70 border border-white/80 shadow-lg" />
                            }
                        >
                            <HeroSearchBar />
                        </Suspense>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
