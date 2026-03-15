'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { BookingForEdit, ExtrasState } from './types';

export function useBookingEditData(
  bookingId: string,
  profileId: string | null
): {
  booking: BookingForEdit | null;
  loading: boolean;
  error: string | null;
  setError: (s: string | null) => void;
  initialForm: {
    checkInInput: string;
    checkOutInput: string;
    guestsInput: number;
    notesInput: string;
    slotKey: string;
    extrasState: ExtrasState;
    extrasNote: string;
  } | null;
} {
  const [booking, setBooking] = useState<BookingForEdit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialForm, setInitialForm] = useState<{
    checkInInput: string;
    checkOutInput: string;
    guestsInput: number;
    notesInput: string;
    slotKey: string;
    extrasState: ExtrasState;
    extrasNote: string;
  } | null>(null);

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(
          `
          id,
          check_in,
          check_out,
          guests_count,
          status,
          special_requests,
          check_in_slot_start,
          check_in_slot_end,
          extras,
          listings (
            id,
            title,
            city,
            country
          )
        `
        )
        .eq('id', bookingId)
        .eq('guest_id', profileId)
        .maybeSingle();

      if (fetchError) {
        console.error('fetch booking for edit error:', fetchError.message);
        setError('Rezervasyon yüklenirken bir hata oluştu.');
        setLoading(false);
        return;
      }

      if (!data) {
        setError('Rezervasyon bulunamadı.');
        setLoading(false);
        return;
      }

      const mapped: BookingForEdit = {
        id: data.id,
        checkIn: data.check_in,
        checkOut: data.check_out,
        guestsCount: data.guests_count,
        status: data.status,
        specialRequests: data.special_requests ?? null,
        checkInSlotStart: data.check_in_slot_start ?? null,
        checkInSlotEnd: data.check_in_slot_end ?? null,
        extras: (data.extras as Record<string, any> | null) ?? null,
        listing: data.listings
          ? {
              id: data.listings.id,
              title: data.listings.title,
              city: data.listings.city ?? null,
              country: data.listings.country ?? null,
            }
          : null,
      };

      setBooking(mapped);

      let slotKey = '';
      if (mapped.checkInSlotStart && mapped.checkInSlotEnd) {
        const startHour = mapped.checkInSlotStart.slice(0, 2);
        const endHour = mapped.checkInSlotEnd.slice(0, 2);
        slotKey = `${startHour}-${endHour}`;
      }

      const extrasOptions = mapped.extras?.options ?? {};
      setInitialForm({
        checkInInput: mapped.checkIn,
        checkOutInput: mapped.checkOut,
        guestsInput: mapped.guestsCount,
        notesInput: mapped.specialRequests ?? '',
        slotKey,
        extrasState: {
          parking: !!extrasOptions.parking,
          babyBed: !!extrasOptions.babyBed,
          extraCleaning: !!extrasOptions.extraCleaning,
          withPet: !!extrasOptions.withPet,
        },
        extrasNote: mapped.extras?.note ?? '',
      });
      setLoading(false);
    };

    load();
  }, [bookingId, profileId]);

  return { booking, loading, error, setError, initialForm };
}
