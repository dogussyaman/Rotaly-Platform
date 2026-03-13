import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AVAILABILITY, formatCurrency, formatDate } from '@/lib/mock/dashboard';

export default function AvailabilityPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Uygunluk Takvimi" description="Müsaitlik ve özel fiyat yönetimi.">
        <ContentCard title="Takvim Görünümü" description="Yakın tarihli müsaitlik kayıtları">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İlan</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Uygun</TableHead>
                <TableHead>Özel Fiyat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AVAILABILITY.map((item) => (
                <TableRow key={`${item.listing}-${item.date}`}>
                  <TableCell>{item.listing}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <BooleanBadge value={item.available} />
                  </TableCell>
                  <TableCell>{item.customPrice ? formatCurrency(item.customPrice) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ContentCard>
      </Section>
    </div>
  );
}

