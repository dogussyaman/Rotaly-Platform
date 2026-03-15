'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Gift, Home, MessageSquare, Star, Users, Loader2, ArrowRight } from 'lucide-react';

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
      className="flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-white/90 px-4 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] transition-colors hover:border-[#99f6e4] hover:bg-[#f0fdfa]/80 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]"
    >
      <div>
        <span className="text-sm font-semibold text-[#111]">{title}</span>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#0d9488]" />
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

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-white/90 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#111]">Rezervasyon Takvimi</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Bu ay dolu günler; tıklayınca rezervasyonlara gidin</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-lg border-[#e5e7eb] text-[#0d9488] hover:bg-[#f0fdfa]">
                <Link href="/dashboard/bookings">Tümünü Gör</Link>
              </Button>
            </div>
            {role === 'host' && hostStats ? (
              <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-3">
                <div className="mb-2 text-center text-xs font-medium text-[#6b7280]">
                  {calendarMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="py-1 text-center text-[10px] font-medium text-[#6b7280]">
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
                            ? 'bg-[#0d9488] text-white hover:bg-[#0f766e]'
                            : 'text-[#6b7280] hover:bg-[#e5e7eb]'
                        }`}
                      >
                        {d.getDate()}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#f9fafb]">
                <p className="text-sm text-muted-foreground">Takvim ev sahibi panelinde görünür.</p>
              </div>
            )}
          </div>
          {role === 'host' && upcomingBookings.length > 0 && (
            <div className="rounded-xl border border-[#e5e7eb] bg-white/90 p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-[#111]">Yaklaşan rezervasyonlar</h3>
              <ul className="mt-3 space-y-2">
                {upcomingBookings.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/dashboard/bookings/${b.id}`}
                      className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm transition-colors hover:bg-[#f0fdfa]"
                    >
                      <span className="font-medium">{b.listingTitle ?? 'İlan'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(b.checkIn).toLocaleDateString('tr-TR')} · {b.guestName ?? 'Misafir'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" size="sm" className="mt-2 w-full rounded-lg text-[#0d9488]">
                <Link href="/dashboard/bookings">Tüm rezervasyonlar</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-[#0d9488]/20 bg-linear-to-br from-[#0f766e] to-[#134e4a] p-5 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.25)] sm:p-6">
          <div className="relative z-10">
            <h3 className="text-sm font-semibold">Hızlı İşlemler</h3>
            <p className="mt-0.5 text-xs text-white/70">İşlemlerinizi hızlıca gerçekleştirin</p>
            <div className="mt-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2.5 transition-colors hover:bg-white/15"
                >
                  <span className="text-sm font-medium">{link.title}</span>
                  <ArrowRight className="h-4 w-4 opacity-80" />
                </Link>
              ))}
            </div>
          </div>
          <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        </div>
      </div>
    </div>
  );
}
