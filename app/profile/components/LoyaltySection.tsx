'use client';

import { format } from 'date-fns';
import { Sparkles, TrendingUp } from 'lucide-react';
import { type LoyaltySummary } from '@/lib/supabase/profile';
import { useLocale } from '@/lib/i18n/locale-context';
import { dateFnsLocale, formatNumber } from '@/lib/i18n/format';

interface LoyaltySectionProps {
  loyalty: LoyaltySummary | null;
}

export function LoyaltySection({ loyalty }: LoyaltySectionProps) {
  const { t, locale } = useLocale();
  const dateLocale = dateFnsLocale(locale);

  if (!loyalty) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-bold">{t.profileLoyaltyTitle as string ?? 'Sadakat Puanı'}</h2>
        <div className="rounded-2xl border border-border bg-card/40 p-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-amber-400 mb-3" />
          <p className="text-sm font-medium">Henüz bir puan hesabınız yok.</p>
          <p className="text-xs text-muted-foreground mt-1">
            İlk rezervasyonunuz tamamlandığında otomatik olarak puan kazanmaya başlayacaksınız.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{t.profileLoyaltyTitle as string ?? 'Sadakat Puanı'}</h2>

      {/* Balance cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card/40 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Mevcut bakiye</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(loyalty.pointsBalance, locale)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/40 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span>Toplam kazanılan</span>
          </div>
          <p className="text-2xl font-bold">{formatNumber(loyalty.lifetimePoints, locale)}</p>
        </div>
      </div>

      {/* Transactions */}
      {loyalty.lastTransactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.profileLoyaltyEmpty as string ?? 'Henüz puan hareketi yok.'}</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
          <div className="divide-y divide-border text-sm">
            {loyalty.lastTransactions.map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {tx.description ?? (tx.type === 'earn' ? (t.profileLoyaltyEarn as string ?? 'Puan kazanımı') : tx.type === 'redeem' ? (t.profileLoyaltyRedeem as string ?? 'Puan kullanımı') : (t.profileLoyaltyAdjust as string ?? 'Düzeltme'))}
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
