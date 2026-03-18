'use client';

import Link from 'next/link';
import { Building2, LifeBuoy, BookOpen, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const LINKS = [
  { label: 'Destek', href: '/dashboard/help', icon: LifeBuoy },
  { label: 'Belgeler', href: '/dashboard/documents', icon: BookOpen },
];

export function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-4 mb-3 mt-auto">
      <Separator className="mb-3 opacity-40" />
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-[11px] text-muted-foreground/70">
        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold tracking-tight text-muted-foreground">Rotaly</span>
          <span className="hidden sm:inline">Hotel Admin Panel</span>
          <span className="opacity-40">·</span>
          <span>© {year}</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-4">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Icon className="w-3 h-3" />
              {label}
            </Link>
          ))}
          <a
            href="https://rotaly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            rotaly.com
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
