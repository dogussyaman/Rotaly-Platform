import { createClient } from '@/lib/supabase/client';

export interface ValidCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingTotal: number | null;
}

export type CouponValidationResult =
  | { valid: true; coupon: ValidCoupon; discountAmount: number }
  | { valid: false; error: string };

/**
 * Kupon kodunu doğrular.
 * Aktiflik, süre, min tutar, tekrar kullanım ve host eşleşmesi kontrolü yapar.
 *
 * @param listingId - Rezerve edilecek ilanın ID'si. Kupona host_id bağlıysa
 *   bu ilanın aynı hosta ait olduğu doğrulanır; böylece başka host'un
 *   kuponunun haksız kullanımı engellenir.
 */
export async function validateCoupon(
  code: string,
  userId: string,
  bookingTotal: number,
  listingId?: string,
): Promise<CouponValidationResult> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('coupons')
    .select('id, code, discount_type, discount_value, min_booking_total, expires_at, is_active, host_id')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle();

  if (error) {
    console.error('validateCoupon error:', error.message);
    return { valid: false, error: 'Kupon sorgulanırken bir hata oluştu.' };
  }

  if (!data) {
    return { valid: false, error: 'Kupon kodu bulunamadı.' };
  }

  if (!data.is_active) {
    return { valid: false, error: 'Bu kupon artık geçerli değil.' };
  }

  if (data.expires_at && data.expires_at < today) {
    return { valid: false, error: 'Bu kuponun süresi dolmuş.' };
  }

  if (data.min_booking_total != null && bookingTotal < data.min_booking_total) {
    return {
      valid: false,
      error: `Bu kupon için minimum rezervasyon tutarı ₺${Number(data.min_booking_total).toLocaleString('tr-TR')} olmalıdır.`,
    };
  }

  // Kupona host bağlıysa, rezerve edilen ilan aynı hosta ait olmalı
  if (data.host_id && listingId) {
    const { data: listingHost } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', listingId)
      .maybeSingle();

    if (!listingHost || listingHost.host_id !== data.host_id) {
      return { valid: false, error: 'Bu kupon kodu bu ilan için geçerli değil.' };
    }
  }

  // Kullanıcı bu kuponu daha önce kullandı mı?
  const { data: usageData } = await supabase
    .from('coupon_usages')
    .select('id')
    .eq('coupon_id', data.id)
    .eq('user_id', userId)
    .limit(1);

  if (usageData && usageData.length > 0) {
    return { valid: false, error: 'Bu kuponu daha önce kullandınız.' };
  }

  const discountAmount =
    data.discount_type === 'percentage'
      ? Math.round(bookingTotal * (data.discount_value / 100) * 100) / 100
      : Math.min(Number(data.discount_value), bookingTotal);

  return {
    valid: true,
    coupon: {
      id: data.id,
      code: data.code,
      discountType: data.discount_type as 'percentage' | 'fixed',
      discountValue: data.discount_value,
      minBookingTotal: data.min_booking_total,
    },
    discountAmount,
  };
}

/**
 * Kupon kullanımını coupon_usages tablosuna kaydeder.
 * createBooking başarılı olduktan sonra çağrılmalıdır.
 */
export async function recordCouponUsage(
  couponId: string,
  userId: string,
  bookingId: string,
  discountApplied: number,
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('coupon_usages').insert({
    coupon_id: couponId,
    user_id: userId,
    booking_id: bookingId,
    discount_applied: discountApplied,
  });

  if (error) {
    console.error('recordCouponUsage error:', error.message);
    return false;
  }

  return true;
}
