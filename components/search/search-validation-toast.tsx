'use client';

import { toast } from 'sonner';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchValidationToastPayload {
  title: string;
  hint?: string;
}

/**
 * Ana sayfa / hero arama — geniş, alçak bar; cam efekti; Sonner sarmalayıcısı unstyled (çift kart yok).
 */
export function showSearchValidationToast({ title, hint }: SearchValidationToastPayload) {
  toast.custom(
    (id) => (
      <div
        role="alert"
        className={cn(
          'pointer-events-auto relative flex w-[min(100vw-2rem,36rem)] flex-wrap items-center gap-2 overflow-hidden rounded-2xl sm:gap-3',
          'border border-black/[0.07] bg-white/80 py-2.5 pl-3 pr-10 text-foreground shadow-sm',
          'backdrop-blur-xl backdrop-saturate-150',
          'dark:border-white/10 dark:bg-[#1a1a1a]/82 dark:text-white dark:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.35)]'
        )}
      >
        <button
          type="button"
          aria-label="Kapat"
          className={cn(
            'absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors',
            'hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10'
          )}
          onClick={() => toast.dismiss(id)}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>

        {/* Navbar ile aynı R rozeti (search-header Logo) */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 shadow-lg shadow-orange-500/30"
          aria-hidden
        >
          <span className="text-base font-black leading-none text-white">R</span>
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-sm font-bold leading-tight tracking-tight text-foreground dark:text-white">
              {title}
            </span>
            <span className="text-muted-foreground/60 dark:text-white/35" aria-hidden>
              |
            </span>
            <time
              className="text-[11px] font-medium text-muted-foreground dark:text-white/45"
              dateTime={new Date().toISOString()}
            >
              Şimdi
            </time>
          </div>
          {hint ? (
            <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground dark:text-white/60">
              {hint}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3 border-l border-black/6 pl-3 dark:border-white/10">
          <button
            type="button"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground dark:text-white/50 dark:hover:text-white/85"
            onClick={() => toast.dismiss(id)}
          >
            Kapat
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-[#FF7000] transition-opacity hover:opacity-90 dark:text-[#FF8533]"
            onClick={() => toast.dismiss(id)}
          >
            Tamam
          </button>
        </div>
      </div>
    ),
    {
      duration: 6500,
      closeButton: false,
      unstyled: true,
      className: '!p-0 !m-0 !gap-0 !bg-transparent !border-0 !shadow-none',
    }
  );
}
