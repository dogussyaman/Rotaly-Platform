'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { LOCALES, type Locale } from '@/lib/i18n/translations';
import { FlagIcon } from '@/components/ui/flag-icon';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
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
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-2xl border border-border/60 hover:bg-white/20 transition-all text-sm font-medium text-foreground backdrop-blur-md hover:border-foreground/20 active:scale-95 shadow-sm"
        aria-label={t.navSelectLanguageAria as string}
      >
        <span className="transform group-hover:scale-110 transition-transform">
          <FlagIcon countryCode={locale} />
        </span>
        <span className="hidden min-[360px]:inline text-[10px] font-black uppercase tracking-widest opacity-60">
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
                    <FlagIcon countryCode={l.code} className="w-4 h-3" />
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
