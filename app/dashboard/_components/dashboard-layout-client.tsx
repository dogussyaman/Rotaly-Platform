'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SiteHeader } from '@/components/dashboard/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchUserProfile } from '@/lib/store/slices/user-slice';

const ADMIN_ONLY_PREFIXES = [
  '/dashboard/applications',
  '/dashboard/users',
  '/dashboard/roles',
  '/dashboard/hosts',
  '/dashboard/wishlists',
  '/dashboard/reports',
  '/dashboard/documents',
];

function getHeaderTitle(pathname: string, role: 'admin' | 'host') {
  if (pathname === '/dashboard') {
    if (role === 'admin') return { title: 'Yönetici Paneli', subtitle: 'Platform operasyonlarının merkezi yönetimi.' };
    return { title: 'Ev Sahibi Paneli', subtitle: 'İlanlarınızı ve rezervasyonlarınızı yönetin.' };
  }

  if (pathname === '/dashboard/listings') {
    return role === 'host'
      ? { title: 'Otel ilanlarım', subtitle: 'İlan içerikleri, görseller, imkanlar ve kurallar.' }
      : { title: 'Otel İlanları', subtitle: 'İlan içerikleri, görseller, imkanlar ve kurallar.' };
  }

  if (pathname === '/dashboard/bookings') {
    return { title: 'Rezervasyonlar', subtitle: 'Giriş/çıkış, ödeme ve durum takibi.' };
  }

  const map: Record<string, { title: string; subtitle: string }> = {
    '/dashboard/search': { title: 'Arama', subtitle: 'İlan, rezervasyon ve mesaj sonuçları.' },
    '/dashboard/applications': { title: 'Otel Başvuruları', subtitle: 'Gelen başvuruları inceleyip onaylayın.' },
    '/dashboard/users': { title: 'Kullanıcılar', subtitle: 'Profil doğrulama ve rol atamaları.' },
    '/dashboard/roles': { title: 'Roller & Yetkiler', subtitle: 'Rol atama, doğrulama ve ilk üyelik kupon kuralı.' },
    '/dashboard/hosts': { title: 'Ev Sahipleri', subtitle: 'Yanıt oranı, dil ve performans metrikleri.' },
    '/dashboard/availability': { title: 'Uygunluk Takvimi', subtitle: 'Müsaitlik ve özel fiyat yönetimi.' },
    '/dashboard/reviews': { title: 'Değerlendirmeler', subtitle: 'Puan kırılımı ve yorum yönetimi.' },
    '/dashboard/wishlists': { title: 'Favoriler', subtitle: 'Favori listeleri ve liste öğeleri.' },
    '/dashboard/messages': { title: 'Mesajlar', subtitle: 'Konuşmalar ve okunmamışlar.' },
    '/dashboard/loyalty': { title: 'Sadakat', subtitle: 'Puan bakiyeleri ve hareketleri.' },
    '/dashboard/coupons': { title: 'Kuponlar', subtitle: 'Kampanyalar ve kullanım geçmişi.' },
    '/dashboard/tours': { title: 'Turlar', subtitle: 'Tur seansları ve rezervasyonlar.' },
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

  if (pathname.startsWith('/dashboard/listings/')) {
    return { title: 'İlan Detayı', subtitle: 'İlan bilgileri, güncelleme ve uygunluk.' };
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

  useEffect(() => {
    if (!initialized || loading || !profile) return;
    const isGuest = !profile.isAdmin && !profile.isHost;
    if (isGuest) {
      router.replace('/profile');
    }
  }, [initialized, loading, profile, router]);

  useEffect(() => {
    if (!initialized || loading || !profile) return;
    if (!profile.isAdmin && ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      router.replace('/dashboard');
    }
  }, [initialized, loading, profile, pathname, router]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const isGuest = !profile.isAdmin && !profile.isHost;
  if (isGuest) {
    return null;
  }

  const role: 'admin' | 'host' | 'guest' = profile.isAdmin ? 'admin' : 'host';
  const header = getHeaderTitle(pathname, role);

  return (
    <SidebarProvider className="dashboard-theme">
      <AppSidebar variant="sidebar" />
      <SidebarInset className="bg-muted/40 min-h-svh">
        <SiteHeader title={header.title} subtitle={header.subtitle} />
        <div className="flex flex-1 flex-col @container/main overflow-auto min-h-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
