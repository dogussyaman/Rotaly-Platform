import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PARTNER_PROFILES } from '@/lib/mock/dashboard';

export default function RolesPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Roller & Partnerler" description="Ajans/otel ortak profilleri ve kurumsal bilgiler.">
        <ContentCard title="Partner Kayıtları" description="Vergi ve şirket bilgileri">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tür</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Vergi No</TableHead>
                <TableHead>Web</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PARTNER_PROFILES.map((partner) => (
                <TableRow key={partner.company}>
                  <TableCell className="capitalize">{partner.partnerType}</TableCell>
                  <TableCell className="font-medium">{partner.company}</TableCell>
                  <TableCell>{partner.taxNumber}</TableCell>
                  <TableCell>{partner.website}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContentCard>
      </Section>
    </div>
  );
}
