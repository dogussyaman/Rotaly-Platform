'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { type WishlistSummary } from '@/lib/supabase/profile';

interface WishlistSectionProps {
  loading: boolean;
  wishlists: WishlistSummary[];
}

export function WishlistSection({ loading, wishlists }: WishlistSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Listelerim (Wishlist)</h2>
        <Link href="/search">
          <Button variant="outline" size="sm" className="rounded-2xl px-4">Yeni yerler keşfet</Button>
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : wishlists.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz bir favori listeniz yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlists.map((wl) => (
            <div key={wl.id} className="rounded-2xl border border-border bg-card/40 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{wl.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {wl.itemsCount} ilan • {format(new Date(wl.createdAt), 'dd MMM yyyy', { locale: tr })} oluşturuldu
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">Gör</Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
