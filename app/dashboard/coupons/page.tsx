'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Loader2, Percent, TicketPercent, Trash2, Tag, Plus,
  TrendingDown, CheckCircle, AlertCircle, Users, Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { formatCurrency, formatDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { fetchHostByUserId } from '@/lib/supabase/host';
import { useAppSelector } from '@/lib/store/hooks';

type CouponRow = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_booking_total: number | null;
  expires_at: string | null;
  is_active: boolean;
};
type UsageRow = {
  id: string;
  discount_applied: number;
  coupons: { code: string } | null;
  profiles: { full_name: string | null } | null;
  booking_id: string | null;
};

function StatCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function CouponCard({
  coupon, onToggle, onDelete, toggling,
}: {
  coupon: CouponRow;
  onToggle: (c: CouponRow) => void;
  onDelete: (id: string) => void;
  toggling: boolean;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const isExpired = coupon.expires_at != null && coupon.expires_at < today;
  const isEffectivelyActive = coupon.is_active && !isExpired;

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-all duration-200 ${
        isEffectivelyActive
          ? 'border-primary/30 shadow-sm shadow-primary/5'
          : 'border-border/50 opacity-70'
      }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-colors ${
          isEffectivelyActive ? 'bg-primary' : 'bg-slate-300'
        }`}
      />

      {/* Code + toggle row */}
      <div className="flex items-start justify-between gap-2 pl-3">
        <div>
          <p className="font-mono text-lg font-bold tracking-widest text-foreground">{coupon.code}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge
              className={`rounded-full px-2 py-0 text-[10px] font-semibold border-transparent ${
                coupon.discount_type === 'percentage'
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-sky-100 text-sky-700'
              }`}
            >
              {coupon.discount_type === 'percentage' ? 'Yüzde' : 'Sabit Tutar'}
            </Badge>
            {isExpired && (
              <Badge className="rounded-full px-2 py-0 text-[10px] border-transparent bg-red-100 text-red-600">
                Süresi Dolmuş
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <Switch
            checked={coupon.is_active}
            onCheckedChange={() => onToggle(coupon)}
            disabled={toggling || isExpired}
            aria-label={coupon.is_active ? 'Pasif yap' : 'Aktif yap'}
          />
          <span className={`text-[10px] font-semibold ${isEffectivelyActive ? 'text-primary' : 'text-muted-foreground'}`}>
            {isEffectivelyActive ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="ml-3 border-t border-dashed border-border/60" />

      {/* Stats row */}
      <div className="ml-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="mb-0.5 text-[10px] text-muted-foreground">İndirim</p>
          <p className="text-sm font-bold text-foreground">
            {coupon.discount_type === 'percentage'
              ? `%${coupon.discount_value}`
              : formatCurrency(coupon.discount_value)}
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] text-muted-foreground">Min. Sepet</p>
          <p className="text-sm font-bold text-foreground">
            {coupon.min_booking_total != null ? formatCurrency(coupon.min_booking_total) : '—'}
          </p>
        </div>
        <div>
          <p className="mb-0.5 text-[10px] text-muted-foreground">Bitiş</p>
          <p className={`text-sm font-bold ${isExpired ? 'text-red-500' : 'text-foreground'}`}>
            {coupon.expires_at ? formatDate(coupon.expires_at) : '∞'}
          </p>
        </div>
      </div>

      {/* Delete button */}
      <div className="ml-3 flex justify-end">
        <button
          type="button"
          onClick={() => onDelete(coupon.id)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3 w-3" />
          Sil
        </button>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [usages, setUsages] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minTotal: '',
    expiresAt: '',
  });
  const { profile } = useAppSelector((s) => s.user);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      const supabase = createClient();
      const isAdmin = !!profile.isAdmin;
      const isHost = !!profile.isHost;
      let hostId: string | null = null;

      if (!isAdmin && isHost) {
        const host = await fetchHostByUserId(profile.id);
        hostId = host?.hostId ?? null;
        if (!hostId) {
          setCoupons([]);
          setUsages([]);
          setLoading(false);
          return;
        }
      }

      let couponsQuery = supabase
        .from('coupons')
        .select('id, code, discount_type, discount_value, min_booking_total, expires_at, is_active')
        .order('is_active', { ascending: false })
        .order('code');

      let usagesQuery = supabase
        .from('coupon_usages')
        .select('id, discount_applied, booking_id, coupons!inner(code, host_id), profiles(full_name)')
        .order('id', { ascending: false })
        .limit(30);

      if (!isAdmin && hostId) {
        couponsQuery = couponsQuery.eq('host_id', hostId);
        usagesQuery = usagesQuery.eq('coupons.host_id', hostId);
      }

      const [cRes, uRes] = await Promise.all([couponsQuery, usagesQuery]);
      setCoupons((cRes.data ?? []) as CouponRow[]);
      setUsages((uRes.data ?? []) as UsageRow[]);
      setLoading(false);
    }
    void load();
  }, [profile?.id, profile?.isAdmin, profile?.isHost]);

  const stats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter((c) => c.is_active && (!c.expires_at || c.expires_at >= today)).length,
    totalDiscount: usages.reduce((sum, u) => sum + Number(u.discount_applied ?? 0), 0),
    totalUsages: usages.length,
  }), [coupons, usages, today]);

  const handleCreate = async () => {
    if (!profile?.id || saving) return;
    const supabase = createClient();
    const isAdmin = !!profile.isAdmin;
    const isHost = !!profile.isHost;
    let hostId: string | null = null;

    if (!isAdmin && isHost) {
      const host = await fetchHostByUserId(profile.id);
      hostId = host?.hostId ?? null;
    }

    const valueNumber = Number(form.discountValue.replace(',', '.'));
    if (!form.code.trim() || !Number.isFinite(valueNumber) || valueNumber <= 0) return;

    setSaving(true);
    const { error } = await supabase.from('coupons').insert({
      code: form.code.trim().toUpperCase(),
      discount_type: form.discountType,
      discount_value: valueNumber,
      min_booking_total: form.minTotal ? Number(form.minTotal.replace(',', '.')) : null,
      expires_at: form.expiresAt || null,
      is_active: true,
      host_id: hostId,
    });
    setSaving(false);
    if (!error) {
      setForm({ code: '', discountType: 'percentage', discountValue: '', minTotal: '', expiresAt: '' });
      const supabaseReload = createClient();
      const { data } = await supabaseReload
        .from('coupons')
        .select('id, code, discount_type, discount_value, min_booking_total, expires_at, is_active')
        .order('is_active', { ascending: false })
        .order('code');
      setCoupons((data ?? []) as CouponRow[]);
    }
  };

  const handleToggle = async (coupon: CouponRow) => {
    setTogglingId(coupon.id);
    const supabase = createClient();
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !coupon.is_active })
      .eq('id', coupon.id);
    if (!error) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !coupon.is_active } : c)),
      );
    }
    setTogglingId(null);
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Bu kuponu silmek istediğinizden emin misiniz?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('coupons').delete().eq('id', couponId);
    if (!error) {
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    }
  };

  if (loading) {
    return (
      <div className="flex h-75 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kupon Yönetimi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          İndirim kodları oluşturun, aktif / pasif durumunu tek tıkla değiştirin.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Tag} label="Toplam Kupon" value={stats.total} color="bg-violet-100 text-violet-600" />
        <StatCard icon={CheckCircle} label="Aktif Kupon" value={stats.active} color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Users} label="Kullanım (Son 30)" value={stats.totalUsages} color="bg-sky-100 text-sky-600" />
        <StatCard icon={TrendingDown} label="Toplam İndirim" value={formatCurrency(stats.totalDiscount)} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Main layout */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Create form */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Yeni Kupon Oluştur</h2>
                <p className="text-xs text-muted-foreground">İndirim kampanyası başlat</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 flex items-start gap-2.5">
              <TicketPercent className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-snug">
                Oluşturduğunuz kod misafirlerin ödeme adımında gireceği{' '}
                <span className="font-semibold text-foreground">indirim kuponu</span> olarak kullanılır.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Kupon Kodu</label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  placeholder="Örn. ROTAYAZ20"
                  className="rounded-xl font-mono uppercase tracking-wider"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">İndirim Tipi</label>
                <div className="flex rounded-xl border border-border/70 bg-muted/30 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, discountType: 'percentage' }))}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      form.discountType === 'percentage'
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Percent className="h-3.5 w-3.5" />
                    Yüzde (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, discountType: 'fixed' }))}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      form.discountType === 'fixed'
                        ? 'bg-card text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Sabit (₺)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    {form.discountType === 'percentage' ? 'Oran (%)' : 'Tutar (₺)'}
                  </label>
                  <Input
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'percentage' ? '10' : '500'}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Min. Sepet (₺)</label>
                  <Input
                    value={form.minTotal}
                    onChange={(e) => setForm((f) => ({ ...f, minTotal: e.target.value }))}
                    placeholder="İsteğe bağlı"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Bitiş Tarihi</label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="rounded-xl"
                  min={today}
                />
                <p className="text-[10px] text-muted-foreground">Boş bırakırsanız süresiz geçerli olur.</p>
              </div>
            </div>

            <Button
              type="button"
              className="w-full rounded-xl"
              disabled={saving || !form.code.trim() || !form.discountValue.trim()}
              onClick={handleCreate}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Kuponu Oluştur
            </Button>
          </div>
        </div>

        {/* Right column: coupon cards + usages */}
        <div className="xl:col-span-2 space-y-6">
          {/* Coupon grid */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Kuponlar</h2>
              <span className="text-xs text-muted-foreground">{coupons.length} adet</span>
            </div>
            {coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-14 gap-3">
                <TicketPercent className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Henüz kupon oluşturulmadı</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {coupons.map((c) => (
                  <CouponCard
                    key={c.id}
                    coupon={c}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    toggling={togglingId === c.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Usage log */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Son Kullanımlar</h2>
              <span className="text-xs text-muted-foreground">Son 30 kayıt</span>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              {usages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Henüz kupon kullanımı yok</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {usages.map((u, idx) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold font-mono tracking-wide">
                            {(u.coupons as { code: string } | null)?.code ?? '—'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(u.profiles as { full_name: string | null } | null)?.full_name ?? 'Misafir'}
                            {u.booking_id && (
                              <span className="ml-1.5 opacity-60">· #{u.booking_id.slice(0, 8)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">−{formatCurrency(u.discount_applied)}</p>
                        <p className="text-[10px] text-muted-foreground">indirim uygulandı</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
