'use client';

import Link from 'next/link';
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
        <footer className="border-t border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
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
        </footer>
    );
}
