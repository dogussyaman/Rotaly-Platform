'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Gift, Heart, Home, MessageSquare, Star, TicketPercent, Users, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/lib/store/hooks';
import { ADMIN_STATS, GUEST_STATS } from '@/lib/mock/dashboard';
import { Section, StatCard } from '@/components/dashboard/dashboard-ui';
import { fetchHostByUserId, fetchHostStats, HostStats } from '@/lib/supabase/host';

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
  const [hostStats, setHostStats] = useState<HostStats | null>(null);
  const [loading, setLoading] = useState(true);

  const role: 'admin' | 'host' | 'guest' = profile?.isAdmin ? 'admin' : profile?.isHost ? 'host' : 'guest';

  useEffect(() => {
    async function loadStats() {
      if (role === 'host' && profile?.id) {
        try {
          const host = await fetchHostByUserId(profile.id);
          if (host) {
            const stats = await fetchHostStats(host.hostId, profile.id);
            setHostStats(stats);
          }
        } catch (error) {
          console.error('Error loading host stats:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    loadStats();
  }, [role, profile?.id]);

  const stats =
    role === 'admin'
      ? ADMIN_STATS.map((stat, index) => ({ ...stat, icon: ADMIN_ICONS[index] }))
      : role === 'host'
        ? hostStats 
          ? [
              { 
                title: 'Bu Ay Gelir', 
                value: `₺${hostStats.thisMonthEarnings.toLocaleString('tr-TR')}`, 
                change: '', 
                helper: 'Net kazanç',
                icon: HOST_ICONS[0]
              },
              { 
                title: 'Yaklaşan Giriş', 
                value: hostStats.upcomingCheckins.toString(), 
                change: '', 
                helper: 'Gelecek 7 gün',
                icon: HOST_ICONS[1]
              },
              { 
                title: 'Ortalama Puan', 
                value: hostStats.averageRating.toFixed(1), 
                change: '', 
                helper: `${hostStats.reviewCount} değerlendirme`,
                icon: HOST_ICONS[2]
              },
              { 
                title: 'Yeni Mesaj', 
                value: hostStats.unreadMessages.toString(), 
                change: '', 
                helper: 'Okunmamış',
                icon: HOST_ICONS[3]
              },
            ]
          : []
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

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
