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

export const formatCurrency = (value: number) =>
  value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const ADMIN_STATS: AdminStat[] = [
  { title: 'Toplam Kullanıcı', value: '12.840', change: '+4.2%', helper: 'Son 30 gün', },
  { title: 'Aktif İlan', value: '1.284', change: '+3.1%', helper: 'Yayında', },
  { title: 'Açık Rezervasyon', value: '356', change: '+18', helper: 'Giriş bekleyen', },
  { title: 'Ortalama Puan', value: '4.82', change: '+0.04', helper: 'Son 90 gün', },
];

export const HOST_STATS: AdminStat[] = [
  { title: 'Bu Ay Gelir', value: '₺186.400', change: '+%12', helper: 'Geçen aya göre' },
  { title: 'Yaklaşan Giriş', value: '11', change: '+3', helper: 'Bu hafta' },
  { title: 'Ortalama Puan', value: '4.9', change: '+0.1', helper: '124 değerlendirme' },
  { title: 'Yeni Mesaj', value: '7', change: '+2', helper: 'Bugün' },
];

export const GUEST_STATS: AdminStat[] = [
  { title: 'Yaklaşan Seyahat', value: '2', change: '1 onay bekliyor', helper: '30 gün' },
  { title: 'Favoriler', value: '8', change: '+2', helper: 'Yeni eklenen' },
  { title: 'Sadakat Puanı', value: '4.250', change: '+320', helper: 'Son seyahat' },
  { title: 'Kuponlar', value: '3', change: '1 son 7 gün', helper: 'Aktif' },
];

export const PROFILES: ProfileRow[] = [
  {
    name: 'Aylin Demir',
    email: 'aylin@rotaly.com',
    isHost: true,
    isVerified: true,
    createdAt: '2026-02-21',
  },
  {
    name: 'Kerem Kaya',
    email: 'kerem@rotaly.com',
    isHost: false,
    isVerified: true,
    createdAt: '2026-03-02',
  },
  {
    name: 'Derya Yılmaz',
    email: 'derya@rotaly.com',
    isHost: true,
    isVerified: false,
    createdAt: '2026-03-09',
  },
];

export const USER_ROLES: UserRoleRow[] = [
  { user: 'Aylin Demir', role: 'admin', createdAt: '2026-01-05' },
  { user: 'Kerem Kaya', role: 'guest', createdAt: '2026-02-18' },
  { user: 'Derya Yılmaz', role: 'host', createdAt: '2026-03-01' },
];

export const PARTNER_PROFILES: PartnerProfileRow[] = [
  {
    partnerType: 'hotel',
    company: 'Aurora Hotels',
    taxNumber: 'TR-983215',
    website: 'aurora.com',
  },
  {
    partnerType: 'agency',
    company: 'Mavi Rota',
    taxNumber: 'TR-712442',
    website: 'mavirota.com',
  },
];

export const HOSTS: HostRow[] = [
  {
    name: 'Aylin Demir',
    responseRate: 98,
    responseTime: '1 saat içinde',
    superhost: true,
    totalReviews: 142,
    languages: ['TR', 'EN'],
  },
  {
    name: 'Derya Yılmaz',
    responseRate: 91,
    responseTime: '2 saat içinde',
    superhost: false,
    totalReviews: 57,
    languages: ['TR', 'DE'],
  },
];

export const LISTINGS: ListingRow[] = [
  {
    title: 'Boğaz Manzaralı Daire',
    propertyType: 'apartment',
    city: 'İstanbul',
    country: 'Türkiye',
    pricePerNight: 3200,
    maxGuests: 4,
    rating: 4.92,
    isActive: true,
  },
  {
    title: 'Ege Manzaralı Villa',
    propertyType: 'villa',
    city: 'İzmir',
    country: 'Türkiye',
    pricePerNight: 5400,
    maxGuests: 8,
    rating: 4.76,
    isActive: true,
  },
  {
    title: 'Kapadokya Taş Otel',
    propertyType: 'hotel',
    city: 'Nevşehir',
    country: 'Türkiye',
    pricePerNight: 2800,
    maxGuests: 3,
    rating: 4.61,
    isActive: false,
  },
];

export const LISTING_IMAGES: ListingImageRow[] = [
  { listing: 'Boğaz Manzaralı Daire', url: '/images/listings/bogaz-1.jpg', isPrimary: true, sortOrder: 1 },
  { listing: 'Ege Manzaralı Villa', url: '/images/listings/ege-1.jpg', isPrimary: true, sortOrder: 1 },
  { listing: 'Kapadokya Taş Otel', url: '/images/listings/kapadokya-1.jpg', isPrimary: true, sortOrder: 1 },
];

