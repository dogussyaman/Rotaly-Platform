'use client';

import { useEffect, useState } from 'react';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { createClient } from '@/lib/supabase/client';
import { fetchHostByUserId } from '@/lib/supabase/host';
import { useAppSelector } from '@/lib/store/hooks';
import type { ReviewRow } from '@/lib/mock/dashboard';
import { formatDate } from '@/lib/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReviewsSkeleton } from '@/components/dashboard/dashboard-skeletons';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [canView, setCanView] = useState(true);
  const { profile } = useAppSelector((s) => s.user);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      const supabase = createClient();
      const isAdmin = !!profile.isAdmin;
      const isHost = !!profile.isHost;
      let hostId: string | null = null;

      if (!isAdmin && !isHost) {
        setCanView(false);
        setReviews([]);
        setLoading(false);
        return;
      }

      if (!isAdmin && isHost) {
        const host = await fetchHostByUserId(profile.id);
        hostId = host?.hostId ?? null;
        if (!hostId) {
          setReviews([]);
          setLoading(false);
          return;
        }
      }
      let query = supabase
        .from('reviews')
        .select(`
          id,
          rating,
          cleanliness_rating,
          communication_rating,
          location_rating,
          value_rating,
          comment,
          created_at,
          listings!inner(title, host_id),
          profiles!reviewer_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      if (hostId) {
        query = query.eq('listings.host_id', hostId);
      }
      const { data } = await query;
      const list: ReviewRow[] = (data ?? []).map((r: any) => ({
        listing: r.listings?.title ?? '—',
        reviewer: r.profiles?.full_name ?? '—',
        rating: Number(r.rating ?? 0),
        cleanliness: Number(r.cleanliness_rating ?? 0),
        communication: Number(r.communication_rating ?? 0),
        location: Number(r.location_rating ?? 0),
        value: Number(r.value_rating ?? 0),
        createdAt: r.created_at,
      }));
      setReviews(list);
      setLoading(false);
    }
    void load();
  }, [profile?.id, profile?.isAdmin, profile?.isHost]);

  if (loading) return <ReviewsSkeleton />;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <ContentCard title="Yorumlar" description="Temizlik, iletişim ve değer puanları">
          {!canView ? (
            <p className="py-8 text-center text-muted-foreground">Bu sayfayı görüntülemek için yetkiniz bulunmuyor.</p>
          ) : reviews.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Henüz yorum yok.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İlan</TableHead>
                  <TableHead>Yorumlayan</TableHead>
                  <TableHead>Ortalama</TableHead>
                  <TableHead>Temizlik</TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Değer</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((rev, i) => (
                  <TableRow key={i}>
                    <TableCell>{rev.listing}</TableCell>
                    <TableCell>{rev.reviewer}</TableCell>
                    <TableCell>{rev.rating.toFixed(1)}</TableCell>
                    <TableCell>{rev.cleanliness.toFixed(1)}</TableCell>
                    <TableCell>{rev.communication.toFixed(1)}</TableCell>
                    <TableCell>{rev.location.toFixed(1)}</TableCell>
                    <TableCell>{rev.value.toFixed(1)}</TableCell>
                    <TableCell>{formatDate(rev.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ContentCard>
      </Section>
    </div>
  );
}
