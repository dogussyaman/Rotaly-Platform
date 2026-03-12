'use client';

import { Calendar, MapPin, Star, TicketPercent, Users, LucideIcon } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { formatNumber } from '@/lib/i18n/format';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (id: any) => void;
  bookingCount: number;
  pointsBalance: number | undefined;
}

export function ProfileSidebar({ activeTab, setActiveTab, bookingCount, pointsBalance }: ProfileSidebarProps) {
  const { t, locale } = useLocale();

  const tabs: Tab[] = [
    { id: 'bookings', label: t.profileTabBookings as string, icon: Calendar },
    { id: 'tours', label: t.profileTabTours as string, icon: MapPin },
    { id: 'wishlists', label: t.profileTabWishlists as string, icon: Star },
    { id: 'loyalty', label: t.profileTabLoyalty as string, icon: TicketPercent },
    { id: 'account', label: t.profileTabAccount as string, icon: Users },
  ];

  return (
    <aside className="lg:col-span-3">
      <div className="sticky top-32 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 pl-4">
            {t.profileSidebarTitle as string}
          </h3>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${activeTab === tab.id
                ? 'bg-amber-500 text-foreground shadow-lg shadow-amber-500/20'
                : 'hover:bg-muted text-muted-foreground'
                }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Küçük özet kartı */}
        <div className="rounded-2xl border border-border bg-card shadow-sm px-4 py-4 space-y-2 text-xs">
          <p className="font-bold text-foreground">{t.profileSummaryTitle as string}</p>
          <div className="space-y-1.5">
            <p className="flex justify-between items-center text-muted-foreground">
              <span>{t.profileSummaryBookings as string}</span>
              <span className="font-black text-foreground">{formatNumber(bookingCount, locale)}</span>
            </p>
            {pointsBalance !== undefined && (
              <p className="flex justify-between items-center text-muted-foreground">
                <span>{t.profileSummaryPoints as string}</span>
                <span className="font-black text-amber-600">
                  {formatNumber(pointsBalance, locale)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
