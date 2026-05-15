'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { LOCALES, type Locale } from '@/lib/i18n/translations';
import { FlagIcon } from '@/components/ui/flag-icon';

interface LanguageSwitcherProps {
  /** Footer gibi alta yakın yerlerde 'up', navbar/header için 'down' (varsayılan) */
  direction?: 'up' | 'down';
}

interface DropdownPos {
  top: number;
  bottom: number;
  right: number;
  width: number;
}

export function LanguageSwitcher({ direction = 'down' }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Ensure we're in the browser before using portals
  useEffect(() => { setMounted(true); }, []);

  const calcPos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom,          // viewport-relative, no scrollY (fixed positioning)
      bottom: window.innerHeight - r.top,
      right: window.innerWidth - r.right,
      width: Math.max(r.width, 192),
    });
  }, []);

  const handleOpen = () => {
    calcPos();
    setOpen((o) => !o);
  };

  // Recalculate on scroll/resize
  useEffect(() => {
    if (!open) return;
    const update = () => calcPos();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [open, calcPos]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        // Also check if click is inside the portal dropdown
        const portal = document.getElementById('lang-switcher-portal');
        if (portal && portal.contains(e.target as Node)) return;
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isUp = direction === 'up';

  const dropdownStyle: React.CSSProperties = pos
    ? isUp
      ? {
          position: 'fixed',
          bottom: pos.bottom,
          right: pos.right,
          width: 192,
          zIndex: 99999,
        }
      : {
          position: 'fixed',
          top: pos.top + 8,
          right: pos.right,
          width: 192,
          zIndex: 99999,
        }
    : { display: 'none' };

  const motionProps = isUp
    ? { initial: { opacity: 0, y: 8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8, scale: 0.97 } }
    : { initial: { opacity: 0, y: -6, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -6, scale: 0.97 } };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-2xl border border-border/60 hover:bg-white/20 transition-all text-sm font-medium text-foreground backdrop-blur-md hover:border-foreground/20 active:scale-95 shadow-sm"
        aria-label={t.navSelectLanguageAria as string}
        aria-expanded={open}
      >
        <FlagIcon countryCode={locale} />
        <span className="hidden min-[360px]:inline text-[10px] font-black uppercase tracking-widest opacity-60">
          {locale}
        </span>
      </button>

      {/* Portal: renders outside any stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div
              id="lang-switcher-portal"
              {...motionProps}
              transition={{ duration: 0.15 }}
              style={dropdownStyle}
              className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-muted ${
                    locale === l.code ? 'text-foreground font-semibold bg-muted/50' : 'text-muted-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FlagIcon countryCode={l.code} className="w-4 h-3" />
                    <span>{l.label}</span>
                  </span>
                  {locale === l.code && <Check className="w-3.5 h-3.5 text-foreground" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
