'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';
import {
  createTour,
  enableHostTours,
  fetchHostRecord,
  resolveTourOperatorForUser,
  type MyTourOperator,
} from '@/lib/supabase/tours-admin';
import { TourForm } from '../_components/tour-form';

export default function NewTourPage() {
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState<MyTourOperator | null>(null);

  useEffect(() => {
    async function init() {
      if (!profile?.id) return;
      let op = await resolveTourOperatorForUser(profile.id, {
        isHost: profile.isHost,
        isTourOperator: profile.isTourOperator,
      });

      if (!op && profile.isHost) {
        const host = await fetchHostRecord(profile.id);
        if (host && !host.toursEnabled) {
          await enableHostTours(profile.id);
        }
        op = await resolveTourOperatorForUser(profile.id, { isHost: true });
      }

      setOperator(op);
      setLoading(false);
    }
    void init();
  }, [profile?.id, profile?.isHost, profile?.isTourOperator]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="p-6">
        <ContentCard title="Hata">
          <p className="text-sm text-muted-foreground">Tur operatör profili oluşturulamadı.</p>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Section title="Yeni tur" description="Grup veya bireysel tur oluşturun">
        <ContentCard title="Tur bilgileri">
          <TourForm
            operatorId={operator.id}
            submitLabel="Tur oluştur"
            onCancel={() => router.push('/dashboard/my-tours')}
            onSubmit={async (values) => {
              const id = await createTour(operator.id, values);
              if (id) {
                router.push(`/dashboard/my-tours/${id}/edit`);
                return true;
              }
              return false;
            }}
          />
        </ContentCard>
      </Section>
    </div>
  );
}
