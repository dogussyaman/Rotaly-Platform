import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Raporlar" description="Operasyon, finans ve risk raporları.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Finansal Özet" description="Aylık gelir ve komisyon takibi">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Toplam Ciro</span>
                <span className="font-semibold">₺3.240.000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Platform Komisyonu</span>
                <span className="font-semibold">₺324.000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>İade Tutarı</span>
                <span className="font-semibold">₺48.000</span>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">Raporlar günlük olarak güncellenir.</p>
            </div>
          </ContentCard>

          <ContentCard title="Platform Sağlığı" description="Operasyonel metriklerin güncel durumu">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Doğrulanmış Profil Oranı</span>
                  <span className="font-semibold">87%</span>
                </div>
                <Progress value={87} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>İlan Doluluk Oranı</span>
                  <span className="font-semibold">76%</span>
                </div>
                <Progress value={76} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>İptal Oranı</span>
                  <span className="font-semibold">4.8%</span>
                </div>
                <Progress value={48} className="mt-2" />
              </div>
            </div>
          </ContentCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Sistem Kayıtları" description="Son güvenlik ve erişim kayıtları">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Yeni admin girişi</span>
                <Badge variant="outline">13:42</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>RLS politika güncellemesi</span>
                <Badge variant="outline">11:18</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Kupon kullanım limiti uyarısı</span>
                <Badge variant="secondary">09:05</Badge>
              </div>
            </div>
          </ContentCard>

          <ContentCard title="Risk & Uyarılar" description="Kontrol edilmesi gereken alanlar">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Bekleyen iadeler</span>
                <Badge variant="destructive">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Onay bekleyen ilan</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Okunmamış konuşmalar</span>
                <Badge variant="outline">7</Badge>
              </div>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
