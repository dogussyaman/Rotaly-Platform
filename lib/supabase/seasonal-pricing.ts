import { createClient } from '@/lib/supabase/client';
import type { SeasonalRule } from '@/lib/supabase/pricing';

export type PricingRuleType = 'date_range' | 'month' | 'min_nights';

export interface SeasonalPricingRow {
  id: string;
  listingId: string;
  ruleType: PricingRuleType;
  startDate: string | null;
  endDate: string | null;
  monthOfYear: number | null;
  minNights: number | null;
  modifierType: 'percent' | 'fixed';
  modifierValue: number;
}

export interface SeasonalDiscountHit {
  id: string;
  listingId: string;
  ruleType: PricingRuleType;
  startDate: string | null;
  endDate: string | null;
  monthOfYear: number | null;
  minNights: number | null;
  modifierType: 'percent' | 'fixed';
  modifierValue: number;
}

export async function fetchSeasonalPricingForListing(
  listingId: string,
): Promise<SeasonalRule[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('listing_seasonal_pricing')
    .select('id, listing_id, rule_type, start_date, end_date, month_of_year, min_nights, modifier_type, modifier_value')
    .eq('listing_id', listingId)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('fetchSeasonalPricingForListing error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    ruleType: (row.rule_type as PricingRuleType) ?? 'date_range',
    startDate: row.start_date ?? null,
    endDate: row.end_date ?? null,
    monthOfYear: row.month_of_year ?? null,
    minNights: row.min_nights ?? null,
    modifierType: row.modifier_type,
    modifierValue: Number(row.modifier_value),
  }));
}

export async function upsertSeasonalPricing(
  listingId: string,
  rule: {
    id?: string;
    ruleType: PricingRuleType;
    startDate: string | null;
    endDate: string | null;
    monthOfYear: number | null;
    minNights: number | null;
    modifierType: 'percent' | 'fixed';
    modifierValue: number;
  },
): Promise<boolean> {
  const supabase = createClient();

  const row = {
    listing_id: listingId,
    rule_type: rule.ruleType,
    start_date: rule.startDate,
    end_date: rule.endDate,
    month_of_year: rule.monthOfYear,
    min_nights: rule.minNights,
    modifier_type: rule.modifierType,
    modifier_value: rule.modifierValue,
    updated_at: new Date().toISOString(),
  };

  if (rule.id) {
    const { error } = await supabase
      .from('listing_seasonal_pricing')
      .update(row)
      .eq('id', rule.id);
    if (error) {
      console.error('upsertSeasonalPricing update error:', error.message);
      return false;
    }
  } else {
    const { error } = await supabase.from('listing_seasonal_pricing').insert(row);
    if (error) {
      console.error('upsertSeasonalPricing insert error:', error.message);
      return false;
    }
  }
  return true;
}

export async function deleteSeasonalPricing(ruleId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('listing_seasonal_pricing')
    .delete()
    .eq('id', ruleId);
  if (error) {
    console.error('deleteSeasonalPricing error:', error.message);
    return false;
  }
  return true;
}

export async function fetchSeasonalPricingRowsForListing(
  listingId: string,
): Promise<SeasonalPricingRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('listing_seasonal_pricing')
    .select('id, listing_id, rule_type, start_date, end_date, month_of_year, min_nights, modifier_type, modifier_value')
    .eq('listing_id', listingId)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('fetchSeasonalPricingRowsForListing error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    listingId: row.listing_id,
    ruleType: (row.rule_type as PricingRuleType) ?? 'date_range',
    startDate: row.start_date ?? null,
    endDate: row.end_date ?? null,
    monthOfYear: row.month_of_year ?? null,
    minNights: row.min_nights ?? null,
    modifierType: row.modifier_type,
    modifierValue: Number(row.modifier_value),
  }));
}

