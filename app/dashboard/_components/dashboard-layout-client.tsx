'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SiteHeader } from '@/components/dashboard/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchUserProfile } from '@/lib/store/slices/user-slice';

function getHeaderTitle(pathname: string, role: 'admin' | 'host' | 'guest') {
  if (pathname === '/dashboard') {
    if (role === 'admin') return { title: 'Yönetici Paneli', subtitle: 'Platform operasyonlarının merkezi yönetimi.' };
    if (role === 'host') return { title: 'Ev Sahibi Paneli', subtitle: 'İlanlarınızı ve rezervasyonlarınızı yönetin.' };
    return { title: 'Seyahat Paneli', subtitle: 'Rezervasyonlarınızı ve puanlarınızı takip edin.' };
  }

  const map: Record<string, { title: string; subtitle: string }> = {
    '/dashboard/users': { title: 'Kullanıcılar', subtitle: 'Profil doğrulamaları ve rol atamaları.' },
    '/dashboard/roles': { title: 'Roller & Partnerler', subtitle: 'Partner profilleri ve rol yönetimi.' },
    '/dashboard/hosts': { title: 'Ev Sahipleri', subtitle: 'Yanıt oranı, dil ve performans metrikleri.' },
    '/dashboard/listings': { title: 'İlanlar', subtitle: 'İlan içerikleri, görseller, imkanlar ve kurallar.' },
    '/dashboard/availability': { title: 'Uygunluk Takvimi', subtitle: 'Müsaitlik ve özel fiyat yönetimi.' },
    '/dashboard/bookings': { title: 'Rezervasyonlar', subtitle: 'Giriş/çıkış, ödeme ve durum takibi.' },
    '/dashboard/reviews': { title: 'Değerlendirmeler', subtitle: 'Puan kırılımı ve yorum yönetimi.' },
    '/dashboard/wishlists': { title: 'Favoriler', subtitle: 'Favori listeleri ve liste öğeleri.' },
    '/dashboard/messages': { title: 'Mesajlar', subtitle: 'Konuşmalar, mesajlar ve okunmamışlar.' },
    '/dashboard/loyalty': { title: 'Sadakat', subtitle: 'Puan bakiyeleri ve hareketleri.' },
    '/dashboard/coupons': { title: 'Kuponlar', subtitle: 'Kampanyalar ve kullanım geçmişi.' },
    '/dashboard/tours': { title: 'Turlar', subtitle: 'Tur operatörleri, seanslar ve rezervasyonlar.' },
    '/dashboard/reports': { title: 'Raporlar', subtitle: 'Operasyon, finans ve risk raporları.' },
    '/dashboard/earnings': { title: 'Gelirler', subtitle: 'Ev sahibi gelir ve vergi özetleri.' },
    '/dashboard/profile': { title: 'Profil', subtitle: 'Hesap bilgileriniz.' },
    '/dashboard/documents': { title: 'Belgeler', subtitle: 'Seyahat belgeleri ve faturalar.' },
    '/dashboard/settings': { title: 'Ayarlar', subtitle: 'Panel tercihleri ve hesap ayarları.' },
    '/dashboard/help': { title: 'Yardım', subtitle: 'Sık sorulan sorular ve destek.' },
  };

  if (map[pathname]) return map[pathname];

  if (pathname.startsWith('/dashboard/bookings/')) {
    return { title: 'Rezervasyon Detayı', subtitle: 'Rezervasyonun tüm detaylarını inceleyin.' };
  }

  return { title: 'Dashboard', subtitle: 'Panel görünümü' };
}

export default function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const { profile, loading, initialized } = useAppSelector((s) => s.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initialized && !loading) {
      void dispatch(fetchUserProfile());
    }
  }, [dispatch, initialized, loading]);

  useEffect(() => {
    if (initialized && !loading && !profile) {
      router.replace('/auth/login');
    }
  }, [initialized, loading, profile, router]);

  // Only block the UI on the initial auth/profile bootstrap.
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const role: 'admin' | 'host' | 'guest' = profile.isAdmin ? 'admin' : profile.isHost ? 'host' : 'guest';
  const header = getHeaderTitle(pathname, role);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={header.title} subtitle={header.subtitle} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
