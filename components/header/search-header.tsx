'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Check } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { LOCALES, type Locale } from '@/lib/i18n/translations';

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

// ─── Main Header (Nav only) ──────────────────────────────────────────────────

export function SearchHeader() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);

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
          ? 'bg-card/95 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="h-16 flex items-center justify-between gap-4">
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
            </div>
          </div>
        </div>
      </header>

      {/* ── Search Form Wrapper ──
          header'ın TAMAMEN DIŞINDA, bağımsız fixed div.
          z-40 → navbarın (z-50) arkasında kalır ama sayfanın önünde.
          top-[72px] → navbar yüksekliği 64px + üst/alt py-2 ≈ 72px.
          Bu div'in className'ini istediğin gibi özelleştirebilirsin. */}
      <div className="fixed top-[80px] left-0 right-0 z-80 flex justify-center px-6">
        <AnimatePresence>
          {isScrolled && !heroSearchVisible && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="flex justify-center w-full max-w-7xl"
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2.5 bg-card/95 backdrop-blur-xl border-x border-b border-border border-t-0 rounded-b-full px-5 py-2.5 shadow-lg hover:shadow-xl transition-all text-sm font-medium text-foreground max-w-xl w-full justify-center"
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
