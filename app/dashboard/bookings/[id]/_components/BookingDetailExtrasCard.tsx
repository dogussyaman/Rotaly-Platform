'use client';

import { ContentCard } from '@/components/dashboard/dashboard-ui';
import { formatExtras } from '@/lib/format';

interface BookingDetailExtrasCardProps {
  extras: Record<string, unknown> | null;
}

export function BookingDetailExtrasCard({ extras }: BookingDetailExtrasCardProps) {
  const items = formatExtras(extras);
  return (
    <ContentCard title="Ekstralar" description="Ek hizmetler">
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Ekstra yok</p>
      )}
    </ContentCard>
  );
}
