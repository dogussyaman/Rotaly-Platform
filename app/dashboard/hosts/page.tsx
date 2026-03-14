import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HOSTS } from '@/lib/mock/dashboard';

export default function HostsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Ev Sahipleri" description="Ev sahibi performans ve yanıt metrikleri.">
        <ContentCard title="Ev Sahibi Detayları" description="Yanıt oranı, dil ve değerlendirme bilgileri">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ev Sahibi</TableHead>
                <TableHead>Yanıt Oranı</TableHead>
                <TableHead>Yanıt Süresi</TableHead>
                <TableHead>Süper Ev Sahibi</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Diller</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HOSTS.map((host) => (
                <TableRow key={host.name}>
                  <TableCell className="font-medium">{host.name}</TableCell>
                  <TableCell>{host.responseRate}%</TableCell>
                  <TableCell>{host.responseTime}</TableCell>
                  <TableCell>
                    <BooleanBadge value={host.superhost} />
                  </TableCell>
                  <TableCell>{host.totalReviews}</TableCell>
                  <TableCell>{host.languages.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContentCard>
      </Section>
    </div>
  );
}
