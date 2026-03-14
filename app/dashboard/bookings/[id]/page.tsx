import { notFound } from 'next/navigation';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { BOOKINGS, formatCurrency, formatDate } from '@/lib/mock/dashboard';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const booking = BOOKINGS.find((item) => item.id === params.id);

  if (!booking) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section
        title={`Rezervasyon ${booking.id}`}
        description={`${formatDate(booking.checkIn)} → ${formatDate(booking.checkOut)} • ${booking.guestsCount} kişi`}
        actions={
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">Geri Dön</Link>
          </Button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Özet" description="Durum, fiyat ve indirim bilgileri">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Durum</span>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-center justify-between">
                <span>İlan</span>
                <span className="font-medium">{booking.listing}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Misafir</span>
                <span className="font-medium">{booking.guest}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Toplam</span>
                <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>İndirim</span>
                <span className="font-semibold">{formatCurrency(booking.discountTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Puan Kullanımı</span>
                <span className="font-semibold">{booking.pointsRedeemed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Final</span>
                <span className="font-semibold">{formatCurrency(booking.finalPrice)}</span>
              </div>
            </div>
          </ContentCard>

          <ContentCard title="Check-in Penceresi" description="Zaman aralığı ve ekstra hizmetler">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Saat</span>
                <span className="font-medium">
                  {booking.checkInSlotStart} - {booking.checkInSlotEnd}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kupon</span>
                {booking.coupon ? <Badge variant="secondary">{booking.coupon}</Badge> : <span>—</span>}
              </div>
              <Separator />
              <div>
                <p className="font-medium">Extras</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {booking.extras.length === 0 ? (
                    <Badge variant="outline">Ekstra yok</Badge>
                  ) : (
                    booking.extras.map((extra) => (
                      <Badge key={extra} variant="secondary">
                        {extra}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
