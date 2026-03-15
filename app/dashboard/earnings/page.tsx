'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostByUserId } from '@/lib/supabase/host';
import { fetchHostEarnings } from '@/lib/supabase/host';

const CHART_COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

export default function EarningsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [byMonth, setByMonth] = useState<{ label: string; total: number }[]>([]);
  const [byListing, setByListing] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      const host = await fetchHostByUserId(profile.id);
      if (!host) {
        setLoading(false);
        return;
      }
      const { byMonth: m, byListing: l } = await fetchHostEarnings(host.hostId, { months: 12 });
      setByMonth(m.map((x) => ({ label: x.label, total: x.total })));
      setByListing(l.map((x) => ({ name: x.listingTitle, value: x.total })));
      setLoading(false);
    }
    void load();
  }, [profile?.id]);

  const totalEarnings = byListing.reduce((acc, x) => acc + x.value, 0);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-6 lg:grid-cols-2">
          <ContentCard title="Aylık gelir" description="Son 12 ay (onaylı ve tamamlanan rezervasyonlar)">
            {byMonth.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Henüz gelir verisi yok.
              </div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
                    <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} name="Gelir" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ContentCard>

          <ContentCard title="İlan bazında gelir (pasta)" description="Toplam gelirin ilanlara göre dağılımı">
            {byListing.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Henüz gelir verisi yok.
              </div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byListing}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name?.slice(0, 12)} ${(percent * 100).toFixed(0)}%`}
                    >
                      {byListing.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ContentCard>
        </div>

        <ContentCard title="Özet" description="Toplam ve vergi bilgisi">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Toplam gelir (12 ay)</p>
              <p className="mt-1 text-lg font-semibold text-[#111]">
                ₺{totalEarnings.toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Vergi özeti</p>
              <p className="mt-1 text-sm text-muted-foreground">KDV / stopaj raporu panelden indirilebilir.</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Komisyon</p>
              <p className="mt-1 text-sm text-muted-foreground">Platform komisyonu kesintileri ayrı raporlanır.</p>
            </div>
          </div>
        </ContentCard>
      </Section>
    </div>
  );
}
