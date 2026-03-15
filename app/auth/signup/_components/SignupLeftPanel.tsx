'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function SignupLeftPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-foreground">
      <div className="absolute inset-0 z-0 text-white/50">
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
          <span className="font-bold text-2xl text-white tracking-tight">StayHub</span>
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
            Yolculuk <br />
            <span className="text-white/60">Burada Başlıyor.</span>
          </h2>
          <p className="text-lg text-white/70 font-medium">
            StayHub topluluğuna katılarak dünyanın her yerindeki özel konaklama yerlerine erişim sağla.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-8">
          <div>
            <p className="text-white font-bold text-xl">10k+</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">İlanlar</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl">250+</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Destinasyon</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl">4.9/5</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Müşteri Memnuniyeti</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
