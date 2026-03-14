import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';

export default function EarningsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Gelirler" description="Ev sahibi gelir ve vergi özetleri.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Gelir Dağılımı" description="Son 30 gün">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Konaklama gelirleri</span>
                <span className="font-semibold">₺164.000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ekstra hizmetler</span>
                <span className="font-semibold">₺22.400</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Net gelir (tahmini)</span>
                <span className="font-semibold">₺148.600</span>
              </div>
            </div>
          </ContentCard>

          <ContentCard title="Vergi Belgeleri" description="2026 Mart dönemi">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>KDV Özet</span>
                <Badge variant="outline">PDF</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Stopaj Raporu</span>
                <Badge variant="outline">PDF</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Komisyon Kesintileri</span>
                <Badge variant="secondary">Hazır</Badge>
              </div>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
