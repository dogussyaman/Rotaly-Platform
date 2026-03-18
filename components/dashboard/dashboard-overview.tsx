'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Gift, Home, MessageSquare, Star, Users, Loader2, ArrowRight, CheckCircle2, TicketPercent, Clock3, ClipboardCheck, MessageCircleMore, CalendarCheck2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';
import { Section, StatCard } from '@/components/dashboard/dashboard-ui';
import { fetchHostByUserId, fetchHostStats, fetchHostBookings, type HostBooking, HostStats } from '@/lib/supabase/host';
import { fetchAdminStats, type AdminStatRow } from '@/lib/supabase/dashboard-stats';

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

function getDaysInMonth(month: Date): (Date | null)[] {
  const y = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const days: (Date | null)[] = Array(startPad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(y, m, d));
  return days;
}

const ADMIN_ICONS = [Users, Home, Calendar, Star] as const;
const HOST_ICONS = [Gift, Calendar, Star, MessageSquare] as const;

function QuickLink({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-border/70 bg-card/90 px-4 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-colors hover:border-primary/30 hover:bg-accent/60 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]"
    >
      <div>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
    </Link>
  );
}

export function DashboardOverview() {
  const { profile } = useAppSelector((s) => s.user);
  const [hostStats, setHostStats] = useState<HostStats | null>(null);
  const [hostBookings, setHostBookings] = useState<HostBooking[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStatRow[]>([]);
  const [loading, setLoading] = useState(true);

  const role: 'admin' | 'host' = profile?.isAdmin ? 'admin' : 'host';

  useEffect(() => {
    async function loadStats() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }
      try {
        if (role === 'host') {
          const host = await fetchHostByUserId(profile.id);
          if (host) {
            const [stats, bookings] = await Promise.all([
              fetchHostStats(host.hostId, profile.id),
              fetchHostBookings(host.hostId),
            ]);
            setHostStats(stats);
            setHostBookings(bookings);
          }
        } else {
          const stats = await fetchAdminStats();
          setAdminStats(stats);
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [role, profile?.id]);

  const calendarMonth = new Date();
  const daysWithBookings = new Set<string>();
  hostBookings.forEach((b) => {
    const start = new Date(b.checkIn);
    const end = new Date(b.checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      daysWithBookings.add(d.toISOString().slice(0, 10));
    }
  });
  const upcomingBookings = hostBookings
    .filter((b) => b.status === 'confirmed' && new Date(b.checkIn) >= new Date())
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .slice(0, 5);

  const todayStr = new Date().toISOString().slice(0, 10);
  const pendingBookingsCount = hostBookings.filter((b) => b.status === 'pending').length;
  const todayCheckinsCount = hostBookings.filter(
    (b) => b.status === 'confirmed' && b.checkIn.slice(0, 10) === todayStr,
  ).length;

  const stats =
    role === 'admin'
      ? adminStats.map((stat, index) => ({ ...stat, icon: ADMIN_ICONS[index] }))
      : hostStats
        ? [
            {
              title: 'Bu Ay Gelir',
              value: `₺${hostStats.thisMonthEarnings.toLocaleString('tr-TR')}`,
              change: '—',
              helper: 'Geçen aya göre',
              icon: HOST_ICONS[0],
            },
            {
              title: 'Yaklaşan Giriş',
              value: hostStats.upcomingCheckins.toString(),
              change: '—',
              helper: 'Gelecek 7 gün',
              icon: HOST_ICONS[1],
            },
            {
              title: 'Ortalama Puan',
              value: hostStats.averageRating.toFixed(1),
              change: '—',
              helper: `${hostStats.reviewCount} yorum`,
              icon: HOST_ICONS[2],
            },
            {
              title: 'Yeni Mesaj',
              value: hostStats.unreadMessages.toString(),
              change: '—',
              helper: 'Okunmamış',
              icon: HOST_ICONS[3],
            },
          ]
        : [];

  const links =
    role === 'admin'
      ? [
          { title: 'Kullanıcılar', description: 'Profil ve rol yönetimi', href: '/dashboard/users' },
          { title: 'İlanlar', description: 'İlan, görsel, imkan', href: '/dashboard/listings' },
          { title: 'Rezervasyonlar', description: 'Durum ve ödeme takibi', href: '/dashboard/bookings' },
          { title: 'Raporlar', description: 'Finansal ve operasyon', href: '/dashboard/reports' },
        ]
      : [
          { title: 'Otel ilanlarım', description: 'İlan yönetimi', href: '/dashboard/listings' },
          { title: 'Uygunluk', description: 'Takvim ve fiyat', href: '/dashboard/availability' },
          { title: 'Rezervasyonlar', description: 'Giriş/çıkış planı', href: '/dashboard/bookings' },
          { title: 'Mesajlar', description: 'Misafir iletişimi', href: '/dashboard/messages' },
        ];

  const todoItems =
    role === 'admin'
      ? [
          {
            title: 'Yeni ilanları doğrula',
            description: 'Görsel, konum ve içerik kalite kontrolü.',
            href: '/dashboard/listings',
          },
          {
            title: 'Ev sahibi performansı',
            description: 'Yanıt oranı ve iptal eğilimlerini gözden geçir.',
            href: '/dashboard/hosts',
          },
          {
            title: 'Fiyat ve kampanya denetimi',
            description: 'İndirim/zam kuralları ve kupon limitleri.',
            href: '/dashboard/coupons',
          },
          {
            title: 'Operasyon raporları',
            description: 'Gelir, risk ve doluluk özetleri.',
            href: '/dashboard/reports',
          },
        ]
      : [
          {
            title: 'İlan bilgilerini tamamla',
            description: 'Oda tipleri, görseller ve kurallar.',
            href: '/dashboard/listings',
          },
          {
            title: 'Uygunluk ve özel fiyat',
            description: 'Takvim, sezon/ay/uzun konaklama kuralları.',
            href: '/dashboard/availability',
          },
          {
            title: 'İndirim & zam kurgusu',
            description: 'Tarih, ay veya minimum gece bazlı kural ekle.',
            href: '/dashboard/availability',
          },
          {
            title: 'Mesaj ve check-in akışı',
            description: 'Misafir bilgilendirme ve hızlı yanıt şablonları.',
            href: '/dashboard/messages',
          },
        ];

  if (loading) {
    return (
      <div className="flex h-100 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </Section>

      {role === 'host' && (
        <Section title="" description="">
          <div className="rounded-xl border border-border/70 bg-card/90 p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Bugün için hızlı erişim</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">En çok kullanılan işlemler tek alanda</p>
              </div>
              <Clock3 className="h-4 w-4 text-primary" />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/dashboard/bookings?status=pending"
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:bg-accent/60"
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Onay Bekleyenler</span>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{pendingBookingsCount}</span>
              </Link>

              <Link
                href="/dashboard/bookings"
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:bg-accent/60"
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Bugünkü Girişler</span>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{todayCheckinsCount}</span>
              </Link>

              <Link
                href="/dashboard/messages"
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:bg-accent/60"
              >
                <div className="flex items-center gap-2">
                  <MessageCircleMore className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Mesaj Merkezi</span>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {hostStats?.unreadMessages ?? 0}
                </span>
              </Link>

              <Link
                href="/dashboard/availability"
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:bg-accent/60"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Takvim & Fiyat</span>
                </div>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>
        </Section>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card/90 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Rezervasyon Takvimi</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Bu ay dolu günler; tıklayınca rezervasyonlara gidin</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-lg">
                <Link href="/dashboard/bookings">Tümünü Gör</Link>
              </Button>
            </div>
            {role === 'host' && hostStats ? (
              <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="mb-2 text-center text-xs font-medium text-muted-foreground">
                  {calendarMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="py-1 text-center text-[10px] font-medium text-muted-foreground">
                      {w}
                    </div>
                  ))}
                  {getDaysInMonth(calendarMonth).map((d, i) => {
                    if (!d) return <div key={`pad-${i}`} />;
                    const dateStr = d.toISOString().slice(0, 10);
                    const hasBooking = daysWithBookings.has(dateStr);
                    return (
                      <Link
                        key={dateStr}
                        href="/dashboard/bookings"
                        className={`flex min-h-8 items-center justify-center rounded text-xs transition-colors ${
                          hasBooking
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {d.getDate()}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-50 w-full items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20">
                <p className="text-sm text-muted-foreground">Takvim ev sahibi panelinde görünür.</p>
              </div>
            )}
          </div>
          {role === 'host' && upcomingBookings.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-card/90 p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-foreground">Yaklaşan rezervasyonlar</h3>
              <ul className="mt-3 space-y-2">
                {upcomingBookings.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/dashboard/bookings/${b.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm transition-colors hover:bg-accent/60"
                    >
                      <span className="font-medium">{b.listingTitle ?? 'İlan'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(b.checkIn).toLocaleDateString('tr-TR')} · {b.guestName ?? 'Misafir'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" size="sm" className="mt-2 w-full rounded-lg text-primary">
                <Link href="/dashboard/bookings">Tüm rezervasyonlar</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-[0_6px_18px_-6px_rgba(13,148,136,0.25)] sm:p-6">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold">Hızlı İşlemler</h3>
              <p className="mt-0.5 text-xs text-primary-foreground/70">İşlemlerinizi hızlıca gerçekleştirin</p>
              <div className="mt-4 space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-lg bg-primary-foreground/10 px-3 py-2.5 transition-colors hover:bg-primary-foreground/15"
                  >
                    <span className="text-sm font-medium">{link.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-80" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary-foreground/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl" />
          </div>

          <div className="rounded-xl border border-border/70 bg-card/90 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Yapılacaklar</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Operasyonu hızlandıran öneriler</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 space-y-2">
              {todoItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 text-sm transition-colors hover:bg-accent/60"
                >
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/90 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Kampanya performansı (örnek)</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  En çok rezervasyon getiren indirim kurgularını hızlıca görün.
                </p>
              </div>
              <TicketPercent className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <div>
                  <p className="font-semibold text-foreground">ROTAYAZ20</p>
                  <p className="text-muted-foreground">Yaz sezonu %20 indirim kuponu</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">38 rezervasyon</p>
                  <p className="text-[11px] text-emerald-600">Toplam ciro: ₺120k</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <div>
                  <p className="font-semibold text-foreground">UZUNKAL15</p>
                  <p className="text-muted-foreground">7+ gece konaklamalarda %15</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">21 rezervasyon</p>
                  <p className="text-[11px] text-emerald-600">Doluluk artışı: +12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                <div>
                  <p className="font-semibold text-foreground">SONDKAÇIS</p>
                  <p className="text-muted-foreground">Son dakika %10 indirim</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">14 rezervasyon</p>
                  <p className="text-[11px] text-emerald-600">Boş gün kurtarma</p>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Bu blok konsept amaçlıdır; gerçek entegrasyonda veriler kupon ve rezervasyon tablolarından çekilecektir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
