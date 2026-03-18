'use client';

import { useState } from 'react';
import { Tag, Ticket, CheckCircle2, X, Loader2, Coins } from 'lucide-react';
import { CHECK_IN_SLOTS } from './check-in-slots';

interface ExtrasState {
  parking: boolean;
  babyBed: boolean;
  extraCleaning: boolean;
  withPet: boolean;
}

interface CheckoutTripSectionProps {
  checkInStr: string | null;
  checkOutStr: string | null;
  nights: number;
  guests: number;
  checkInSlotKey: string;
  setCheckInSlotKey: (v: string) => void;
  extrasState: ExtrasState;
  setExtrasState: React.Dispatch<React.SetStateAction<ExtrasState>>;
  extrasNote: string;
  setExtrasNote: (v: string) => void;
  // Kupon
  couponCode: string;
  setCouponCode: (v: string) => void;
  couponApplied: boolean;
  couponError: string | null;
  couponLoading: boolean;
  couponDiscount: number;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  // Sadakat puanları
  redeemablePoints: number;
  pointsToRedeem: number;
  setPointsToRedeem: (v: number) => void;
  loyaltyDiscount: number;
}

export function CheckoutTripSection({
  checkInStr,
  checkOutStr,
  nights,
  guests,
  checkInSlotKey,
  setCheckInSlotKey,
  extrasState,
  setExtrasState,
  extrasNote,
  setExtrasNote,
  couponCode,
  setCouponCode,
  couponApplied,
  couponError,
  couponLoading,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  redeemablePoints,
  pointsToRedeem,
  setPointsToRedeem,
  loyaltyDiscount,
}: CheckoutTripSectionProps) {
  const [showPoints, setShowPoints] = useState(false);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return `${d} ${months[Number(m) - 1]} ${y}`;
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4">Seyahatiniz</h2>

      {/* Tarihler ve Misafirler */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Giriş</div>
          <div className="text-base font-bold">{formatDate(checkInStr)}</div>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Çıkış</div>
          <div className="text-base font-bold">{formatDate(checkOutStr)}</div>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Toplam Süre</div>
          <div className="text-base font-bold">{nights} gece</div>
        </div>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Misafirler</div>
          <div className="text-base font-bold">{guests} misafir</div>
        </div>
      </div>

      {/* Giriş saati ve ek hizmetler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Giriş Saati Aralığı
          </div>
          <select
            value={checkInSlotKey}
            onChange={(e) => setCheckInSlotKey(e.target.value)}
            className="w-full h-11 px-3 rounded-2xl border border-border bg-background text-sm"
          >
            <option value="">Seçiniz</option>
            {CHECK_IN_SLOTS.map((slot) => (
              <option key={slot.key} value={slot.key}>
                {slot.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Yaklaşık ne zaman giriş yapacağınızı seçin. Ev sahibi hazırlığını buna göre yapar.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Ek Hizmetler / Tercihler
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={extrasState.parking}
                onChange={(e) =>
                  setExtrasState((prev) => ({ ...prev, parking: e.target.checked }))
                }
              />
              <span>Otopark istiyorum</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={extrasState.babyBed}
                onChange={(e) =>
                  setExtrasState((prev) => ({ ...prev, babyBed: e.target.checked }))
                }
              />
              <span>Bebek yatağı talep ediyorum</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={extrasState.extraCleaning}
                onChange={(e) =>
                  setExtrasState((prev) => ({
                    ...prev,
                    extraCleaning: e.target.checked,
                  }))
                }
              />
              <span>Ekstra temizlik hizmeti talep ediyorum</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-border"
                checked={extrasState.withPet}
                onChange={(e) =>
                  setExtrasState((prev) => ({ ...prev, withPet: e.target.checked }))
                }
              />
              <span>Evcil hayvan ile geleceğim</span>
            </label>
          </div>
        </div>
      </div>

      {/* Ev Sahibine Not */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Ev Sahibine Notunuz
        </div>
        <textarea
          value={extrasNote}
          onChange={(e) => setExtrasNote(e.target.value)}
          className="w-full min-h-[72px] rounded-2xl border border-border bg-background px-3 py-2 text-sm resize-none"
          placeholder="Örneğin, geç giriş yapacağım, özel beslenme tercihlerim var vb."
        />
      </div>

      {/* Kupon Kodu */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            İndirim Kuponu
          </span>
        </div>

        {couponApplied ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-sm font-bold text-emerald-800">{couponCode}</span>
                <span className="text-xs text-emerald-600 ml-2">
                  −₺{couponDiscount.toLocaleString('tr-TR')} indirim uygulandı
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onApplyCoupon())}
              placeholder="Kupon kodunuzu girin"
              className="flex-1 h-11 px-3 rounded-2xl border border-border bg-background text-sm uppercase placeholder:normal-case"
              disabled={couponLoading}
            />
            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="h-11 px-5 rounded-2xl bg-foreground text-background text-sm font-bold disabled:opacity-40 flex items-center gap-2"
            >
              {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
              Uygula
            </button>
          </div>
        )}

        {couponError && (
          <p className="text-xs text-red-500 font-medium">{couponError}</p>
        )}
      </div>

      {/* Sadakat Puanları */}
      {redeemablePoints > 0 && (
        <div className="space-y-3 border-t pt-3">
          <button
            type="button"
            onClick={() => {
              setShowPoints(!showPoints);
              if (showPoints) setPointsToRedeem(0);
            }}
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <Coins className="w-4 h-4 text-amber-500" />
            Sadakat Puanlarını Kullan
            <span className="ml-auto text-xs font-bold text-amber-600 normal-case">
              {redeemablePoints.toLocaleString('tr-TR')} puan mevcut
            </span>
          </button>

          {showPoints && (
            <div className="space-y-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex justify-between text-xs text-amber-700 font-medium">
                <span>Kullanılacak puan: <strong>{pointsToRedeem.toLocaleString('tr-TR')}</strong></span>
                <span>İndirim: <strong>₺{loyaltyDiscount.toLocaleString('tr-TR')}</strong></span>
              </div>
              <input
                type="range"
                min={0}
                max={redeemablePoints}
                step={10}
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-amber-600">
                <span>0</span>
                <span>{redeemablePoints.toLocaleString('tr-TR')} puan</span>
              </div>
              <p className="text-[11px] text-amber-600">
                Her 10 puan = ₺1 indirim
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
