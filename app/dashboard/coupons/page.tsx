'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
        <div className="grid gap-6 xl:grid-cols-2">
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
      </Section>
    </div>
  );
}
