'use client';

import { format } from 'date-fns';
import { type LoyaltySummary } from '@/lib/supabase/profile';
import { useLocale } from '@/lib/i18n/locale-context';
import { dateFnsLocale, formatNumber } from '@/lib/i18n/format';

interface LoyaltySectionProps {
  loyalty: LoyaltySummary | null;
}

export function LoyaltySection({ loyalty }: LoyaltySectionProps) {
  const { t, locale } = useLocale();
  const dateLocale = dateFnsLocale(locale);

  if (!loyalty) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t.profileLoyaltyTitle as string}</h2>
      </div>
      {loyalty.lastTransactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.profileLoyaltyEmpty as string}</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
          <div className="divide-y divide-border text-sm">
            {loyalty.lastTransactions.map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {tx.description ?? (tx.type === 'earn' ? (t.profileLoyaltyEarn as string) : tx.type === 'redeem' ? (t.profileLoyaltyRedeem as string) : (t.profileLoyaltyAdjust as string))}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {format(new Date(tx.createdAt), 'dd MMM yyyy HH:mm', { locale: dateLocale })}
                  </p>
                </div>
                <div className={`text-sm font-bold ${tx.type === 'redeem' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {tx.type === 'redeem' ? '-' : '+'}{formatNumber(tx.points, locale)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
