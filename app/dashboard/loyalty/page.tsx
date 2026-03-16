'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { useAppSelector } from '@/lib/store/hooks';

type AccountRow = { id: string; points_balance: number; lifetime_points_earned: number; profiles: { full_name: string | null } | null };
type TxRow = { id: string; type: string; points: number; description: string | null; created_at: string; loyalty_accounts: { user_id: string } | null };

export default function LoyaltyPage() {
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAppSelector((s) => s.user);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      const supabase = createClient();
      const isAdmin = !!profile.isAdmin;
      const accountsQuery = isAdmin
        ? supabase
            .from('loyalty_accounts')
            .select('id, points_balance, lifetime_points_earned, profiles(full_name)')
            .order('points_balance', { ascending: false })
        : supabase
            .from('loyalty_accounts')
            .select('id, points_balance, lifetime_points_earned, profiles(full_name)')
            .eq('user_id', profile.id)
            .order('points_balance', { ascending: false });

      const txQuery = isAdmin
        ? supabase
            .from('loyalty_point_transactions')
            .select('id, type, points, description, created_at, loyalty_accounts(user_id)')
            .order('created_at', { ascending: false })
            .limit(100)
        : supabase
            .from('loyalty_point_transactions')
            .select('id, type, points, description, created_at, loyalty_accounts!inner(user_id)')
            .eq('loyalty_accounts.user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(100);

      const [aRes, tRes] = await Promise.all([accountsQuery, txQuery]);
      setAccounts((aRes.data ?? []) as AccountRow[]);
      setTransactions((tRes.data ?? []) as TxRow[]);
      setLoading(false);
    }
    void load();
  }, [profile?.id, profile?.isAdmin]);

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
          <ContentCard title="Hesaplar" description="Puan bakiyeleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Bakiye</TableHead>
                  <TableHead>Toplam Kazanım</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  accounts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{(a.profiles as { full_name: string | null } | null)?.full_name ?? '—'}</TableCell>
                      <TableCell>{a.points_balance}</TableCell>
                      <TableCell>{a.lifetime_points_earned}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Hareketler" description="earn / redeem işlemleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip</TableHead>
                  <TableHead>Puan</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="capitalize">{t.type}</TableCell>
                      <TableCell>{t.points}</TableCell>
                      <TableCell>{t.description ?? '—'}</TableCell>
                      <TableCell>{formatDate(t.created_at)}</TableCell>
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
