'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ChevronLeft, ChevronRight, Users, Minus, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

function MiniCalendar({
  year, month, onPrev, onNext, dateRange, onDateClick, hoverDate, onHover,
}: {
  year: number; month: number;
  onPrev: () => void; onNext: () => void;
  dateRange: DateRange;
  onDateClick: (d: Date) => void;
  hoverDate: Date | null;
  onHover: (d: Date | null) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date(); today.setHours(0,0,0,0);

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
    <div className="w-72">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">{MONTHS[month]} {year}</span>
        <button onClick={onNext} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`empty-${i}`} />;
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
              className={`
                relative h-9 w-9 mx-auto flex items-center justify-center text-sm font-medium rounded-full transition-all
                ${past ? 'text-muted-foreground/30 cursor-not-allowed' : 'cursor-pointer hover:bg-muted'}
                ${(start || end) ? 'bg-foreground text-card z-10' : ''}
                ${inRange ? 'bg-muted rounded-none' : ''}
                ${start && dateRange.end ? 'rounded-l-full rounded-r-none' : ''}
                ${end ? 'rounded-r-full rounded-l-none' : ''}
                ${start && !dateRange.end ? 'rounded-full' : ''}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ActivePanel = 'location' | 'checkin' | 'checkout' | 'guests' | null;

export function SearchHeader() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (dateRange.start) params.set('checkin', dateRange.start.toISOString());
    if (dateRange.end) params.set('checkout', dateRange.end.toISOString());
    params.set('guests', String(totalGuests));
    router.push(`/search?${params.toString()}`);
    setActivePanel(null);
  };

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-card/95 backdrop-blur-lg shadow-sm border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="white" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">StayHub</span>
        </Link>

        {/* Nav Tabs — hidden when not scrolled on mobile */}
        <nav className="hidden md:flex items-center gap-1 bg-muted rounded-full p-1">
          {['Stays', 'Experiences', 'Hotels'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                tab === 'Stays'
                  ? 'bg-secondary text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors hidden sm:block">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-foreground text-card text-sm font-medium px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Expanded Search Bar — shown on hero, collapses on scroll */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pb-5 px-6"
          >
            <div className="max-w-3xl mx-auto" ref={containerRef}>
              <div className="bg-card rounded-2xl shadow-lg border border-border flex items-stretch overflow-visible relative">

                {/* Location */}
                <button
                  onClick={() => setActivePanel(activePanel === 'location' ? null : 'location')}
                  className={`flex-1 px-5 py-4 text-left border-r border-border transition-colors hover:bg-muted/40 ${
                    activePanel === 'location' ? 'bg-muted/60' : ''
                  } rounded-l-2xl`}
                >
                  <div className="text-xs font-semibold text-foreground mb-1">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {location || 'Enter your destination'}
                  </div>
                </button>

                {/* Check in */}
                <button
                  onClick={() => setActivePanel(activePanel === 'checkin' ? null : 'checkin')}
                  className={`flex-1 px-5 py-4 text-left border-r border-border transition-colors hover:bg-muted/40 ${
                    activePanel === 'checkin' || activePanel === 'checkout' ? 'bg-muted/60' : ''
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground mb-1">Check in</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(dateRange.start) || 'Set date'}
                  </div>
                </button>

                {/* Check out */}
                <button
                  onClick={() => setActivePanel(activePanel === 'checkout' ? null : 'checkout')}
                  className={`flex-1 px-5 py-4 text-left border-r border-border transition-colors hover:bg-muted/40 ${
                    activePanel === 'checkout' ? 'bg-muted/60' : ''
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground mb-1">Check out</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(dateRange.end) || 'Set date'}
                  </div>
                </button>

                {/* Guests */}
                <button
                  onClick={() => setActivePanel(activePanel === 'guests' ? null : 'guests')}
                  className={`flex-1 px-5 py-4 text-left transition-colors hover:bg-muted/40 ${
                    activePanel === 'guests' ? 'bg-muted/60' : ''
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground mb-1">Guests</div>
                  <div className="text-sm text-muted-foreground">
                    {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
                    {guests.infants > 0 ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}
                  </div>
                </button>

                {/* Search Button */}
                <div className="flex items-center px-3">
                  <button
                    onClick={handleSearch}
                    className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center hover:bg-foreground/90 transition-colors flex-shrink-0"
                  >
                    <Search className="w-5 h-5 text-card" />
                  </button>
                </div>

                {/* Panels */}
                <AnimatePresence>
                  {activePanel === 'location' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-card rounded-2xl shadow-xl border border-border p-4 z-50"
                    >
                      <div className="relative mb-3">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          autoFocus
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          placeholder="Search destinations..."
                          className="w-full pl-9 pr-3 py-2.5 bg-muted rounded-xl text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                        {location && (
                          <button onClick={() => setLocation('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-1">
                        {['Istanbul, Turkey', 'Bodrum, Turkey', 'Antalya, Turkey', 'Cappadocia, Turkey', 'Izmir, Turkey'].map(s => (
                          <button
                            key={s}
                            onClick={() => { setLocation(s); setActivePanel('checkin'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                          >
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm text-foreground">{s}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {(activePanel === 'checkin' || activePanel === 'checkout') && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card rounded-2xl shadow-xl border border-border p-5 z-50"
                    >
                      <div className="flex gap-8">
                        <MiniCalendar
                          year={calYear} month={calMonth}
                          onPrev={prevMonth} onNext={nextMonth}
                          dateRange={dateRange}
                          onDateClick={handleDateClick}
                          hoverDate={hoverDate}
                          onHover={setHoverDate}
                        />
                        <MiniCalendar
                          year={nextCalYear} month={nextCalMonth}
                          onPrev={prevMonth} onNext={nextMonth}
                          dateRange={dateRange}
                          onDateClick={handleDateClick}
                          hoverDate={hoverDate}
                          onHover={setHoverDate}
                        />
                      </div>
                      {(dateRange.start || dateRange.end) && (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                          <button
                            onClick={() => setDateRange({ start: null, end: null })}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Clear dates
                          </button>
                          <button
                            onClick={() => setActivePanel('guests')}
                            className="text-sm font-medium bg-foreground text-card px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors"
                          >
                            Next: Guests
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activePanel === 'guests' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-card rounded-2xl shadow-xl border border-border p-5 z-50"
                    >
                      {[
                        { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
                        { key: 'children', label: 'Children', desc: 'Ages 2–12' },
                        { key: 'infants', label: 'Infants', desc: 'Under 2' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                          <div>
                            <div className="text-sm font-medium text-foreground">{label}</div>
                            <div className="text-xs text-muted-foreground">{desc}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setGuests(g => ({ ...g, [key]: Math.max(key === 'adults' ? 1 : 0, (g as any)[key] - 1) }))}
                              disabled={(guests as any)[key] <= (key === 'adults' ? 1 : 0)}
                              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-medium text-foreground">{(guests as any)[key]}</span>
                            <button
                              onClick={() => setGuests(g => ({ ...g, [key]: (g as any)[key] + 1 }))}
                              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:border-foreground transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Search — shows on scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="pb-3 px-6"
          >
            <div className="max-w-lg mx-auto">
              <button
                onClick={() => { setIsScrolled(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow"
              >
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground flex-1 text-left">
                  {location || 'Anywhere'} · {formatDate(dateRange.start) ? `${formatDate(dateRange.start)} – ${formatDate(dateRange.end) || '?'}` : 'Any week'} · {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                </span>
                <div className="w-7 h-7 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                  <Search className="w-3 h-3 text-card" />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
