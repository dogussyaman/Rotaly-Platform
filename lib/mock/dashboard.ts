export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type AdminStat = {
  title: string;
  value: string;
  change: string;
  helper: string;
};

export type ProfileRow = {
  name: string;
  email: string;
  isHost: boolean;
  isVerified: boolean;
  createdAt: string;
};

export type UserRoleRow = {
  user: string;
  role: string;
  createdAt: string;
};

export type PartnerProfileRow = {
  partnerType: 'hotel' | 'agency' | 'property_manager';
  company: string;
  taxNumber: string;
  website: string;
};

export type HostRow = {
  name: string;
  responseRate: number;
  responseTime: string;
  superhost: boolean;
  totalReviews: number;
  languages: string[];
};

export type ListingRow = {
  title: string;
  propertyType: string;
  city: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  rating: number;
  isActive: boolean;
};

export type ListingImageRow = {
  listing: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type AmenityRow = {
  name: string;
  category: string;
};

export type ListingAmenitiesRow = {
  listing: string;
  amenities: string[];
};

export type HouseRuleRow = {
  listing: string;
  smoking: boolean;
  pets: boolean;
  parties: boolean;
};

export type AvailabilityRow = {
  listing: string;
  date: string;
  available: boolean;
  customPrice: number | null;
};

export type BookingRow = {
  id: string;
  listing: string;
  guest: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: BookingStatus;
  totalPrice: number;
  coupon: string | null;
  pointsRedeemed: number;
  discountTotal: number;
  finalPrice: number;
  checkInSlotStart: string;
  checkInSlotEnd: string;
  extras: string[];
};

export type ReviewRow = {
  listing: string;
  reviewer: string;
  rating: number;
  cleanliness: number;
  communication: number;
  location: number;
  value: number;
  createdAt: string;
};

export type WishlistRow = {
  name: string;
  user: string;
  items: number;
};

export type WishlistItemRow = {
  wishlist: string;
  listing: string;
};

export type ConversationRow = {
  id: string;
  participants: string;
  listing: string;
  lastMessageAt: string;
  unread: number;
};

export type MessageRow = {
  conversation: string;
  sender: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type LoyaltyAccountRow = {
  user: string;
  pointsBalance: number;
  lifetimePoints: number;
};

export type LoyaltyTransactionRow = {
  user: string;
  type: 'earn' | 'redeem' | 'adjust';
  points: number;
  description: string;
  createdAt: string;
};

export type CouponRow = {
  code: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minTotal: number;
  maxDiscount: number | null;
  startsAt: string;
  expiresAt: string;
  usageLimit: number;
  isActive: boolean;
};

export type CouponUsageRow = {
  code: string;
  user: string;
  booking: string;
  discountApplied: number;
};

export type TourOperatorRow = {
  company: string;
  phone: string;
  website: string;
};

export type TourRow = {
  title: string;
  city: string;
  durationMinutes: number;
  maxParticipants: number;
  basePrice: number;
  rating: number;
  isActive: boolean;
};

export type TourScheduleRow = {
  tour: string;
  startTime: string;
  availableSpots: number;
  priceOverride: number | null;
};

export type TourBookingRow = {
  tour: string;
  guest: string;
  participants: number;
  status: BookingStatus;
  totalPrice: number;
  finalPrice: number;
};

export type TourReviewRow = {
  tour: string;
  reviewer: string;
  rating: number;
  comment: string;
};

/** Format ve tarih yardımcıları artık @/lib/format dosyasından kullanılıyor. Burada sadece tipler export ediliyor. */
export { formatCurrency, formatDate } from '@/lib/format';
