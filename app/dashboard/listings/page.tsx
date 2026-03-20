'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostByUserId, fetchHostListingsPage, type HostListingCard } from '@/lib/supabase/host';
import { createClient } from '@/lib/supabase/client';
import { ListingsSkeleton } from '@/components/dashboard/dashboard-skeletons';

const PAGE_SIZE = 10;

export default function ListingsPage() {
  const { profile } = useAppSelector((s) => s.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get('q') ?? '').trim();

  const role: 'admin' | 'host' | 'guest' = useMemo(() => {
    if (!profile) return 'guest';
    return profile.isAdmin ? 'admin' : profile.isHost ? 'host' : 'guest';
  }, [profile]);

  const [hostId, setHostId] = useState<string | null>(null);
  const [rows, setRows] = useState<HostListingCard[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      setLoading(true);
      try {
        if (role === 'admin') {
          const supabase = createClient();
          const from = (page - 1) * PAGE_SIZE;
          const to = from + PAGE_SIZE - 1;
          let query = supabase
            .from('listings')
            .select(
              `
                id,
                title,
                city,
                country,
                price_per_night,
                rating,
                total_reviews,
                property_type,
                max_guests,
                is_active,
                listing_images (
                  url,
                  is_primary,
                  sort_order
                )
              `,
              { count: 'exact' },
            )
            .order('created_at', { ascending: false });

          if (q) {
            query = query.ilike('title', `%${q}%`);
          }

          const { data, count, error } = await query.range(from, to);
          if (error) {
            console.error('fetchAdminListingsPage error:', error.message);
            setRows([]);
            setTotal(0);
            setHostId(null);
            return;
          }

          const mapped = (data ?? []).map((row: any) => {
            let imageUrl: string | null = null;
            if (row.listing_images?.length) {
              const sorted = [...row.listing_images].sort((a, b) => {
                if (a.is_primary && !b.is_primary) return -1;
                if (!a.is_primary && b.is_primary) return 1;
                return (a.sort_order ?? 0) - (b.sort_order ?? 0);
              });
              imageUrl = sorted[0].url;
            }

            return {
              id: row.id,
              title: row.title,
              location: [row.city, row.country].filter(Boolean).join(', '),
              pricePerNight: Number(row.price_per_night),
              rating: Number(row.rating ?? 0),
              totalReviews: row.total_reviews ?? 0,
              imageUrl,
              propertyType: row.property_type ?? null,
              maxGuests: row.max_guests ?? null,
              isActive: row.is_active ?? true,
              bookingsCount: 0,
              earnings: 0,
            } as HostListingCard;
          });

          setRows(mapped);
          setTotal(count ?? mapped.length);
          setHostId(null);
          return;
        }

        const host = await fetchHostByUserId(profile.id);
        setHostId(host?.hostId ?? null);
        if (!host) {
          setRows([]);
          setTotal(0);
          return;
        }

        const res = await fetchHostListingsPage(host.hostId, { page, pageSize: PAGE_SIZE, query: q });
        setRows(res.rows);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [profile?.id, role, page, q]);

  if (loading) return <ListingsSkeleton />;

  if (role === 'guest') {
    return (
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Section title="" description="">
          <ContentCard title="Bilgi" description="Hesabınız ev sahibi değil">
            <div className="text-sm text-muted-foreground">
              İlan yönetimi için ev sahibi hesabına geçiş yapmanız gerekir.
            </div>
          </ContentCard>
        </Section>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="" actions={
          q ? (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => router.push('/dashboard/listings')}
            >
              Filtreyi temizle
            </Button>
          ) : null
        }
      >
        <div className="space-y-6">
          <ContentCard title="İlan Listesi" description={`Sayfa başına ${PAGE_SIZE} kayıt`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İlan</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Fiyat/Gün</TableHead>
                  <TableHead>Misafir</TableHead>
                  <TableHead>Puan</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {q
                        ? 'Filtreyle eşleşen ilan bulunamadı.'
                        : role === 'admin'
                          ? 'Henüz ilan bulunmuyor.'
                          : 'Henüz bir ilanınız bulunmuyor.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((l) => (
                    <TableRow key={l.id} className="transition-colors hover:bg-accent/60">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {l.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                No Img
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{l.title}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {l.propertyType ?? '—'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.location || '—'}</TableCell>
                      <TableCell className="text-xs font-semibold">₺{l.pricePerNight.toLocaleString('tr-TR')}</TableCell>
                      <TableCell className="text-xs">{l.maxGuests ?? '—'}</TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                          {(l.rating ?? 0).toFixed(1)}
                          <span className="text-[10px] text-muted-foreground">({l.totalReviews ?? 0})</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {l.isActive ? <Badge>Aktif</Badge> : <Badge variant="secondary">Pasif</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-accent">
                          <Link href={`/dashboard/listings/${l.id}`}>
                            Detay <ExternalLink className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="pt-4 flex justify-center">
              <PaginationControls page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
            </div>
          </ContentCard>

          <div className="grid gap-4 md:grid-cols-2">
            <ContentCard title="Görseller" description="Bu sayfadaki ilan görselleri">
              <div className="space-y-4">
                {rows.map((l) => (
                  <div key={l.id} className="flex items-center gap-4 border-b pb-2 last:border-0 text-sm">
                    <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                      {l.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
                {rows.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground">Henüz veri yok.</p>
                ) : null}
              </div>
            </ContentCard>

            <ContentCard title="Performans" description="İlan sayısı ve puan özeti">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toplam İlan</span>
                  <span className="font-semibold">{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bu Sayfa</span>
                  <span className="font-semibold">{rows.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ortalama Puan</span>
                  <span className="font-semibold">
                    {(rows.reduce((acc, curr) => acc + (curr.rating ?? 0), 0) / (rows.length || 1)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Host ID</span>
                  <span className="font-mono text-xs">{hostId ?? '—'}</span>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      </Section>
    </div>
  );
}
