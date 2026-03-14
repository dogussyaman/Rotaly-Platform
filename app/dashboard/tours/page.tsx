import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { TOUR_BOOKINGS, TOUR_OPERATORS, TOUR_REVIEWS, TOUR_SCHEDULES, TOURS, formatCurrency } from '@/lib/mock/dashboard';

export default function ToursPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Turlar" description="Tur operatörleri, seanslar ve rezervasyonlar.">
        <div className="grid gap-4 xl:grid-cols-3">
          <ContentCard title="Operatörler" description="tour_operators tablosu">
            <div className="space-y-3 text-sm">
              {TOUR_OPERATORS.map((operator) => (
                <div key={operator.company} className="space-y-1">
                  <p className="font-medium">{operator.company}</p>
                  <p className="text-xs text-muted-foreground">{operator.phone}</p>
                  <p className="text-xs text-muted-foreground">{operator.website}</p>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard title="Turlar" description="Fiyat ve kapasite bilgileri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tur</TableHead>
                  <TableHead>Şehir</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Puan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOURS.map((tour) => (
                  <TableRow key={tour.title}>
                    <TableCell className="font-medium">{tour.title}</TableCell>
                    <TableCell>{tour.city}</TableCell>
                    <TableCell>{tour.durationMinutes} dk</TableCell>
                    <TableCell>{formatCurrency(tour.basePrice)}</TableCell>
                    <TableCell>{tour.rating.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Seanslar & Rezervasyon" description="tour_schedules ve tour_bookings">
            <div className="space-y-4 text-sm">
              {TOUR_SCHEDULES.map((schedule) => (
                <div key={schedule.startTime} className="space-y-1">
                  <p className="font-medium">{schedule.tour}</p>
                  <p className="text-xs text-muted-foreground">{schedule.startTime}</p>
                  <p className="text-xs text-muted-foreground">
                    Kalan {schedule.availableSpots} •{' '}
                    {schedule.priceOverride ? formatCurrency(schedule.priceOverride) : 'Standart fiyat'}
                  </p>
                </div>
              ))}
              <Separator />
              {TOUR_BOOKINGS.map((booking) => (
                <div key={`${booking.tour}-${booking.guest}`} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.tour}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.guest} • {booking.participants} kişi
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                {TOUR_REVIEWS.map((review) => (
                  <div key={`${review.tour}-${review.reviewer}`} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{review.tour}</span> — {review.comment}{' '}
                    <Badge variant="outline">{review.rating}/5</Badge>
                  </div>
                ))}
              </div>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
