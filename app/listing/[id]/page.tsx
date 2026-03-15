'use client';

import { use, useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
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

interface ListingDetailsProps {
  params: Promise<{ id: string }>;
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchListingById(id);
      setListing(data);
      setLoading(false);
    })();
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

  useEffect(() => {
    if (!listing) return;

    const hasDates = checkInStr && checkOutStr;
    if (!hasDates) {
      const nights = totalNights;
      const simpleSubtotal = listing.pricePerNight * nights;
      const simpleServiceFee = Math.round(simpleSubtotal * 0.12);
      const simpleCleaningFee = listing.cleaningFee ?? 850;
      setPriceCalc({
        subtotal: simpleSubtotal,
        serviceFee: simpleServiceFee,
        cleaningFee: simpleCleaningFee,
        extraGuestFee: 0,
        total: simpleSubtotal + simpleServiceFee + simpleCleaningFee,
      });
      return;
    }

    const requestId = ++priceRequestIdRef.current;
    setPriceLoading(true);

    getPriceBreakdown(listing, checkInStr, checkOutStr, guestCount)
      .then((breakdown) => {
        if (requestId !== priceRequestIdRef.current || !breakdown) return;
        setPriceCalc({
          subtotal: breakdown.subtotal,
          serviceFee: breakdown.serviceFee,
          cleaningFee: breakdown.cleaningFee,
          extraGuestFee: breakdown.extraGuestFee,
          total: breakdown.total,
        });
      })
      .catch(() => {
        if (requestId !== priceRequestIdRef.current) return;
        const nights = totalNights;
        const subtotal = listing.pricePerNight * nights;
        const serviceFee = Math.round(subtotal * 0.12);
        const cleaningFee = listing.cleaningFee ?? 850;
        setPriceCalc({
          subtotal,
          serviceFee,
          cleaningFee,
          extraGuestFee: 0,
          total: subtotal + serviceFee + cleaningFee,
        });
      })
      .finally(() => {
        if (requestId === priceRequestIdRef.current) setPriceLoading(false);
      });
  }, [listing?.id, checkInStr, checkOutStr, guestCount, totalNights]);

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
                  guestCount={guestCount}
                  setGuestCount={setGuestCount}
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
      <MainFooter />
    </div>
  );
}
