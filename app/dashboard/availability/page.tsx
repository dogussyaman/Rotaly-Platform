'use client';

import { useCallback, useEffect, useState } from 'react';
import { Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchHostByUserId, fetchHostListings } from '@/lib/supabase/host';
import {
  fetchAvailabilityByListing,
  fetchBookedDatesForListing,
  setAvailabilityRange,
  upsertAvailability,
  type AvailabilityDay,
} from '@/lib/supabase/availability';
import { getMonthRange, toLocalDateString } from './_components/utils';
import { AvailabilityCalendar } from './_components/AvailabilityCalendar';

export default function AvailabilityPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [listings, setListings] = useState<{ id: string; title: string }[]>([]);
  const [listingId, setListingId] = useState<string>('');
  const [month, setMonth] = useState(() => new Date());
  const [days, setDays] = useState<AvailabilityDay[]>([]);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionDay, setActionDay] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    if (!profile?.id) return;
    const host = await fetchHostByUserId(profile.id);
    if (!host) return;
    const list = await fetchHostListings(host.hostId);
    setListings(list.map((l) => ({ id: l.id, title: l.title })));
    if (list.length > 0 && !listingId) setListingId(list[0].id);
  }, [profile?.id, listingId]);

  const loadAvailability = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    const { start, end } = getMonthRange(month);
    const [data, booked] = await Promise.all([
      fetchAvailabilityByListing(listingId, start, end),
      fetchBookedDatesForListing(listingId, start, end),
    ]);
    setDays(data);
    setBookedDates(booked);
    setLoading(false);
  }, [listingId, month]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  const todayStr = toLocalDateString(new Date());

  const handleDayClick = async (date: Date) => {
    if (!listingId || updating) return;
    const dateStr = toLocalDateString(date);
    if (dateStr < todayStr) return;
    if (bookedDates.has(dateStr)) return;
    const dayMap = new Map(days.map((d) => [d.date, d]));
    const current = dayMap.get(dateStr);
    const nextAvailable = current ? !current.isAvailable : false;
    setActionDay(dateStr);
    setUpdating(true);
    const ok = await upsertAvailability(listingId, dateStr, { isAvailable: nextAvailable });
    setUpdating(false);
    setActionDay(null);
    if (ok) void loadAvailability();
  };

  const handleMonthOpen = async (open: boolean) => {
    if (!listingId || updating) return;
    const { start, end } = getMonthRange(month);
    const effectiveStart = start < todayStr ? todayStr : start;
    if (effectiveStart > end) {
      setUpdating(false);
      return;
    }
    setActionDay('month');
    setUpdating(true);
    const ok = await setAvailabilityRange(listingId, effectiveStart, end, open);
    setUpdating(false);
    setActionDay(null);
    if (ok) void loadAvailability();
  };

  if (!profile?.id) return null;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <AvailabilityCalendar
          listings={listings}
          listingId={listingId}
          setListingId={setListingId}
          month={month}
          setMonth={setMonth}
          days={days}
          bookedDates={bookedDates}
          loading={loading}
          updating={updating}
          actionDay={actionDay}
          onDayClick={handleDayClick}
          onMonthOpen={handleMonthOpen}
        />
      </Section>
    </div>
  );
}
