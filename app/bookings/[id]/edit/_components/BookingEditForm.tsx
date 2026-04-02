'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { de, enUS, fr, tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Loader2, Users } from 'lucide-react';
import { CHECK_IN_SLOTS } from './check-in-slots';
import type { BookingForEdit, ExtrasState } from './types';
import { useLocale } from '@/lib/i18n/locale-context';
import type { Locale } from '@/lib/i18n/translations';

const DATE_FNS_LOCALES: Record<Locale, typeof enUS> = {
  tr,
  en: enUS,
  de,
  fr,
};

interface BookingEditFormProps {
  booking: BookingForEdit;
  checkInInput: string;
  setCheckInInput: (v: string) => void;
  checkOutInput: string;
  setCheckOutInput: (v: string) => void;
  guestsInput: number;
  setGuestsInput: (v: number) => void;
  notesInput: string;
  setNotesInput: (v: string) => void;
  slotKey: string;
  setSlotKey: (v: string) => void;
  extrasState: ExtrasState;
  setExtrasState: React.Dispatch<React.SetStateAction<ExtrasState>>;
  extrasNote: string;
  setExtrasNote: (v: string) => void;
  canEdit: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function BookingEditForm({
  booking,
  checkInInput,
  setCheckInInput,
  checkOutInput,
  setCheckOutInput,
  guestsInput,
  setGuestsInput,
  notesInput,
  setNotesInput,
  slotKey,
  setSlotKey,
  extrasState,
  setExtrasState,
  extrasNote,
  setExtrasNote,
  canEdit,
  saving,
  error,
  success,
  onSubmit,
  onCancel,
}: BookingEditFormProps) {
  const { t, locale } = useLocale();
  const dfLocale = DATE_FNS_LOCALES[locale];
  const numLocale = NUMBER_LOCALES[locale];

  const nights =
    checkInInput && checkOutInput
      ? Math.max(
          1,
          Math.ceil(
            Math.abs(new Date(checkOutInput).getTime() - new Date(checkInInput).getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-8 shadow-sm"
    >
      {booking.listing && (
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.bookingFormStayLabel as string}</p>
            <Link
              href={`/listing/${booking.listing.id}`}
              className="text-sm md:text-base font-semibold hover:underline"
            >
              {booking.listing.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {[booking.listing.city, booking.listing.country].filter(Boolean).join(', ')}
            </p>
          </div>
          <Badge variant="outline" className="rounded-full text-[10px] uppercase">
            {booking.status}
          </Badge>
        </div>
      )}

      {!canEdit && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/80 px-4 py-3 text-xs text-amber-900">
          {t.bookingFormCannotEdit as string}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {t.bookingFormCheckIn as string}
          </label>
          <input
            type="date"
            value={checkInInput}
            onChange={(e) => setCheckInInput(e.target.value)}
            className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {t.bookingFormCheckOut as string}
          </label>
          <input
            type="date"
            value={checkOutInput}
            onChange={(e) => setCheckOutInput(e.target.value)}
            className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
            disabled={!canEdit}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {t.bookingFormGuests as string}
          </label>
          <input
            type="number"
            min={1}
            value={guestsInput}
            onChange={(e) => setGuestsInput(Number(e.target.value))}
            className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
            disabled={!canEdit}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {checkInInput && checkOutInput ? (
            <span>
              {format(new Date(checkInInput), 'dd MMM', { locale: dfLocale })} -{' '}
              {format(new Date(checkOutInput), 'dd MMM yyyy', { locale: dfLocale })} ({nights}{' '}
              {t.bookingFormNights as string})
            </span>
          ) : (
            <span>{t.bookingFormDateRangePlaceholder as string}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">{t.bookingFormNotes as string}</label>
        <textarea
          value={notesInput}
          onChange={(e) => setNotesInput(e.target.value)}
          className="w-full min-h-[72px] rounded-2xl border border-input bg-background px-3 py-2 text-sm resize-none"
          disabled={!canEdit}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">{t.bookingFormSlotLabel as string}</label>
          <select
            value={slotKey}
            onChange={(e) => setSlotKey(e.target.value)}
            className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
            disabled={!canEdit}
          >
            <option value="">{t.bookingFormSelectPlaceholder as string}</option>
            {CHECK_IN_SLOTS.map((slot) => (
              <option key={slot.key} value={slot.key}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>{t.bookingFormSlotHint as string}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">{t.bookingFormExtrasSection as string}</label>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-input"
                checked={extrasState.parking}
                onChange={(e) => setExtrasState((prev) => ({ ...prev, parking: e.target.checked }))}
                disabled={!canEdit}
              />
              <span>{t.bookingFormExtraParking as string}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-input"
                checked={extrasState.babyBed}
                onChange={(e) => setExtrasState((prev) => ({ ...prev, babyBed: e.target.checked }))}
                disabled={!canEdit}
              />
              <span>{t.bookingFormExtraBabyBed as string}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-input"
                checked={extrasState.extraCleaning}
                onChange={(e) =>
                  setExtrasState((prev) => ({
                    ...prev,
                    extraCleaning: e.target.checked,
                  }))
                }
                disabled={!canEdit}
              />
              <span>{t.bookingFormExtraCleaning as string}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-input"
                checked={extrasState.withPet}
                onChange={(e) => setExtrasState((prev) => ({ ...prev, withPet: e.target.checked }))}
                disabled={!canEdit}
              />
              <span>{t.bookingFormExtraPet as string}</span>
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">{t.bookingFormHostNoteLabel as string}</label>
          <textarea
            value={extrasNote}
            onChange={(e) => setExtrasNote(e.target.value)}
            className="w-full min-h-[80px] rounded-2xl border border-input bg-background px-3 py-2 text-sm resize-none"
            placeholder={t.bookingFormNotesPlaceholder as string}
            disabled={!canEdit}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-emerald-600">{success}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button type="submit" className="rounded-2xl px-6" disabled={!canEdit || saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.bookingFormSaving as string}
            </>
          ) : (
            (t.bookingFormSubmit as string)
          )}
        </Button>
        <Button type="button" variant="outline" className="rounded-2xl px-6" onClick={onCancel}>
          {t.bookingFormCancel as string}
        </Button>
      </div>
    </form>
  );
}
