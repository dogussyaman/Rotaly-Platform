'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ChevronLeft, ChevronRight, Minus, Plus, X, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from '@/lib/i18n/locale-context';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSearch } from '@/lib/store/slices/search-slice';
import type { GuestCounts } from '@/lib/store/slices/search-slice';
import { searchLocations, type LocationSuggestion } from '@/lib/supabase/listings';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DateRange {
  start: Date | null;
  end: Date | null;
}

type ActivePanel = 'location' | 'checkin' | 'checkout' | 'guests' | null;

// ─── Mini Calendar ───────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function MiniCalendar({
  year, month, onPrev, onNext, dateRange, onDateClick, hoverDate, onHover, days, months,
}: {
  year: number; month: number;
  onPrev: () => void; onNext: () => void;
  dateRange: DateRange;
  onDateClick: (d: Date) => void;
  hoverDate: Date | null;
  onHover: (d: Date | null) => void;
  days: string[];
  months: string[];
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const isInRange = (d: Date) => {
    const start = dateRange.start;
    const end = dateRange.end || hoverDate;
    if (!start || !end) return false;
    const [lo, hi] = start <= end ? [start, end] : [end, start];
    return d > lo && d < hi;
  };
  const isStart = (d: Date) => dateRange.start?.toDateString() === d.toDateString();
  const isEnd = (d: Date) => dateRange.end?.toDateString() === d.toDateString();
  const isPast = (d: Date) => d < today;

  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
  );

  return (
    <div className="w-64">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">{months[month]} {year}</span>
        <button onClick={onNext} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {days.map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const past = isPast(d);
          const start = isStart(d);
          const end = isEnd(d);
          const inRange = isInRange(d);
          return (
            <button
              key={d.toDateString()}
              disabled={past}
              onMouseEnter={() => !past && onHover(d)}
              onMouseLeave={() => onHover(null)}
              onClick={() => !past && onDateClick(d)}
              className={[
                'relative h-8 w-full flex items-center justify-center text-xs font-medium transition-all select-none',
                past ? 'text-muted-foreground/30 cursor-not-allowed' : 'cursor-pointer',
                (start || end) ? 'bg-foreground text-card z-10' : '',
                inRange ? 'bg-foreground/10' : '',
                !start && !end && !inRange && !past ? 'hover:bg-muted' : '',
                start ? 'rounded-l-full' : '',
                end ? 'rounded-r-full' : '',
                !start && !end ? 'rounded-full' : '',
              ].filter(Boolean).join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hero Search Bar ─────────────────────────────────────────────────────────

export function HeroSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const reduxSearch = useAppSelector((s) => s.search);

  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [location, setLocation] = useState(reduxSearch.location);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: reduxSearch.checkIn ? new Date(reduxSearch.checkIn) : null,
    end: reduxSearch.checkOut ? new Date(reduxSearch.checkOut) : null,
  });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState({
    adults: Math.max(1, reduxSearch.guests.adults),
    children: Math.max(0, reduxSearch.guests.children),
    infants: Math.max(0, reduxSearch.guests.infants),
  });
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const lastSyncedQueryRef = useRef<string>('');

  const parseDateParam = useCallback((raw: string): Date | null => {
    if (!raw) return null;
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    if (ymd) {
      const y = Number(ymd[1]);
      const m = Number(ymd[2]) - 1;
      const d = Number(ymd[3]);
      return new Date(Date.UTC(y, m, d, 12, 0, 0));
    }
    const dt = new Date(raw);
    if (Number.isNaN(dt.getTime())) return null;
    return dt;
  }, []);

  // URL'den (örn. /search?location=...&checkin=...&checkout=...) gelince barı doldur.
  useEffect(() => {
    if (activePanel) return;

    const loc = searchParams.get('location') ?? '';
    const cin = searchParams.get('checkin');
    const cout = searchParams.get('checkout');
    const adultsParam = searchParams.get('adults');
    const childrenParam = searchParams.get('children');
    const infantsParam = searchParams.get('infants');
    const gst = searchParams.get('guests');

    const queryKey = `${loc}__${cin ?? ''}__${cout ?? ''}__${adultsParam ?? ''}__${childrenParam ?? ''}__${infantsParam ?? ''}__${gst ?? ''}`;
    if (!loc && !cin && !cout && !adultsParam && !childrenParam && !infantsParam && !gst) return;
    if (lastSyncedQueryRef.current === queryKey) return;
    lastSyncedQueryRef.current = queryKey;

    const nextStart = cin ? parseDateParam(cin) : null;
    const nextEnd = cout ? parseDateParam(cout) : null;
    const adults = adultsParam ? Number.parseInt(adultsParam, 10) : NaN;
    const children = childrenParam ? Number.parseInt(childrenParam, 10) : NaN;
    const infants = infantsParam ? Number.parseInt(infantsParam, 10) : NaN;
    const legacyTotalGuests = gst ? Number.parseInt(gst, 10) : NaN;

    let nextGuests: GuestCounts = {
      adults: Math.max(1, reduxSearch.guests.adults),
      children: Math.max(0, reduxSearch.guests.children),
      infants: Math.max(0, reduxSearch.guests.infants),
    };

    const hasBreakdown = Number.isFinite(adults) || Number.isFinite(children) || Number.isFinite(infants);
    if (hasBreakdown) {
      nextGuests = {
        adults: Number.isFinite(adults) ? Math.max(1, adults) : 1,
        children: Number.isFinite(children) ? Math.max(0, children) : 0,
        infants: Number.isFinite(infants) ? Math.max(0, infants) : 0,
      };
    } else if (Number.isFinite(legacyTotalGuests) && legacyTotalGuests > 0) {
      nextGuests = { adults: Math.max(1, legacyTotalGuests), children: 0, infants: 0 };
    }

    setLocation(loc);
    setDateRange({ start: nextStart, end: nextEnd });
    setGuests(nextGuests);

    dispatch(setSearch({
      location: loc,
      checkIn: nextStart ? nextStart.toISOString() : null,
      checkOut: nextEnd ? nextEnd.toISOString() : null,
      guests: nextGuests,
    }));
  }, [activePanel, dispatch, parseDateParam, reduxSearch.guests.adults, reduxSearch.guests.children, reduxSearch.guests.infants, searchParams]);

  // Canlı lokasyon arama
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    setLocationLoading(true);
    const results = await searchLocations(q);
    setLocationSuggestions(results);
    setLocationLoading(false);
  }, []);

  useEffect(() => {
    if (activePanel !== 'location') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(location);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [location, activePanel, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDateClick = (d: Date) => {
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: d, end: null });
      setActivePanel('checkout');
    } else {
      if (d < dateRange.start) {
        setDateRange({ start: d, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: d });
      }
      setActivePanel('guests');
    }
  };

  const formatDate = (d: Date | null) =>
    d ? d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : null;

  const totalGuests = guests.adults + guests.children;

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const nextCalMonth = calMonth === 11 ? 0 : calMonth + 1;
  const nextCalYear = calMonth === 11 ? calYear + 1 : calYear;

  const handleSearch = () => {
    if (!location || location.trim().length === 0) {
      toast.error('Konum seçmeden arama yapamazsınız.');
      setActivePanel('location');
      return;
    }
    if (!dateRange.start) {
      toast.error('Giriş tarihini seçin.');
      setActivePanel('checkin');
      return;
    }
    if (!dateRange.end) {
      toast.error('Çıkış tarihini seçin.');
      setActivePanel('checkout');
      return;
    }

    // Redux'a kaydet (search sayfasında tekrar okumak için)
    dispatch(setSearch({
      location,
      checkIn: dateRange.start ? dateRange.start.toISOString() : null,
      checkOut: dateRange.end ? dateRange.end.toISOString() : null,
      guests,
    }));

    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (dateRange.start) params.set('checkin', dateRange.start.toISOString());
    if (dateRange.end) params.set('checkout', dateRange.end.toISOString());
    params.set('adults', String(guests.adults));
    params.set('children', String(guests.children));
    params.set('infants', String(guests.infants));
    // Legacy fallback for old links/components that still read total guests.
    params.set('guests', String(totalGuests));
    router.push(`/search?${params.toString()}`);
    setActivePanel(null);
  };

  const months = t.months as string[];
  const days = t.days as string[];

  return (
    <div ref={wrapperRef} className="relative w-full max-w-4xl mx-auto">
      {/* ── Search bar card ── */}
      <div className="bg-white rounded-2xl shadow-2xl border border-white/60 flex items-stretch overflow-visible">

        {/* Location */}
        <button
          onClick={() => setActivePanel(activePanel === 'location' ? null : 'location')}
          className={`flex-[2] px-6 py-5 text-left border-r border-gray-100 transition-colors rounded-l-2xl ${
            activePanel === 'location' ? 'bg-gray-50' : 'hover:bg-gray-50/70'
          }`}
        >
          <div className="text-xs font-bold text-foreground mb-1 tracking-wide">{t.location as string}</div>
          <div className={`text-sm ${location ? 'text-foreground font-medium' : 'text-gray-400'}`}>
            {location || (t.locationPlaceholder as string)}
          </div>
        </button>

        {/* Check in */}
        <button
          onClick={() => setActivePanel(activePanel === 'checkin' ? null : 'checkin')}
          className={`flex-1 px-6 py-5 text-left border-r border-gray-100 transition-colors ${
            activePanel === 'checkin' || activePanel === 'checkout' ? 'bg-gray-50' : 'hover:bg-gray-50/70'
          }`}
        >
          <div className="text-xs font-bold text-foreground mb-1 tracking-wide">{t.checkin as string}</div>
          <div className={`text-sm ${dateRange.start ? 'text-foreground font-medium' : 'text-gray-400'}`}>
            {formatDate(dateRange.start) || (t.setDate as string)}
          </div>
        </button>

        {/* Check out */}
        <button
          onClick={() => setActivePanel(activePanel === 'checkout' ? null : 'checkout')}
          className={`flex-1 px-6 py-5 text-left border-r border-gray-100 transition-colors ${
            activePanel === 'checkout' ? 'bg-gray-50' : 'hover:bg-gray-50/70'
          }`}
        >
          <div className="text-xs font-bold text-foreground mb-1 tracking-wide">{t.checkout as string}</div>
          <div className={`text-sm ${dateRange.end ? 'text-foreground font-medium' : 'text-gray-400'}`}>
            {formatDate(dateRange.end) || (t.setDate as string)}
          </div>
        </button>

        {/* Guests */}
        <button
          onClick={() => setActivePanel(activePanel === 'guests' ? null : 'guests')}
          className={`flex-1 px-6 py-5 text-left transition-colors ${
            activePanel === 'guests' ? 'bg-gray-50' : 'hover:bg-gray-50/70'
          }`}
        >
          <div className="text-xs font-bold text-foreground mb-1 tracking-wide">{t.guests as string}</div>
          <div className={`text-sm ${totalGuests > 1 || guests.infants > 0 ? 'text-foreground font-medium' : 'text-gray-400'}`}>
            {totalGuests > 1 || guests.infants > 0
              ? `${totalGuests} ${t.guests as string}${guests.infants > 0 ? `, ${guests.infants} ${t.infants as string}` : ''}`
              : (t.addGuests as string)}
          </div>
        </button>

        {/* Search button */}
        <div className="flex items-center pr-3 pl-2">
          <button
            onClick={handleSearch}
            className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center hover:bg-foreground/85 transition-all active:scale-95 shadow-md"
            aria-label={t.search as string}
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ── Dropdown Panels ── */}
      <AnimatePresence>

        {/* Location panel */}
        {activePanel === 'location' && (
          <motion.div
            key="location-panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+10px)] left-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
          >
            {/* Input */}
            <div className="relative mb-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t.searchPlaceholder as string}
                className="w-full pl-9 pr-8 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-all placeholder:text-gray-400"
              />
              {locationLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 animate-spin" />
              )}
              {!locationLoading && location && (
                <button onClick={() => setLocation('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-foreground transition-colors" />
                </button>
              )}
            </div>

            {/* Başlık */}
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 mb-1.5">
              {location.trim() ? 'Eşleşen Lokasyonlar' : 'Popüler Destinasyonlar'}
            </p>

            {/* Sonuçlar - fixed height with scroll */}
            <div className="h-70 overflow-y-auto space-y-0.5">
              {locationLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
                    <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-1/3" />
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full w-8 shrink-0" />
                  </div>
                ))
              ) : locationSuggestions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  {location.trim() ? 'Sonuç bulunamadı' : 'Veri yok'}
                </p>
              ) : (
                locationSuggestions.slice(0, 5).map((sug) => (
                  <button
                    key={sug.label}
                    onClick={() => { setLocation(sug.label); setActivePanel('checkin'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-foreground">{sug.city}</span>
                      {sug.country && (
                        <span className="text-xs text-gray-400 ml-1">{sug.country}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {sug.count} ilan
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Calendar panel */}
        {(activePanel === 'checkin' || activePanel === 'checkout') && (
          <motion.div
            key="calendar-panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
          >
            <div className="flex gap-8">
              <MiniCalendar
                year={calYear} month={calMonth}
                onPrev={prevMonth} onNext={nextMonth}
                dateRange={dateRange}
                onDateClick={handleDateClick}
                hoverDate={hoverDate}
                onHover={setHoverDate}
                months={months}
                days={days}
              />
              <div className="w-px bg-gray-100" />
              <MiniCalendar
                year={nextCalYear} month={nextCalMonth}
                onPrev={prevMonth} onNext={nextMonth}
                dateRange={dateRange}
                onDateClick={handleDateClick}
                hoverDate={hoverDate}
                onHover={setHoverDate}
                months={months}
                days={days}
              />
            </div>
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={() => setDateRange({ start: null, end: null })}
                className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors underline underline-offset-2"
              >
                {t.clearDates as string}
              </button>
              <button
                onClick={() => setActivePanel('guests')}
                className="text-sm font-semibold bg-foreground text-white px-6 py-2.5 rounded-full hover:bg-foreground/85 transition-colors"
              >
                {t.nextGuests as string}
              </button>
            </div>
          </motion.div>
        )}

        {/* Guests panel */}
        {activePanel === 'guests' && (
          <motion.div
            key="guests-panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+10px)] right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50"
          >
            {[
              { key: 'adults', label: t.adults as string, desc: t.adultsDesc as string, min: 1 },
              { key: 'children', label: t.children as string, desc: t.childrenDesc as string, min: 0 },
              { key: 'infants', label: t.infants as string, desc: t.infantsDesc as string, min: 0 },
            ].map(({ key, label, desc, min }) => (
              <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-semibold text-foreground">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(g => ({ ...g, [key]: Math.max(min, (g as any)[key] - 1) }))}
                    disabled={(guests as any)[key] <= min}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-foreground transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-foreground">{(guests as any)[key]}</span>
                  <button
                    onClick={() => setGuests(g => ({ ...g, [key]: (g as any)[key] + 1 }))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-foreground transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-foreground" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleSearch}
              className="w-full mt-4 bg-foreground text-white text-sm font-semibold py-3 rounded-full hover:bg-foreground/85 transition-colors"
            >
              {t.search as string}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
