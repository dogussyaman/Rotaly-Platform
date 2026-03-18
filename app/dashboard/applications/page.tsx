'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import {
  fetchHostApplicationsForAdmin,
  reviewHostApplicationByAdmin,
} from '@/lib/supabase/admin';
import type { ApplicationStatus, HostApplication } from '@/lib/supabase/host-applications';

function statusVariant(status: ApplicationStatus): 'default' | 'secondary' | 'destructive' {
  if (status === 'approved') return 'default';
  if (status === 'rejected') return 'destructive';
  return 'secondary';
}

function statusLabel(status: ApplicationStatus): string {
  if (status === 'pending') return 'Bekliyor';
  if (status === 'in_review') return 'İncelemede';
  if (status === 'approved') return 'Onaylandı';
  return 'Reddedildi';
}

export default function ApplicationsPage() {
  const [rows, setRows] = useState<HostApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchHostApplicationsForAdmin();
      setRows(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleStatusUpdate(id: string, status: ApplicationStatus) {
    setSubmittingId(id);
    try {
      const ok = await reviewHostApplicationByAdmin(id, status, `Admin panelinden durum güncellendi: ${status}`);
      if (ok) {
        await load();
      }
    } finally {
      setSubmittingId(null);
    }
  }

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.total += 1;
        if (row.status === 'pending') acc.pending += 1;
        if (row.status === 'in_review') acc.inReview += 1;
        if (row.status === 'approved') acc.approved += 1;
        if (row.status === 'rejected') acc.rejected += 1;
        return acc;
      },
      { total: 0, pending: 0, inReview: 0, approved: 0, rejected: 0 },
    );
  }, [rows]);

  if (loading) {
    return (
      <div className="flex h-75 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <ContentCard title="Toplam" description="Tüm başvurular">
            <p className="text-2xl font-bold">{summary.total}</p>
          </ContentCard>
          <ContentCard title="Bekleyen" description="Yeni gelen başvurular">
            <p className="text-2xl font-bold">{summary.pending}</p>
          </ContentCard>
          <ContentCard title="İncelemede" description="Değerlendirme aşaması">
            <p className="text-2xl font-bold">{summary.inReview}</p>
          </ContentCard>
          <ContentCard title="Onaylı" description="Yayına açılanlar">
            <p className="text-2xl font-bold">{summary.approved}</p>
          </ContentCard>
          <ContentCard title="Reddedilen" description="Uygun olmayan başvurular">
            <p className="text-2xl font-bold">{summary.rejected}</p>
          </ContentCard>
        </div>
      </Section>

      <Section title="" description="">
        <ContentCard title="Otel Başvuru Kuyruğu" description="Admin onay ve değerlendirme akışı">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başvuran</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Lokasyon / Tür</TableHead>
                <TableHead>Mülk Sayısı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Henüz başvuru yok.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const isSubmitting = submittingId === row.id;
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="font-medium">{row.fullName}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{row.experience || '—'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{row.email || '—'}</div>
                        <div className="text-xs text-muted-foreground">{row.phone || '—'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{row.city || '—'}</div>
                        <div className="text-xs text-muted-foreground capitalize">{row.propertyType || '—'}</div>
                      </TableCell>
                      <TableCell>{row.propertyCount ?? 0}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(row.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            disabled={isSubmitting || row.status === 'in_review'}
                            onClick={() => void handleStatusUpdate(row.id, 'in_review')}
                          >
                            İncele
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-lg"
                            disabled={isSubmitting || row.status === 'approved'}
                            onClick={() => void handleStatusUpdate(row.id, 'approved')}
                          >
                            Onayla
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-lg"
                            disabled={isSubmitting || row.status === 'rejected'}
                            onClick={() => void handleStatusUpdate(row.id, 'rejected')}
                          >
                            Reddet
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ContentCard>
      </Section>
    </div>
  );
}
