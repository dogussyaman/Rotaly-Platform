'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  fetchSeasonalPricingRowsForListing,
  upsertSeasonalPricing,
  deleteSeasonalPricing,
  type SeasonalPricingRow,
} from '@/lib/supabase/seasonal-pricing';

interface ListingSeasonalPricingProps {
  listingId: string;
}

export function ListingSeasonalPricing({ listingId }: ListingSeasonalPricingProps) {
  const [rows, setRows] = useState<SeasonalPricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newRule, setNewRule] = useState({
    effect: 'discount' as 'discount' | 'surcharge',
    startDate: '',
    endDate: '',
    modifierType: 'percent' as 'percent' | 'fixed',
    modifierValue: '',
  });

  useEffect(() => {
    fetchSeasonalPricingRowsForListing(listingId).then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, [listingId]);

  async function handleAdd() {
    const start = newRule.startDate.trim();
    const end = newRule.endDate.trim();
    const raw = parseFloat(newRule.modifierValue);
    if (!start || !end || !Number.isFinite(raw)) return;
    const absVal = Math.abs(raw);
    const signedVal = newRule.effect === 'discount' ? -absVal : absVal;
    setSaving(true);
    const ok = await upsertSeasonalPricing(listingId, {
      startDate: start,
      endDate: end,
      modifierType: newRule.modifierType,
      modifierValue: signedVal,
    });
    setSaving(false);
    if (ok) {
      setNewRule({
        effect: 'discount',
        startDate: '',
        endDate: '',
        modifierType: 'percent',
        modifierValue: '',
      });
      const data = await fetchSeasonalPricingRowsForListing(listingId);
      setRows(data);
    }
  }

  async function handleDelete(ruleId: string) {
    setSaving(true);
    const ok = await deleteSeasonalPricing(ruleId);
    setSaving(false);
    if (ok) setRows((prev) => prev.filter((r) => r.id !== ruleId));
  }

  if (loading) {
    return (
      <ContentCard title="Sezonluk fiyatlandırma" description="Tarih aralığına göre yüzde veya sabit fiyat değişimi">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Sezonluk fiyatlandırma"
      description="Tarih aralığına göre yüzdelik indirim/zam veya gece başı sabit TL değişimi ekleyin. Örn: yaz %20 zam, kış %10 indirim."
    >
      <div className="space-y-6">
        <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-6">
          <Input
            type="date"
            value={newRule.startDate}
            onChange={(e) => setNewRule((r) => ({ ...r, startDate: e.target.value }))}
            placeholder="Başlangıç"
          />
          <Input
            type="date"
            value={newRule.endDate}
            onChange={(e) => setNewRule((r) => ({ ...r, endDate: e.target.value }))}
            placeholder="Bitiş"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground w-14">Tür</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={newRule.effect}
              onChange={(e) =>
                setNewRule((r) => ({ ...r, effect: e.target.value as 'discount' | 'surcharge' }))
              }
            >
              <option value="discount">İndirim</option>
              <option value="surcharge">Zam</option>
            </select>
          </div>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            value={newRule.modifierType}
            onChange={(e) =>
              setNewRule((r) => ({ ...r, modifierType: e.target.value as 'percent' | 'fixed' }))
            }
          >
            <option value="percent">Yüzde (%)</option>
            <option value="fixed">Sabit TL (gece)</option>
          </select>
          <Input
            type="number"
            step={newRule.modifierType === 'percent' ? 1 : 0.01}
            value={newRule.modifierValue}
            onChange={(e) => setNewRule((r) => ({ ...r, modifierValue: e.target.value }))}
            placeholder={newRule.modifierType === 'percent' ? 'Örn: 20' : 'Örn: 50'}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={saving || !newRule.startDate || !newRule.endDate || !newRule.modifierValue}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Ekle
          </Button>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Henüz sezonluk kural yok. Yukarıdan tarih aralığı, tür (indirim/zam) ve yüzde/sabit değer girerek ekleyin.
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm"
              >
                <span className="font-medium">
                  {r.startDate} – {r.endDate}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      r.modifierValue < 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {r.modifierValue < 0 ? 'İndirim' : 'Zam'}
                  </span>
                  <span className="text-muted-foreground">
                    {r.modifierType === 'percent'
                      ? `%${r.modifierValue}`
                      : `₺${r.modifierValue} / gece`}
                  </span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDelete(r.id)}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ContentCard>
  );
}
