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
    <Card className="border-none bg-white shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] rounded-[24px] overflow-hidden group hover:shadow-[0_8px_30px_0_rgba(0,0,0,0.06)] transition-all">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-base font-bold text-[#1A1A1A]">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-2">
        <Button asChild variant="ghost" className="w-full justify-between hover:bg-[#F4F7F6] text-[#0F3D3E] font-bold rounded-xl group-hover:px-6 transition-all">
          <Link href={href}>
            Git
            <span aria-hidden className="group-hover:translate-x-1 transition-transform">→</span>
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
                change: '+%12', 
                helper: 'Geçen aya göre',
                icon: HOST_ICONS[0]
              },
              { 
                title: 'Yaklaşan Giriş', 
                value: hostStats.upcomingCheckins.toString(), 
                change: '3 Yeni', 
                helper: 'Gelecek 7 gün',
                icon: HOST_ICONS[1]
              },
              { 
                title: 'Ortalama Puan', 
                value: hostStats.averageRating.toFixed(1), 
                change: '★ 4.9', 
                helper: `${hostStats.reviewCount} yorum`,
                icon: HOST_ICONS[2]
              },
              { 
                title: 'Yeni Mesaj', 
                value: hostStats.unreadMessages.toString(), 
                change: 'Acil', 
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
    <div className="flex flex-1 flex-col gap-6 px-5 py-6 lg:px-8 bg-[#F4F7F6]/50">
      <Section
        title={role === 'admin' ? 'Genel Bakış' : role === 'host' ? 'Yönetim Paneli' : 'Seyahat Özeti'}
        description="Platform üzerindeki güncel durumunuz ve önemli bildirimler."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         <Card className="xl:col-span-2 border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-[#1A1A1A]">Rezervasyon Takvimi</h3>
                <p className="text-[13px] text-muted-foreground mt-1">Doluluk oranı ve giriş/çıkış planı</p>
              </div>
              <Button variant="outline" className="h-9 rounded-xl border-[#0F3D3E]/20 text-[#0F3D3E] font-bold">Tümünü Gör</Button>
            </div>
            {/* Calendar UI Placeholder based on image */}
            <div className="h-[260px] w-full bg-[#F4F7F6] rounded-2xl flex items-center justify-center border border-dashed border-[#0F3D3E]/10">
               <div className="text-center">
                 <Calendar className="h-10 w-10 text-[#0F3D3E]/30 mx-auto mb-2" />
                 <p className="text-sm font-medium text-muted-foreground">Takvim Görünümü Yükleniyor...</p>
               </div>
            </div>
         </Card>

         <Card className="border-none bg-[#0F3D3E] shadow-2xl rounded-[24px] overflow-hidden p-6 text-white relative">
            <div className="relative z-10">
               <h3 className="text-lg font-extrabold mb-2">Hızlı İşlemler</h3>
               <p className="text-[13px] text-white/60 mb-6">İşlemlerinizi hızlıca gerçekleştirin</p>
               <div className="space-y-4">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center justify-between p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors border border-white/5">
                       <span className="font-bold">{link.title}</span>
                       <span className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">→</span>
                    </Link>
                  ))}
               </div>
            </div>
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-48 w-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
         </Card>
      </div>
    </div>
  );
}
