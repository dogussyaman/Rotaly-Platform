export interface BookingForEdit {
  id: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
  specialRequests: string | null;
  checkInSlotStart: string | null;
  checkInSlotEnd: string | null;
  extras: Record<string, any> | null;
  listing: {
    id: string;
    title: string;
    city: string | null;
    country: string | null;
  } | null;
}

export interface ExtrasState {
  parking: boolean;
  babyBed: boolean;
  extraCleaning: boolean;
  withPet: boolean;
}
