'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import data from './data.json';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SiteHeader } from '@/components/dashboard/site-header';
import { SectionCards } from '@/components/dashboard/section-cards';
import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive';
import { DataTable } from '@/components/dashboard/data-table';
import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardTitle } from '@/components/ui/card';

import { HostOverview } from '@/components/dashboard/host-overview';

export default function DashboardPage() {
  const { profile, loading, initialized } = useAppSelector((s) => s.user);
  const router = useRouter();

  // If not initialized or loading, we could show a skeleton or just return null
  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!profile) {
    router.replace('/auth/login');
    return null;
  }

  const isAdmin = !!profile.isAdmin;
  const isHost = !!profile.isHost;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {isAdmin ? (
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            ) : isHost ? (
              <HostOverview />
            ) : (
              <div className="px-4 lg:px-6 py-8 space-y-4">
                <h1 className="text-2xl font-bold">Seyahat Özeti</h1>
                <p className="text-sm text-muted-foreground">
                  Buradan profilinizdeki rezervasyonlarınızı, puanlarınızı ve listelerinizi hızlıca
                  görüntüleyebilirsiniz. Detaylar için profil sayfasını kullanabilirsiniz.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  <Card className="p-6 border-none bg-muted/40">
                    <CardTitle className="text-lg">Rezervasyonlarım</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">Gelecek seyahatlerinizi yönetin.</p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

