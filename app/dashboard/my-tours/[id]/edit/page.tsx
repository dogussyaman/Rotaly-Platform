'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSelector } from '@/lib/store/hooks';
import {
  createTourSchedule,
  deleteTour,
  fetchMyTourById,
  fetchTourSchedules,
  resolveTourOperatorForUser,
  updateTour,
  type MyTourOperator,
} from '@/lib/supabase/tours-admin';
import { TourForm } from '../../_components/tour-form';

export default function EditTourPage() {
  const params = useParams();
  const tourId = String(params.id ?? '');
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState<MyTourOperator | null>(null);
  const [tour, setTour] = useState<Awaited<ReturnType<typeof fetchMyTourById>>>(null);
  const [schedules, setSchedules] = useState<Awaited<ReturnType<typeof fetchTourSchedules>>>([]);
  const [scheduleStart, setScheduleStart] = useState('');
  const [scheduleSpots, setScheduleSpots] = useState('');
  const [addingSchedule, setAddingSchedule] = useState(false);

  useEffect(() => {
    async function load() {
      if (!profile?.id || !tourId) return;
      const op = await resolveTourOperatorForUser(profile.id, {
        isHost: profile.isHost,
        isTourOperator: profile.isTourOperator,
      });
      setOperator(op);
      const t = await fetchMyTourById(tourId);
      setTour(t);
      if (t) {
        setSchedules(await fetchTourSchedules(tourId));
      }
      setLoading(false);
    }
    void load();
  }, [profile?.id, profile?.isHost, profile?.isTourOperator, tourId]);

  async function handleAddSchedule() {
    if (!scheduleStart) return;
    setAddingSchedule(true);
    const id = await createTourSchedule({
      tourId,
      startTime: new Date(scheduleStart).toISOString(),
      availableSpots: scheduleSpots ? Number(scheduleSpots) : null,
    });
    setAddingSchedule(false);
    if (id) {
      setSchedules(await fetchTourSchedules(tourId));
      setScheduleStart('');
      setScheduleSpots('');
    }
  }

  async function handleDeactivate() {
    const ok = await deleteTour(tourId);
    if (ok) router.push('/dashboard/my-tours');
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!operator || !tour) {
    return (
      <div className="p-6">
        <ContentCard title="Hata">
          <p className="text-sm text-muted-foreground">Tur bulunamadı veya erişim yok.</p>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Section
        title={tour.title}
        description="Tur bilgilerini güncelleyin"
        actions={
          <Button variant="destructive" size="sm" onClick={() => void handleDeactivate()}>
            <Trash2 className="mr-2 h-4 w-4" />
            Yayından kaldır
          </Button>
        }
      >
        <ContentCard title="Tur bilgileri">
          <TourForm
            operatorId={operator.id}
            initial={{
              title: tour.title,
              description: tour.description,
              city: tour.city,
              country: tour.country,
              tourFormat: tour.tourFormat,
              durationMinutes: tour.durationMinutes,
              minParticipants: tour.minParticipants,
              maxParticipants: tour.maxParticipants,
              basePrice: tour.basePrice,
              tourCategoryId: tour.tourCategoryId,
              tourGuideId: tour.tourGuideId,
              meetingPoint: tour.meetingPoint,
              detailedItinerary: tour.detailedItinerary,
              isActive: tour.isActive,
            }}
            submitLabel="Kaydet"
            onCancel={() => router.push('/dashboard/my-tours')}
            onSubmit={async (values) => updateTour({ id: tourId, ...values })}
          />
        </ContentCard>
      </Section>

      <Section title="Seanslar" description="Tur kalkış saatleri ve kontenjan">
        <ContentCard title="Seans listesi">
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label htmlFor="start">Başlangıç</Label>
              <Input
                id="start"
                type="datetime-local"
                value={scheduleStart}
                onChange={(e) => setScheduleStart(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="spots">Kontenjan</Label>
              <Input
                id="spots"
                type="number"
                min={1}
                placeholder="Opsiyonel"
                value={scheduleSpots}
                onChange={(e) => setScheduleSpots(e.target.value)}
              />
            </div>
            <Button onClick={() => void handleAddSchedule()} disabled={addingSchedule || !scheduleStart}>
              {addingSchedule ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Seans ekle'}
            </Button>
          </div>

          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz seans eklenmedi.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih / saat</TableHead>
                  <TableHead>Kontenjan</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{new Date(s.startTime).toLocaleString('tr-TR')}</TableCell>
                    <TableCell>{s.availableSpots ?? '—'}</TableCell>
                    <TableCell>{s.isCancelled ? 'İptal' : 'Aktif'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ContentCard>
      </Section>
    </div>
  );
}
