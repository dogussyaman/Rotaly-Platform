import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LOYALTY_ACCOUNTS, LOYALTY_TRANSACTIONS } from '@/lib/mock/dashboard';

export default function LoyaltyPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Sadakat" description="Puan bakiyeleri ve hareketleri.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Hesaplar" description="loyalty_accounts tablosu">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Bakiye</TableHead>
                  <TableHead>Toplam Kazanım</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LOYALTY_ACCOUNTS.map((account) => (
                  <TableRow key={account.user}>
                    <TableCell>{account.user}</TableCell>
                    <TableCell>{account.pointsBalance}</TableCell>
                    <TableCell>{account.lifetimePoints}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Hareketler" description="earn / redeem işlemleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Puan</TableHead>
                  <TableHead>Açıklama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LOYALTY_TRANSACTIONS.map((tx) => (
                  <TableRow key={`${tx.user}-${tx.createdAt}`}>
                    <TableCell>{tx.user}</TableCell>
                    <TableCell className="capitalize">{tx.type}</TableCell>
                    <TableCell>{tx.points}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}

