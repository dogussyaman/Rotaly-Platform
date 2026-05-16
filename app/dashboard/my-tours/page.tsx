'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MapPin, Plus, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format';
import { useAppSelector } from '@/lib/store/hooks';
import {
  enableHostTours,
  fetchHostRecord,
  fetchMyTours,
  resolveTourOperatorForUser,
  type MyTourOperator,
  type MyTourRow,
} from '@/lib/supabase/tours-admin';

export default function MyToursPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [enabling, setEnabling] = useState(false);
  const [operator, setOperator] = useState<MyTourOperator | null>(null);
  const [tours, setTours] = useState<MyTourRow[]>([]);
  const [toursEnabled, setToursEnabled] = useState(false);
  const [needsEnable, setNeedsEnable] = useState(false);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);

    const hostRecord = profile.isHost ? await fetchHostRecord(profile.id) : null;
    setToursEnabled(!!hostRecord?.toursEnabled);

    const op = await resolveTourOperatorForUser(profile.id, {
      isHost: profile.isHost,
      isTourOperator: profile.isTourOperator,
    });

    if (!op) {
      if (profile.isHost && !hostRecord?.toursEnabled) {
        setNeedsEnable(true);
      }
      setOperator(null);
      setTours([]);
      setLoading(false);
      return;
    }

    setNeedsEnable(false);
    setOperator(op);
    const rows = await fetchMyTours(op.id);
    setTours(rows);
    setLoading(false);
  }, [profile?.id, profile?.isHost, profile?.isTourOperator]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleEnableTours() {
    if (!profile?.id) return;
    setEnabling(true);
    const ok = await enableHostTours(profile.id);
    setEnabling(false);
    if (ok) {
      setToursEnabled(true);
      setNeedsEnable(false);
      void load();
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (needsEnable && profile?.isHost) {
    return (
      <div className="p-6">
        <ContentCard title="Tur satışı" description="Opsiyonel tur yönetimini açın">
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <MapPin className="h-12 w-12 text-primary" />
            <h2 className="text-lg font-bold">Tur satışını açın</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Konaklama ilanlarınıza ek olarak grup veya bireysel turlar sunabilir, rehber atayabilir ve
              rezervasyonları buradan yönetebilirsiniz.
            </p>
            <Button onClick={() => void handleEnableTours()} disabled={enabling}>
              {enabling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Tur satışını etkinleştir
            </Button>
          </div>
        </ContentCard>
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="p-6">
        <ContentCard title="Profil bulunamadı">
          <p className="text-sm text-muted-foreground">
            Tur operatör profiliniz bulunamadı. Yönetici ile iletişime geçin veya tur şirketi rolünüzün
            atandığından emin olun.
          </p>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Section
        title="Turlarım"
        description={
          operator.operatorType === 'host'
            ? 'Ev sahibi olarak eklediğiniz turlar'
            : `${operator.companyName ?? 'Tur şirketi'} turları`
        }
        actions={
          <Button asChild>
            <Link href="/dashboard/my-tours/new">
              <Plus className="mr-2 h-4 w-4" />
              Tur ekle
            </Link>
          </Button>
        }
      >
        <ContentCard title="Tur listesi">
          {tours.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Henüz tur eklemediniz. İlk turunuzu oluşturmak için &quot;Tur ekle&quot;ye tıklayın.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tur</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Şehir</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Rehber</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell className="font-medium">{tour.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {tour.tourFormat === 'individual' ? (
                          'Bireysel'
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Grup
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{tour.city ?? '—'}</TableCell>
                    <TableCell>{formatCurrency(tour.basePrice, tour.currency)}</TableCell>
                    <TableCell className="text-muted-foreground">{tour.tourGuideName ?? '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={tour.isActive ? 'confirmed' : 'cancelled'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/my-tours/${tour.id}/edit`}>Düzenle</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ContentCard>
      </Section>

      {profile?.isHost && toursEnabled && (
        <p className="text-xs text-muted-foreground">
          Tur satışı etkin. Rehberlerinizi{' '}
          <Link href="/dashboard/tour-guides" className="text-primary underline">
            Tur Rehberleri
          </Link>{' '}
          sayfasından yönetebilirsiniz.
        </p>
      )}
    </div>
  );
}
