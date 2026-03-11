'use client';

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { type LoyaltySummary } from '@/lib/supabase/profile';

interface LoyaltySectionProps {
  loyalty: LoyaltySummary | null;
}

export function LoyaltySection({ loyalty }: LoyaltySectionProps) {
  if (!loyalty) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Puan Hareketleri</h2>
      </div>
      {loyalty.lastTransactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz puan kazanımı veya kullanımı kaydedilmemiş.</p>
      ) : (
        <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
          <div className="divide-y divide-border text-sm">
            {loyalty.lastTransactions.map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {tx.description ?? (tx.type === 'earn' ? 'Puan kazanımı' : tx.type === 'redeem' ? 'Puan kullanımı' : 'Puan ayarı')}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {format(new Date(tx.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                  </p>
                </div>
                <div className={`text-sm font-bold ${tx.type === 'redeem' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {tx.type === 'redeem' ? '-' : '+'}{tx.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
