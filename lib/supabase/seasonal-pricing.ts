import { createClient } from '@/lib/supabase/client';
import type { SeasonalRule } from '@/lib/supabase/pricing';

export interface SeasonalPricingRow {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  modifierType: 'percent' | 'fixed';
  modifierValue: number;
}

export interface SeasonalDiscountHit {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  modifierType: 'percent' | 'fixed';
  modifierValue: number;
}

export async function fetchSeasonalPricingForListing(
  listingId: string,
): Promise<SeasonalRule[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('listing_seasonal_pricing')
    .select('id, listing_id, start_date, end_date, modifier_type, modifier_value')
    .eq('listing_id', listingId)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('fetchSeasonalPricingForListing error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    startDate: row.start_date,
    endDate: row.end_date,
    modifierType: row.modifier_type,
    modifierValue: Number(row.modifier_value),
  }));
}

export async function upsertSeasonalPricing(
  listingId: string,
  rule: {
    id?: string;
    startDate: string;
    endDate: string;
    modifierType: 'percent' | 'fixed';
    modifierValue: number;
  },
): Promise<boolean> {
  const supabase = createClient();

  const row = {
    listing_id: listingId,
    start_date: rule.startDate,
    end_date: rule.endDate,
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
    .select('id, listing_id, start_date, end_date, modifier_type, modifier_value')
    .eq('listing_id', listingId)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('fetchSeasonalPricingRowsForListing error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    listingId: row.listing_id,
    startDate: row.start_date,
    endDate: row.end_date,
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
    .select('id, listing_id, start_date, end_date, modifier_type, modifier_value')
    .in('listing_id', params.listingIds)
    .lt('modifier_value', 0)
    .lte('start_date', params.checkOut)
    .gte('end_date', params.checkIn)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('fetchSeasonalDiscountsForListings error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    listingId: row.listing_id,
    startDate: row.start_date,
    endDate: row.end_date,
    modifierType: row.modifier_type,
    modifierValue: Number(row.modifier_value),
  }));
}

export async function fetchUpcomingDiscountOffers(params?: {
  from?: string; // yyyy-MM-dd (default: today)
  to?: string; // yyyy-MM-dd (default: today + 90d)
  limit?: number; // default: 30
}): Promise<SeasonalDiscountHit[]> {
  const supabase = createClient();

  const today = new Date();
  const from = params?.from ?? today.toISOString().slice(0, 10);
  const windowEnd = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  const to = params?.to ?? windowEnd.toISOString().slice(0, 10);
  const limit = params?.limit ?? 30;

  const { data, error } = await supabase
    .from('listing_seasonal_pricing')
    .select('id, listing_id, start_date, end_date, modifier_type, modifier_value')
    .lt('modifier_value', 0)
    .lte('start_date', to)
    .gte('end_date', from)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('fetchUpcomingDiscountOffers error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    listingId: row.listing_id,
    startDate: row.start_date,
    endDate: row.end_date,
    modifierType: row.modifier_type,
    modifierValue: Number(row.modifier_value),
  }));
}
