'use client';

import { use, useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { fetchListingById, type ListingDetail } from '@/lib/supabase/bookings';
import { getPriceBreakdown } from '@/lib/supabase/price-breakdown';
import { ListingGallery } from './_components/ListingGallery';
import { ListingHeader } from './_components/ListingHeader';
import { ListingKeyFacts } from './_components/ListingKeyFacts';
import { ListingAbout } from './_components/ListingAbout';
import { ListingAmenities } from './_components/ListingAmenities';
import { ListingHost } from './_components/ListingHost';
import { ListingBookingCard } from './_components/ListingBookingCard';

type GuestCounts = {
  adults: number;
  children: number;
  infants: number;
};

interface ListingDetailsProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailsPage({ params }: ListingDetailsProps) {
  const { id } = use(params);
  const { t, locale } = useLocale();
  const searchParams = useSearchParams();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  function parseDateParam(raw: string): Date | null {
    if (!raw) return null;
    const ymd = /^\d{4}-\d{2}-\d{2}$/.test(raw);
    if (ymd) return parseYmd(raw);
    const dt = new Date(raw);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const fromParam = searchParams.get('from') ?? searchParams.get('checkin');
  const toParam = searchParams.get('to') ?? searchParams.get('checkout');
  const adultsParam = searchParams.get('adults');
  const childrenParam = searchParams.get('children');
  const infantsParam = searchParams.get('infants');
  const legacyGuestsParam = searchParams.get('guests');

  const initialFrom = fromParam ? parseDateParam(fromParam) : null;
  const initialTo = toParam ? parseDateParam(toParam) : null;

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(() => ({
    from: initialFrom ?? new Date(),
    to: initialTo ?? new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
  }));

  const [guestCounts, setGuestCounts] = useState<GuestCounts>(() => {
    const adults = adultsParam ? Number.parseInt(adultsParam, 10) : NaN;
    const children = childrenParam ? Number.parseInt(childrenParam, 10) : NaN;
    const infants = infantsParam ? Number.parseInt(infantsParam, 10) : NaN;
    const legacyGuests = legacyGuestsParam ? Number.parseInt(legacyGuestsParam, 10) : NaN;

    if (Number.isFinite(adults) || Number.isFinite(children) || Number.isFinite(infants)) {
      return {
        adults: Number.isFinite(adults) ? Math.max(1, adults) : 1,
        children: Number.isFinite(children) ? Math.max(0, children) : 0,
        infants: Number.isFinite(infants) ? Math.max(0, infants) : 0,
      };
    }

    if (Number.isFinite(legacyGuests) && legacyGuests > 0) {
      return {
        adults: Math.max(1, legacyGuests),
        children: 0,
        infants: 0,
      };
    }

    return {
      adults: 2,
      children: 0,
      infants: 0,
    };
  });

  const checkoutError = searchParams.get('checkoutError');
  const checkoutErrorText =
    checkoutError === 'invalid_dates'
      ? 'Rezervasyona devam etmek için geçerli giriş/çıkış tarihlerini yeniden seçin.'
      : checkoutError === 'listing_not_found'
        ? 'Checkout sırasında ilan bilgisi doğrulanamadı. Lütfen tekrar deneyin.'
        : null;

  function parseYmd(ymd: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
    return new Date(Date.UTC(y, mo, d, 12, 0, 0));
  }

  const totalNights = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 5;
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [dateRange]);

  const [priceCalc, setPriceCalc] = useState({
    subtotal: 0,
    serviceFee: 0,
    cleaningFee: 0,
    extraGuestFee: 0,
    total: 0,
  });
  const [priceLoading, setPriceLoading] = useState(false);
  const priceRequestIdRef = useRef(0);

  const checkInStr = dateRange.from ? dateRange.from.toISOString().slice(0, 10) : '';
  const checkOutStr = dateRange.to ? dateRange.to.toISOString().slice(0, 10) : '';
  const totalGuestsForPricing = guestCounts.adults + guestCounts.children;

  useEffect(() => {
    let active = true;
    const loadListing = async () => {
      // Only show loader if we don't have a listing yet
      if (!listing) setIsInitialLoading(true);
      
      try {
        const data = await fetchListingById(id);
        if (active) {
          setListing(data);
        }
      } catch (err) {
        console.error('Failed to load listing:', err);
      } finally {
        if (active) setIsInitialLoading(false);
      }
    };

    loadListing();
    return () => {
      active = false;
    };
  }, [id]);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      !listing || !listing.images?.length ? 0 : prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };
  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      !listing || !listing.images?.length ? 0 : prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (!listing) return;

    const hasDates = checkInStr && checkOutStr;
    if (!hasDates) {
      setPriceCalc({
        subtotal: 0,
        serviceFee: 0,
        cleaningFee: listing.cleaningFee ?? 0,
        extraGuestFee: 0,
        total: 0,
      });
      setPriceLoading(false);
      return;
    }

    const requestId = ++priceRequestIdRef.current;
    setPriceLoading(true);

    getPriceBreakdown(listing, checkInStr, checkOutStr, totalGuestsForPricing)
      .then((breakdown) => {
        if (requestId !== priceRequestIdRef.current) return;

        if (!breakdown) {
          setPriceCalc({
            subtotal: 0,
            serviceFee: 0,
            cleaningFee: listing.cleaningFee ?? 0,
            extraGuestFee: 0,
            total: 0,
          });
          return;
        }

        setPriceCalc({
          subtotal: breakdown.subtotal,
          serviceFee: breakdown.serviceFee,
          cleaningFee: breakdown.cleaningFee,
          extraGuestFee: breakdown.extraGuestFee,
          total: breakdown.total,
        });
      })
      .finally(() => {
        if (requestId === priceRequestIdRef.current) setPriceLoading(false);
      });
  }, [listing?.id, checkInStr, checkOutStr, totalGuestsForPricing, totalNights]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <SearchHeader />
      <main className="pt-20 pb-20">
        {isInitialLoading && !listing && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isInitialLoading && !listing && (
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
            {checkoutErrorText && (
              <div className="max-w-7xl mx-auto px-6 mb-6">
                <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                  {checkoutErrorText}
                </div>
              </div>
            )}

            <ListingGallery
              listing={listing}
              selectedImageIndex={selectedImageIndex}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
              isWishlisted={isWishlisted}
              onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
              staysLabel={t.stays as string}
            />

            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 space-y-12">
                <ListingHeader listing={listing} reviewsLabel={t.dashboardReviewsLabel as string} />
                <ListingKeyFacts
                  listing={listing}
                  guestsLabel={t.listingGuestsLabel as string}
                  guestsUnit={t.guests as string}
                  bedroomsLabel={t.listingBedroomsLabel as string}
                  bathsLabel={t.listingBathsLabel as string}
                  typeLabel={t.listingTypeLabel as string}
                />
                <ListingAbout
                  description={listing.description ?? ''}
                  aboutTitle={t.listingAboutSpace as string}
                />
                <ListingAmenities
                  amenitiesTitle={t.listingAmenitiesTitle as string}
                  wifiLabel={t.amenityWifi as string}
                  kitchenLabel={t.amenityKitchen as string}
                  acLabel={t.amenityAirConditioning as string}
                  poolLabel={t.amenityPool as string}
                />
                <ListingHost
                  listing={listing}
                  memberSinceLabel={t.dashboardMemberSince as string}
                  contactHostLabel={t.listingContactHost as string}
                  reviewsLabel={t.dashboardReviewsLabel as string}
                  hostRatingLabel={t.listingHostRating as string}
                />
              </div>

              <div className="lg:col-span-4 relative">
                <ListingBookingCard
                  listing={listing}
                  listingId={id}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  guestCounts={guestCounts}
                  setGuestCounts={setGuestCounts}
                  totalNights={totalNights}
                  priceCalc={priceCalc}
                  priceLoading={priceLoading}
                  locale={locale}
                  t={{
                    checkin: t.checkin as string,
                    checkout: t.checkout as string,
                    setDate: t.setDate as string,
                    guests: t.guests as string,
                    listingReserve: t.listingReserve as string,
                    listingPerNight: t.listingPerNight as string,
                    listingCleaningFee: t.listingCleaningFee as string,
                    listingServiceFee: t.listingServiceFee as string,
                    listingTotal: t.listingTotal as string,
                  }}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
