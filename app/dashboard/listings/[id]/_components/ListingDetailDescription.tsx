'use client';

import { ContentCard } from '@/components/dashboard/dashboard-ui';

interface ListingDetailDescriptionProps {
  description: string | null;
}

export function ListingDetailDescription({ description }: ListingDetailDescriptionProps) {
  return (
    <ContentCard title="Açıklama" description="İlan metni">
      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
        {description || 'Açıklama eklenmemiş.'}
      </p>
    </ContentCard>
  );
}