export async function fetchSeasonalDiscountsForListings(params: {
  listingIds: string[];
  checkIn: string; // yyyy-MM-dd
  checkOut: string; // yyyy-MM-dd
}): Promise<SeasonalDiscountHit[]> {
  const supabase = createClient();

  if (!params.listingIds || params.listingIds.length === 0) return [];

  const { data, error } = await supabase
    .from('listing_seasonal_pricing')
    .select('id, listing_id, rule_type, start_date, end_date, month_of_year, min_nights, modifier_type, modifier_value')
    .in('listing_id', params.listingIds)
    .lt('modifier_value', 0)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('fetchSeasonalDiscountsForListings error:', error.message);
    return [];
  }

  const checkInDate = new Date(params.checkIn + 'T12:00:00Z');
  const checkOutDate = new Date(params.checkOut + 'T12:00:00Z');

  const hasMonthOverlap = (month: number) => {
    for (let d = new Date(checkInDate); d < checkOutDate; d.setUTCDate(d.getUTCDate() + 1)) {
      if (d.getUTCMonth() + 1 === month) return true;
    }
    return false;
  };

  return (data ?? [])
    .map((row: any) => ({
      id: row.id,
      listingId: row.listing_id,
      ruleType: (row.rule_type as PricingRuleType) ?? 'date_range',
      startDate: row.start_date ?? null,
      endDate: row.end_date ?? null,
      monthOfYear: row.month_of_year ?? null,
      minNights: row.min_nights ?? null,
      modifierType: row.modifier_type,
      modifierValue: Number(row.modifier_value),
    }))
    .filter((row: SeasonalDiscountHit) => {
      if (row.ruleType === 'month' && row.monthOfYear) {
        return hasMonthOverlap(row.monthOfYear);
      }
      if (row.ruleType === 'date_range' && row.startDate && row.endDate) {
        return row.startDate <= params.checkOut && row.endDate >= params.checkIn;
      }
      return false;
    });
}

export async function fetchUpcomingDiscountOffers(params?: {
  from?: string; // yyyy-MM-dd (default: today)
  to?: string; // yyyy-MM-dd (default: today + 90d)
  limit?: number; // default: 30
}): Promise<SeasonalDiscountHit[]> {
  const supabase = createClient();

  const today = new Date();
  const from = params?.from ?? today.toISOString().slice(0, 10);
  const defaultWindowEnd = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  const to = params?.to ?? defaultWindowEnd.toISOString().slice(0, 10);
  const limit = params?.limit ?? 30;

  const { data, error } = await supabase
    .from('listing_seasonal_pricing')
    .select('id, listing_id, rule_type, start_date, end_date, month_of_year, min_nights, modifier_type, modifier_value')
    .lt('modifier_value', 0)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('fetchUpcomingDiscountOffers error:', error.message);
    return [];
  }

  const windowStart = new Date(from + 'T12:00:00Z');
  const windowEnd = new Date(to + 'T12:00:00Z');
  const activeMonths = new Set<number>();
  for (let d = new Date(windowStart); d <= windowEnd; d.setUTCDate(d.getUTCDate() + 1)) {
    activeMonths.add(d.getUTCMonth() + 1);
  }

  return (data ?? [])
    .map((row: any) => ({
      id: row.id,
      listingId: row.listing_id,
      ruleType: (row.rule_type as PricingRuleType) ?? 'date_range',
      startDate: row.start_date ?? null,
      endDate: row.end_date ?? null,
      monthOfYear: row.month_of_year ?? null,
      minNights: row.min_nights ?? null,
      modifierType: row.modifier_type,
      modifierValue: Number(row.modifier_value),
    }))
    .flatMap((row: SeasonalDiscountHit) => {
      if (row.ruleType === 'month' && row.monthOfYear) {
        if (!activeMonths.has(row.monthOfYear)) return [];
        const year = windowStart.getUTCFullYear();
        const start = new Date(Date.UTC(year, row.monthOfYear - 1, 1));
        const end = new Date(Date.UTC(year, row.monthOfYear, 0));
        const startDate = start.toISOString().slice(0, 10);
        const endDate = end.toISOString().slice(0, 10);
        if (end < windowStart || start > windowEnd) return [];
        return [{ ...row, startDate, endDate }];
      }

      if (row.ruleType === 'date_range' && row.startDate && row.endDate) {
        if (row.startDate > to || row.endDate < from) return [];
        return [row];
      }

      return [];
    });
}
