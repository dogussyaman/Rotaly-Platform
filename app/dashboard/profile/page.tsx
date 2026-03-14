'use client';

import { Badge } from '@/components/ui/badge';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';

export default function DashboardProfilePage() {
  const { profile } = useAppSelector((s) => s.user);

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Profil" description="Hesap bilgileriniz.">
        <ContentCard title="Profil Bilgileri" description="Kayıtlı iletişim bilgileri">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Ad Soyad</span>
              <span className="font-semibold">{profile?.fullName || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>E-posta</span>
              <span className="font-semibold">{profile?.email || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rol</span>
              <Badge variant="secondary">
                {profile?.isAdmin ? 'Yönetici' : profile?.isHost ? 'Ev Sahibi' : 'Misafir'}
              </Badge>
            </div>
          </div>
        </ContentCard>
      </Section>
    </div>
  );
}
