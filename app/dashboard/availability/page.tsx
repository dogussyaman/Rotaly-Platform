'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/mock/dashboard';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostAvailability, fetchHostByUserId, HostAvailability } from '@/lib/supabase/host';

export default function AvailabilityPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [availability, setAvailability] = useState<HostAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAvailability() {
      if (profile?.id) {
        const host = await fetchHostByUserId(profile.id);
        if (host) {
          const data = await fetchHostAvailability(host.hostId);
          setAvailability(data);
        }
      }
      setLoading(false);
    }
    loadAvailability();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Uygunluk Takvimi" description="Müsaitlik ve özel fiyat yönetimi.">
        <ContentCard title="Takvim Görünümü" description="Yakın tarihli müsaitlik kayıtları">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İlan</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Uygun</TableHead>
                <TableHead>Özel Fiyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availability.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Kayıtlı müsaitlik bilgisi bulunamadı.
                  </TableCell>
                </TableRow>
              ) : (
                availability.map((item) => (
                  <TableRow key={`${item.listingTitle}-${item.date}`}>
                    <TableCell className="font-medium">{item.listingTitle}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>
                      <BooleanBadge value={item.isAvailable} />
                    </TableCell>
                    <TableCell>{item.customPrice ? formatCurrency(item.customPrice) : '—'}</TableCell>
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

