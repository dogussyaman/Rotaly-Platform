'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function LoginLeftPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0">
        <img
          src="/auth_hero_image.png"
          alt="Luxury Villa"
          className="w-full h-full object-cover opacity-60 scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground via-foreground/20 to-transparent" />
      </div>
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="black" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Rotaly</span>
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-lg space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Eşsiz Deneyimler <br />
            <span className="text-white/60">Seni Bekliyor.</span>
          </h2>
          <p className="text-lg text-white/70 font-medium">
            Hayalindeki tatili planlamak hiç bu kadar kolay olmamıştı. Binlerce seçenek arasından sana en uygun olanı bul.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-foreground bg-muted overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50 font-medium leading-tight">
            <span className="text-white font-bold text-sm block">12.4k+ Gezgin</span>
            Tarafından tercih ediliyor
          </p>
        </div>
      </motion.div>
    </div>
  );
}
