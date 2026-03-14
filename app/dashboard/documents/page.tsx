import { Badge } from '@/components/ui/badge';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';

export default function DocumentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Belgeler" description="Seyahat belgeleri ve faturalar.">
        <ContentCard title="Dosyalar" description="PDF ve bilet çıktıları">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Rezervasyon Onayı</span>
              <Badge variant="outline">PDF</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Fatura</span>
              <Badge variant="outline">PDF</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Tur Bileti</span>
              <Badge variant="secondary">Yakında</Badge>
            </div>
          </div>
        </ContentCard>
      </Section>
    </div>
  );
}
