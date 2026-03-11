'use client';

import { use } from 'react';

import { useLocale } from '@/lib/i18n/locale-context';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    CreditCard,
    Lock,
    Star,
    ShieldCheck,
    Calendar,
    Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CheckoutPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Mock listing data (in real app, this would be fetched from backend)
const LISTING_DATA = {
    id: '1',
    title: 'Boğaz Manzaralı Lüks Penthouse',
    location: 'Bebek, İstanbul',
    pricePerNight: 12400,
    rating: 4.97,
    totalReviews: 88,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
    hostName: 'Aslıhan Y.',
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
    const { id } = use(params);
    const { t } = useLocale();

    // Mock booking details
    const booking = {
        checkIn: '15 Mar 2026',
        checkOut: '20 Mar 2026',
        guests: 2,
        nights: 5,
        subtotal: 62000,
        cleaningFee: 850,
        serviceFee: 7440,
        total: 70290,
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <SearchHeader />

            <main className="pt-28 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <Link
                            href={`/listing/${id}`}
                            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-black text-foreground">Rezervasyonu Onayla</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Left Column: Form & Info */}
                        <div className="lg:col-span-7 space-y-12">

                            {/* Trip Selection Summary */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold border-b pb-4">Seyahatiniz</h2>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Tarihler</div>
                                        <div className="text-lg font-bold">{booking.checkIn} – {booking.checkOut}</div>
                                    </div>
                                    <button className="text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">Düzenle</button>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Misafirler</div>
                                        <div className="text-lg font-bold">{booking.guests} misafir</div>
                                    </div>
                                    <button className="text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">Düzenle</button>
                                </div>
                            </section>

                            {/* Payment Section */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <h2 className="text-2xl font-bold">Ödeme Yöntemi</h2>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-6 bg-muted rounded border border-border/50" />
                                        <div className="w-10 h-6 bg-muted rounded border border-border/50" />
                                        <div className="w-10 h-6 bg-muted rounded border border-border/50" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Kart Sahibi</label>
                                            <input
                                                type="text"
                                                placeholder="Caner Yaman"
                                                className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border focus:border-foreground/30 focus:outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Kart Numarası</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full h-14 px-5 pr-12 rounded-2xl bg-muted/50 border border-border focus:border-foreground/30 focus:outline-none transition-all font-medium font-mono"
                                                />
                                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Son Kullanma Tarihi</label>
                                            <input
                                                type="text"
                                                placeholder="AA/YY"
                                                className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border focus:border-foreground/30 focus:outline-none transition-all font-medium font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">CVV</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="***"
                                                    className="w-full h-14 px-5 pr-12 rounded-2xl bg-muted/50 border border-border focus:border-foreground/30 focus:outline-none transition-all font-medium font-mono"
                                                />
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted/20 border rounded-2xl text-xs text-muted-foreground leading-relaxed flex gap-3 italic">
                                    <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-600" />
                                    Ödemeniz, Rezervasyon Koruması tarafından uçtan uca şifrelenir ve korunur.
                                </div>
                            </section>

                            {/* Cancellation Policy Reminder */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold border-b pb-4">İptal Politikası</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    <span className="font-bold text-foreground">Esnek:</span> 12 Mart tarihine kadar ücretsiz iptal edebilirsiniz. Bu tarihten sonra yapılan iptallerde iade yapılmaz.
                                </p>
                                <a href="/cancellation-policy" className="inline-block text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">Detayları Gör →</a>
                            </section>

                            <div className="pt-8 border-t">
                                <Button className="w-full h-16 rounded-3xl bg-foreground text-background font-black text-xl hover:bg-foreground/85 transition-transform active:scale-95 shadow-2xl shadow-foreground/10">
                                    Rezervasyonu Tamamla ve Öde
                                </Button>
                                <p className="text-center text-xs text-muted-foreground mt-4">
                                    "Rezervasyonu Tamamla ve Öde" butonuna tıklayarak Hizmet Şartlarımızı ve İptal Politikamızı kabul etmiş olursunuz.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Listing & Price Summary */}
                        <div className="lg:col-span-5 sticky top-28">
                            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge className="bg-foreground/5 text-foreground border-none font-bold">Premium Seçenek</Badge>
                                </div>

                                {/* Listing Card Minimal */}
                                <div className="flex gap-4 pb-8 border-b border-border">
                                    <div className="w-32 h-24 rounded-2xl overflow-hidden relative shrink-0 shadow-lg">
                                        <Image src={LISTING_DATA.image} alt={LISTING_DATA.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Mülk Sahibi: {LISTING_DATA.hostName}</div>
                                        <h3 className="font-bold text-lg leading-tight line-clamp-2">{LISTING_DATA.title}</h3>
                                        <div className="flex items-center gap-1.5 mt-2 text-sm">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="font-bold">{LISTING_DATA.rating}</span>
                                            <span className="text-muted-foreground">({LISTING_DATA.totalReviews} yorum)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold">Fiyat Özeti</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-muted-foreground">
                                            <span className="font-medium">₺{LISTING_DATA.pricePerNight.toLocaleString('tr-TR')} x {booking.nights} gece</span>
                                            <span className="font-bold text-foreground">₺{booking.subtotal.toLocaleString('tr-TR')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-muted-foreground">
                                            <span className="font-medium">Temizlik ücreti</span>
                                            <span className="font-bold text-foreground">₺{booking.cleaningFee.toLocaleString('tr-TR')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-muted-foreground">
                                            <span className="font-medium">StayHub hizmet bedeli</span>
                                            <span className="font-bold text-foreground">₺{booking.serviceFee.toLocaleString('tr-TR')}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-8 border-t-2 border-dashed font-black text-2xl text-foreground">
                                        <span>{t.listingTotal as string}</span>
                                        <span>₺{booking.total.toLocaleString('tr-TR')}</span>
                                    </div>
                                </div>

                                {/* Info Badges */}
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 bg-muted/30 rounded-2xl text-center space-y-1">
                                        <Lock className="w-5 h-5 mx-auto text-muted-foreground" />
                                        <div className="text-[10px] font-black uppercase text-muted-foreground">Güvenli Ödeme</div>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-2xl text-center space-y-1">
                                        <ShieldCheck className="w-5 h-5 mx-auto text-muted-foreground" />
                                        <div className="text-[10px] font-black uppercase text-muted-foreground">StayHub Koruma</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <MainFooter />
        </div>
    );
}
