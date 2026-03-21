'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type SocialItem = {
  Icon: LucideIcon;
  label: string;
  href: string;
};

type FooterMobileSocialStripProps = {
  siteName: string;
  socialIcons: SocialItem[];
};

export function FooterMobileSocialStrip({ siteName, socialIcons }: FooterMobileSocialStripProps) {
  return (
    <div className="relative z-10 lg:hidden border-t border-slate-200/60 bg-white/45 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <span className="text-xs font-black tracking-[0.2em] text-slate-600">{siteName}</span>
        <div className="flex items-center gap-2">
          {socialIcons.map(({ Icon, label, href }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -2, scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-white/80 border border-slate-200/70 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Icon size={16} />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
