'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { formatNumber } from '@/lib/i18n/format';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchUserProfile, clearUser } from '@/lib/store/slices/user-slice';
import { createClient } from '@/lib/supabase/client';

// ─── User Menu ───────────────────────────────────────────────────────────────

function UserMenu() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.user);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const { t, locale } = useLocale();

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
    setOpen(false);
    window.location.href = '/';
  };

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />;
  }

  if (!profile) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-2xl hover:bg-white/20 transition-all border border-border/60 backdrop-blur-md shadow-sm"
      >
        {/* Avatar */}
        <div className="w-6 h-6 rounded-full overflow-hidden bg-foreground flex items-center justify-center flex-shrink-0">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.fullName ?? ''} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-black text-white leading-none">{initials}</span>
          )}
        </div>

        {/* İsim */}
        <span className="hidden sm:block text-sm font-semibold text-foreground max-w-[80px] truncate">
          {profile.fullName?.split(' ')[0] ?? profile.email.split('@')[0]}
        </span>

        {/* Puan */}
        <span className="hidden sm:flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">
          <Star className="w-2.5 h-2.5 fill-amber-500 stroke-none" />
          {formatNumber(profile.points, locale)}
        </span>

        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-[60]"
          >
            {/* Profil özeti */}
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-sm font-bold text-foreground truncate">{profile.fullName ?? profile.email}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                <span className="text-xs font-bold text-amber-600">
                  {formatNumber(profile.points, locale)} {t.navPointsLabel as string}
                </span>
                {profile.isHost && (
                  <span className="ml-auto text-[10px] bg-foreground text-white font-black px-1.5 py-0.5 rounded-full">HOST</span>
                )}
                {profile.isAdmin && (
                  <span className="ml-auto text-[10px] bg-rose-600 text-white font-black px-1.5 py-0.5 rounded-full">
                    ADMIN
                  </span>
                )}
              </div>
            </div>

            {/* Menü öğeleri */}
            <div className="py-1.5">
              {/* Misafir / roller için profil yönlendirmesi */}
              <Link
                href={profile.isAdmin || profile.isHost ? '/dashboard' : '/profile'}
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                {t.navProfileBookings as string}
              </Link>
              <Link
                href="/messages"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                {t.navMessages as string}
              </Link>

              {/* Ev sahibi için */}
              {profile.isHost && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {t.navHostPanel as string}
                </Link>
              )}

              {/* Tur operatörü için */}
              {profile.isTourOperator && (
                <Link
                  href="/tours"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {t.navMyTours as string}
                </Link>
              )}

              {/* Admin için */}
              {profile.isHost && profile.isAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {t.navAdminPanel as string}
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t.navSignOut as string}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Header (Nav only) ──────────────────────────────────────────────────

export function SearchHeader() {
  const { t } = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { profile, initialized } = useAppSelector((s) => s.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);

  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    if (!initialized && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile, initialized]);

  const tabs = [
    { label: t.stays as string, href: '/' },
    { label: t.tours as string, href: '/tours' },
    { label: t.guides as string, href: '/guide' },
  ];

  const activeTabIndex = tabs.findIndex(tab => {
    if (tab.href === '/') return pathname === '/';
    return pathname.startsWith(tab.href);
  });

  const activeTab = activeTabIndex !== -1 ? activeTabIndex : 0;

  // Show compact pill only when hero search bar has scrolled out of view
  useEffect(() => {
    const target = document.getElementById('hero-search-bar');
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroSearchVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Track scroll for navbar background only
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-[#f3f3f3] backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-1.5">
          <div className="h-14 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                <span className="text-white font-black text-base leading-none">R</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[19px] leading-tight tracking-tight text-foreground">
                  Rotaly
                </span>
                <span className="mt-0.5 h-[3px] w-12 rounded-full bg-orange-200" />
              </div>
            </Link>

            {/* Segment tabs — center */}
            <nav className="hidden md:flex items-center gap-0.5 bg-black/8 backdrop-blur-sm rounded-full p-1" aria-label="Ana navigasyon">
              {tabs.map((tab, i) => (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === i
                    ? 'bg-secondary text-foreground shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/30'
                    }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0 min-w-[120px] justify-end">
              <LanguageSwitcher />
              {!initialized ? (
                <div className="w-24 h-9 bg-black/5 animate-pulse rounded-full" />
              ) : profile ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="hidden sm:block text-sm font-medium text-foreground hover:text-foreground/70 transition-colors px-3 py-1.5"
                  >
                    {t.login as string}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-foreground text-card text-sm font-semibold px-4 py-2 rounded-full hover:bg-foreground/85 transition-colors shadow-sm"
                  >
                    {t.signup as string}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Search Form Wrapper ── */}
      <div className="fixed top-[68px] left-0 right-0 z-40 flex justify-center px-6 pointer-events-none">
        <AnimatePresence>
          {isScrolled && !heroSearchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex justify-center w-full max-w-7xl pointer-events-auto"
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2.5 bg-[#f3f3f3] backdrop-blur-xl border-x border-b border-border border-t-0 rounded-b-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all text-sm font-medium text-foreground max-w-xl w-full justify-center"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span>{t.locationPlaceholder as string}</span>
                <span className="h-4 w-px bg-border mx-0.5" />
                <span className="text-muted-foreground text-xs">
                  {t.checkin as string} – {t.checkout as string}
                </span>
                <span className="h-4 w-px bg-border mx-0.5" />
                <span className="text-muted-foreground text-xs">
                  {t.addGuests as string}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
