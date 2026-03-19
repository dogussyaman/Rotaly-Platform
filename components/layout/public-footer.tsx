'use client';

import { usePathname } from 'next/navigation';
import PremiumFooter from '@/components/footer/premium-footer';

export function PublicFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/dashboard')) return null;
  return <PremiumFooter />;
}
