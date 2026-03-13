import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Ayarlar" description="Panel tercihleri ve hesap ayarları.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Genel" description="Görünüm ve bildirim tercihleri">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-name">Panel Adı</Label>
                <Input id="dashboard-name" defaultValue="Rotaly Dashboard" />
              </div>
              <Separator />
              <Button className="rounded-xl">Kaydet</Button>
            </div>
          </ContentCard>

          <ContentCard title="Güvenlik" description="Oturum ve erişim seçenekleri">
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Bu ekran şimdilik mock olarak hazır. Supabase / auth entegrasyonu tamamlandığında gerçek ayarlar buraya
                taşınacak.
              </p>
              <Button variant="outline" className="rounded-xl">
                Oturumlardan Çık
              </Button>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}

