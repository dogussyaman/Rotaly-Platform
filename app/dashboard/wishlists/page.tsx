'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';

type WishlistRow = { id: string; name: string; profiles: { full_name: string | null } | null; count?: number };
type ItemRow = { id: string; wishlist_id: string; listing_id: string; wishlists: { name: string } | null; listings: { title: string | null } | null };

export default function WishlistsPage() {
  const [lists, setLists] = useState<WishlistRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [wRes, iRes] = await Promise.all([
        supabase.from('wishlists').select('id, name, profiles(full_name)').order('name'),
        supabase.from('wishlist_items').select('id, wishlist_id, listing_id, wishlists(name), listings(title)').limit(200),
      ]);
      const wData = (wRes.data ?? []) as WishlistRow[];
      const iData = (iRes.data ?? []) as ItemRow[];
      const countMap = new Map<string, number>();
      iData.forEach((i) => countMap.set(i.wishlist_id, (countMap.get(i.wishlist_id) ?? 0) + 1));
      setLists(wData.map((w) => ({ ...w, count: countMap.get(w.id) ?? 0 })));
      setItems(iData);
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-6 xl:grid-cols-2">
          <ContentCard title="Liste Başlıkları" description="Misafir favori listeleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liste</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>İçerik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  lists.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{w.name}</TableCell>
                      <TableCell>{(w.profiles as { full_name: string | null } | null)?.full_name ?? '—'}</TableCell>
                      <TableCell>{w.count ?? 0} ilan</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Liste Öğeleri" description="wishlist_items">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liste</TableHead>
                  <TableHead>İlan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  items.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{(i.wishlists as { name: string } | null)?.name ?? '—'}</TableCell>
                      <TableCell>{(i.listings as { title: string | null } | null)?.title ?? i.listing_id.slice(0, 8)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
