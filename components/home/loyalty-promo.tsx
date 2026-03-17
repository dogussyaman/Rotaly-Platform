'use client';

import { Sparkles, Wallet, Percent } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LoyaltyPromoSection() {
  const { t } = useLocale();

  return (
    <section className="bg-background px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0f172a] rounded-3xl px-6 py-8 sm:px-10 sm:py-10 flex flex-col gap-8 lg:flex-row lg:items-center text-white">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Rotaly Puan • Sadakat Programı</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Daha fazla konakla, her rezervasyonda{' '}
              <span className="text-amber-300">puan kazan</span>.
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl">
              Onaylanan her rezervasyonda ödül puanı birikir. Puanlarınızı gelecekteki konaklamalarda
              indirim olarak kullanabilir, kampanyalı fiyatlarla birleştirerek ekstra tasarruf sağlayabilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-secondary text-foreground font-semibold hover:bg-secondary/90"
              >
                <Link href="/dashboard/loyalty">Puan bakiyemi görüntüle</Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full border-white/25 text-foreground  hover:bg-white/10 hover:text-white"
              >
                <Link href="/profile">Puan hareketlerimi gör</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 space-y-1.5">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <p className="font-semibold">Nasıl kazanılır?</p>
              <p className="text-xs text-white/70">
                Her tamamlanan rezervasyon için ödenen tutara göre otomatik puan kazanılır. Puanlar
                hesabınıza check-out sonrasında yansır.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 space-y-1.5">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
                <Percent className="h-3.5 w-3.5" />
              </div>
              <p className="font-semibold">Nasıl kullanılır?</p>
              <p className="text-xs text-white/70">
                Rezervasyon adımında &quot;puan kullan&quot; seçeneği ile bakiyenizden düşerek toplam
                ücreti azaltabilirsiniz. Minimum kullanım limiti ve kampanya koşulları geçerlidir.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 space-y-1.5">
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <p className="font-semibold">Seviyeler & avantajlar</p>
              <p className="text-xs text-white/70">
                Gelecekte; daha yüksek puan seviyelerinde ekstra indirimler, erken erişim kampanyaları
                ve özel müşteri desteği gibi avantajlar planlanmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

