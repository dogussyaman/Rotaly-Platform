'use client';

import { useEffect, useState } from 'react';
import { Loader2, Sparkles, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { useAppSelector } from '@/lib/store/hooks';
import {
  fetchLoyaltyAccount,
  fetchLoyaltyTransactions,
  type LoyaltyAccount,
  type LoyaltyTransaction,
} from '@/lib/supabase/loyalty';

type AdminAccountRow = {
  id: string;
  points_balance: number;
  lifetime_points_earned: number;
  profiles: { full_name: string | null } | null;
};

export default function LoyaltyPage() {
  const { profile } = useAppSelector((s) => s.user);
  const isAdmin = !!profile?.isAdmin;

  const [loading, setLoading] = useState(true);

  // Host / guest
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  // Admin
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountRow[]>([]);
  const [adminTx, setAdminTx] = useState<LoyaltyTransaction[]>([]);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      setLoading(true);

      if (isAdmin) {
        const supabase = createClient();
        const [aRes, tRes] = await Promise.all([
          supabase
            .from('loyalty_accounts')
            .select('id, points_balance, lifetime_points_earned, profiles(full_name)')
            .order('points_balance', { ascending: false }),
          supabase
            .from('loyalty_point_transactions')
            .select('id, account_id, booking_id, type, points, description, created_at')
            .order('created_at', { ascending: false })
            .limit(100),
        ]);
        setAdminAccounts((aRes.data ?? []) as AdminAccountRow[]);
        setAdminTx(
          (tRes.data ?? []).map((tx: any) => ({
            id: tx.id,
            accountId: tx.account_id,
            bookingId: tx.booking_id ?? null,
            type: tx.type,
            points: tx.points,
            description: tx.description ?? null,
            createdAt: tx.created_at,
          })),
        );
      } else {
        const [acc, txs] = await Promise.all([
          fetchLoyaltyAccount(profile.id),
          fetchLoyaltyTransactions(profile.id, 50),
        ]);
        setAccount(acc);
        setTransactions(txs);
      }
      setLoading(false);
    }
    void load();
  }, [profile?.id, isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  // ----------- Admin view -----------
  if (isAdmin) {
    const totalBalance = adminAccounts.reduce((s, a) => s + a.points_balance, 0);
    const totalLifetime = adminAccounts.reduce((s, a) => s + a.lifetime_points_earned, 0);

    return (
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium mb-1">Toplam hesap</p>
            <p className="text-2xl font-bold">{adminAccounts.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium mb-1">Toplam bakiye</p>
            <p className="text-2xl font-bold">{totalBalance.toLocaleString('tr-TR')}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs text-muted-foreground font-medium mb-1">Toplam kazanım</p>
            <p className="text-2xl font-bold">{totalLifetime.toLocaleString('tr-TR')}</p>
          </div>
        </div>

        <Section title="" description="">
          <div className="grid gap-6 xl:grid-cols-2">
            <ContentCard title="Hesaplar" description="Kullanıcı puan bakiyeleri">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wide">Kullanıcı</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Bakiye</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Toplam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Henüz hesap yok</TableCell>
                    </TableRow>
                  ) : (
                    adminAccounts.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{(a.profiles as { full_name: string | null } | null)?.full_name ?? '—'}</TableCell>
                        <TableCell className="font-semibold">{a.points_balance.toLocaleString('tr-TR')}</TableCell>
                        <TableCell>{a.lifetime_points_earned.toLocaleString('tr-TR')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ContentCard>

            <ContentCard title="Son hareketler" description="Earn / redeem işlemleri">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wide">Tip</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Puan</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Açıklama</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminTx.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Henüz hareket yok</TableCell>
                    </TableRow>
                  ) : (
                    adminTx.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <Badge variant="outline" className={tx.type === 'earn' ? 'text-emerald-600' : tx.type === 'redeem' ? 'text-rose-600' : ''}>
                            {tx.type === 'earn' ? 'Kazanım' : tx.type === 'redeem' ? 'Kullanım' : 'Düzeltme'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {tx.type === 'redeem' ? '-' : '+'}{tx.points}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.description ?? '—'}</TableCell>
                        <TableCell>{formatDate(tx.createdAt)}</TableCell>
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

  // ----------- Host / Guest view -----------
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Balance cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-0.5">Mevcut bakiye</p>
            <p className="text-2xl font-bold">{(account?.pointsBalance ?? 0).toLocaleString('tr-TR')}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-0.5">Toplam kazanılan</p>
            <p className="text-2xl font-bold">{(account?.lifetimePointsEarned ?? 0).toLocaleString('tr-TR')}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm flex items-start gap-3 sm:col-span-2 lg:col-span-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-0.5">Kullanılan</p>
            <p className="text-2xl font-bold">
              {((account?.lifetimePointsEarned ?? 0) - (account?.pointsBalance ?? 0)).toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      {!account && (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-amber-400 mb-3" />
          <p className="font-semibold">Henüz bir puan hesabınız yok.</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            İlk rezervasyonunuz tamamlandığında otomatik olarak puan kazanmaya başlayacaksınız.
            Kazandığınız puanları gelecekteki konaklamalarda indirim olarak kullanabilirsiniz.
          </p>
        </div>
      )}

      {/* Transactions table */}
      <ContentCard title="Puan hareketleri" description="Son işlemleriniz" className="rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wide">İşlem</TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Puan</TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Açıklama</TableHead>
              <TableHead className="text-xs uppercase tracking-wide">Tarih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                  Henüz puan hareketi bulunmuyor.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-[#f9fafb]">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === 'earn' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : tx.type === 'redeem' ? (
                        <ArrowDownLeft className="h-4 w-4 text-rose-500" />
                      ) : null}
                      <Badge variant="outline" className={tx.type === 'earn' ? 'text-emerald-600 border-emerald-200' : tx.type === 'redeem' ? 'text-rose-600 border-rose-200' : ''}>
                        {tx.type === 'earn' ? 'Kazanım' : tx.type === 'redeem' ? 'Kullanım' : 'Düzeltme'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className={`font-semibold ${tx.type === 'redeem' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {tx.type === 'redeem' ? '-' : '+'}{tx.points.toLocaleString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tx.description ?? '—'}</TableCell>
                  <TableCell>{formatDate(tx.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ContentCard>
    </div>
  );
}
