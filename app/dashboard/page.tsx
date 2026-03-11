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

export default function DashboardPage() {
  const { profile } = useAppSelector((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (profile?.isHost && !profile.isAdmin) {
      router.replace('/host/dashboard');
    }
  }, [profile, router]);

  const isAdmin = !!profile?.isAdmin;

  if (profile?.isHost && !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {isAdmin ? (
                <>
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  <DataTable data={data} />
                </>
              ) : (
                <div className="px-4 lg:px-6 py-8 space-y-4">
                  <h1 className="text-2xl font-bold">Seyahat Özeti</h1>
                  <p className="text-sm text-muted-foreground">
                    Buradan profilinizdeki rezervasyonlarınızı, puanlarınızı ve listelerinizi hızlıca
                    görüntüleyebilirsiniz. Detaylar için profil sayfasını kullanabilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

