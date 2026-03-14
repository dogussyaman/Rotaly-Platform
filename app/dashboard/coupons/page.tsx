import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { COUPONS, COUPON_USAGES, formatCurrency, formatDate } from '@/lib/mock/dashboard';

export default function CouponsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Kuponlar" description="Kampanyalar ve kullanım geçmişi.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Kuponlar" description="Geçerlilik ve indirim tipleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Değer</TableHead>
                  <TableHead>Min. Tutar</TableHead>
                  <TableHead>Bitiş</TableHead>
                  <TableHead>Aktif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COUPONS.map((coupon) => (
                  <TableRow key={coupon.code}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.discountType === 'percentage' ? 'Yüzde' : 'Tutar'}</TableCell>
                    <TableCell>
                      {coupon.discountType === 'percentage'
                        ? `%${coupon.discountValue}`
                        : formatCurrency(coupon.discountValue)}
                    </TableCell>
                    <TableCell>{formatCurrency(coupon.minTotal)}</TableCell>
                    <TableCell>{formatDate(coupon.expiresAt)}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Kullanımlar" description="coupon_usages tablosu">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rezervasyon</TableHead>
                  <TableHead>İndirim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COUPON_USAGES.map((usage) => (
                  <TableRow key={`${usage.code}-${usage.booking}`}>
                    <TableCell>{usage.code}</TableCell>
                    <TableCell>{usage.user}</TableCell>
                    <TableCell>{usage.booking}</TableCell>
                    <TableCell>{formatCurrency(usage.discountApplied)}</TableCell>
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
