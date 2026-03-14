'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ContentCard, ListingsTable, Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostByUserId, fetchHostListings, HostListingCard } from '@/lib/supabase/host';

export default function ListingsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [listings, setListings] = useState<HostListingCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      if (profile?.id) {
        const host = await fetchHostByUserId(profile.id);
        if (host) {
          const data = await fetchHostListings(host.hostId);
          setListings(data);
        }
      }
      setLoading(false);
    }
    loadListings();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Convert HostListingCard to ListingRow format for the existing table component
  const tableData = listings.map(l => ({
    title: l.title,
    propertyType: 'apartment', // Simplified for now since HostListingCard doesn't have it explicitly
    city: l.location.split(',')[0],
    country: l.location.split(',')[1]?.trim() || 'Türkiye',
    pricePerNight: l.pricePerNight,
    maxGuests: 0, // Placeholder
    rating: l.rating,
    isActive: true
  }));

  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="İlanlarım" description="Yayındaki ilanlarınızın yönetimi.">
        <div className="grid gap-4">
          <ContentCard title="Aktif İlanlar" description="Fiyat ve performans takibi">
            {listings.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Henüz bir ilanınız bulunmuyor.
              </div>
            ) : (
              <ListingsTable listings={tableData} />
            )}
          </ContentCard>

          <div className="grid gap-4 md:grid-cols-2">
             <ContentCard title="Görseller" description="İlan görsellerinin durumu">
               <div className="space-y-4">
                 {listings.map((l) => (
                   <div key={l.id} className="flex items-center gap-4 border-b pb-2 last:border-0 text-sm">
                     <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                        {l.imageUrl ? (
                          <img src={l.imageUrl} alt={l.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px]">No Img</div>
                        )}
                     </div>
                     <div>
                       <p className="font-medium">{l.title}</p>
                       <p className="text-xs text-muted-foreground">{l.location}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </ContentCard>
             
             <ContentCard title="Performans" description="Rezervasyon ve kazanç özetleri">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam İlan</span>
                    <span className="font-semibold">{listings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ortalama Puan</span>
                    <span className="font-semibold">
                      {(listings.reduce((acc, curr) => acc + curr.rating, 0) / (listings.length || 1)).toFixed(1)}
                    </span>
                  </div>
                </div>
             </ContentCard>
          </div>
        </div>
      </Section>
    </div>
  );
}

