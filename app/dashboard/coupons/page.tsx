'use client';

import { useEffect, useState } from 'react';
import { Loader2, Percent, TicketPercent } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { fetchHostByUserId } from '@/lib/supabase/host';
import { useAppSelector } from '@/lib/store/hooks';

type CouponRow = { id: string; code: string; discount_type: string; discount_value: number; min_booking_total: number | null; expires_at: string | null; is_active: boolean };
type UsageRow = { id: string; discount_applied: number; coupons: { code: string } | null; profiles: { full_name: string | null } | null; booking_id: string | null };

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [usages, setUsages] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minTotal: '',
    expiresAt: '',
  });
  const { profile } = useAppSelector((s) => s.user);

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
        .order('code');

      let usagesQuery = supabase
        .from('coupon_usages')
        .select('id, discount_applied, booking_id, coupons!inner(code, host_id), profiles(full_name)')
        .order('id', { ascending: false })
        .limit(50);

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
      setForm({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minTotal: '',
        expiresAt: '',
      });
      const supabaseReload = createClient();
      const { data } = await supabaseReload
        .from('coupons')
        .select('id, code, discount_type, discount_value, min_booking_total, expires_at, is_active')
        .order('code');
      setCoupons((data ?? []) as CouponRow[]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-6 xl:grid-cols-3">
          <ContentCard
            title="Hızlı kupon oluştur"
            description="Basit bir kod ile indirim kampanyası başlatın."
            className="xl:col-span-1"
          >
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <TicketPercent className="h-4 w-4 text-primary" />
                <p>
                  Misafirler, bu kodu ödeme adımında girerek{' '}
                  <span className="font-semibold text-foreground">kupon indirimi</span> kazanır.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Kod</label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                    placeholder="Örn. ROTAYAZ20"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Tip</label>
                  <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background px-2 py-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, discountType: 'percentage' }))}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 ${
                        form.discountType === 'percentage'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-transparent text-muted-foreground hover:bg-muted/60'
                      }`}
                    >
                      <Percent className="h-3.5 w-3.5" />
                      Yüzde
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, discountType: 'fixed' }))}
                      className={`flex flex-1 items-center justify-center rounded-md px-2 py-1 ${
                        form.discountType === 'fixed'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-transparent text-muted-foreground hover:bg-muted/60'
                      }`}
                    >
                      Tutar
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    {form.discountType === 'percentage' ? 'İndirim oranı (%)' : 'İndirim tutarı (₺)'}
                  </label>
                  <Input
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'percentage' ? 'Örn. 10' : 'Örn. 500'}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Minimum sepet (isteğe bağlı)</label>
                  <Input
                    value={form.minTotal}
                    onChange={(e) => setForm((f) => ({ ...f, minTotal: e.target.value }))}
                    placeholder="Örn. 2500"
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Bitiş tarihi (isteğe bağlı)</label>
                  <Input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full px-4"
                  disabled={saving}
                  onClick={handleCreate}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kupon oluştur
                </Button>
              </div>
            </div>
          </ContentCard>

          <div className="xl:col-span-2 grid gap-6 xl:grid-cols-2">
          <ContentCard title="Kuponlar" description="Geçerlilik ve indirim tipleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Değer</TableHead>
                  <TableHead>Min. Tutar</TableHead>
                  <TableHead>Bitiş</TableHead>
                  <TableHead>Aktif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  coupons.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.code}</TableCell>
                      <TableCell>{c.discount_type === 'percentage' ? 'Yüzde' : 'Tutar'}</TableCell>
                      <TableCell>{c.discount_type === 'percentage' ? `%${c.discount_value}` : formatCurrency(c.discount_value)}</TableCell>
                      <TableCell>{c.min_booking_total != null ? formatCurrency(c.min_booking_total) : '—'}</TableCell>
                      <TableCell>{c.expires_at ? formatDate(c.expires_at) : '—'}</TableCell>
                      <TableCell><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Aktif' : 'Pasif'}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>
          <ContentCard title="Kullanımlar" description="Son kullanımlar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rezervasyon</TableHead>
                  <TableHead>İndirim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  usages.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{(u.coupons as { code: string } | null)?.code ?? '—'}</TableCell>
                      <TableCell>{(u.profiles as { full_name: string | null } | null)?.full_name ?? '—'}</TableCell>
                      <TableCell>{u.booking_id ? u.booking_id.slice(0, 8) : '—'}</TableCell>
                      <TableCell>{formatCurrency(u.discount_applied)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>
          </div>
        </div>
      </Section>
    </div>
  );
}
