'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CONSENT_KEY = 'rotaly_cookie_consent';

type ConsentValue = 'all' | 'essential' | null;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue;
      if (!stored) setVisible(true);
    } catch {
      // localStorage erişilemiyorsa banner gösterme
    }
  }, []);

  const accept = (value: 'all' | 'essential') => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-background border border-border rounded-3xl shadow-2xl">
            {/* Ana banner */}
            <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-foreground flex items-center justify-center mt-0.5">
                  <Cookie className="w-4 h-4 text-background" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Çerez Tercihleriniz</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Deneyiminizi iyileştirmek, trafiği analiz etmek ve kişiselleştirilmiş içerik sunmak için çerezler
                    kullanıyoruz.{' '}
                    <Link href="/cookies" className="underline font-semibold hover:text-foreground transition-colors">
                      Çerez Politikası
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDetail((v) => !v)}
                  className="h-9 px-4 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Ayarla
                </button>
                <button
                  type="button"
                  onClick={() => accept('essential')}
                  className="h-9 px-4 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Yalnızca Zorunlu
                </button>
                <button
                  type="button"
                  onClick={() => accept('all')}
                  className="h-9 px-5 rounded-xl bg-foreground text-background text-xs font-bold hover:bg-foreground/90 transition-colors"
                >
                  Tümünü Kabul Et
                </button>
                <button
                  type="button"
                  aria-label="Kapat"
                  onClick={() => accept('essential')}
                  className="h-9 w-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Detay paneli */}
            <AnimatePresence>
              {showDetail && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-5 md:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        label: 'Zorunlu Çerezler',
                        desc: 'Oturum ve güvenlik için gereklidir.',
                        required: true,
                      },
                      {
                        label: 'Analitik Çerezler',
                        desc: 'Ziyaretçi istatistiklerini toplar.',
                        required: false,
                      },
                      {
                        label: 'Fonksiyonel Çerezler',
                        desc: 'Tema ve dil tercihlerini hatırlar.',
                        required: false,
                      },
                      {
                        label: 'Pazarlama Çerezleri',
                        desc: 'Kişiselleştirilmiş reklamlar sunar.',
                        required: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-muted/50"
                      >
                        <div
                          className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center ${
                            item.required
                              ? 'bg-foreground border-foreground'
                              : 'bg-background border-border'
                          }`}
                        >
                          {item.required && (
                            <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                          {item.required && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">Her zaman aktif</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 md:px-6 pb-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => accept('essential')}
                      className="h-9 px-4 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
                    >
                      Seçilenleri Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => accept('all')}
                      className="h-9 px-5 rounded-xl bg-foreground text-background text-xs font-bold hover:bg-foreground/90 transition-colors"
                    >
                      Tümünü Kabul Et
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
