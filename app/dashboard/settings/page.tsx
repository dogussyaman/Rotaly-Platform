'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { createClient } from '@/lib/supabase/client';
import { useAppDispatch } from '@/lib/store/hooks';
import { clearUser } from '@/lib/store/slices/user-slice';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const supabase = createClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    router.replace('/auth/login');
  };

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Ayarlar" description="Panel tercihleri ve hesap ayarları.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Genel" description="Görünüm ve bildirim tercihleri">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-name">Panel Adı</Label>
                <Input id="dashboard-name" defaultValue="Rotaly Dashboard" />
              </div>
              <Separator />
              <Button className="rounded-xl" disabled>
                Kaydet (yakında)
              </Button>
            </div>
          </ContentCard>

          <ContentCard title="Güvenlik" description="Oturum ve erişim seçenekleri">
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Oturum işlemleri Supabase Auth ile yönetilir.
              </p>
              <Button variant="outline" className="rounded-xl" onClick={() => void signOut()}>
                Oturumu Kapat
              </Button>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}

