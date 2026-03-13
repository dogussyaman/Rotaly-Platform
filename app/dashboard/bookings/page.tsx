import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { BOOKINGS, formatCurrency, formatDate } from '@/lib/mock/dashboard';

export default function BookingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Rezervasyonlar" description="Giriş/çıkış, ödeme ve durum takibi.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Rezervasyon Listesi" description="check_in, check_out ve durum bilgileri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rezervasyon</TableHead>
                  <TableHead>İlan</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Misafir</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BOOKINGS.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      <a href={`/dashboard/bookings/${booking.id}`} className="underline underline-offset-4">
                        {booking.id}
                      </a>
                    </TableCell>
                    <TableCell>{booking.listing}</TableCell>
                    <TableCell>
                      {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                      <div className="text-xs text-muted-foreground">
                        {booking.checkInSlotStart} - {booking.checkInSlotEnd}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.guest}</div>
                      <div className="text-xs text-muted-foreground">{booking.guestsCount} kişi</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(booking.finalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Ekstra Hizmetler" description="extras JSONB alanı">
            <div className="space-y-4">
              {BOOKINGS.map((booking) => (
                <div key={booking.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{booking.id}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking.extras.length === 0 ? (
                      <Badge variant="outline">Ekstra yok</Badge>
                    ) : (
                      booking.extras.map((extra) => (
                        <Badge key={`${booking.id}-${extra}`} variant="secondary">
                          {extra}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
