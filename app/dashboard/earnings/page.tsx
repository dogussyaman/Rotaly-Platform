'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Loader2, TrendingUp, Clock, XCircle, BarChart3, Building2,
  Users, CalendarDays, ArrowUpRight, ArrowDownRight, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

import { formatCurrency } from '@/lib/format';
import { fetchHostByUserId, fetchHostEarningsFull } from '@/lib/supabase/host';
import type { EarningsStats, ListingPerformance, RecentBookingRow, EarningsByMonth } from '@/lib/supabase/host';
import { useAppSelector } from '@/lib/store/hooks';

const PLATFORM_COMMISSION_RATE = 0.10; // %10 platform komisyonu
const PERIOD_OPTIONS = [
  { label: '3 Ay', value: 3 },
  { label: '6 Ay', value: 6 },
  { label: '12 Ay', value: 12 },
] as const;

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  confirmed: { label: 'Onaylandı', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  completed: { label: 'Tamamlandı', dot: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50' },
  pending:   { label: 'Bekliyor',   dot: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50'  },
  cancelled: { label: 'İptal',      dot: 'bg-rose-500',   text: 'text-rose-700',   bg: 'bg-rose-50'   },
};

function KpiCard({
  icon: Icon, label, value, sub, variant = 'default',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  variant?: 'default' | 'emerald' | 'amber' | 'rose';
}) {
  const variants = {
    default: { icon: 'bg-primary/10 text-primary', border: 'border-border/60' },
    emerald: { icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200/60' },
    amber:   { icon: 'bg-amber-100 text-amber-600',   border: 'border-amber-200/60'   },
    rose:    { icon: 'bg-rose-100 text-rose-600',     border: 'border-rose-200/60'     },
  };
  const v = variants[variant];
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border bg-card px-5 py-4 ${v.border}`}>
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${v.icon}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-primary">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function EarningsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [period, setPeriod] = useState<3 | 6 | 12>(12);
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [byMonth, setByMonth] = useState<EarningsByMonth[]>([]);
  const [byListing, setByListing] = useState<ListingPerformance[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      setLoading(true);
      const host = await fetchHostByUserId(profile.id);
      if (!host) { setLoading(false); return; }
      const data = await fetchHostEarningsFull(host.hostId, period);
      setStats(data.stats);
      setByMonth(data.byMonth);
      setByListing(data.byListing);
      setRecentBookings(data.recentBookings);
      setLoading(false);
    }
    void load();
  }, [profile?.id, period]);

  const netRevenue = useMemo(
    () => stats ? Math.round(stats.grossRevenue * (1 - PLATFORM_COMMISSION_RATE)) : 0,
    [stats],
  );
  const commission = useMemo(
    () => stats ? Math.round(stats.grossRevenue * PLATFORM_COMMISSION_RATE) : 0,
    [stats],
  );
  const peakMonth = useMemo(
    () => byMonth.length ? byMonth.reduce((a, b) => (b.total > a.total ? b : a), byMonth[0]) : null,
    [byMonth],
  );

  if (loading) {
    return (
      <div className="flex h-75 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gelir & Gider</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Onaylı ve tamamlanan rezervasyonlara göre hesaplanır.
          </p>
        </div>
        {/* Period selector */}
        <div className="flex rounded-xl border border-border/70 bg-muted/30 p-1 gap-1 w-fit">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                period === opt.value
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard
          icon={TrendingUp}
          label="Brüt Kazanç"
          value={formatCurrency(stats?.grossRevenue ?? 0)}
          sub={`${stats?.confirmedCount ?? 0} rezervasyon`}
          variant="emerald"
        />
        <KpiCard
          icon={ArrowUpRight}
          label="Net Kazanç"
          value={formatCurrency(netRevenue)}
          sub={`%${Math.round(PLATFORM_COMMISSION_RATE * 100)} komisyon düşüldü`}
          variant="default"
        />
        <KpiCard
          icon={ArrowDownRight}
          label="Platform Komisyonu"
          value={formatCurrency(commission)}
          sub={`%${Math.round(PLATFORM_COMMISSION_RATE * 100)} oran`}
          variant="default"
        />
        <KpiCard
          icon={Clock}
          label="Onay Bekleyen"
          value={formatCurrency(stats?.pendingRevenue ?? 0)}
          sub={`${stats?.pendingCount ?? 0} rezervasyon`}
          variant="amber"
        />
        <KpiCard
          icon={XCircle}
          label="İptal Edilen"
          value={`${stats?.cancelledCount ?? 0} adet`}
          sub="Bu dönemde"
          variant="rose"
        />
      </div>

      {/* Avg + Peak insight row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1 flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ort. Rezervasyon</p>
            <p className="text-lg font-bold">{formatCurrency(stats?.avgBookingValue ?? 0)}</p>
          </div>
        </div>
        {peakMonth && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
              <CalendarDays className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Zirve Ay</p>
              <p className="text-lg font-bold">{peakMonth.label}</p>
              <p className="text-[11px] text-muted-foreground">{formatCurrency(peakMonth.total)}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
            <Building2 className="h-4 w-4 text-sky-600" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Aktif İlan</p>
            <p className="text-lg font-bold">{byListing.length}</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 xl:grid-cols-5">
        {/* Area chart — monthly revenue */}
        <div className="xl:col-span-3 rounded-2xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Aylık Gelir Trendi</h2>
              <p className="text-xs text-muted-foreground">Onaylı + tamamlanan rezervasyonlar</p>
            </div>
          </div>
          {byMonth.every((m) => m.total === 0) ? (
            <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
              Bu dönemde gelir verisi yok.
            </div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={byMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--chart-1)', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Listing performance */}
        <div className="xl:col-span-2 rounded-2xl border border-border/60 bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">İlan Performansı</h2>
            <p className="text-xs text-muted-foreground">Toplam gelire katkı oranı</p>
          </div>
          {byListing.length === 0 ? (
            <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
              Veri yok.
            </div>
          ) : (
            <div className="space-y-4">
              {byListing.slice(0, 6).map((l, i) => {
                const colors = [
                  'bg-primary', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5', 'bg-violet-500',
                ];
                return (
                  <div key={l.listingId} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="truncate text-xs font-medium">{l.listingTitle}</span>
                      </div>
                      <div className="ml-2 flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">{l.bookingsCount} rez.</span>
                        <span className="text-xs font-bold">{formatCurrency(l.total)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                        style={{ width: `${l.pct}%` }}
                      />
                    </div>
                    <p className="text-right text-[10px] text-muted-foreground">{l.pct}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent bookings feed */}
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Son Rezervasyonlar</h2>
            <p className="text-xs text-muted-foreground">Bu döneme ait tüm durumlar</p>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        {recentBookings.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Bu dönemde rezervasyon yok.
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-2 px-5 py-3 hover:bg-muted/20 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                {/* left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{b.listingTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.guestName ?? 'Misafir'} · {b.nights} gece · {b.guestsCount} kişi
                    </p>
                  </div>
                </div>

                {/* middle */}
                <div className="flex items-center gap-3 sm:gap-6 pl-12 sm:pl-0">
                  <div className="text-xs text-muted-foreground">
                    <span>{b.checkIn}</span>
                    <span className="mx-1">→</span>
                    <span>{b.checkOut}</span>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {/* right */}
                <div className="pl-12 sm:pl-0 text-right">
                  <p className={`text-sm font-bold ${b.status === 'cancelled' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {formatCurrency(b.totalPrice)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {b.status !== 'cancelled' ? `Net: ${formatCurrency(Math.round(b.totalPrice * (1 - PLATFORM_COMMISSION_RATE)))}` : 'İptal edildi'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground pb-2">
        * Net kazanç hesaplaması %{Math.round(PLATFORM_COMMISSION_RATE * 100)} platform komisyonu baz alınarak yapılmaktadır.
        Vergi ve diğer kesintiler ayrıca uygulanabilir.
      </p>
    </div>
  );
}
