'use client';

import { MapPin } from 'lucide-react';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface ListingDetailLocationProps {
  listing: ListingDetail;
}

export function ListingDetailLocation({ listing }: ListingDetailLocationProps) {
  const { address, rules } = listing;
  return (
    <ContentCard title="Konum ve kurallar" description="Adres ve ev kuralları">
      <div className="space-y-3 text-sm">
        {address && (
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6b7280]" />
            <span>{address}</span>
          </div>
        )}
        {rules && (
          <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
            <p className="text-xs font-medium text-[#6b7280]">Ev kuralları</p>
            <ul className="mt-1 list-inside list-disc text-xs">
              {rules.smokingAllowed && <li>Sigara içilebilir</li>}
              {rules.petsAllowed && <li>Evcil hayvan kabul edilir</li>}
              {rules.partiesAllowed && <li>Parti/etkinlik yapılabilir</li>}
              {rules.additionalRules && <li>{rules.additionalRules}</li>}
            </ul>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