export const AMENITIES: AmenityRow[] = [
  { name: 'WiFi', category: 'essentials' },
  { name: 'Havuz', category: 'outdoor' },
  { name: 'Klima', category: 'climate' },
  { name: 'Otopark', category: 'parking' },
];

export const LISTING_AMENITIES: ListingAmenitiesRow[] = [
  { listing: 'Boğaz Manzaralı Daire', amenities: ['WiFi', 'Klima', 'Otopark'] },
  { listing: 'Ege Manzaralı Villa', amenities: ['WiFi', 'Havuz', 'Otopark'] },
];

export const HOUSE_RULES: HouseRuleRow[] = [
  { listing: 'Boğaz Manzaralı Daire', smoking: false, pets: true, parties: false },
  { listing: 'Ege Manzaralı Villa', smoking: false, pets: false, parties: false },
];

export const AVAILABILITY: AvailabilityRow[] = [
  { listing: 'Boğaz Manzaralı Daire', date: '2026-03-18', available: true, customPrice: 3400 },
  { listing: 'Boğaz Manzaralı Daire', date: '2026-03-19', available: false, customPrice: null },
  { listing: 'Ege Manzaralı Villa', date: '2026-03-20', available: true, customPrice: 6200 },
];

export const BOOKINGS: BookingRow[] = [
  {
    id: 'BK-3921',
    listing: 'Boğaz Manzaralı Daire',
    guest: 'Derya Yılmaz',
    checkIn: '2026-03-18',
    checkOut: '2026-03-22',
    guestsCount: 2,
    status: 'confirmed',
    totalPrice: 12400,
    coupon: 'WELCOME10',
    pointsRedeemed: 1200,
    discountTotal: 1500,
    finalPrice: 10900,
    checkInSlotStart: '14:00',
    checkInSlotEnd: '16:00',
    extras: ['Havaalanı transferi', 'Erken giriş'],
  },
  {
    id: 'BK-4017',
    listing: 'Ege Manzaralı Villa',
    guest: 'Kerem Kaya',
    checkIn: '2026-03-25',
    checkOut: '2026-03-29',
    guestsCount: 5,
    status: 'pending',
    totalPrice: 21600,
    coupon: null,
    pointsRedeemed: 0,
    discountTotal: 0,
    finalPrice: 21600,
    checkInSlotStart: '15:00',
    checkInSlotEnd: '17:00',
    extras: ['Bebek yatağı'],
  },
  {
    id: 'BK-3774',
    listing: 'Kapadokya Taş Otel',
    guest: 'Seda Arslan',
    checkIn: '2026-03-12',
    checkOut: '2026-03-14',
    guestsCount: 2,
    status: 'completed',
    totalPrice: 5600,
    coupon: 'SPRING',
    pointsRedeemed: 600,
    discountTotal: 400,
    finalPrice: 4600,
    checkInSlotStart: '13:00',
    checkInSlotEnd: '15:00',
    extras: [],
  },
];

export const REVIEWS: ReviewRow[] = [
  {
    listing: 'Boğaz Manzaralı Daire',
    reviewer: 'Derya Yılmaz',
    rating: 4.8,
    cleanliness: 4.9,
    communication: 5,
    location: 4.7,
    value: 4.6,
    createdAt: '2026-03-05',
  },
  {
    listing: 'Ege Manzaralı Villa',
    reviewer: 'Kerem Kaya',
    rating: 4.6,
    cleanliness: 4.5,
    communication: 4.8,
    location: 4.7,
    value: 4.4,
    createdAt: '2026-02-27',
  },
];

export const WISHLISTS: WishlistRow[] = [
  { name: 'Yaz Tatili', user: 'Kerem Kaya', items: 4 },
  { name: 'Balayı', user: 'Derya Yılmaz', items: 2 },
];

export const WISHLIST_ITEMS: WishlistItemRow[] = [
  { wishlist: 'Yaz Tatili', listing: 'Ege Manzaralı Villa' },
  { wishlist: 'Yaz Tatili', listing: 'Kapadokya Taş Otel' },
  { wishlist: 'Balayı', listing: 'Boğaz Manzaralı Daire' },
];

