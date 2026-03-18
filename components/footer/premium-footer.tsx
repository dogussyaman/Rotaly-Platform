'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Facebook, Twitter, Globe } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const SKY_GRADIENT = "bg-gradient-to-b from-sky-100 via-orange-100 to-orange-200"; 

// Gerçekçi güneş: alttan yükselir, tam görünür, daha kompakt boyut
const Sun = ({ shouldAnimate }: { shouldAnimate: boolean }) => (
    <motion.div
        initial={{ y: 130, opacity: 0, scale: 0.9 }}
        animate={
            shouldAnimate
                ? { y: [0, -5, 0], opacity: 1, scale: 1 }
                : { y: 130, opacity: 0, scale: 0.9 }
        }
        transition={
            shouldAnimate
                ? {
                    delay: 1.2,
                    duration: 2.2,
                    ease: [0.16, 1, 0.3, 1],
                    y: {
                        duration: 4.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }
                : { duration: 0.2 }
        }
        className="absolute left-6 sm:left-10 md:left-14 bottom-5 w-44 md:w-56 h-44 md:h-56 pointer-events-none z-0"
    >
        {/* Dış atmosfer glow */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-300/35 via-orange-300/20 to-transparent blur-[56px] rounded-full animate-pulse" 
             style={{ animationDuration: '4.2s' }} 
        />
        
        {/* Orta ışık katmanı */}
        <div className="absolute inset-[7%] bg-gradient-radial from-yellow-300/35 via-orange-400/28 to-transparent blur-[36px] rounded-full" />
        
        {/* Güneş gövdesi */}
        <div className="absolute inset-[24%] rounded-full overflow-hidden shadow-[0_0_70px_rgba(251,146,60,0.45)]">
            {/* Ana yüzey */}
            <div className="absolute inset-0 bg-radial from-yellow-100 via-orange-300 to-orange-500 rounded-full" />
            
            {/* Parlama */}
            <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/30 to-white/50 rounded-full blur-sm" />
            
            {/* Hafif yüzey dokusu */}
            <div className="absolute top-[23%] left-[28%] w-4 h-4 bg-orange-700/30 rounded-full blur-[3px]" />
            <div className="absolute top-[58%] right-[24%] w-6 h-6 bg-orange-800/20 rounded-full blur-xs" />
            <div className="absolute bottom-[30%] left-[43%] w-3 h-3 bg-red-700/25 rounded-full blur-[2px]" />
            
            {/* Merkez aydınlık */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-radial from-yellow-100 via-amber-300/50 to-transparent rounded-full blur-xl" />
        </div>
        
        {/* İç beyaz parlama */}
        <div className="absolute inset-[37%] bg-white/35 rounded-full blur-xl" />
        
        {/* Yumuşak ışınlar */}
        {[...Array(10)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={shouldAnimate ? { opacity: [0.3, 0.6, 0.3], scale: [0.8, 1, 0.8] } : { opacity: 0, scale: 0 }}
                transition={{
                    duration: 2.8,
                    delay: i * 0.08,
                    repeat: Infinity,
                    repeatDelay: 1.8
                }}
                className="absolute top-1/2 left-1/2 w-0.5 h-14 md:h-16 bg-linear-to-t from-amber-300/55 to-transparent origin-bottom blur-[1px]"
                style={{
                    transform: `translate(-50%, -100%) rotate(${i * 36}deg)`,
                }}
            />
        ))}
    </motion.div>
);

// Yıldız/Işık parçacıkları
const Sparkle = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        viewport={{ once: false }}
        transition={{ 
            duration: 2, 
            delay, 
            repeat: Infinity, 
            repeatDelay: Math.random() * 5 
        }}
        className="absolute w-1 h-1 bg-white rounded-full blur-[1px] z-0"
        style={{ left: x, top: y }}
    />
);

// Bulut komponenti
const Cloud = ({ delay = 0, duration = 20, size = 1, opacity = 0.8, x = 0, y = 0 }) => (
    <motion.div
        initial={{ x: 240, opacity: 0 }}
        whileInView={{ x: 0, opacity }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: "easeOut" }}
        className="absolute pointer-events-none z-10"
        style={{ right: `${x}%`, top: `${y}%`, scale: size }}
    >
        <motion.div
            animate={{ x: [0, -22, 0, -10, 0], y: [0, -9, -2, -11, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        >
            <svg width="260" height="130" viewBox="0 0 180 80" fill="white" className="filter blur-[1px] opacity-95 drop-shadow-2xl">
                <path d="M25 60C25 48.954 33.954 40 45 40C48.909 40 52.542 41.149 55.6 43.137C59.172 34.381 67.83 28 78 28C89.598 28 99.373 36.09 101.6 47.038C104.18 45.754 107.04 45 110 45C119.389 45 127 52.611 127 62H25Z" fillOpacity="0.8" />
            </svg>
        </motion.div>
    </motion.div>
);

export default function PremiumFooter() {
    const { t } = useLocale();
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const footerInView = useInView(triggerRef, { once: true, amount: 0.65 });

    const sections = [
        {
            title: t.support as string || "Destek",
            links: [
                { label: 'Sıkça Sorulan Sorular', href: '/faq' },
                { label: 'İletişim & Destek', href: '/contact' },
                { label: 'İptal ve İade', href: '/cancellation-policy' },
                { label: 'Güvenlik', href: '/safety' }
            ]
        },
        {
            title: t.community as string || "Topluluk",
            links: [
                { label: 'Rotaly.org', href: '/community' },
                { label: 'Ayrımcılıkla Mücadele', href: '/anti-discrimination' },
                { label: 'Arkadaşını Davet Et', href: '/invite' }
            ]
        },
        {
            title: t.hosting as string || "Ev Sahipliği",
            links: [
                { label: 'Evinizi Listeleyin', href: '/host' },
                { label: 'Ev Sahipleri için Destek', href: '/host/support' },
                { label: 'Kaynaklara Göz At', href: '/host/resources' }
            ]
        },
    ];

    const socialIcons = [
        { Icon: Instagram, label: "Instagram", href: "https://instagram.com/rotaly" },
        { Icon: Facebook, label: "Facebook", href: "https://facebook.com/rotaly" },
        { Icon: Twitter, label: "Twitter", href: "https://twitter.com/rotaly" }
    ];

    return (
        <footer className="relative w-full overflow-hidden text-slate-800 border-t border-slate-200/50">
            <div ref={triggerRef} className="absolute inset-x-0 top-0 h-2" />
            {/* Animasyonlu Arka Plan */}
            <div className={`absolute inset-0 z-0 ${SKY_GRADIENT} opacity-40`} />
            
            {/* Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-multiply" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
            />
            
            {/* Arka Plan Animasyonları (Güneş & Bulutlar) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Sun shouldAnimate={footerInView} />
                
                {/* Yıldız Efektleri */}
                <Sparkle x="15%" y="20%" delay={0.5} />
                <Sparkle x="85%" y="15%" delay={1.2} />
                <Sparkle x="70%" y="35%" delay={0.8} />
                <Sparkle x="25%" y="50%" delay={2.1} />
                <Sparkle x="90%" y="60%" delay={1.5} />

                {/* Bulutlar - kenarlarda */}
                <Cloud x={2} y={14} size={1.1} delay={0.4} duration={30} opacity={0.62} />
                <Cloud x={-8} y={38} size={1.35} delay={0.8} duration={24} opacity={0.5} />
                <Cloud x={8} y={63} size={1} delay={1.2} duration={28} opacity={0.58} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-2">
                {/* İçerik Bölümü */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-8 pt-8 md:pt-10">
                    {/* Marka Kolonu */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 group">
                            <div className="w-14 h-14 bg-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:rotate-6 transition-transform">
                                <span className="text-white font-black text-3xl tracking-tighter">R</span>
                            </div>
                            <span className="text-4xl font-black tracking-tighter text-slate-900 border-b-4 border-orange-500/10 pb-1">Rotaly</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed text-base font-semibold max-w-xs">
                            Dünyanın en benzersiz ve lüks tatil kiralama yerlerini keşfedin.
                        </p>
                        <div className="flex gap-4">
                            {socialIcons.map(({ Icon, label, href }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    whileHover={{ y: -8, scale: 1.15, backgroundColor: "#f97316", color: "#fff" }}
                                    className="w-14 h-14 rounded-3xl bg-white/60 backdrop-blur-md border border-slate-200/50 flex items-center justify-center text-slate-600 transition-all shadow-lg hover:shadow-orange-500/20"
                                >
                                    <Icon size={26} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Dinamik Kolonlar */}
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[11px] opacity-60">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href} 
                                            className="text-slate-500 hover:text-orange-500 transition-colors text-base font-bold relative group w-fit block"
                                        >
                                            {link.label}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.75 bg-orange-400/30 transition-all duration-300 group-hover:w-full rounded-full" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    
                    {/* İletişim Kolonu */}
                    <div className="space-y-6">
                        <h4 className="text-slate-900 font-black uppercase tracking-[0.3em] text-[11px] opacity-60">İletişim</h4>
                        <div className="space-y-5">
                            <a href="mailto:hello@rotaly.com" className="flex items-center gap-4 text-slate-500 hover:text-orange-500 transition-all group">
                                <div className="p-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl group-hover:border-orange-200 group-hover:bg-orange-50 transition-all shadow-lg group-hover:shadow-orange-100">
                                    <Mail size={20} className="text-slate-400 group-hover:text-orange-500" />
                                </div>
                                <span className="text-sm font-bold">hello@rotaly.com</span>
                            </a>
                            <a href="tel:+1234567890" className="flex items-center gap-4 text-slate-500 hover:text-orange-500 transition-all group">
                                <div className="p-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl group-hover:border-orange-200 group-hover:bg-orange-50 transition-all shadow-lg group-hover:shadow-orange-100">
                                    <Phone size={20} className="text-slate-400 group-hover:text-orange-500" />
                                </div>
                                <span className="text-sm font-bold">+90 (234) 567 890</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alt Bölüm */}
            <div className="relative z-10 w-full bg-white/40 backdrop-blur-2xl border-t border-slate-200/50 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-slate-600 text-[11px] font-black tracking-widest">
                            &copy; {new Date().getFullYear()} ROTALY PLATFORM. TÜM HAKLAR SAKLIDIR.
                        </p>
                        <div className="hidden md:block w-px h-5 bg-slate-300/50" />
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors tracking-[0.2em]">GİZLİLİK</Link>
                            <Link href="/terms" className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors tracking-[0.2em]">ŞARTLAR</Link>
                            <Link href="/cookies" className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors tracking-[0.2em]">ÇEREZLER</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-slate-950/5 p-2 rounded-3xl border border-white/40 shadow-xl backdrop-blur-sm">
                        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-lg">
                            <Globe size={16} className="text-orange-500" />
                            TÜRKÇE (TR)
                        </button>
                        <div className="w-px h-5 bg-slate-300/50" />
                        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-lg">
                            TRY (₺)
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Alt Işık Efekti */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-linear-to-r from-orange-400/30 via-amber-400/30 to-orange-400/30 blur-[60px] pointer-events-none opacity-50" />
        </footer>
    );
}