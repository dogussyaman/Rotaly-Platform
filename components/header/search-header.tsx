'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Star, ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { LOCALES, type Locale } from '@/lib/i18n/translations';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchUserProfile, clearUser } from '@/lib/store/slices/user-slice';
import { createClient } from '@/lib/supabase/client';

// ─── Language Switcher ──────────────────────────────────────────────────────

function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const el = document.getElementById('lang-switcher');
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" id="lang-switcher">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-border/60 hover:bg-white/20 transition-all text-sm font-medium text-foreground backdrop-blur-md hover:border-foreground/20 active:scale-95 shadow-sm"
        aria-label="Dil seçin"
      >
        <span className="text-lg leading-none transform group-hover:scale-110 transition-transform">
          {LOCALES.find(l => l.code === locale)?.flag}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
          {locale}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-[60]"
          >
            {LOCALES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-muted ${locale === l.code ? 'text-foreground font-semibold bg-muted/50' : 'text-muted-foreground'
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </span>
                {locale === l.code && <Check className="w-3.5 h-3.5 text-foreground" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── User Menu ───────────────────────────────────────────────────────────────

function UserMenu() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((s) => s.user);
  const [open, setOpen] = useState(false);
  const supabase = createClient();

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
        <div className="w-8 h-8 rounded-full overflow-hidden bg-foreground flex items-center justify-center flex-shrink-0">
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
          {profile.points.toLocaleString('tr-TR')}
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
                <span className="text-xs font-bold text-amber-600">{profile.points.toLocaleString('tr-TR')} puan</span>
                {profile.isHost && (
                  <span className="ml-auto text-[10px] bg-foreground text-white font-black px-1.5 py-0.5 rounded-full">HOST</span>
                )}
              </div>
            </div>

            {/* Menü öğeleri */}
            <div className="py-1.5">
              {profile.isHost && (
                <Link
                  href="/host/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
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
  const { profile } = useAppSelector((s) => s.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);

  // Kullanıcı oturumunu kontrol et
  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

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
              <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="white" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">StayHub</span>
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

            {/* Auth + Lang — right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              {profile ? (
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

      {/* ── Search Form Wrapper ──
          header'ın TAMAMEN DIŞINDA, bağımsız fixed div.
          z-40 → navbarın (z-50) arkasında kalır ama sayfanın önünde.
          top-[72px] → navbar yüksekliği 64px + üst/alt py-2 ≈ 72px.
          Bu div'in className'ini istediğin gibi özelleştirebilirsin. */}
      <div className="fixed top-[68px] left-0 right-0 z-80 flex justify-center px-6">
        <AnimatePresence>
          {isScrolled && !heroSearchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex justify-center w-full max-w-7xl "
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
