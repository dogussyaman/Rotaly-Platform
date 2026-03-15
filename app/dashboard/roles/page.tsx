'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';

type Row = { id: string; partner_type: string | null; company_name: string | null; tax_number: string | null; website: string | null };

export default function RolesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('partner_profiles').select('id, partner_type, company_name, tax_number, website').order('company_name');
      setRows((data ?? []) as Row[]);
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
        <ContentCard title="Partner Kayıtları" description="Vergi ve şirket bilgileri">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tür</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Vergi No</TableHead>
                <TableHead>Web</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="capitalize">{r.partner_type ?? '—'}</TableCell>
                    <TableCell className="font-medium">{r.company_name ?? '—'}</TableCell>
                    <TableCell>{r.tax_number ?? '—'}</TableCell>
                    <TableCell>{r.website ?? '—'}</TableCell>
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
