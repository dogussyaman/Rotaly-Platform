'use client';

import Link from 'next/link';
import { Calendar, Gift, Heart, Home, MessageSquare, Star, TicketPercent, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/lib/store/hooks';
import { ADMIN_STATS, GUEST_STATS, HOST_STATS } from '@/lib/mock/dashboard';
import { Section, StatCard } from '@/components/dashboard/dashboard-ui';

const ADMIN_ICONS = [Users, Home, Calendar, Star] as const;
const HOST_ICONS = [Gift, Calendar, Star, MessageSquare] as const;
const GUEST_ICONS = [Calendar, Heart, Gift, TicketPercent] as const;

function QuickLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="border-none bg-card/50">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full justify-between">
          <Link href={href}>
            Aç
            <span aria-hidden>→</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const { profile } = useAppSelector((s) => s.user);
  const role: 'admin' | 'host' | 'guest' = profile?.isAdmin ? 'admin' : profile?.isHost ? 'host' : 'guest';

  const stats =
    role === 'admin'
      ? ADMIN_STATS.map((stat, index) => ({ ...stat, icon: ADMIN_ICONS[index] }))
      : role === 'host'
        ? HOST_STATS.map((stat, index) => ({ ...stat, icon: HOST_ICONS[index] }))
        : GUEST_STATS.map((stat, index) => ({ ...stat, icon: GUEST_ICONS[index] }));

  const links =
    role === 'admin'
      ? [
          { title: 'Kullanıcılar', description: 'Profil ve rol yönetimi', href: '/dashboard/users' },
          { title: 'İlanlar', description: 'İlan, görsel, imkan', href: '/dashboard/listings' },
          { title: 'Rezervasyonlar', description: 'Durum ve ödeme takibi', href: '/dashboard/bookings' },
          { title: 'Raporlar', description: 'Finansal ve operasyon', href: '/dashboard/reports' },
        ]
      : role === 'host'
        ? [
            { title: 'İlanlarım', description: 'İlan yönetimi', href: '/dashboard/listings' },
            { title: 'Uygunluk', description: 'Takvim ve fiyat', href: '/dashboard/availability' },
            { title: 'Rezervasyonlar', description: 'Giriş/çıkış planı', href: '/dashboard/bookings' },
            { title: 'Mesajlar', description: 'Misafir iletişimi', href: '/dashboard/messages' },
          ]
        : [
            { title: 'Rezervasyonlarım', description: 'Seyahat geçmişi', href: '/dashboard/bookings' },
            { title: 'Favorilerim', description: 'Kaydedilen ilanlar', href: '/dashboard/wishlists' },
            { title: 'Kuponlar', description: 'Kampanyalar', href: '/dashboard/coupons' },
            { title: 'Turlar', description: 'Deneyimler', href: '/dashboard/tours' },
          ];

  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section
        title={role === 'admin' ? 'Genel Bakış' : role === 'host' ? 'Ev Sahibi Özeti' : 'Seyahat Özeti'}
        description="Önemli metrikler ve hızlı erişim alanları."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </Section>

      <Separator />

      <Section title="Hızlı Erişim" description="En sık kullanılan sayfalara tek tıkla ulaşın.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {links.map((link) => (
            <QuickLink key={link.href} {...link} />
          ))}
        </div>
      </Section>
    </div>
  );
}
