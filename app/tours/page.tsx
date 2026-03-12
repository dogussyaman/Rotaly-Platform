'use client';

import { useState } from 'react';

import { useLocale } from '@/lib/i18n/locale-context';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    Compass,
    MapPin,
    Star,
    Clock,
    Users,
    Layers,
    Camera,
    Trees,
    Waves,
    Mountain,
    Utensils
} from 'lucide-react';
import Image from 'next/image';

const TOUR_CATEGORY_META = [
    { icon: Compass, color: 'bg-amber-100 text-amber-600' },
    { icon: Mountain, color: 'bg-sky-100 text-sky-600' },
    { icon: Utensils, color: 'bg-rose-100 text-rose-600' },
    { icon: Trees, color: 'bg-emerald-100 text-emerald-600' },
    { icon: Camera, color: 'bg-indigo-100 text-indigo-600' },
    { icon: Waves, color: 'bg-cyan-100 text-cyan-600' },
] as const;

const TOUR_GRADIENTS = [
    'from-amber-500 to-orange-600',
    'from-sky-500 to-blue-700',
    'from-emerald-500 to-teal-700',
    'from-violet-500 to-purple-700',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-pink-700',
];

const MOCK_TOURS_BASE = [
    {
        id: '1',
        price: 4500,
        rating: 4.98,
        reviews: 1240,
        maxGuests: 12,
        image: 'https://images.unsplash.com/photo-1544833055-175c0cfcebb0?w=800&h=600&fit=crop&auto=format',
        gradient: 'from-amber-500 to-orange-600',
        titleIndex: 0,
        locationIndex: 0,
        durationIndex: 0,
        badgeIndex: 0,
    },
    {
        id: '2',
        price: 2200,
        rating: 4.85,
        reviews: 856,
        maxGuests: 50,
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop&auto=format',
        gradient: 'from-sky-500 to-indigo-700',
        titleIndex: 1,
        locationIndex: 1,
        durationIndex: 1,
        badgeIndex: 1,
    },
    {
        id: '3',
        price: 1800,
        rating: 4.92,
        reviews: 2100,
        maxGuests: 15,
        image: 'https://images.unsplash.com/photo-1558642891-54be180ea339?w=800&h=600&fit=crop&auto=format',
        gradient: 'from-stone-600 to-amber-800',
        titleIndex: 2,
        locationIndex: 2,
        durationIndex: 2,
        badgeIndex: 2,
    },
    {
        id: '4',
        price: 3800,
        rating: 4.99,
        reviews: 450,
        maxGuests: 1,
        image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=600&fit=crop&auto=format',
        gradient: 'from-cyan-500 to-sky-700',
        titleIndex: 3,
        locationIndex: 3,
        durationIndex: 3,
        badgeIndex: 3,
    },
    {
        id: '5',
        price: 1200,
        rating: 4.78,
        reviews: 620,
        maxGuests: 25,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format',
        gradient: 'from-teal-500 to-emerald-700',
        titleIndex: 4,
        locationIndex: 4,
        durationIndex: 4,
        badgeIndex: 4,
    },
    {
        id: '6',
        price: 1500,
        rating: 4.96,
        reviews: 310,
        maxGuests: 8,
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&auto=format',
        gradient: 'from-rose-500 to-pink-700',
        titleIndex: 5,
        locationIndex: 5,
        durationIndex: 5,
        badgeIndex: 5,
    },
] as const;

type LocalizedTour = {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    duration: string;
    maxGuests: number;
    image: string;
    gradient: string;
    badge: string;
};

