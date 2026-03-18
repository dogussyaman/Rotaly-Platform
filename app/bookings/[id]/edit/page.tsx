'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { updateBooking, fetchListingById } from '@/lib/supabase/bookings';
import { getPriceBreakdown } from '@/lib/supabase/price-breakdown';
import { useBookingEditData } from './_components/useBookingEditData';
import { BookingEditForm } from './_components/BookingEditForm';
import { CHECK_IN_SLOTS } from './_components/check-in-slots';
import type { ExtrasState } from './_components/types';

interface BookingEditPageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_EXTRAS: ExtrasState = {
  parking: false,
  babyBed: false,
  extraCleaning: false,
  withPet: false,
};

export default function BookingEditPage({ params }: BookingEditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const { booking, loading, error, setError, initialForm } = useBookingEditData(id, profile?.id ?? null);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkInInput, setCheckInInput] = useState('');
  const [checkOutInput, setCheckOutInput] = useState('');
  const [guestsInput, setGuestsInput] = useState(1);
  const [notesInput, setNotesInput] = useState('');
  const [slotKey, setSlotKey] = useState('');
  const [extrasState, setExtrasState] = useState<ExtrasState>(DEFAULT_EXTRAS);
  const [extrasNote, setExtrasNote] = useState('');

  // Fiyat recalculation
  const [recalcPrice, setRecalcPrice] = useState<number | null>(null);
  const priceRequestIdRef = useRef(0);

  useEffect(() => {
    if (!initialForm) return;
    setCheckInInput(initialForm.checkInInput);
    setCheckOutInput(initialForm.checkOutInput);
    setGuestsInput(initialForm.guestsInput);
    setNotesInput(initialForm.notesInput);
    setSlotKey(initialForm.slotKey);
    setExtrasState(initialForm.extrasState);
    setExtrasNote(initialForm.extrasNote);
  }, [initialForm]);

  // Tarih veya misafir sayısı değişince fiyatı yeniden hesapla
  useEffect(() => {
    if (!booking?.listing?.id || !checkInInput || !checkOutInput) {
      setRecalcPrice(null);
      return;
    }
    const checkInDate = new Date(checkInInput);
    const checkOutDate = new Date(checkOutInput);
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) return;
    if (checkOutDate <= checkInDate) return;

    const requestId = ++priceRequestIdRef.current;
    const listingId = booking.listing.id;
    const checkInStr = checkInDate.toISOString().slice(0, 10);
    const checkOutStr = checkOutDate.toISOString().slice(0, 10);

    fetchListingById(listingId).then((listingData) => {
      if (requestId !== priceRequestIdRef.current || !listingData) return;
      return getPriceBreakdown(listingData, checkInStr, checkOutStr, guestsInput).then((b) => {
        if (requestId !== priceRequestIdRef.current || !b) return;
        setRecalcPrice(b.total);
      });
    }).catch(() => {
      if (requestId !== priceRequestIdRef.current) return;
      setRecalcPrice(null);
    });
  }, [booking?.listing?.id, checkInInput, checkOutInput, guestsInput]);

  const selectedSlot = CHECK_IN_SLOTS.find((s) => s.key === slotKey) ?? null;
  const canEdit =
    booking &&
    (booking.status === 'pending' || booking.status === 'confirmed') &&
    new Date(booking.checkOut).getTime() > Date.now();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !profile || saving) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!checkInInput || !checkOutInput) {
      setError('Giriş ve çıkış tarihleri zorunludur.');
      setSaving(false);
      return;
    }

    const checkInDate = new Date(checkInInput);
    const checkOutDate = new Date(checkOutInput);
    if (Number.isNaN(checkInDate.getTime())) {
      setError('Geçerli bir giriş tarihi girin.');
      setSaving(false);
      return;
    }
    if (Number.isNaN(checkOutDate.getTime())) {
      setError('Geçerli bir çıkış tarihi girin.');
      setSaving(false);
      return;
    }
    if (checkOutDate <= checkInDate) {
      setError('Çıkış tarihi giriş tarihinden sonra olmalıdır.');
      setSaving(false);
      return;
    }
    if (!Number.isFinite(guestsInput) || guestsInput <= 0) {
      setError('Geçerli bir misafir sayısı girin.');
      setSaving(false);
      return;
    }
    if (!selectedSlot) {
      setError('Lütfen giriş yapacağınız saat aralığını seçin.');
      setSaving(false);
      return;
    }

    const ok = await updateBooking(booking.id, {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestsCount: guestsInput,
      totalPrice: recalcPrice ?? undefined,
      specialRequests: notesInput.trim() || null,
      checkInSlotStart: selectedSlot.start,
      checkInSlotEnd: selectedSlot.end,
      extras: { options: extrasState, note: extrasNote.trim() || null },
    });

    if (!ok) {
      setError('Rezervasyon güncellenirken bir hata oluştu.');
      setSaving(false);
      return;
    }

    setSuccess('Rezervasyonunuz güncellendi.');
    setSaving(false);
    setTimeout(() => router.push('/profile?tab=bookings'), 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full" asChild>
              <Link href="/profile?tab=bookings">
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Rezervasyonu Düzenle
              </h1>
              <p className="text-sm text-muted-foreground">
                Tarihleri, misafir sayısını ve notlarınızı güncelleyebilirsiniz.
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && !profile && (
            <p className="text-center text-muted-foreground">
              Rezervasyon görüntülemek için giriş yapmalısınız.
            </p>
          )}

          {!loading && profile && !booking && error && (
            <p className="text-center text-muted-foreground">{error}</p>
          )}

          {!loading && profile && booking && (
            <>
              {recalcPrice !== null && recalcPrice !== booking.totalPrice && (
                <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
                  Seçtiğiniz tarih ve misafir sayısına göre yeni toplam:{' '}
                  <strong>₺{recalcPrice.toLocaleString('tr-TR')}</strong>
                  {' '}(eski: ₺{booking.totalPrice.toLocaleString('tr-TR')})
                </div>
              )}
              <BookingEditForm
                booking={booking}
                checkInInput={checkInInput}
                setCheckInInput={setCheckInInput}
                checkOutInput={checkOutInput}
                setCheckOutInput={setCheckOutInput}
                guestsInput={guestsInput}
                setGuestsInput={setGuestsInput}
                notesInput={notesInput}
                setNotesInput={setNotesInput}
                slotKey={slotKey}
                setSlotKey={setSlotKey}
                extrasState={extrasState}
                setExtrasState={setExtrasState}
                extrasNote={extrasNote}
                setExtrasNote={setExtrasNote}
                canEdit={!!canEdit}
                saving={saving}
                error={error}
                success={success}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/profile?tab=bookings')}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
