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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />
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
            {/* Alt kısımdan: soldan güneş yükselir, sağdan bulutlar gelir */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
                <motion.div
                    initial={{ y: 90, x: -30, opacity: 0 }}
                    whileInView={{ y: 0, x: 0, opacity: 1 }}
                    animate={{ y: [0, -4, 0] }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], y: { repeat: Infinity, duration: 4.8, ease: 'easeInOut' } }}
                    className="absolute -bottom-7 left-4 sm:left-10"
                >
                    <svg width="180" height="110" viewBox="0 0 180 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="74" cy="74" r="44" className="fill-primary/25" />
                        <circle cx="74" cy="74" r="34" className="fill-primary/45" />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ y: 50, x: 90, opacity: 0 }}
                    whileInView={{ y: 0, x: 0, opacity: 1 }}
                    animate={{ x: [0, -6, 0], y: [0, -2, 0] }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], x: { repeat: Infinity, duration: 7, ease: 'easeInOut' }, y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' } }}
                    className="absolute bottom-2 right-3 sm:right-10"
                >
                    <svg width="190" height="84" viewBox="0 0 190 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-background">
                        <path
                            d="M30 62C30 50.954 38.954 42 50 42C53.909 42 57.542 43.149 60.6 45.137C64.172 36.381 72.83 30 83 30C94.598 30 104.373 38.09 106.6 49.038C109.18 47.754 112.04 47 115 47C124.389 47 132 54.611 132 64H30Z"
                            className="fill-current"
                            fillOpacity="0.85"
                        />
                    </svg>
                </motion.div>

                <motion.div
                    initial={{ y: 60, x: 110, opacity: 0 }}
                    whileInView={{ y: 0, x: 0, opacity: 1 }}
                    animate={{ x: [0, -10, 0], y: [0, -3, 0] }}
                    viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1], x: { repeat: Infinity, duration: 8.2, ease: 'easeInOut' }, y: { repeat: Infinity, duration: 5.2, ease: 'easeInOut' } }}
                    className="absolute bottom-8 right-36 hidden lg:block"
                >
                    <svg width="148" height="64" viewBox="0 0 148 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-background">
                        <path
                            d="M14 46C14 37.716 20.716 31 29 31C32.52 31 35.781 32.206 38.4 34.24C41.079 26.76 48.089 21 56.5 21C65.93 21 73.88 27.741 75.7 36.74C77.86 35.79 80.27 35.25 82.8 35.25C91.06 35.25 97.75 41.94 97.75 50.2H14Z"
                            className="fill-current"
                            fillOpacity="0.75"
                        />
                    </svg>
                </motion.div>
            </div>
        </footer>
    );
}
