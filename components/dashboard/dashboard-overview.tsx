'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Gift,
  Home,
  MessageSquare,
  Star,
  Users,
  ArrowRight,
  CheckCircle2,
  TicketPercent,
  Clock3,
  ClipboardCheck,
  MessageCircleMore,
  CalendarCheck2,
} from 'lucide-react';
import { DashboardOverviewSkeleton } from '@/components/dashboard/dashboard-skeletons';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';
import { Section, StatCard } from '@/components/dashboard/dashboard-ui';
import { fetchHostByUserId, fetchHostStats, fetchHostBookings, type HostBooking, HostStats } from '@/lib/supabase/host';
import { fetchAdminStats, type AdminStatRow } from '@/lib/supabase/dashboard-stats';
import { useLocale } from '@/lib/i18n/locale-context';
import type { Locale } from '@/lib/i18n/translations';

const NUMBER_LOCALES: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
};

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

export function DashboardOverview() {
  const { t, locale } = useLocale();
  const numberLocale = NUMBER_LOCALES[locale];
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
          const stats = await fetchAdminStats(numberLocale);
          setAdminStats(stats);
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [role, profile?.id, numberLocale]);

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

  const stats = useMemo(() => {
    if (role === 'admin') {
      const meta = [
        { title: t.dashboardAdminStat1Title as string, helper: t.dashboardAdminStat1Helper as string },
        { title: t.dashboardAdminStat2Title as string, helper: t.dashboardAdminStat2Helper as string },
        { title: t.dashboardAdminStat3Title as string, helper: t.dashboardAdminStat3Helper as string },
        { title: t.dashboardAdminStat4Title as string, helper: t.dashboardAdminStat4Helper as string },
      ];
      return adminStats.map((stat, index) => ({
        ...stat,
        title: meta[index]?.title ?? stat.title,
        helper: meta[index]?.helper ?? stat.helper,
        icon: ADMIN_ICONS[index],
      }));
    }
    if (!hostStats) return [];
    return [
      {
        title: t.dashboardStatRevenue as string,
        value: `₺${hostStats.thisMonthEarnings.toLocaleString(numberLocale)}`,
        change: '—',
        helper: t.dashboardStatRevenueHelper as string,
        icon: HOST_ICONS[0],
      },
      {
        title: t.dashboardStatUpcoming as string,
        value: hostStats.upcomingCheckins.toString(),
        change: '—',
        helper: t.dashboardStatUpcomingHelper as string,
        icon: HOST_ICONS[1],
      },
      {
        title: t.dashboardStatRating as string,
        value: hostStats.averageRating.toFixed(1),
        change: '—',
        helper: `${hostStats.reviewCount} ${t.dashboardStatRatingHelper as string}`,
        icon: HOST_ICONS[2],
      },
      {
        title: t.dashboardStatMessages as string,
        value: hostStats.unreadMessages.toString(),
        change: '—',
        helper: t.dashboardStatMessagesHelper as string,
        icon: HOST_ICONS[3],
      },
    ];
  }, [role, adminStats, hostStats, t, numberLocale]);

  const links = useMemo(
    () =>
      role === 'admin'
        ? [
            {
              title: t.dashboardLinkApplications as string,
              description: t.dashboardLinkApplicationsDesc as string,
              href: '/dashboard/applications',
            },
            {
              title: t.dashboardLinkRoles as string,
              description: t.dashboardLinkRolesDesc as string,
              href: '/dashboard/roles',
            },
            {
              title: t.dashboardLinkListingsAdmin as string,
              description: t.dashboardLinkListingsAdminDesc as string,
              href: '/dashboard/listings',
            },
            {
              title: t.dashboardLinkCoupons as string,
              description: t.dashboardLinkCouponsDesc as string,
              href: '/dashboard/coupons',
            },
          ]
        : [
            {
              title: t.dashboardLinkListingsHost as string,
              description: t.dashboardLinkListingsHostDesc as string,
              href: '/dashboard/listings',
            },
            {
              title: t.dashboardLinkAvailability as string,
              description: t.dashboardLinkAvailabilityDesc as string,
              href: '/dashboard/availability',
            },
            {
              title: t.dashboardLinkBookings as string,
              description: t.dashboardLinkBookingsDesc as string,
              href: '/dashboard/bookings',
            },
            {
              title: t.dashboardLinkMessages as string,
              description: t.dashboardLinkMessagesDesc as string,
              href: '/dashboard/messages',
            },
          ],
    [role, t],
  );

  const todoItems = useMemo(
    () =>
      role === 'admin'
        ? [
            {
              title: t.dashboardTodoAdmin1Title as string,
              description: t.dashboardTodoAdmin1Desc as string,
              href: '/dashboard/applications',
            },
            {
              title: t.dashboardTodoAdmin2Title as string,
              description: t.dashboardTodoAdmin2Desc as string,
              href: '/dashboard/hosts',
            },
            {
              title: t.dashboardTodoAdmin3Title as string,
              description: t.dashboardTodoAdmin3Desc as string,
              href: '/dashboard/coupons',
            },
            {
              title: t.dashboardTodoAdmin4Title as string,
              description: t.dashboardTodoAdmin4Desc as string,
              href: '/dashboard/reports',
            },
          ]
        : [
            {
              title: t.dashboardTodoHost1Title as string,
              description: t.dashboardTodoHost1Desc as string,
              href: '/dashboard/listings',
            },
            {
              title: t.dashboardTodoHost2Title as string,
              description: t.dashboardTodoHost2Desc as string,
              href: '/dashboard/availability',
            },
            {
              title: t.dashboardTodoHost3Title as string,
              description: t.dashboardTodoHost3Desc as string,
              href: '/dashboard/availability',
            },
            {
              title: t.dashboardTodoHost4Title as string,
              description: t.dashboardTodoHost4Desc as string,
              href: '/dashboard/messages',
            },
          ],
    [role, t],
  );

  const weekdays = t.dashboardWeekdays as string[];

  if (loading) return <DashboardOverviewSkeleton />;

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
                <h3 className="text-sm font-semibold text-foreground">{t.dashboardQuickTitle as string}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.dashboardQuickSubtitle as string}</p>
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
                  <span className="text-sm font-medium text-foreground">{t.dashboardQuickPending as string}</span>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {pendingBookingsCount}
                </span>
              </Link>

              <Link
                href="/dashboard/bookings"
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:bg-accent/60"
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{t.dashboardQuickToday as string}</span>
                </div>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {todayCheckinsCount}
                </span>
              </Link>

              <Link
                href="/dashboard/messages"
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:bg-accent/60"
              >
                <div className="flex items-center gap-2">
                  <MessageCircleMore className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{t.dashboardQuickMsgCenter as string}</span>
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
                  <span className="text-sm font-medium text-foreground">{t.dashboardQuickCalendar as string}</span>
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
                <h3 className="text-sm font-semibold text-foreground">{t.dashboardCalTitle as string}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.dashboardCalSubtitle as string}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-lg">
                <Link href="/dashboard/bookings">{t.dashboardCalViewAll as string}</Link>
              </Button>
            </div>
            {role === 'host' && hostStats ? (
              <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
                <div className="mb-2 text-center text-xs font-medium text-muted-foreground">
                  {calendarMonth.toLocaleDateString(numberLocale, { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {weekdays.map((w) => (
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
                <p className="text-sm text-muted-foreground">{t.dashboardCalHostOnly as string}</p>
              </div>
            )}
          </div>
          {role === 'host' && upcomingBookings.length > 0 && (
            <div className="rounded-xl border border-border/70 bg-card/90 p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-semibold text-foreground">{t.dashboardUpcomingTitle as string}</h3>
              <ul className="mt-3 space-y-2">
                {upcomingBookings.map((b) => (
                  <li key={b.id}>
                    <Link
                      href={`/dashboard/bookings/${b.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm transition-colors hover:bg-accent/60"
                    >
                      <span className="font-medium">{b.listingTitle ?? (t.dashboardListingFallback as string)}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(b.checkIn).toLocaleDateString(numberLocale)} ·{' '}
                        {b.guestName ?? (t.dashboardGuestFallback as string)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" size="sm" className="mt-2 w-full rounded-lg text-primary">
                <Link href="/dashboard/bookings">{t.dashboardUpcomingAll as string}</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-[0_6px_18px_-6px_rgba(13,148,136,0.25)] sm:p-6">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold">{t.dashboardQuickActionsTitle as string}</h3>
              <p className="mt-0.5 text-xs text-primary-foreground/70">{t.dashboardQuickActionsSubtitle as string}</p>
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
                <h3 className="text-sm font-semibold text-foreground">{t.dashboardTodosTitle as string}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.dashboardTodosSubtitle as string}</p>
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
                <h3 className="text-sm font-semibold text-foreground">{t.dashboardCampaignTitle as string}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.dashboardCampaignSubtitle as string}</p>
              </div>
              <TicketPercent className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <div>
                  <p className="font-semibold text-foreground">ROTAYAZ20</p>
                  <p className="text-muted-foreground">{t.dashboardCouponSummerDesc as string}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    38 {t.dashboardCouponBookings as string}
                  </p>
                  <p className="text-[11px] text-emerald-600">
                    {t.dashboardCouponRevenue as string} ₺120k
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <div>
                  <p className="font-semibold text-foreground">UZUNKAL15</p>
                  <p className="text-muted-foreground">{t.dashboardCouponLongDesc as string}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    21 {t.dashboardCouponBookings as string}
                  </p>
                  <p className="text-[11px] text-emerald-600">
                    {t.dashboardCouponOcc as string} +12%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                <div>
                  <p className="font-semibold text-foreground">SONDKAÇIS</p>
                  <p className="text-muted-foreground">{t.dashboardCouponLastDesc as string}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    14 {t.dashboardCouponBookings as string}
                  </p>
                  <p className="text-[11px] text-emerald-600">{t.dashboardCouponSave as string}</p>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">{t.dashboardCampaignFoot as string}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
