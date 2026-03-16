'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { useAppSelector } from '@/lib/store/hooks';

type TourRow = { id: string; title: string; city: string | null; duration_minutes: number | null; base_price: number; rating: number | null };
type OperatorRow = { id: string; company_name: string | null; phone: string | null; website: string | null };
type ScheduleRow = { id: string; start_time: string; available_spots: number | null; price_override: number | null; tours: { title: string } | null };
type BookingRow = { id: string; participants_count: number; total_price: number; status: string; tours: { title: string } | null; profiles: { full_name: string | null } | null };

export default function ToursPage() {
  const [operators, setOperators] = useState<OperatorRow[]>([]);
  const [tours, setTours] = useState<TourRow[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [canView, setCanView] = useState(true);
  const { profile } = useAppSelector((s) => s.user);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      const supabase = createClient();
      const isAdmin = !!profile.isAdmin;
      const isTourOperator = !!profile.isTourOperator;

      if (!isAdmin && !isTourOperator) {
        setCanView(false);
        setOperators([]);
        setTours([]);
        setSchedules([]);
        setBookings([]);
        setLoading(false);
        return;
      }

      if (isAdmin) {
        const [oRes, tRes, sRes, bRes] = await Promise.all([
          supabase.from('tour_operators').select('id, company_name, phone, website'),
          supabase.from('tours').select('id, title, city, duration_minutes, base_price, rating').eq('is_active', true).order('title'),
          supabase.from('tour_schedules').select('id, start_time, available_spots, price_override, tours(title)').limit(50),
          supabase.from('tour_bookings').select('id, participants_count, total_price, status, tours(title), profiles(full_name)').order('id', { ascending: false }).limit(50),
        ]);
        setOperators((oRes.data ?? []) as OperatorRow[]);
        setTours((tRes.data ?? []) as TourRow[]);
        setSchedules((sRes.data ?? []) as ScheduleRow[]);
        setBookings((bRes.data ?? []) as BookingRow[]);
        setLoading(false);
        return;
      }

      const { data: operator } = await supabase
        .from('tour_operators')
        .select('id, company_name, phone, website')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (!operator) {
        setOperators([]);
        setTours([]);
        setSchedules([]);
        setBookings([]);
        setLoading(false);
        return;
      }

      const operatorId = operator.id as string;

      const [tRes, sRes, bRes] = await Promise.all([
        supabase
          .from('tours')
          .select('id, title, city, duration_minutes, base_price, rating')
          .eq('operator_id', operatorId)
          .order('title'),
        supabase
          .from('tour_schedules')
          .select('id, start_time, available_spots, price_override, tours!inner(title, operator_id)')
          .eq('tours.operator_id', operatorId)
          .limit(50),
        supabase
          .from('tour_bookings')
          .select('id, participants_count, total_price, status, tours!inner(title, operator_id), profiles(full_name)')
          .eq('tours.operator_id', operatorId)
          .order('id', { ascending: false })
          .limit(50),
      ]);

      setOperators([operator as OperatorRow]);
      setTours((tRes.data ?? []) as TourRow[]);
      setSchedules((sRes.data ?? []) as ScheduleRow[]);
      setBookings((bRes.data ?? []) as BookingRow[]);
      setLoading(false);
    }
    void load();
  }, [profile?.id, profile?.isAdmin, profile?.isTourOperator]);

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
        {!canView ? (
          <ContentCard title="Bilgi" description="Bu sayfa tur operatörleri için hazırlanmıştır.">
            <p className="text-sm text-muted-foreground">
              Tur operatörü rolünüz yok. Devam etmek için tur operatörü kaydınızı tamamlayın.
            </p>
          </ContentCard>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
          <ContentCard title="Operatörler" description="Tur operatörleri">
            {operators.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Veri yok</p>
            ) : (
              <div className="space-y-3 text-sm">
                {operators.map((o) => (
                  <div key={o.id} className="space-y-1">
                    <p className="font-medium">{o.company_name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{o.phone ?? ''}</p>
                    <p className="text-xs text-muted-foreground">{o.website ?? ''}</p>
                  </div>
                ))}
              </div>
            )}
          </ContentCard>

          <ContentCard title="Turlar" description="Fiyat ve kapasite">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tur</TableHead>
                  <TableHead>Şehir</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Puan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tours.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  tours.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.title}</TableCell>
                      <TableCell>{t.city ?? '—'}</TableCell>
                      <TableCell>{t.duration_minutes != null ? `${t.duration_minutes} dk` : '—'}</TableCell>
                      <TableCell>{formatCurrency(t.base_price)}</TableCell>
                      <TableCell>{(t.rating ?? 0).toFixed(1)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Seanslar & Rezervasyon" description="Son seanslar ve rezervasyonlar">
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-2 font-medium">Seanslar</p>
                {schedules.length === 0 ? (
                  <p className="text-muted-foreground">Veri yok</p>
                ) : (
                  schedules.slice(0, 5).map((s) => (
                    <div key={s.id} className="space-y-1 py-1">
                      <p className="font-medium">{(s.tours as { title: string } | null)?.title ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{s.start_time}</p>
                      <p className="text-xs text-muted-foreground">
                        Kalan {s.available_spots ?? 0} • {s.price_override != null ? formatCurrency(s.price_override) : 'Standart fiyat'}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div>
                <p className="mb-2 font-medium">Rezervasyonlar</p>
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground">Veri yok</p>
                ) : (
                  bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-medium">{(b.tours as { title: string } | null)?.title ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">
                          {(b.profiles as { full_name: string | null } | null)?.full_name ?? '—'} • {b.participants_count} kişi
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </ContentCard>
          </div>
        )}
      </Section>
    </div>
  );
}
