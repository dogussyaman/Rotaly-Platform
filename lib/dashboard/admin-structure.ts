export type DashboardIconKey =
  | 'overview'
  | 'users'
  | 'roles'
  | 'hosts'
  | 'applications'
  | 'listings'
  | 'availability'
  | 'bookings'
  | 'reviews'
  | 'wishlists'
  | 'messages'
  | 'loyalty'
  | 'coupons'
  | 'tours'
  | 'reports'
  | 'systemLogs'
  | 'earnings';

export type DashboardModuleKey =
  | 'overview'
  | 'users'
  | 'roles'
  | 'hosts'
  | 'applications'
  | 'listings'
  | 'availability'
  | 'bookings'
  | 'reviews'
  | 'wishlists'
  | 'messages'
  | 'loyalty'
  | 'coupons'
  | 'tours'
  | 'reports'
  | 'systemLogs'
  | 'earnings';

export type DashboardCapability = 'read' | 'approve' | 'review' | 'update' | 'delete';

export interface DashboardModuleDefinition {
  key: DashboardModuleKey;
  title: string;
  url: string;
  iconKey: DashboardIconKey;
  placement: 'main' | 'documents';
  capabilities: DashboardCapability[];
}

export const ADMIN_MODULES: DashboardModuleDefinition[] = [
  { key: 'overview', title: 'Genel Bakış', url: '/dashboard', iconKey: 'overview', placement: 'main', capabilities: ['read'] },
  { key: 'applications', title: 'Otel Başvuruları', url: '/dashboard/applications', iconKey: 'applications', placement: 'main', capabilities: ['read', 'approve', 'review'] },
  { key: 'listings', title: 'Otel İlanları', url: '/dashboard/listings', iconKey: 'listings', placement: 'main', capabilities: ['read', 'update', 'delete'] },
  { key: 'bookings', title: 'Rezervasyonlar', url: '/dashboard/bookings', iconKey: 'bookings', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'users', title: 'Kullanıcılar', url: '/dashboard/users', iconKey: 'users', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'roles', title: 'Roller & Yetkiler', url: '/dashboard/roles', iconKey: 'roles', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'hosts', title: 'Ev Sahipleri', url: '/dashboard/hosts', iconKey: 'hosts', placement: 'main', capabilities: ['read', 'review'] },
  { key: 'messages', title: 'Mesajlar', url: '/dashboard/messages', iconKey: 'messages', placement: 'main', capabilities: ['read', 'review'] },
  { key: 'coupons', title: 'Kuponlar', url: '/dashboard/coupons', iconKey: 'coupons', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'reports', title: 'Raporlar', url: '/dashboard/reports', iconKey: 'reports', placement: 'documents', capabilities: ['read'] },
  { key: 'systemLogs', title: 'Sistem Kayıtları', url: '/dashboard/reports', iconKey: 'systemLogs', placement: 'documents', capabilities: ['read'] },
];

export const HOST_MODULES: DashboardModuleDefinition[] = [
  { key: 'overview', title: 'Genel Bakış', url: '/dashboard', iconKey: 'overview', placement: 'main', capabilities: ['read'] },
  { key: 'listings', title: 'Otel ilanlarım', url: '/dashboard/listings', iconKey: 'listings', placement: 'main', capabilities: ['read', 'update', 'delete'] },
  { key: 'availability', title: 'Uygunluk', url: '/dashboard/availability', iconKey: 'availability', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'bookings', title: 'Rezervasyonlar', url: '/dashboard/bookings', iconKey: 'bookings', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'reviews', title: 'Değerlendirmeler', url: '/dashboard/reviews', iconKey: 'reviews', placement: 'main', capabilities: ['read', 'review'] },
  { key: 'messages', title: 'Mesajlar', url: '/dashboard/messages', iconKey: 'messages', placement: 'main', capabilities: ['read', 'review'] },
  { key: 'loyalty', title: 'Sadakat', url: '/dashboard/loyalty', iconKey: 'loyalty', placement: 'main', capabilities: ['read'] },
  { key: 'coupons', title: 'Kuponlar', url: '/dashboard/coupons', iconKey: 'coupons', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'tours', title: 'Turlar', url: '/dashboard/tours', iconKey: 'tours', placement: 'main', capabilities: ['read', 'update'] },
  { key: 'earnings', title: 'Gelirler', url: '/dashboard/earnings', iconKey: 'earnings', placement: 'main', capabilities: ['read'] },
  { key: 'reports', title: 'Rezervasyon Raporları', url: '/dashboard/reports', iconKey: 'bookings', placement: 'documents', capabilities: ['read'] },
  { key: 'systemLogs', title: 'Vergi Belgeleri', url: '/dashboard/reports', iconKey: 'reports', placement: 'documents', capabilities: ['read'] },
];
