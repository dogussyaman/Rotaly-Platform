'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { createClient } from '@/lib/supabase/client';
import type { ReviewRow } from '@/lib/mock/dashboard';
import { formatDate } from '@/lib/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
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
          listings(title),
          profiles!reviewer_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
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
        <ContentCard title="Yorumlar" description="Temizlik, iletişim ve değer puanları">
          {reviews.length === 0 ? (
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
