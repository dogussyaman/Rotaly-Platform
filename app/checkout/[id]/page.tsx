'use client';

import { use, useEffect, useState } from 'react';

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
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchListingById, createBooking, isListingAvailable, type ListingDetail } from '@/lib/supabase/bookings';
import { useAppSelector } from '@/lib/store/hooks';

interface CheckoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = use(params);
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAppSelector((s) => s.user);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkInSlotKey, setCheckInSlotKey] = useState<string>('');
  const [extrasState, setExtrasState] = useState({
    parking: false,
    babyBed: false,
    extraCleaning: false,
    withPet: false,
  });
  const [extrasNote, setExtrasNote] = useState('');

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const guestsParam = searchParams.get('guests');

  const selectedCheckIn = fromParam ? new Date(fromParam) : null;
  const selectedCheckOut = toParam ? new Date(toParam) : null;

  let nights = 5;
  if (selectedCheckIn && selectedCheckOut) {
    const diffMs = Math.abs(selectedCheckOut.getTime() - selectedCheckIn.getTime());
    const calculated = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    nights = calculated;
  }

  const guests = guestsParam ? Number.parseInt(guestsParam, 10) || 2 : 2;

  const subtotal = listing ? listing.pricePerNight * nights : 0;
  const cleaningFee = 850;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchListingById(id);
      setListing(data);
      setLoading(false);
    };
    load();
  }, [id]);

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

  const selectedSlot = checkInSlots.find((s) => s.key === checkInSlotKey) ?? null;

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

    const now = new Date();
    const fallbackCheckIn = now;
    const fallbackCheckOut = new Date(now.getTime() + nights * 24 * 60 * 60 * 1000);

    const checkIn = selectedCheckIn ?? fallbackCheckIn;
    const checkOut = selectedCheckOut ?? fallbackCheckOut;

    const available = await isListingAvailable(listing.id, checkIn, checkOut);
    if (!available) {
      setErrorMessage('Bu tarih aralığında bu ilan dolu, lütfen başka tarih seçin.');
      setSubmitting(false);
      return;
    }

    const result = await createBooking({
      listingId: listing.id,
      guestId: profile.id,
      checkIn,
      checkOut,
      guestsCount: guests,
      totalPrice: total,
      checkInSlotStart: selectedSlot.start,
      checkInSlotEnd: selectedSlot.end,
      extras: {
        options: extrasState,
        note: extrasNote.trim() || null,
      },
    });

    if (result) {
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => {
        router.push('/profile?tab=bookings');
      }, 1500);
      return;
    }

    setSubmitting(false);
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
              {/* Left Column: Form & Info */}
              <div className="lg:col-span-7 space-y-12">
                {/* Trip Selection Summary */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-4">Seyahatiniz</h2>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Tarihler
                      </div>
                      <div className="text-lg font-bold">
                        {nights} gece
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Misafirler
                      </div>
                    <div className="text-lg font-bold">{guests} misafir</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Giriş Saati Aralığı
                    </div>
                    <select
                      value={checkInSlotKey}
                      onChange={(e) => setCheckInSlotKey(e.target.value)}
                      className="w-full h-11 px-3 rounded-2xl border border-border bg-background text-sm"
                    >
                      <option value="">Seçiniz</option>
                      {checkInSlots.map((slot) => (
                        <option key={slot.key} value={slot.key}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      Yaklaşık ne zaman giriş yapacağınızı seçin. Ev sahibi hazırlığını buna göre yapar.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Ek Hizmetler / Tercihler
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={extrasState.parking}
                          onChange={(e) =>
                            setExtrasState((prev) => ({ ...prev, parking: e.target.checked }))
                          }
                        />
                        <span>Otopark istiyorum</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={extrasState.babyBed}
                          onChange={(e) =>
                            setExtrasState((prev) => ({ ...prev, babyBed: e.target.checked }))
                          }
                        />
                        <span>Bebek yatağı talep ediyorum</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={extrasState.extraCleaning}
                          onChange={(e) =>
                            setExtrasState((prev) => ({
                              ...prev,
                              extraCleaning: e.target.checked,
                            }))
                          }
                        />
                        <span>Ekstra temizlik hizmeti talep ediyorum</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={extrasState.withPet}
                          onChange={(e) =>
                            setExtrasState((prev) => ({ ...prev, withPet: e.target.checked }))
                          }
                        />
                        <span>Evcil hayvan ile geleceğim</span>
                      </label>
                    </div>
                    </div>
                  </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Ev Sahibine Notunuz
                  </div>
                  <textarea
                    value={extrasNote}
                    onChange={(e) => setExtrasNote(e.target.value)}
                    className="w-full min-h-[72px] rounded-2xl border border-border bg-background px-3 py-2 text-sm resize-none"
                    placeholder="Örneğin, geç giriş yapacağım, özel beslenme tercihlerim var vb."
                  />
                </div>
                </section>

                {/* Payment Section */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <h2 className="text-2xl font-bold">Ödeme Yöntemi</h2>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-muted rounded border border-border/50" />
                        <div className="w-10 h-6 bg-muted rounded border border-border/50" />
                        <div className="w-10 h-6 bg-muted rounded border border-border/50" />
                      </div>
                    </div>

                    {/* Kart formu şu an dummy, gerçek ödeme sağlayıcısına bağlanmadı */}
                    <div className="space-y-4 opacity-70 pointer-events-none">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
                            Kart Sahibi
                          </label>
                          <input
                            type="text"
                            placeholder="Caner Yaman"
                            className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border font-medium"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
                            Kart Numarası
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="w-full h-14 px-5 pr-12 rounded-2xl bg-muted/50 border border-border font-medium font-mono"
                            />
                            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
                            Son Kullanma Tarihi
                          </label>
                          <input
                            type="text"
                            placeholder="AA/YY"
                            className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border font-medium font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              placeholder="***"
                              className="w-full h-14 px-5 pr-12 rounded-2xl bg-muted/50 border border-border font-medium font-mono"
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
                      <span className="font-bold text-foreground">Esnek:</span> Belirli bir tarihe kadar
                      ücretsiz iptal edebilirsiniz. Bu tarihten sonra yapılan iptallerde iade yapılmaz.
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
                      disabled={submitting || !profile || success}
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
                        'Rezervasyonu Tamamla ve Öde'
                      )}
                    </Button>
                    {errorMessage && (
                      <p className="text-xs text-red-500 text-center">
                        {errorMessage}
                      </p>
                    )}
                    {!profile && (
                      <p className="text-xs text-red-500 text-center">
                        Rezervasyon tamamlamak için önce giriş yapmalısınız.
                      </p>
                    )}
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      \"Rezervasyonu Tamamla ve Öde\" butonuna tıklayarak Hizmet Şartlarımızı ve İptal Politikamızı
                      kabul etmiş olursunuz.
                    </p>
                  </div>
                </form>
              </div>

              {/* Right Column: Listing & Price Summary */}
              <div className="lg:col-span-5 sticky top-28">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-foreground/5 text-foreground border-none font-bold">
                      Premium Seçenek
                    </Badge>
                  </div>

                  {/* Listing Card Minimal */}
                  <div className="flex gap-4 pb-8 border-b border-border">
                    <div className="w-32 h-24 rounded-2xl overflow-hidden relative shrink-0 shadow-lg">
                      <Image
                        src={
                          listing.images[0] ??
                          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
                        }
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">
                        Mülk Sahibi: {listing.host?.fullName ?? 'Ev Sahibi'}
                      </div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-2">{listing.title}</h3>
                      <div className="flex items-center gap-1.5 mt-2 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{listing.rating.toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          ({listing.totalReviews} yorum)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Fiyat Özeti</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-medium">
                          ₺{listing.pricePerNight.toLocaleString('tr-TR')} x {nights} gece
                        </span>
                        <span className="font-bold text-foreground">
                          ₺{subtotal.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-medium">Temizlik ücreti</span>
                        <span className="font-bold text-foreground">
                          ₺{cleaningFee.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-medium">StayHub hizmet bedeli</span>
                        <span className="font-bold text-foreground">
                          ₺{serviceFee.toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t-2 border-dashed font-black text-2xl text-foreground">
                      <span>{t.listingTotal as string}</span>
                      <span>₺{total.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>

                  {/* Info Badges */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-muted/30 rounded-2xl text-center space-y-1">
                      <Lock className="w-5 h-5 mx-auto text-muted-foreground" />
                      <div className="text-[10px] font-black uppercase text-muted-foreground">
                        Güvenli Ödeme
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-2xl text-center space-y-1">
                      <ShieldCheck className="w-5 h-5 mx-auto text-muted-foreground" />
                      <div className="text-[10px] font-black uppercase text-muted-foreground">
                        StayHub Koruma
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
