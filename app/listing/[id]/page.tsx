'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Wifi,
  Utensils,
  Wind,
  Waves,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar as CalendarIcon,
  Info,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { fetchListingById, type ListingDetail } from '@/lib/supabase/bookings';
import { Loader2 } from 'lucide-react';

interface ListingDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ListingDetailsPage({ params }: ListingDetailsProps) {
  const { id } = use(params);
  const { t, locale } = useLocale();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
  });
  const [guestCount, setGuestCount] = useState(2);

  const dateLocale = locale === 'tr' ? tr : enUS;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchListingById(id);
      setListing(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      !listing || listing.images.length === 0
        ? 0
        : prev === 0
          ? listing.images.length - 1
          : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      !listing || listing.images.length === 0
        ? 0
        : prev === listing.images.length - 1
          ? 0
          : prev + 1
    );
  };

  const totalNights = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 5;
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [dateRange]);

  const priceCalc = useMemo(() => {
    if (!listing) {
      return { subtotal: 0, serviceFee: 0, cleaningFee: 0, total: 0 };
    }
    const subtotal = listing.pricePerNight * totalNights;
    const serviceFee = Math.round(subtotal * 0.12);
    const cleaningFee =  Number.isFinite((listing as any).cleaningFee)
      ? Number((listing as any).cleaningFee)
      : 850;
    return { subtotal, serviceFee, cleaningFee, total: subtotal + serviceFee + cleaningFee };
  }, [totalNights]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SearchHeader />

      <main className="pt-20 pb-20">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && !listing && (
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h1 className="text-2xl font-bold mb-2">İlan bulunamadı</h1>
            <p className="text-muted-foreground mb-6">
              Aradığınız ilan silinmiş veya yayından kaldırılmış olabilir.
            </p>
            <Link href="/search">
              <Button variant="outline">Diğer ilanlara göz at</Button>
            </Link>
          </div>
        )}

        {listing && (
        <>
        {/* Gallery Section */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          {/* Breadcrumbs or Back */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.stays as string}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-foreground truncate">{listing.title}</span>
          </div>

          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden group shadow-2xl">
            <Image
              src={listing.images[selectedImageIndex] ?? 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop'}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Navigation Buttons */}
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                onClick={handlePrevImage}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-all transform hover:-translate-x-1"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={handleNextImage}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white transition-all transform hover:translate-x-1"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Image Counters */}
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20">
              {selectedImageIndex + 1} / {listing.images.length || 1}
            </div>

            {/* Top Actions */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
              </button>
              <button className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all">
                <Share2 className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header Info */}
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-secondary/50 text-foreground border-none px-3 py-1 font-bold">
                {(listing as any).property_type ?? 'Konaklama'}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {listing.title}
              </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-foreground text-lg">{listing.rating.toFixed(2)}</span>
                  <span className="underline font-medium hover:text-foreground cursor-pointer">
                    {listing.totalReviews} {t.dashboardReviewsLabel as string}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">
                    {[listing.address, listing.city, listing.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8 bg-card border rounded-[2rem] shadow-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" /> {t.listingGuestsLabel as string}
                </div>
                <div className="text-xl font-bold">{listing.maxGuests} {t.guests as string}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Bed className="w-4 h-4" /> {t.listingBedroomsLabel as string}
                </div>
                <div className="text-xl font-bold">{listing.bedrooms}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Bath className="w-4 h-4" /> {t.listingBathsLabel as string}
                </div>
                <div className="text-xl font-bold">{listing.bathrooms}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" /> {t.listingTypeLabel as string}
                </div>
                <div className="text-xl font-bold">{(listing as any).property_type ?? 'Stay'}</div>
              </div>
            </div>

            {/* About the Space */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold border-b pb-4">{t.listingAboutSpace as string}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-4">{t.listingAmenitiesTitle as string}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                {/* Şimdilik sadece birkaç temel amenity örneği gösteriyoruz */}
                {[Wifi, Utensils, Wind, Waves, ShieldCheck].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium text-foreground">
                      {/* Çeviri key'i yoksa basit metin */}
                      {i === 0 && (t.amenityWifi as string)}
                      {i === 1 && (t.amenityKitchen as string)}
                      {i === 2 && (t.amenityAirConditioning as string)}
                      {i === 3 && (t.amenityPool as string)}
                      {i === 4 && 'Güvenlik'}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="rounded-2xl px-8 py-6 font-bold border-2">
                Tüm Olanakları Gör
              </Button>
            </div>

            {/* Host Section */}
            {listing.host && (
            <div className="p-8 bg-muted/40 rounded-[2.5rem] border border-border/60">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <Image
                        src={
                          listing.host.avatarUrl ??
                          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
                        }
                        alt={listing.host.fullName ?? 'Ev Sahibi'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* superhost bilgisi yoksa gizli */}
                    {false && (
                      <div className="absolute -bottom-2 -right-2 bg-foreground text-background w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Ev Sahibi: {listing.host.fullName ?? 'Ev Sahibi'}</h3>
                    <p className="text-muted-foreground font-medium">{t.dashboardMemberSince as string}: 2021</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="rounded-2xl px-6 py-6 font-bold border-2">
                    {t.listingContactHost as string}
                  </Button>
                </div>
              </div>
              <div className="mt-8 grid sm:grid-cols-3 gap-6 pt-8 border-t border-border/60">
                <div>
                  <div className="text-2xl font-bold">{listing.totalReviews}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{t.dashboardReviewsLabel as string}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold underline cursor-pointer">{listing.rating.toFixed(2)} ★</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{t.listingHostRating as string}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Çok Hızlı</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">Yanıt Süresi</div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4 relative">
            <aside className="sticky top-28">
              <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500" />

                <div className="flex items-baseline justify-between mb-8">
                  <div>
                    <span className="text-3xl font-black text-foreground">₺{listing.pricePerNight.toLocaleString('tr-TR')}</span>
                    <span className="text-muted-foreground font-medium ml-1">/{t.listingPerNight as string}</span>
                  </div>
                    <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {listing.rating.toFixed(2)}
                  </div>
                </div>

                {/* Date Selection Grid */}
                <div className="grid grid-cols-2 border rounded-2xl overflow-hidden mb-6 bg-muted/30">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex flex-col items-start p-4 hover:bg-white transition-colors text-left border-r border-border">
                        <span className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">{t.checkin as string}</span>
                        <span className="text-sm font-bold truncate">
                          {dateRange.from ? format(dateRange.from, 'dd MMM yyyy', { locale: dateLocale }) : t.setDate as string}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex flex-col items-start p-4 hover:bg-white transition-colors text-left">
                        <span className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">{t.checkout as string}</span>
                        <span className="text-sm font-bold truncate">
                          {dateRange.to ? format(dateRange.to, 'dd MMM yyyy', { locale: dateLocale }) : t.setDate as string}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-3xl" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.to || dateRange.from}
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="col-span-2 border-t p-4 hover:bg-white transition-colors flex justify-between items-center group/guest cursor-pointer">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase font-black tracking-tighter text-muted-foreground mb-1">{t.guests as string}</span>
                      <span className="text-sm font-bold">{guestCount} {t.guests as string}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted font-bold"
                      >-</button>
                              <button
                        onClick={() => setGuestCount(Math.min(listing.maxGuests, guestCount + 1))}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted font-bold"
                      >+</button>
                    </div>
                  </div>
                </div>

                <Link href={`/checkout/${id}`}>
                  <Button className="w-full h-16 rounded-2xl bg-foreground text-background font-black text-xl hover:bg-foreground/90 transition-transform active:scale-95 shadow-xl shadow-foreground/10">
                    {t.listingReserve as string}
                  </Button>
                </Link>

                <p className="text-center text-sm text-muted-foreground mt-4 font-medium italic">
                  Henüz bir ödeme yapmayacaksınız
                </p>

                {/* Price Breakdown */}
                <div className="mt-8 space-y-4 pt-8 border-t border-border/60">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">₺{listing.pricePerNight.toLocaleString('tr-TR')} x {totalNights} gece</span>
                    <span className="font-bold">₺{priceCalc.subtotal.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">{t.listingCleaningFee as string}</span>
                    <span className="font-bold">₺{priceCalc.cleaningFee.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground underline underline-offset-4 decoration-muted-foreground/30">{t.listingServiceFee as string}</span>
                    <span className="font-bold">₺{priceCalc.serviceFee.toLocaleString('tr-TR')}</span>
                  </div>

                  <div className="flex justify-between items-center text-2xl pt-6 border-t font-black text-foreground">
                    <span>{t.listingTotal as string}</span>
                    <span>₺{priceCalc.total.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              {/* Safety/Info Card */}
              <div className="mt-8 p-6 bg-muted/40 rounded-3xl border border-border/60 flex gap-4 items-start">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">StayHub Koruması</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Rezervasyonunuz acil durumlara ve ev sahibi iptallerine karşı tam güvence altındadır.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
        </>
        )}
      </main>

      <MainFooter />
    </div>
  );
}