export const CONVERSATIONS: ConversationRow[] = [
  {
    id: 'CNV-91',
    participants: 'Aylin Demir ↔ Kerem Kaya',
    listing: 'Ege Manzaralı Villa',
    lastMessageAt: '2026-03-10 14:42',
    unread: 2,
  },
  {
    id: 'CNV-87',
    participants: 'Aylin Demir ↔ Derya Yılmaz',
    listing: 'Boğaz Manzaralı Daire',
    lastMessageAt: '2026-03-09 20:15',
    unread: 0,
  },
];

export const MESSAGES: MessageRow[] = [
  {
    conversation: 'CNV-91',
    sender: 'Kerem Kaya',
    content: 'Erken giriş mümkün mü?',
    isRead: false,
    createdAt: '2026-03-10 14:42',
  },
  {
    conversation: 'CNV-87',
    sender: 'Aylin Demir',
    content: 'Check-in talebinizi onayladım.',
    isRead: true,
    createdAt: '2026-03-09 20:15',
  },
];

export const LOYALTY_ACCOUNTS: LoyaltyAccountRow[] = [
  { user: 'Kerem Kaya', pointsBalance: 4250, lifetimePoints: 9800 },
  { user: 'Derya Yılmaz', pointsBalance: 3120, lifetimePoints: 6400 },
];

export const LOYALTY_TRANSACTIONS: LoyaltyTransactionRow[] = [
  { user: 'Kerem Kaya', type: 'earn', points: 320, description: 'Boğaz Manzaralı Daire', createdAt: '2026-03-02' },
  { user: 'Derya Yılmaz', type: 'redeem', points: 600, description: 'SPRING kuponu', createdAt: '2026-02-25' },
];

export const COUPONS: CouponRow[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minTotal: 3000,
    maxDiscount: 750,
    startsAt: '2026-02-01',
    expiresAt: '2026-04-01',
    usageLimit: 100,
    isActive: true,
  },
  {
    code: 'SPRING',
    discountType: 'fixed_amount',
    discountValue: 400,
    minTotal: 2500,
    maxDiscount: null,
    startsAt: '2026-03-01',
    expiresAt: '2026-03-31',
    usageLimit: 60,
    isActive: true,
  },
];

export const COUPON_USAGES: CouponUsageRow[] = [
  { code: 'WELCOME10', user: 'Derya Yılmaz', booking: 'BK-3921', discountApplied: 1500 },
  { code: 'SPRING', user: 'Seda Arslan', booking: 'BK-3774', discountApplied: 400 },
];

export const TOUR_OPERATORS: TourOperatorRow[] = [
  { company: 'Rotaly Adventures', phone: '+90 212 000 00 00', website: 'rotaly.com' },
];

export const TOURS: TourRow[] = [
  {
    title: 'İstanbul Tarih Turu',
    city: 'İstanbul',
    durationMinutes: 240,
    maxParticipants: 20,
    basePrice: 850,
    rating: 4.7,
    isActive: true,
  },
  {
    title: 'Kapadokya Balon Deneyimi',
    city: 'Nevşehir',
    durationMinutes: 180,
    maxParticipants: 12,
    basePrice: 2400,
    rating: 4.9,
    isActive: true,
  },
];

export const TOUR_SCHEDULES: TourScheduleRow[] = [
  { tour: 'İstanbul Tarih Turu', startTime: '2026-03-18 09:30', availableSpots: 8, priceOverride: null },
  { tour: 'Kapadokya Balon Deneyimi', startTime: '2026-03-20 05:30', availableSpots: 3, priceOverride: 2600 },
];

export const TOUR_BOOKINGS: TourBookingRow[] = [
  {
    tour: 'İstanbul Tarih Turu',
    guest: 'Kerem Kaya',
    participants: 2,
    status: 'confirmed',
    totalPrice: 1700,
    finalPrice: 1500,
  },
  {
    tour: 'Kapadokya Balon Deneyimi',
    guest: 'Derya Yılmaz',
    participants: 2,
    status: 'pending',
    totalPrice: 4800,
    finalPrice: 4800,
  },
];

export const TOUR_REVIEWS: TourReviewRow[] = [
  { tour: 'İstanbul Tarih Turu', reviewer: 'Kerem Kaya', rating: 5, comment: 'Harika rota ve rehber.' },
  { tour: 'Kapadokya Balon Deneyimi', reviewer: 'Derya Yılmaz', rating: 4, comment: 'Manzara eşsizdi.' },
];
