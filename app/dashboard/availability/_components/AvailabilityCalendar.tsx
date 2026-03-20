'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AvailabilityCalendarSkeleton } from '@/components/dashboard/dashboard-skeletons';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import { getDaysInMonth, getTodayString, toLocalDateString } from './utils';
import type { AvailabilityDay } from '@/lib/supabase/availability';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarProps {
  listings: { id: string; title: string }[];
  listingId: string;
  setListingId: (id: string) => void;
  month: Date;
  setMonth: (fn: (m: Date) => Date) => void;
  days: AvailabilityDay[];
  bookedDates: Set<string>;
  loading: boolean;
  updating: boolean;
  actionDay: string | null;
  onDayClick: (date: Date) => void;
  onMonthOpen: (open: boolean) => void;
}

export function AvailabilityCalendar({
  listings,
  listingId,
  setListingId,
  month,
  setMonth,
  days,
  bookedDates,
  loading,
  updating,
  actionDay,
  onDayClick,
  onMonthOpen,
}: AvailabilityCalendarProps) {
  const dayMap = new Map(days.map((d) => [d.date, d]));
  const todayStr = getTodayString();

  return (
    <ContentCard title="İlan seçin ve takvim" description="İlan bazında uygunluk yönetimi. Tarihe tıklayarak uygunluk açar veya kapatırsınız.">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={listingId} onValueChange={setListingId}>
            <SelectTrigger className="w-60 rounded-lg">
              <SelectValue placeholder="İlan seçin" />
            </SelectTrigger>
            <SelectContent>
              {listings.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500 border border-emerald-600" />
              <span className="text-emerald-700 font-medium">Uygun</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-slate-400 border border-slate-500" />
              <span className="text-slate-600 font-medium">Kapalı</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-amber-400 border border-amber-500" />
              <span className="text-amber-700 font-medium">Rezervasyon</span>
            </span>
          </div>
        </div>

        {listingId && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-35 text-center text-sm font-medium">
                  {month.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-lg" disabled={updating} onClick={() => onMonthOpen(true)}>
                  Bu ay uygunluk aç
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg" disabled={updating} onClick={() => onMonthOpen(false)}>
                  Bu ay uygunluk kapat
                </Button>
              </div>
            </div>

            {loading ? (
              <AvailabilityCalendarSkeleton />
            ) : (
              <div className="rounded-xl border border-border/70 bg-card/90 p-4">
                <div className="grid grid-cols-7 gap-1">
                  {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((w) => (
                    <div key={w} className="py-1 text-center text-xs font-medium text-muted-foreground">{w}</div>
                  ))}
                  {getDaysInMonth(month).map((d, i) => {
                    if (!d) return <div key={`pad-${i}`} />;
                    const dateStr = toLocalDateString(d);
                    const isPast = dateStr < todayStr;
                    const isBooked = bookedDates.has(dateStr);
                    const dayInfo = dayMap.get(dateStr);
                    const available = dayInfo ? dayInfo.isAvailable : true;
                    const isUpdating = actionDay === dateStr || actionDay === 'month';
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        className={cn(
                          'flex min-h-10 flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors',
                          isPast && 'cursor-not-allowed bg-muted/40 text-muted-foreground/50 opacity-60',
                          !isPast && isBooked && 'cursor-default bg-amber-200 text-amber-900 border border-amber-400 font-semibold',
                          !isPast && !isBooked && available && 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400',
                          !isPast && !isBooked && !available && 'bg-slate-200 text-slate-600 border border-slate-300 hover:bg-slate-300',
                          isUpdating && 'pointer-events-none opacity-60',
                        )}
                        onClick={() => onDayClick(d)}
                        disabled={updating || isPast || isBooked}
                        title={isBooked ? 'Rezervasyon var' : undefined}
                      >
                        {d.getDate()}
                        {isBooked && <span className="text-[10px] font-medium">Rez.</span>}
                        {!isPast && !isBooked && dayInfo?.customPrice != null && (
                          <span className="text-[10px] opacity-80">₺{Number(dayInfo.customPrice).toLocaleString('tr-TR')}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {listings.length === 0 && !loading && (
          <p className="py-8 text-center text-sm text-muted-foreground">Henüz ilanınız yok. Önce bir otel ilanı oluşturun.</p>
        )}
      </div>
    </ContentCard>
  );
}
