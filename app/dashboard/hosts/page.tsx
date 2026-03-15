'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';

type HostRow = {
  id: string;
  response_rate: number | null;
  response_time: string | null;
  superhost: boolean | null;
  total_reviews: number | null;
  languages: string[] | null;
  profiles: { full_name: string | null } | null;
};

export default function HostsPage() {
  const [rows, setRows] = useState<HostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('hosts')
        .select('id, response_rate, response_time, superhost, total_reviews, languages, profiles(full_name)')
        .order('total_reviews', { ascending: false });
      setRows((data ?? []) as HostRow[]);
      setLoading(false);
    }
    void load();
  }, []);

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
        <ContentCard title="Ev Sahibi Detayları" description="Yanıt oranı, dil ve değerlendirme bilgileri">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ev Sahibi</TableHead>
                <TableHead>Yanıt Oranı</TableHead>
                <TableHead>Yanıt Süresi</TableHead>
                <TableHead>Süper Ev Sahibi</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Diller</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                </TableRow>
              ) : (
                rows.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{(h.profiles as { full_name: string | null } | null)?.full_name ?? '—'}</TableCell>
                    <TableCell>%{h.response_rate ?? 0}</TableCell>
                    <TableCell>{h.response_time ?? '—'}</TableCell>
                    <TableCell><BooleanBadge value={!!h.superhost} /></TableCell>
                    <TableCell>{h.total_reviews ?? 0}</TableCell>
                    <TableCell>{(h.languages ?? []).join(', ') || '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ContentCard>
      </Section>
    </div>
  );
}
