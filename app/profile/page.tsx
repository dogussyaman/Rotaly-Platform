'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearUser, fetchUserProfile } from '@/lib/store/slices/user-slice';
import { useLocale } from '@/lib/i18n/locale-context';
import {
  fetchUserBookings,
  type BookingWithListing,
  cancelBooking,
  deleteBooking,
} from '@/lib/supabase/bookings';
import {
  fetchWishlists,
  fetchLoyaltySummary,
  fetchTourBookings,
  type WishlistSummary,
  type LoyaltySummary,
  type TourBookingSummary,
  updateUserProfile,
  requestPasswordReset,
  deleteAccount,
} from '@/lib/supabase/profile';

// Sub-components
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSidebar } from './components/ProfileSidebar';
import { BookingsSection } from './components/BookingsSection';
import { ToursSection } from './components/ToursSection';
import { WishlistSection } from './components/WishlistSection';
import { LoyaltySection } from './components/LoyaltySection';
import { AccountSection } from './components/AccountSection';
import { ProfileSkeleton } from './components/ProfileSkeletons';
import { ProfileDialogs } from './components/ProfileDialogs';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading: authLoading, initialized } = useAppSelector((s) => s.user);
  const { t } = useLocale();

  const [activeTab, setActiveTab] = useState<'bookings' | 'tours' | 'wishlists' | 'loyalty' | 'account'>('bookings');
  const [bookings, setBookings] = useState<BookingWithListing[]>([]);
  const [wishlists, setWishlists] = useState<WishlistSummary[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBookingSummary[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFullName, setProfileFullName] = useState<string>('');
  const [profilePhone, setProfilePhone] = useState<string>('');
  const [profileBio, setProfileBio] = useState<string>('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [accountDeleting, setAccountDeleting] = useState(false);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);

  // Booking actions
  const [bookingActionId, setBookingActionId] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [detailBooking, setDetailBooking] = useState<BookingWithListing | null>(null);
  const [cancelBookingTarget, setCancelBookingTarget] = useState<BookingWithListing | null>(null);
  const [deleteBookingTarget, setDeleteBookingTarget] = useState<BookingWithListing | null>(null);

  useEffect(() => {
    if (!initialized && !authLoading) {
      void dispatch(fetchUserProfile());
    }
  }, [dispatch, initialized, authLoading]);

  useEffect(() => {
    if (authLoading || !initialized) return;

    const loadData = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setProfileFullName(profile.fullName ?? '');
      setProfilePhone(''); // If phone is in schema, fetch it
      setProfileBio('');

      try {
        const [b, w, l, t] = await Promise.all([
          fetchUserBookings(profile.id),
          fetchWishlists(profile.id),
          fetchLoyaltySummary(profile.id),
          fetchTourBookings(profile.id),
        ]);
        setBookings(b || []);
        setWishlists(w || []);
        setLoyalty(l || null);
        setTourBookings(t || []);
      } catch (err) {
        console.error('Data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profile, authLoading, initialized]);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setSavingProfile(true);
    setProfileMessage(null);
    const ok = await updateUserProfile({
      fullName: profileFullName,
      // If schema supports phone/bio, add them here
    });
    setProfileMessage(ok ? (t.profileUpdateSuccess as string) : (t.profileUpdateError as string));
    setSavingProfile(false);
  };

  const handleChangePassword = async () => {
    if (!profile?.email) return;
    setPasswordSaving(true);
    const ok = await requestPasswordReset(profile.email);
    setPasswordMessage(ok ? (t.profilePasswordResetSent as string) : (t.profileGenericError as string));
    setPasswordSaving(false);
  };

  const handleDeleteAccount = async () => {
    setAccountDeleting(true);
    const ok = await deleteAccount();
    if (ok) {
      dispatch(clearUser());
      setAccountMessage(t.profileAccountDeleted as string);
    } else {
      setAccountMessage(t.profileGenericError as string);
    }
    setAccountDeleting(false);
  };

  const handleCancelBooking = async (booking: BookingWithListing) => {
    setBookingActionId(booking.id);
    const ok = await cancelBooking(booking.id);
    if (ok) {
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
      setBookingMessage(t.profileBookingCancelled as string);
    } else {
      setBookingMessage(t.profileCancelFailed as string);
    }
    setBookingActionId(null);
    setCancelBookingTarget(null);
  };

  const handleDeleteBooking = async (booking: BookingWithListing) => {
    setBookingActionId(booking.id);
    const ok = await deleteBooking(booking.id);
    if (ok) {
      setBookings(prev => prev.filter(b => b.id !== booking.id));
      setBookingMessage(t.profileBookingDeleted as string);
    } else {
      setBookingMessage(t.profileDeleteFailed as string);
    }
    setBookingActionId(null);
    setDeleteBookingTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />

      <main className="pt-24 pb-24 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {!initialized ? (
            <ProfileSkeleton />
          ) : !profile ? (
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-2">{t.profileLoginRequiredTitle as string}</h1>
              <Link href="/auth/login">
                <Button size="lg" className="rounded-2xl px-8">{t.login as string}</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10">
                <ProfileHeader profile={profile} lifetimePoints={loyalty?.lifetimePoints} />
              </div>

              {/* Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <ProfileSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  bookingCount={bookings.length}
                  pointsBalance={loyalty?.pointsBalance}
                />

                <div className="lg:col-span-9 space-y-12 min-h-[400px]">
                  {activeTab === 'bookings' && (
                    <BookingsSection
                      loading={loading}
                      bookings={bookings}
                      bookingMessage={bookingMessage}
                      bookingActionId={bookingActionId}
                      guestId={profile.id}
                      onViewDetail={setDetailBooking}
                      onCancelBooking={setCancelBookingTarget}
                      onDeleteBooking={setDeleteBookingTarget}
                    />
                  )}

                  {activeTab === 'tours' && <ToursSection loading={loading} tourBookings={tourBookings} />}

                  {activeTab === 'wishlists' && <WishlistSection loading={loading} wishlists={wishlists} />}

                  {activeTab === 'loyalty' && <LoyaltySection loyalty={loyalty} />}

                  {activeTab === 'account' && (
                    <AccountSection
                      fullName={profileFullName} setFullName={setProfileFullName}
                      phone={profilePhone} setPhone={setProfilePhone}
                      bio={profileBio} setBio={setProfileBio}
                      savingProfile={savingProfile} profileMessage={profileMessage} onUpdateProfile={handleUpdateProfile}
                      onChangePassword={handleChangePassword} passwordSaving={passwordSaving} passwordMessage={passwordMessage}
                      onDeleteAccount={handleDeleteAccount} accountDeleting={accountDeleting} accountMessage={accountMessage}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <ProfileDialogs
        detailBooking={detailBooking}
        setDetailBooking={setDetailBooking}
        cancelBookingTarget={cancelBookingTarget}
        setCancelBookingTarget={setCancelBookingTarget}
        deleteBookingTarget={deleteBookingTarget}
        setDeleteBookingTarget={setDeleteBookingTarget}
        onConfirmCancel={() => cancelBookingTarget && handleCancelBooking(cancelBookingTarget)}
        onConfirmDelete={() => deleteBookingTarget && handleDeleteBooking(deleteBookingTarget)}
        t={t}
      />
      <MainFooter />
    </div>
  );
}
