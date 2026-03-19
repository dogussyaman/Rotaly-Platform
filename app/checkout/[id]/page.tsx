'use client';

import { Suspense, use, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from '@/lib/i18n/locale-context';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import {
  fetchListingById,
  createBooking,
  isListingAvailable,
  type ListingDetail,
} from '@/lib/supabase/bookings';
import { getPriceBreakdown } from '@/lib/supabase/price-breakdown';
import { validateCoupon, recordCouponUsage, type ValidCoupon } from '@/lib/supabase/coupons';
import { getRedeemablePoints, redeemLoyaltyPoints } from '@/lib/supabase/loyalty';
import { useAppSelector } from '@/lib/store/hooks';
import { CheckoutTripSection } from './_components/CheckoutTripSection';
import { CheckoutPaymentSection } from './_components/CheckoutPaymentSection';
import { CheckoutSummaryCard } from './_components/CheckoutSummaryCard';
import { CHECK_IN_SLOTS } from './_components/check-in-slots';

interface CheckoutPageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_EXTRAS = {
  parking: false,
  babyBed: false,
  extraCleaning: false,
  withPet: false,
};

function CheckoutPageContent({ id }: { id: string }) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAppSelector((s) => s.user);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkInSlotKey, setCheckInSlotKey] = useState('');
  const [extrasState, setExtrasState] = useState(DEFAULT_EXTRAS);
  const [extrasNote, setExtrasNote] = useState('');

  // Kupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ValidCoupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Sadakat puan state
  const [redeemablePoints, setRedeemablePoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const guestsParam = searchParams.get('guests');

  function parseYmd(ymd: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
    return new Date(Date.UTC(y, mo, d, 12, 0, 0));
  }

  const selectedCheckIn = fromParam ? parseYmd(fromParam) : null;
  const selectedCheckOut = toParam ? parseYmd(toParam) : null;
  const hasValidStayDates =
    !!selectedCheckIn && !!selectedCheckOut && selectedCheckOut.getTime() > selectedCheckIn.getTime();

  const nights = hasValidStayDates
    ? Math.max(1, Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const checkInStr = selectedCheckIn ? selectedCheckIn.toISOString().slice(0, 10) : null;
  const checkOutStr = selectedCheckOut ? selectedCheckOut.toISOString().slice(0, 10) : null;

  const guests = guestsParam ? Number.parseInt(guestsParam, 10) || 2 : 2;

  const [priceBreakdown, setPriceBreakdown] = useState<{
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    extraGuestFee: number;
    total: number;
  } | null>(null);

  const priceRequestIdRef = useRef(0);

  const subtotal = priceBreakdown?.subtotal ?? (listing ? listing.pricePerNight * nights : 0);
  const cleaningFee = priceBreakdown?.cleaningFee ?? (listing?.cleaningFee ?? 850);
  const serviceFee = priceBreakdown?.serviceFee ?? Math.round(subtotal * 0.12);
  const total = priceBreakdown?.total ?? subtotal + cleaningFee + serviceFee;

  // Her 10 puan = ₺1
  const loyaltyDiscount = Math.floor(pointsToRedeem / 10);

  // Nihai ödenecek tutar
  const finalTotal = Math.max(0, total - couponDiscount - loyaltyDiscount);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchListingById(id);
      if (!cancelled) setListing(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!listing || !hasValidStayDates || !checkInStr || !checkOutStr) {
      setPriceBreakdown(null);
      return;
    }
    const requestId = ++priceRequestIdRef.current;
    getPriceBreakdown(listing, checkInStr, checkOutStr, guests)
      .then((b) => {
        if (requestId !== priceRequestIdRef.current || !b) return;
        setPriceBreakdown({
          subtotal: b.subtotal,
          cleaningFee: b.cleaningFee,
          serviceFee: b.serviceFee,
          extraGuestFee: b.extraGuestFee,
          total: b.total,
        });
      })
      .catch(() => {
        if (requestId !== priceRequestIdRef.current) return;
        setPriceBreakdown(null);
      });
  }, [listing?.id, hasValidStayDates, checkInStr, checkOutStr, guests]);

  // Kullanıcının puan bakiyesini yükle
  useEffect(() => {
    if (!profile) return;
    getRedeemablePoints(profile.id).then(setRedeemablePoints);
  }, [profile?.id]);

  // Sepet tutarı değişince kupon geçerliliğini kontrol et
  useEffect(() => {
    if (appliedCoupon?.minBookingTotal != null && total < appliedCoupon.minBookingTotal) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponError('Sepet tutarı düştüğü için kupon geçersiz hale geldi.');
    }
  }, [total]);

  const selectedSlot = CHECK_IN_SLOTS.find((s) => s.key === checkInSlotKey) ?? null;

  const handleApplyCoupon = async () => {
    if (!profile || !couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    const result = await validateCoupon(couponCode.trim(), profile.id, total, listing?.id);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
    } else {
      setCouponError(result.error);
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
    setCouponCode('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !profile || submitting) return;
    setSubmitting(true);
    setErrorMessage(null);

    if (!selectedSlot) {
      setErrorMessage('Lütfen tahmini giriş saat aralığını seçin.');
      setSubmitting(false);
      return;
    }

    if (!hasValidStayDates || !selectedCheckIn || !selectedCheckOut) {
      setErrorMessage('Geçerli giriş ve çıkış tarihleri seçmelisiniz.');
      setSubmitting(false);
      return;
    }

    // Max misafir sayısı kontrolü
    if (guests > listing.maxGuests) {
      setErrorMessage(`Bu ilan maksimum ${listing.maxGuests} misafir kabul etmektedir.`);
      setSubmitting(false);
      return;
    }

    // Host kendi ilanına rezervasyon yapamaz
    if (listing.hostId && listing.hostId === profile.id) {
      setErrorMessage('Kendi ilanınıza rezervasyon oluşturamazsınız.');
      setSubmitting(false);
      return;
    }

    const available = await isListingAvailable(listing.id, selectedCheckIn, selectedCheckOut);
    if (!available) {
      setErrorMessage('Bu tarih aralığında bu ilan dolu, lütfen başka tarih seçin.');
      setSubmitting(false);
      return;
    }

    const totalDiscount = couponDiscount + loyaltyDiscount;

    const result = await createBooking({
      listingId: listing.id,
      guestId: profile.id,
      checkIn: selectedCheckIn,
      checkOut: selectedCheckOut,
      guestsCount: guests,
      totalPrice: total,
      discountTotal: totalDiscount,
      couponId: appliedCoupon?.id ?? null,
      pointsRedeemed: pointsToRedeem,
      checkInSlotStart: selectedSlot.start,
      checkInSlotEnd: selectedSlot.end,
      extras: { options: extrasState, note: extrasNote.trim() || null },
    });

    if (!result) {
      setErrorMessage('Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      setSubmitting(false);
      return;
    }

    // Kupon kullanım kaydı
    if (appliedCoupon && couponDiscount > 0) {
      await recordCouponUsage(appliedCoupon.id, profile.id, result.id, couponDiscount);
    }

    // Sadakat puan harcama
    if (pointsToRedeem > 0) {
      await redeemLoyaltyPoints(profile.id, result.id, pointsToRedeem);
    }

    setSuccess(true);
    setSubmitting(false);
    setTimeout(() => router.push('/profile?tab=bookings'), 1500);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <SearchHeader />
      <main className="pt-28 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <Link
              href={`/listing/${id}`}
              className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-black text-foreground">Rezervasyonu Onayla</h1>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && !listing && (
            <div className="text-center py-24">
              <p className="text-lg text-muted-foreground">İlan bulunamadı.</p>
            </div>
          )}

          {!loading && listing && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7 space-y-12">
                <CheckoutTripSection
                  checkInStr={checkInStr}
                  checkOutStr={checkOutStr}
                  nights={nights}
                  guests={guests}
                  checkInSlotKey={checkInSlotKey}
                  setCheckInSlotKey={setCheckInSlotKey}
                  extrasState={extrasState}
                  setExtrasState={setExtrasState}
                  extrasNote={extrasNote}
                  setExtrasNote={setExtrasNote}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  couponApplied={!!appliedCoupon}
                  couponError={couponError}
                  couponLoading={couponLoading}
                  couponDiscount={couponDiscount}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  redeemablePoints={redeemablePoints}
                  pointsToRedeem={pointsToRedeem}
                  setPointsToRedeem={setPointsToRedeem}
                  loyaltyDiscount={loyaltyDiscount}
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                  <CheckoutPaymentSection />

                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold border-b pb-4">İptal Politikası</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-bold text-foreground">Esnek:</span> Belirli bir tarihe
                      kadar ücretsiz iptal edebilirsiniz. Bu tarihten sonra yapılan iptallerde iade
                      yapılmaz.
                    </p>
                    <a
                      href="/cancellation-policy"
                      className="inline-block text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
                    >
                      Detayları Gör →
                    </a>
                  </section>

                  <div className="pt-8 border-t space-y-4">
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        !profile ||
                        success ||
                        !hasValidStayDates ||
                        (!priceBreakdown && !!checkInStr && !!checkOutStr)
                      }
                      className="w-full h-16 rounded-3xl bg-foreground text-background font-black text-xl hover:bg-foreground/85 transition-transform active:scale-95 shadow-2xl shadow-foreground/10"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Rezervasyon oluşturuluyor...
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Rezervasyon Oluşturuldu
                        </>
                      ) : (
                        `Rezervasyonu Tamamla${finalTotal > 0 ? ` — ₺${finalTotal.toLocaleString('tr-TR')}` : ''}`
                      )}
                    </Button>
                    {hasValidStayDates && !priceBreakdown && listing && (
                      <p className="text-xs text-muted-foreground text-center">
                        Fiyat hesaplanıyor...
                      </p>
                    )}
                    {!hasValidStayDates && (
                      <p className="text-xs text-red-500 text-center">
                        Rezervasyona devam etmek için geçerli giriş ve çıkış tarihleri seçin.
                      </p>
                    )}
                    {errorMessage && (
                      <p className="text-xs text-red-500 text-center">{errorMessage}</p>
                    )}
                    {!profile && (
                      <p className="text-xs text-red-500 text-center">
                        Rezervasyon tamamlamak için önce giriş yapmalısınız.
                      </p>
                    )}
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      &quot;Rezervasyonu Tamamla&quot; butonuna tıklayarak Hizmet Şartlarımızı
                      ve İptal Politikamızı kabul etmiş olursunuz.
                    </p>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5 sticky top-28">
                <CheckoutSummaryCard
                  listing={listing}
                  nights={nights}
                  subtotal={subtotal}
                  cleaningFee={cleaningFee}
                  serviceFee={serviceFee}
                  extraGuestFee={priceBreakdown?.extraGuestFee ?? 0}
                  total={total}
                  totalLabel={t.listingTotal as string}
                  couponDiscount={couponDiscount}
                  loyaltyDiscount={loyaltyDiscount}
                  finalTotal={finalTotal}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <CheckoutPageContent id={id} />
    </Suspense>
  );
}
