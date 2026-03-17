'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from '@/lib/i18n/locale-context';

export function MainFooter() {
    const { t } = useLocale();

    const sections = [
        {
            title: t.support as string,
            links: [
                { label: 'Sıkça Sorulan Sorular (SSS)', href: '/faq' },
                { label: 'İletişim & Destek', href: '/contact' },
                { label: 'İptal ve İade Politikası', href: '/cancellation-policy' },
                { label: 'Güvenlik Bilgisi', href: '/safety' }
            ]
        },
        {
            title: t.community as string,
            links: [
                { label: 'StayHub.org', href: '/community' },
                { label: 'Ayrımcılıkla Mücadele', href: '/anti-discrimination' },
                { label: 'Arkadaşını Davet Et', href: '/invite' }
            ]
        },
        {
            title: t.hosting as string,
            links: [
                { label: 'Evinizi Listeleyin', href: '/host' },
                { label: 'Ev Sahipleri için Destek', href: '/host/support' },
                { label: 'Kaynaklara Göz At', href: '/host/resources' }
            ]
        },
        {
            title: t.company as string,
            links: [
                { label: 'Hakkımızda', href: '/about' },
                { label: 'Biz Kimiz?', href: '/about' },
                { label: 'Haberler & Blog', href: '/blog' },
                { label: 'Kariyer', href: '/careers' }
            ]
        },
    ];

    return (
        <footer className="relative overflow-hidden border-t border-border bg-card">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
            <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    {sections.map(col => (
                        <div key={col.title}>
                            <h4 className="text-sm font-bold text-foreground mb-6 uppercase tracking-wider">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map(l => (
                                    <li key={l.label}>
                                        <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                        <span>{t.privacyTerms as string}</span>
                        <span className="hidden sm:inline">·</span>
                        <Link href="/privacy-policy" className="hover:underline">Gizlilik</Link>
                        <span className="hidden sm:inline">·</span>
                        <Link href="/terms" className="hover:underline">Koşullar</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="https://twitter.com/rotaly" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Twitter</Link>
                        <Link href="https://facebook.com/rotaly" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Facebook</Link>
                        <Link href="https://instagram.com/rotaly" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Instagram</Link>
                    </div>
                </div>
            </div>
            {/* Alt kısımdan yükselen güneş ve bulut animasyonu */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-1/2 bottom-[-40px] flex -translate-x-1/2 items-center justify-center"
                >
                    <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <radialGradient id="footerSunGradient" cx="50%" cy="40%" r="60%">
                                <stop offset="0%" stopColor="#fde68a" />
                                <stop offset="45%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#f97316" />
                            </radialGradient>
                        </defs>
                        <circle cx="110" cy="80" r="46" fill="url(#footerSunGradient)" />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ y: 60, x: -60, opacity: 0 }}
                    whileInView={{ y: 0, x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-0 left-4"
                >
                    <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M25 60C25 48.954 33.954 40 45 40C48.909 40 52.542 41.149 55.6 43.137C59.172 34.381 67.83 28 78 28C89.598 28 99.373 36.09 101.6 47.038C104.18 45.754 107.04 45 110 45C119.389 45 127 52.611 127 62H25Z"
                            fill="white"
                            fillOpacity="0.9"
                        />
                    </svg>
                </motion.div>
                <motion.div
                    initial={{ y: 70, x: 40, opacity: 0 }}
                    whileInView={{ y: 0, x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-4 left-40 hidden sm:block"
                >
                    <svg width="140" height="60" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 45C15 36.716 21.716 30 30 30C33.52 30 36.781 31.206 39.4 33.24C42.079 25.76 49.089 20 57.5 20C66.93 20 74.88 26.741 76.7 35.74C78.86 34.79 81.27 34.25 83.8 34.25C92.06 34.25 98.75 40.94 98.75 49.2H15Z"
                            fill="white"
                            fillOpacity="0.85"
                        />
                    </svg>
                </motion.div>
            </div>
        </footer>
    );
}
