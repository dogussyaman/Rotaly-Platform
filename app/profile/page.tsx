'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Calendar, Users, Star, TicketPercent } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchUserBookings, type BookingWithListing } from '@/lib/supabase/bookings';
import { fetchWishlists, fetchLoyaltySummary, fetchTourBookings, type WishlistSummary, type LoyaltySummary, type TourBookingSummary } from '@/lib/supabase/profile';

export default function ProfilePage() {
  const { profile } = useAppSelector((s) => s.user);
  const [bookings, setBookings] = useState<BookingWithListing[]>([]);
  const [wishlists, setWishlists] = useState<WishlistSummary[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBookingSummary[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const [bookingData, wishlistData, loyaltyData, tourData] = await Promise.all([
        fetchUserBookings(profile.id),
        fetchWishlists(profile.id),
        fetchLoyaltySummary(profile.id),
        fetchTourBookings(profile.id),
      ]);
      setBookings(bookingData);
      setWishlists(wishlistData);
      setLoyalty(loyaltyData);
      setTourBookings(tourData);
      setLoading(false);
    };
    load();
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {/* Auth guard */}
          {!profile && !loading && (
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-2">Profil için giriş yapmanız gerekiyor</h1>
              <p className="text-muted-foreground mb-6">
                Rezervasyonlarınızı görmek ve favorilerinizi yönetmek için lütfen giriş yapın.
              </p>
              <Link href="/auth/login">
                <Button size="lg" className="rounded-2xl px-8">
                  Giriş Yap
                </Button>
              </Link>
            </div>
          )}

          {profile && (
            <>
              {/* Üst profil kartı */}
              <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.fullName ?? profile.email}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black text-foreground">
                        {(profile.fullName ?? profile.email).charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      {profile.fullName ?? profile.email}
                    </h1>
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                      Misafir hesabı
                    </Badge>
                    {profile.isHost && (
                      <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-foreground text-card">
                        Ev Sahibi
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {profile.points.toLocaleString('tr-TR')} sadakat puanı
                    </span>
                    {loyalty && (
                      <span className="flex items-center gap-1">
                        <TicketPercent className="w-3 h-3" />
                        Toplam {loyalty.lifetimePoints.toLocaleString('tr-TR')} puan kazanıldı
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Konaklama Rezervasyonları */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Rezervasyonlarım</h2>
                  <Link href="/search">
                    <Button variant="outline" size="sm" className="rounded-2xl px-4">
                      Yeni konaklama ara
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="border border-dashed border-border rounded-3xl py-10 px-6 text-center">
                    <p className="text-muted-foreground mb-2">Henüz bir rezervasyonunuz yok.</p>
                    <p className="text-xs text-muted-foreground">
                      İlk seyahatinizi planlamak için arama sayfasını kullanabilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const checkIn = new Date(booking.checkIn);
                      const checkOut = new Date(booking.checkOut);
                      const nights =
                        Math.max(
                          1,
                          Math.ceil(
                            Math.abs(checkOut.getTime() - checkIn.getTime()) /
                              (1000 * 60 * 60 * 24),
                          ),
                        );

                      return (
                        <Link
                          key={booking.id}
                          href={booking.listing ? `/listing/${booking.listing.id}` : '#'}
                        >
                          <div className="rounded-3xl border border-border bg-card/50 hover:bg-card/80 transition-colors p-4 md:p-5 flex gap-4 md:gap-6">
                            {booking.listing?.imageUrl && (
                              <div className="relative w-28 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                <Image
                                  src={booking.listing.imageUrl}
                                  alt={booking.listing.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-sm md:text-base truncate">
                                  {booking.listing?.title ?? 'Silinmiş ilan'}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5"
                                >
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
                                {booking.listing && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {[booking.listing.city, booking.listing.country]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(checkIn, 'dd MMM', { locale: tr })} -{' '}
                                  {format(checkOut, 'dd MMM yyyy', { locale: tr })} ({nights} gece)
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {booking.guestsCount} misafir
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-semibold">
                                  Toplam:{' '}
                                  <span className="font-bold">
                                    ₺{booking.totalPrice.toLocaleString('tr-TR')}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Tur Rezervasyonları */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Tur Rezervasyonlarım</h2>
                  <Link href="/tours">
                    <Button variant="outline" size="sm" className="rounded-2xl px-4">
                      Turları keşfet
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : tourBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Henüz bir tur rezervasyonunuz yok.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tourBookings.map((tour) => (
                      <div
                        key={tour.id}
                        className="rounded-2xl border border-border bg-card/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {tour.tourTitle ?? 'Tur'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {[tour.city, tour.country].filter(Boolean).join(', ')}
                            </span>
                            {tour.startTime && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(tour.startTime), 'dd MMM yyyy HH:mm', { locale: tr })}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {tour.participants} kişi
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-bold">
                            ₺{tour.totalPrice.toLocaleString('tr-TR')}
                          </div>
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {tour.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Favori Listelerim */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Listelerim (Wishlist)</h2>
                  <Link href="/search">
                    <Button variant="outline" size="sm" className="rounded-2xl px-4">
                      Yeni yerler keşfet
                    </Button>
                  </Link>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : wishlists.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Henüz bir favori listeniz yok. İlan kartlarındaki kalp ikonuna tıklayarak oluşturabilirsiniz.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlists.map((wl) => (
                      <div
                        key={wl.id}
                        className="rounded-2xl border border-border bg-card/40 px-4 py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold">{wl.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {wl.itemsCount} ilan •{' '}
                            {format(new Date(wl.createdAt), 'dd MMM yyyy', { locale: tr })} oluşturuldu
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          Gör
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Puan İşlemleri */}
              {loyalty && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Puan Hareketleri</h2>
                  </div>
                  {loyalty.lastTransactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Henüz puan kazanımı veya kullanımı kaydedilmemiş.
                    </p>
                  ) : (
                    <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
                      <div className="divide-y divide-border text-sm">
                        {loyalty.lastTransactions.map((tx) => (
                          <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {tx.description ?? (tx.type === 'earn' ? 'Puan kazanımı' : tx.type === 'redeem' ? 'Puan kullanımı' : 'Puan ayarı')}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {format(new Date(tx.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                              </p>
                            </div>
                            <div className={`text-sm font-bold ${tx.type === 'redeem' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {tx.type === 'redeem' ? '-' : '+'}{tx.points}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <MainFooter />
    </div>
  );
}

