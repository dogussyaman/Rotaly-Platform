import type { ReactNode } from 'react';

import './dashboard.css';
import DashboardLayoutClient from './_components/dashboard-layout-client';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}

