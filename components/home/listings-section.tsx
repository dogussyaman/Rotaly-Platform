'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ListingCard } from '@/components/listings/listing-card';

const LISTINGS = [
    {
        id: '1',
        title: 'Sıcak Jakuzi, Tam Müstakil Bahçe, Tiny House',
        location: 'Kamp aracı · Çekmeköy',
        pricePerNight: 7578,
        rating: 4.96,
        totalReviews: 47,
        images: [
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        ],
        isFavorite: true,
        checkIn: new Date('2026-03-12'),
        checkOut: new Date('2026-03-17'),
        nights: 5,
    },
    {
        id: '2',
        title: 'Deniz Manzaralı Özel Jakuzi / Lüks Suit',
        location: 'Daire · Zeytinburnu',
        pricePerNight: 6666,
        rating: 5.0,
        totalReviews: 69,
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        ],
        isFavorite: true,
        checkIn: new Date('2026-03-22'),
        checkOut: new Date('2026-03-27'),
        nights: 5,
    },
    {
        id: '3',
        title: 'Boğaz Manzaralı Lüks Penthouse',
        location: 'Villa · Bebek',
        pricePerNight: 12400,
        rating: 4.97,
        totalReviews: 88,
        images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
        ],
        nights: 5,
    },
    {
        id: '4',
        title: 'Tarihi Taş Ev, Şarap Mahzeni',
        location: 'Ev · Kapadokya',
        pricePerNight: 4250,
        rating: 4.93,
        totalReviews: 134,
        images: [
            'https://images.unsplash.com/photo-1537671608828-cc564c51e25d?w=800&h=600&fit=crop',
        ],
        nights: 5,
    },
    {
        id: '5',
        title: 'Ahşap Villa, Özel Havuz, Doğa İçinde',
        location: 'Villa · Bodrum',
        pricePerNight: 9800,
        rating: 4.95,
        totalReviews: 62,
        images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1540541338537-1220205ac293?w=800&h=600&fit=crop',
        ],
        nights: 5,
    },
    {
        id: '6',
        title: 'Modern Studio, Metrobüs 2 Dk',
        location: 'Daire · Şişli',
        pricePerNight: 1850,
        rating: 4.84,
        totalReviews: 211,
        images: [
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
        ],
        nights: 5,
    },
    {
        id: '7',
        title: "Ege'nin İncisi, Yat Limanı Manzarası",
        location: 'Daire · İzmir',
        pricePerNight: 3200,
        rating: 4.91,
        totalReviews: 77,
        images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
        ],
        nights: 5,
    },
    {
        id: '8',
        title: 'Çam Ormanı İçinde Bungalov',
        location: 'Bungalov · Abant',
        pricePerNight: 2900,
        rating: 4.88,
        totalReviews: 45,
        images: [
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
        ],
        nights: 5,
    },
];

interface ListingsSectionProps {
    t: any;
}

export function ListingsSection({ t }: ListingsSectionProps) {
    return (
        <section className="bg-background py-8 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{t.listingsTitle as string}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{t.listingsSubtitle as string}</p>
                    </div>
                    <Link
                        href="/search"
                        className="text-sm font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
                    >
                        {t.viewAll as string}
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                    {LISTINGS.map((listing, i) => (
                        <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.35 }}
                        >
                            <Link href={`/listing/${listing.id}`}>
                                <ListingCard
                                    id={listing.id}
                                    title={listing.title}
                                    location={listing.location}
                                    pricePerNight={listing.pricePerNight}
                                    rating={listing.rating}
                                    totalReviews={listing.totalReviews}
                                    images={listing.images}
                                    checkIn={listing.checkIn}
                                    checkOut={listing.checkOut}
                                    nights={listing.nights}
                                    isFavorite={(listing as any).isFavorite}
                                    guestFavoriteLabel={t.guestFavorite as string}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
