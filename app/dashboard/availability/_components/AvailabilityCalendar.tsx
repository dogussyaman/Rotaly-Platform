'use client';

import { CalendarCheck, ChevronLeft, ChevronRight, Lock, Loader2, Unlock } from 'lucide-react';
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
            <SelectTrigger className="w-[240px] rounded-lg">
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
              <Unlock className="h-4 w-4 text-primary" />
              <span>Uygun</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span>Kapalı</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <CalendarCheck className="h-4 w-4" />
              <span>Rezervasyon</span>
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
                <span className="min-w-[140px] text-center text-sm font-medium">
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
              <div className="flex h-[320px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
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
                          'flex min-h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors',
                          isPast && 'cursor-not-allowed bg-muted/50 text-muted-foreground/70 opacity-70',
                          !isPast && isBooked && 'cursor-default bg-amber-100 text-amber-800 border border-amber-300',
                          !isPast && !isBooked && available && 'bg-primary/10 text-primary hover:bg-primary/20',
                          !isPast && !isBooked && !available && 'bg-muted text-muted-foreground hover:bg-muted/70',
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
