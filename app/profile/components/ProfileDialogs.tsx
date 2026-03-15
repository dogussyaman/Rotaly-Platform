'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { BookingWithListing } from '@/lib/supabase/bookings';

interface ProfileDialogsProps {
  detailBooking: BookingWithListing | null;
  setDetailBooking: (b: BookingWithListing | null) => void;
  cancelBookingTarget: BookingWithListing | null;
  setCancelBookingTarget: (b: BookingWithListing | null) => void;
  deleteBookingTarget: BookingWithListing | null;
  setDeleteBookingTarget: (b: BookingWithListing | null) => void;
  onConfirmCancel: () => void;
  onConfirmDelete: () => void;
  t: Record<string, unknown>;
}

export function ProfileDialogs({
  detailBooking,
  setDetailBooking,
  cancelBookingTarget,
  setCancelBookingTarget,
  deleteBookingTarget,
  setDeleteBookingTarget,
  onConfirmCancel,
  onConfirmDelete,
  t,
}: ProfileDialogsProps) {
  return (
    <>
      <Dialog open={!!detailBooking} onOpenChange={() => setDetailBooking(null)}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.profileBookingDetailTitle as string}</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-4">
            {detailBooking && (
              <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
                <p><strong>{t.profileFieldListing as string}:</strong> {detailBooking.listing?.title}</p>
                <p><strong>{t.profileFieldCheckIn as string}:</strong> {detailBooking.checkIn}</p>
                <p><strong>{t.profileFieldCheckOut as string}:</strong> {detailBooking.checkOut}</p>
                <p><strong>{t.profileFieldStatus as string}:</strong> {detailBooking.status}</p>
                <p><strong>{t.profileFieldGuests as string}:</strong> {detailBooking.guestsCount} {t.profilePeopleSuffix as string}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!cancelBookingTarget} onOpenChange={() => setCancelBookingTarget(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.profileCancelDialogTitle as string}</AlertDialogTitle>
            <AlertDialogDescription>{t.profileCancelDialogDesc as string}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">{t.profileBack as string}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmCancel} className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.profileCancel as string}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!deleteBookingTarget} onOpenChange={() => setDeleteBookingTarget(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.profileDeleteDialogTitle as string}</AlertDialogTitle>
            <AlertDialogDescription>{t.profileDeleteDialogDesc as string}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">{t.profileClose as string}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.profileConfirmDelete as string}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