function TourCard({
    tour,
    index,
    formatCurrency,
    maxGuestsLabel,
    perPersonLabel,
    reserveCta
}: {
    tour: LocalizedTour;
    index: number;
    formatCurrency: (value: number) => string;
    maxGuestsLabel: (maxGuests: number) => string;
    perPersonLabel: string;
    reserveCta: string;
}) {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
        >
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
                {!imgError ? (
                    <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient} flex items-center justify-center`}>
                        <MapPin className="w-16 h-16 text-white/40" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-md text-foreground border-none font-black px-4 py-1.5 rounded-2xl shadow-lg">
                        {tour.badge}
                    </Badge>
                </div>
                <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95">
                        <Compass className="w-5 h-5 text-foreground" />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="space-y-3 px-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">
                        <MapPin className="w-3 h-3" />
                        {tour.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-sm">{tour.rating}</span>
                        <span className="text-muted-foreground text-xs">({tour.reviews})</span>
                    </div>
                </div>

                <h3 className="text-xl font-black group-hover:text-amber-600 transition-colors leading-tight line-clamp-2">
                    {tour.title}
                </h3>

                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {tour.duration}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                        <Users className="w-4 h-4" />
                        {maxGuestsLabel(tour.maxGuests)}
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-dashed">
                    <div>
                        <span className="text-2xl font-black">{formatCurrency(tour.price)}</span>
                        <span className="text-muted-foreground text-xs font-bold ml-1">{perPersonLabel}</span>
                    </div>
                    <Button size="sm" className="rounded-xl font-black px-4 bg-foreground hover:bg-foreground/90">{reserveCta}</Button>
                </div>
            </div>
        </motion.div>
    );
}

export default function ToursPage() {
    const { t, locale } = useLocale();

    const localeTag =
        locale === 'tr' ? 'tr-TR' :
            locale === 'de' ? 'de-DE' :
                locale === 'fr' ? 'fr-FR' : 'en-US';

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat(localeTag, { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);

    const maxGuestsLabel = (maxGuests: number) => {
        const prefix = (t.toursMaxGuestsPrefix as string) ?? 'Max.';
        const suffix = (t.toursMaxGuestsSuffix as string) ?? '';
        return `${prefix} ${maxGuests}${suffix ? ` ${suffix}` : ''}`.trim();
    };

    const categories = t.toursCategories as string[];
    const heroTitleParts = t.toursHeroTitleParts as string[];

    const titles = t.toursMockTitles as string[];
    const locations = t.toursMockLocations as string[];
    const durations = t.toursMockDurations as string[];
    const badges = t.toursMockBadges as string[];

    const mockTours: LocalizedTour[] = MOCK_TOURS_BASE.map((base) => ({
        id: base.id,
        price: base.price,
        rating: base.rating,
        reviews: base.reviews,
        maxGuests: base.maxGuests,
        image: base.image,
        gradient: base.gradient,
        title: titles[base.titleIndex] ?? '',
        location: locations[base.locationIndex] ?? '',
        duration: durations[base.durationIndex] ?? '',
        badge: badges[base.badgeIndex] ?? '',
    }));

    return (
        <div className="min-h-screen bg-background font-sans">
            <SearchHeader />

            <main className="pb-20">
                {/* Hero Section */}
                <section
                    className="relative min-h-[520px] w-full flex items-center justify-center overflow-hidden mb-16"
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
                            {t.toursHeroSubtitle as string}
                        </motion.p>
                    </div>
                </section>

                {/* Categories Carousel */}
                <section className="max-w-7xl mx-auto px-6 mb-20 overflow-x-auto no-scrollbar">
                    <div className="flex gap-4 pb-2">
                        {TOUR_CATEGORY_META.map((cat, i) => (
                            <motion.button
                                key={categories?.[i] ?? i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
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

                {/* Featured Tours */}
                <section className="max-w-7xl mx-auto px-6 mb-16">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-black mb-2">{t.toursFeaturedTitle as string}</h2>
                            <p className="text-muted-foreground font-medium">{t.toursFeaturedSubtitle as string}</p>
                        </div>
                        <Button variant="outline" className="rounded-2xl font-bold px-6">{t.toursViewAll as string}</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {mockTours.map((tour, i) => (
                            <TourCard
                                key={tour.id}
                                tour={tour}
                                index={i}
                                formatCurrency={formatCurrency}
                                maxGuestsLabel={maxGuestsLabel}
                                perPersonLabel={t.toursPerPersonLabel as string}
                                reserveCta={t.toursReserveCta as string}
                            />
                        ))}
                    </div>
                </section>

                {/* Discovery Layout 2: Wide Section */}
                <section className="max-w-7xl mx-auto px-6 mb-20">
                    <div className="bg-muted/40 rounded-[3rem] p-12 relative overflow-hidden group border border-border/60">
                        <div className="relative z-10 max-w-xl">
                            <Badge className="bg-sky-500 text-white border-none font-black mb-6 uppercase tracking-widest">{t.toursCtaBadge as string}</Badge>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{t.toursCtaTitle as string}</h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">
                                {t.toursCtaSubtitle as string}
                            </p>
                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                                        <Layers className="w-6 h-6 text-sky-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm">{t.toursCtaFeature1Title as string}</h4>
                                        <p className="text-xs text-muted-foreground">{t.toursCtaFeature1Subtitle as string}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                                        <Layers className="w-6 h-6 text-sky-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm">{t.toursCtaFeature2Title as string}</h4>
                                        <p className="text-xs text-muted-foreground">{t.toursCtaFeature2Subtitle as string}</p>
                                    </div>
                                </div>
                            </div>
                            <Button size="lg" className="rounded-2xl font-black px-10 h-16 shadow-2xl">{t.toursCtaButton as string}</Button>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
                            <Image
                                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=800&fit=crop"
                                alt={t.toursCtaImageAlt as string}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-muted/40 to-transparent" />
                        </div>
                    </div>
                </section>
            </main>

            <MainFooter />
        </div>
    );
}
