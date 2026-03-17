/**
 * Dinamik fiyatlandırma algoritması:
 * 1. Her gece için: takvimde custom_price varsa onu kullan, yoksa sezonluk kurala göre base fiyatı uygula.
 * 2. Subtotal = gece fiyatları toplamı.
 * 3. base_guests üzeri her misafir için: extra_guest_fee * gece_sayısı (toplam ek kişi ücreti).
 * 4. cleaning_fee + service_fee (subtotal üzerinden % veya sabit).
 */

export interface SeasonalRule {
  ruleType?: 'date_range' | 'month' | 'min_nights';
  startDate?: string | null;
  endDate?: string | null;
  monthOfYear?: number | null;
  minNights?: number | null;
  modifierType: 'percent' | 'fixed';
  modifierValue: number;
}

export interface AvailabilityDay {
  date: string;
  customPrice: number | null;
}

export interface ListingPricingParams {
  pricePerNight: number;
  cleaningFee: number;
  /** Sabit TL; 0 ise serviceFeePercent kullanılır */
  serviceFeeFixed: number;
  serviceFeePercent: number;
  maxGuests: number;
  baseGuests: number;
  extraGuestFee: number;
}

export interface NightlyPrice {
  date: string;
  price: number;
}

/**
 * Tek bir tarih için gece fiyatını hesaplar.
 * Öncelik: customPrice (takvim) > seasonal (ilk eşleşen kural) > base.
 */
export function getPriceForNight(
  date: string,
  basePrice: number,
  customPrice: number | null,
  seasonalRules: SeasonalRule[],
): number {
  if (customPrice != null && customPrice > 0) {
    return Math.round(customPrice * 100) / 100;
  }

  let bestSeasonalPrice: number | null = null;
  for (const rule of seasonalRules) {
    const ruleType = rule.ruleType ?? 'date_range';
    if (ruleType === 'min_nights') continue;
    if (ruleType === 'month') {
      if (!rule.monthOfYear) continue;
      const month = Number(date.slice(5, 7));
      if (month !== rule.monthOfYear) continue;
    } else {
      if (!rule.startDate || !rule.endDate) continue;
      if (date < rule.startDate || date > rule.endDate) continue;
    }

    const rawPrice =
      rule.modifierType === 'percent'
        ? basePrice * (1 + rule.modifierValue / 100)
        : basePrice + rule.modifierValue;
    const normalizedPrice = Math.round(Math.max(0, rawPrice) * 100) / 100;
    if (bestSeasonalPrice == null || normalizedPrice < bestSeasonalPrice) {
      bestSeasonalPrice = normalizedPrice;
    }
  }

  if (bestSeasonalPrice != null) {
    return bestSeasonalPrice;
  }

  return Math.round(basePrice * 100) / 100;
}

function applyModifier(price: number, rule: SeasonalRule): number {
  const raw =
    rule.modifierType === 'percent'
      ? price * (1 + rule.modifierValue / 100)
      : price + rule.modifierValue;
  return Math.round(Math.max(0, raw) * 100) / 100;
}

/**
 * Tarih aralığındaki her gece için fiyat listesi (check_in <= date < check_out).
 */
export function getNightlyPrices(
  checkIn: string,
  checkOut: string,
  basePrice: number,
  availabilityByDate: Map<string, number | null>,
  seasonalRules: SeasonalRule[],
): NightlyPrice[] {
  const result: NightlyPrice[] = [];
  const start = new Date(checkIn + 'T12:00:00Z');
  const end = new Date(checkOut + 'T12:00:00Z');
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const custom = availabilityByDate.get(dateStr) ?? null;
    const price = getPriceForNight(dateStr, basePrice, custom, seasonalRules);
    result.push({ date: dateStr, price });
  }
  return result;
}

export interface PriceBreakdown {
  subtotal: number;
  extraGuestFee: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  nightlyPrices: NightlyPrice[];
  /** Ortalama gece fiyatı (gösterim için) */
  avgPricePerNight: number;
}

const DEFAULT_SERVICE_FEE_PERCENT = 12;

/**
 * Rezervasyon için toplam fiyat kırılımını hesaplar.
 */
export function computeBookingPrice(
  params: ListingPricingParams,
  checkIn: string,
  checkOut: string,
  guestsCount: number,
  availabilityByDate: Map<string, number | null>,
  seasonalRules: SeasonalRule[],
): PriceBreakdown {
  let nightlyPrices = getNightlyPrices(
    checkIn,
    checkOut,
    params.pricePerNight,
    availabilityByDate,
    seasonalRules,
  );
  const nights = nightlyPrices.length;
  let subtotal = nightlyPrices.reduce((sum, n) => sum + n.price, 0);

  const stayRules = seasonalRules.filter((rule) => {
    const type = rule.ruleType ?? 'date_range';
    if (type !== 'min_nights') return false;
    if (!rule.minNights) return false;
    return nights >= rule.minNights;
  });

  if (stayRules.length > 0 && nights > 0) {
    let bestSubtotal = subtotal;
    let bestPrices = nightlyPrices;

    for (const rule of stayRules) {
      const adjusted = nightlyPrices.map((n) => ({
        ...n,
        price: applyModifier(n.price, rule),
      }));
      const candidateSubtotal = adjusted.reduce((sum, n) => sum + n.price, 0);
      if (candidateSubtotal < bestSubtotal) {
        bestSubtotal = candidateSubtotal;
        bestPrices = adjusted;
      }
    }

    nightlyPrices = bestPrices;
    subtotal = bestSubtotal;
  }

  const extraGuests = Math.max(0, guestsCount - params.baseGuests);
  const extraGuestFee =
    params.extraGuestFee > 0 && extraGuests > 0
      ? Math.round(params.extraGuestFee * extraGuests * nights * 100) / 100
      : 0;

  const cleaningFee = Math.round((params.cleaningFee ?? 0) * 100) / 100;
  const serviceFee =
    (params.serviceFeeFixed ?? 0) > 0
      ? Math.round(params.serviceFeeFixed! * 100) / 100
      : Math.round(
          subtotal *
            (params.serviceFeePercent ?? DEFAULT_SERVICE_FEE_PERCENT) *
            0.01 *
            100,
        ) / 100;
  const total = Math.round((subtotal + extraGuestFee + cleaningFee + serviceFee) * 100) / 100;

  const avgPricePerNight = nights > 0 ? Math.round((subtotal / nights) * 100) / 100 : 0;

  return {
    subtotal,
    extraGuestFee,
    cleaningFee,
    serviceFee,
    total,
    nightlyPrices,
    avgPricePerNight,
  };
}
