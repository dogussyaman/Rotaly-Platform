'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import {
  deleteSeasonalPricing,
  fetchSeasonalPricingRowsForListing,
  upsertSeasonalPricing,
  type PricingRuleType,
  type SeasonalPricingRow,
} from '@/lib/supabase/seasonal-pricing';
import { cn } from '@/lib/utils';

interface ListingSeasonalPricingProps {
  listingId: string;
}

const MONTHS = [
  { value: '1', label: 'Ocak' },
  { value: '2', label: 'Şubat' },
  { value: '3', label: 'Mart' },
  { value: '4', label: 'Nisan' },
  { value: '5', label: 'Mayıs' },
  { value: '6', label: 'Haziran' },
  { value: '7', label: 'Temmuz' },
  { value: '8', label: 'Ağustos' },
  { value: '9', label: 'Eylül' },
  { value: '10', label: 'Ekim' },
  { value: '11', label: 'Kasım' },
  { value: '12', label: 'Aralık' },
];

type RuleFormState = {
  ruleType: PricingRuleType;
  effect: 'discount' | 'surcharge';
  startDate: string;
  endDate: string;
  monthOfYear: string;
  minNights: string;
  modifierType: 'percent' | 'fixed';
  modifierValue: string;
};

const DEFAULT_RULE: RuleFormState = {
  ruleType: 'date_range',
  effect: 'discount',
  startDate: '',
  endDate: '',
  monthOfYear: '',
  minNights: '',
  modifierType: 'percent',
  modifierValue: '',
};

function toDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map((part) => Number(part));
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function DateField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  const date = toDate(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-lg text-sm"
        >
          <span className={cn(!date && 'text-muted-foreground')}>
            {date ? format(date, 'dd MMM yyyy', { locale: tr }) : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(next) => onChange(next ? format(next, 'yyyy-MM-dd') : '')}
          locale={tr}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function ListingSeasonalPricing({ listingId }: ListingSeasonalPricingProps) {
  const [rows, setRows] = useState<SeasonalPricingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newRule, setNewRule] = useState<RuleFormState>(DEFAULT_RULE);

  useEffect(() => {
    fetchSeasonalPricingRowsForListing(listingId).then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, [listingId]);

  const canSubmit = useMemo(() => {
    if (saving) return false;
    const raw = parseFloat(newRule.modifierValue);
    if (!Number.isFinite(raw)) return false;
    if (newRule.ruleType === 'date_range') {
      return !!newRule.startDate && !!newRule.endDate;
    }
    if (newRule.ruleType === 'month') {
      return !!newRule.monthOfYear;
    }
    if (newRule.ruleType === 'min_nights') {
      return !!newRule.minNights && Number(newRule.minNights) >= 1;
    }
    return false;
  }, [newRule, saving]);

  async function handleAdd() {
    const raw = parseFloat(newRule.modifierValue);
    if (!Number.isFinite(raw)) return;

    const absVal = Math.abs(raw);
    const signedVal = newRule.effect === 'discount' ? -absVal : absVal;

    const payload = {
      ruleType: newRule.ruleType,
      startDate: newRule.ruleType === 'date_range' ? newRule.startDate.trim() : null,
      endDate: newRule.ruleType === 'date_range' ? newRule.endDate.trim() : null,
      monthOfYear:
        newRule.ruleType === 'month' ? Number(newRule.monthOfYear) : null,
      minNights:
        newRule.ruleType === 'min_nights' ? Number(newRule.minNights) : null,
      modifierType: newRule.modifierType,
      modifierValue: signedVal,
    };

    setSaving(true);
    const ok = await upsertSeasonalPricing(listingId, payload);
    setSaving(false);
    if (ok) {
      setNewRule(DEFAULT_RULE);
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
      <ContentCard title="Sezonluk fiyatlandırma" description="Tarih, ay veya minimum gece bazlı kurallar">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Sezonluk fiyatlandırma"
      description="Tarih aralığı, ay bazlı veya minimum gece kuralı ile indirim/zam ekleyin."
    >
      <div className="space-y-6">
        <div className="grid gap-3 rounded-lg border border-border/70 bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Kural Tipi</label>
            <Select
              value={newRule.ruleType}
              onValueChange={(value) =>
                setNewRule((r) => ({
                  ...r,
                  ruleType: value as PricingRuleType,
                  startDate: '',
                  endDate: '',
                  monthOfYear: '',
                  minNights: '',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Kural seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_range">Tarih aralığı</SelectItem>
                <SelectItem value="month">Ay bazlı</SelectItem>
                <SelectItem value="min_nights">Minimum gece</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newRule.ruleType === 'date_range' ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Başlangıç</label>
                <DateField
                  value={newRule.startDate}
                  onChange={(next) => setNewRule((r) => ({ ...r, startDate: next }))}
                  placeholder="Başlangıç tarihi"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Bitiş</label>
                <DateField
                  value={newRule.endDate}
                  onChange={(next) => setNewRule((r) => ({ ...r, endDate: next }))}
                  placeholder="Bitiş tarihi"
                />
              </div>
            </>
          ) : null}

          {newRule.ruleType === 'month' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Ay</label>
              <Select
                value={newRule.monthOfYear}
                onValueChange={(value) => setNewRule((r) => ({ ...r, monthOfYear: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ay seçin" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {newRule.ruleType === 'min_nights' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Minimum Gece</label>
              <Input
                type="number"
                min={1}
                value={newRule.minNights}
                onChange={(e) => setNewRule((r) => ({ ...r, minNights: e.target.value }))}
                placeholder="Örn: 5"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Etki</label>
            <Select
              value={newRule.effect}
              onValueChange={(value) =>
                setNewRule((r) => ({ ...r, effect: value as 'discount' | 'surcharge' }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">İndirim</SelectItem>
                <SelectItem value="surcharge">Zam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Tip</label>
            <Select
              value={newRule.modifierType}
              onValueChange={(value) =>
                setNewRule((r) => ({ ...r, modifierType: value as 'percent' | 'fixed' }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Yüzde (%)</SelectItem>
                <SelectItem value="fixed">Sabit TL (gece)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Değer</label>
            <Input
              type="number"
              step={newRule.modifierType === 'percent' ? 1 : 0.01}
              value={newRule.modifierValue}
              onChange={(e) => setNewRule((r) => ({ ...r, modifierValue: e.target.value }))}
              placeholder={newRule.modifierType === 'percent' ? 'Örn: 20' : 'Örn: 50'}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              size="sm"
              className="w-full gap-1"
              onClick={handleAdd}
              disabled={!canSubmit}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Ekle
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Henüz kural yok. Tarih aralığı, ay veya minimum gece seçip indirim/zam değerini ekleyin.
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => {
              const ruleLabel =
                r.ruleType === 'month'
                  ? MONTHS.find((m) => Number(m.value) === r.monthOfYear)?.label ?? 'Ay'
                  : r.ruleType === 'min_nights'
                    ? `${r.minNights} gece ve üzeri`
                    : `${r.startDate ?? ''} – ${r.endDate ?? ''}`;

              const valueLabel =
                r.modifierType === 'percent'
                  ? `%${Math.abs(r.modifierValue)}`
                  : `₺${Math.abs(r.modifierValue)} / gece`;

              return (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 px-4 py-3 text-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{ruleLabel}</span>
                    <Badge variant="secondary">
                      {r.ruleType === 'date_range'
                        ? 'Tarih'
                        : r.ruleType === 'month'
                          ? 'Ay'
                          : 'Minimum Gece'}
                    </Badge>
                    <Badge
                      className={
                        r.modifierValue < 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }
                    >
                      {r.modifierValue < 0 ? 'İndirim' : 'Zam'}
                    </Badge>
                    <span className="text-muted-foreground">{valueLabel}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(r.id)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ContentCard>
  );
}
