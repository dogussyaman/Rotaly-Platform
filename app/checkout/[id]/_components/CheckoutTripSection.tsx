'use client';

import { CHECK_IN_SLOTS } from './check-in-slots';

interface ExtrasState {
  parking: boolean;
  babyBed: boolean;
  extraCleaning: boolean;
  withPet: boolean;
}

interface CheckoutTripSectionProps {
  nights: number;
  guests: number;
  checkInSlotKey: string;
  setCheckInSlotKey: (v: string) => void;
  extrasState: ExtrasState;
  setExtrasState: React.Dispatch<React.SetStateAction<ExtrasState>>;
  extrasNote: string;
  setExtrasNote: (v: string) => void;
}

export function CheckoutTripSection({
  nights,
  guests,
  checkInSlotKey,
  setCheckInSlotKey,
  extrasState,
  setExtrasState,
  extrasNote,
  setExtrasNote,
}: CheckoutTripSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-4">Seyahatiniz</h2>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
            Tarihler
          </div>
          <div className="text-lg font-bold">{nights} gece</div>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">
            Misafirler
          </div>
          <div className="text-lg font-bold">{guests} misafir</div>
        </div>
      </div>

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
    </section>
  );
}
