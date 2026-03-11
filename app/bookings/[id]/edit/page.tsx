'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Users, ChevronLeft } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { updateBooking } from '@/lib/supabase/bookings';
import { createClient } from '@/lib/supabase/client';

interface BookingEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface BookingForEdit {
  id: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: string;
  specialRequests: string | null;
   checkInSlotStart: string | null;
   checkInSlotEnd: string | null;
   extras: Record<string, any> | null;
  listing: {
    id: string;
    title: string;
    city: string | null;
    country: string | null;
  } | null;
}

export default function BookingEditPage({ params }: BookingEditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const [booking, setBooking] = useState<BookingForEdit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkInInput, setCheckInInput] = useState('');
  const [checkOutInput, setCheckOutInput] = useState('');
  const [guestsInput, setGuestsInput] = useState<number>(1);
  const [notesInput, setNotesInput] = useState<string>('');
  const [slotKey, setSlotKey] = useState<string>('');
  const [extrasState, setExtrasState] = useState({
    parking: false,
    babyBed: false,
    extraCleaning: false,
    withPet: false,
  });
  const [extrasNote, setExtrasNote] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(
          `
            id,
            check_in,
            check_out,
            guests_count,
            status,
            special_requests,
            check_in_slot_start,
            check_in_slot_end,
            extras,
            listings (
              id,
              title,
              city,
              country
            )
          `,
        )
        .eq('id', id)
        .eq('guest_id', profile.id)
        .maybeSingle();

      if (fetchError) {
        console.error('fetch booking for edit error:', fetchError.message);
        setError('Rezervasyon yüklenirken bir hata oluştu.');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Rezervasyon bulunamadı.');
        setLoading(false);
        return;
      }

      const mapped: BookingForEdit = {
        id: data.id,
        checkIn: data.check_in,
        checkOut: data.check_out,
        guestsCount: data.guests_count,
        status: data.status,
        specialRequests: data.special_requests ?? null,
        checkInSlotStart: data.check_in_slot_start ?? null,
        checkInSlotEnd: data.check_in_slot_end ?? null,
        extras: (data.extras as Record<string, any> | null) ?? null,
        listing: data.listings
          ? {
              id: data.listings.id,
              title: data.listings.title,
              city: data.listings.city ?? null,
              country: data.listings.country ?? null,
            }
          : null,
      };

      setBooking(mapped);
      setCheckInInput(mapped.checkIn);
      setCheckOutInput(mapped.checkOut);
      setGuestsInput(mapped.guestsCount);
      setNotesInput(mapped.specialRequests ?? '');

      if (mapped.checkInSlotStart && mapped.checkInSlotEnd) {
        const startHour = mapped.checkInSlotStart.slice(0, 2);
        const endHour = mapped.checkInSlotEnd.slice(0, 2);
        setSlotKey(`${startHour}-${endHour}`);
      }

      const extrasOptions = mapped.extras?.options ?? {};
      setExtrasState({
        parking: !!extrasOptions.parking,
        babyBed: !!extrasOptions.babyBed,
        extraCleaning: !!extrasOptions.extraCleaning,
        withPet: !!extrasOptions.withPet,
      });
      setExtrasNote(mapped.extras?.note ?? '');
      setLoading(false);
    };

    load();
  }, [id, profile]);

  const checkInSlots: { key: string; label: string; start: string; end: string }[] = [
    { key: '13-14', label: '13:00 - 14:00', start: '13:00:00', end: '14:00:00' },
    { key: '14-15', label: '14:00 - 15:00', start: '14:00:00', end: '15:00:00' },
    { key: '15-16', label: '15:00 - 16:00', start: '15:00:00', end: '16:00:00' },
    { key: '16-17', label: '16:00 - 17:00', start: '16:00:00', end: '17:00:00' },
    { key: '17-18', label: '17:00 - 18:00', start: '17:00:00', end: '18:00:00' },
    { key: '18-19', label: '18:00 - 19:00', start: '18:00:00', end: '19:00:00' },
    { key: '19-20', label: '19:00 - 20:00', start: '19:00:00', end: '20:00:00' },
    { key: '20-21', label: '20:00 - 21:00', start: '20:00:00', end: '21:00:00' },
    { key: '21-22', label: '21:00 - 22:00', start: '21:00:00', end: '22:00:00' },
    { key: '22-23', label: '22:00 - 23:00', start: '22:00:00', end: '23:00:00' },
  ];

  const selectedSlot = checkInSlots.find((s) => s.key === slotKey) ?? null;

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
    if (!(checkInDate instanceof Date) || Number.isNaN(checkInDate.getTime())) {
      setError('Geçerli bir giriş tarihi girin.');
      setSaving(false);
      return;
    }
    if (!(checkOutDate instanceof Date) || Number.isNaN(checkOutDate.getTime())) {
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
      specialRequests: notesInput.trim() || null,
      checkInSlotStart: selectedSlot.start,
      checkInSlotEnd: selectedSlot.end,
      extras: {
        options: extrasState,
        note: extrasNote.trim() || null,
      },
    });

    if (!ok) {
      setError('Rezervasyon güncellenirken bir hata oluştu.');
      setSaving(false);
      return;
    }

    setSuccess('Rezervasyonunuz güncellendi.');
    setSaving(false);

    setTimeout(() => {
      router.push('/profile?tab=bookings');
    }, 1200);
  };

  const nights =
    checkInInput && checkOutInput
      ? Math.max(
          1,
          Math.ceil(
            Math.abs(
              new Date(checkOutInput).getTime() - new Date(checkInInput).getTime(),
            ) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  const canEdit =
    booking &&
    (booking.status === 'pending' || booking.status === 'confirmed') &&
    new Date(booking.checkOut).getTime() > Date.now();

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              asChild
            >
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
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-8 shadow-sm"
            >
              {booking.listing && (
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Konaklama
                    </p>
                    <Link
                      href={`/listing/${booking.listing.id}`}
                      className="text-sm md:text-base font-semibold hover:underline"
                    >
                      {booking.listing.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {[booking.listing.city, booking.listing.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px] uppercase">
                    {booking.status}
                  </Badge>
                </div>
              )}

              {!canEdit && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50/80 px-4 py-3 text-xs text-amber-900">
                  Bu rezervasyonun tarihi geçmiş veya durumu nedeniyle düzenlenemez.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Giriş Tarihi
                  </label>
                  <input
                    type="date"
                    value={checkInInput}
                    onChange={(e) => setCheckInInput(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Çıkış Tarihi
                  </label>
                  <input
                    type="date"
                    value={checkOutInput}
                    onChange={(e) => setCheckOutInput(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Misafir Sayısı
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={guestsInput}
                    onChange={(e) => setGuestsInput(Number(e.target.value))}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
                    disabled={!canEdit}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {checkInInput && checkOutInput ? (
                    <span>
                      {format(new Date(checkInInput), 'dd MMM', { locale: tr })} -{' '}
                      {format(new Date(checkOutInput), 'dd MMM yyyy', { locale: tr })} (
                      {nights} gece)
                    </span>
                  ) : (
                    <span>Tarihleri seçtiğinizde toplam gece sayısı burada görünecek.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Giriş Saati Aralığı
                  </label>
                  <select
                    value={slotKey}
                    onChange={(e) => setSlotKey(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
                    disabled={!canEdit}
                  >
                    <option value="">Seçiniz</option>
                    {checkInSlots.map((slot) => (
                      <option key={slot.key} value={slot.key}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Giriş aralığını güncellemek, ev sahibinin karşılama ve temizlik planını buna göre
                    ayarlamasına yardımcı olur.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Ek Hizmetler / Tercihler
                  </label>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={extrasState.parking}
                        onChange={(e) =>
                          setExtrasState((prev) => ({ ...prev, parking: e.target.checked }))
                        }
                        disabled={!canEdit}
                      />
                      <span>Otopark istiyorum</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={extrasState.babyBed}
                        onChange={(e) =>
                          setExtrasState((prev) => ({ ...prev, babyBed: e.target.checked }))
                        }
                        disabled={!canEdit}
                      />
                      <span>Bebek yatağı talep ediyorum</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={extrasState.extraCleaning}
                        onChange={(e) =>
                          setExtrasState((prev) => ({
                            ...prev,
                            extraCleaning: e.target.checked,
                          }))
                        }
                        disabled={!canEdit}
                      />
                      <span>Ekstra temizlik hizmeti talep ediyorum</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={extrasState.withPet}
                        onChange={(e) =>
                          setExtrasState((prev) => ({ ...prev, withPet: e.target.checked }))
                        }
                        disabled={!canEdit}
                      />
                      <span>Evcil hayvan ile geleceğim</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Ev Sahibine Notunuz
                  </label>
                  <textarea
                    value={extrasNote}
                    onChange={(e) => setExtrasNote(e.target.value)}
                    className="w-full min-h-[80px] rounded-2xl border border-input bg-background px-3 py-2 text-sm resize-none"
                    placeholder="Örneğin: Geç giriş yapacağım, alerjim var vb."
                    disabled={!canEdit}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-xs text-emerald-600">
                  {success}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  type="submit"
                  className="rounded-2xl px-6"
                  disabled={!canEdit || saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    'Rezervasyonu Güncelle'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl px-6"
                  onClick={() => router.push('/profile?tab=bookings')}
                >
                  Vazgeç
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

