'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
    const { t } = useLocale();

    const contactMethods = [
        { label: 'E-posta', value: 'hello@stayhub.com', icon: <Mail className="w-5 h-5" />, href: 'mailto:hello@stayhub.com' },
        { label: 'Destek Hattı', value: '+90 216 444 00 00', icon: <Phone className="w-5 h-5" />, href: 'tel:+902164440000' },
        { label: 'Ofis Adresi', value: 'Levent, Büyükdere Cd. No: 12, İstanbul', icon: <MapPin className="w-5 h-5" />, href: '#' },
    ];

    return (
        <ContentLayout
            title={t.contactTitle as string}
            subtitle="Bize dilediğiniz zaman ulaşabilirsiniz. Ekibimiz en kısa sürede size geri dönüş sağlayacaktır."
        >
            <div className="grid lg:grid-cols-2 gap-16 py-10 items-start">
                {/* Contact Info */}
                <section className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-foreground">İletişime Geçin</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Sorularınız, iş birliği teklifleriniz veya teknik destek talepleriniz için aşağıdaki kanalları kullanabilirsiniz.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {contactMethods.map((method, i) => (
                            <a
                                key={i}
                                href={method.href}
                                className="group flex items-center gap-6 p-6 rounded-[2rem] border bg-card hover:border-foreground/20 transition-all hover:bg-muted/50 shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {method.icon}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{method.label}</div>
                                    <div className="text-lg font-semibold text-foreground">{method.value}</div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="bg-secondary p-8 rounded-[2rem] space-y-4">
                        <h4 className="font-bold text-foreground">Sıkça Sorulan Sorular</h4>
                        <p className="text-sm text-muted-foreground">Aradığınız cevabı belki de çoktan vermişizdir. Yardım merkezimize göz atın.</p>
                        <a href="/faq" className="inline-block font-bold text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">FAQ sayfasını gör →</a>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="bg-card border rounded-[2.5rem] p-10 shadow-lg">
                    <h2 className="text-2xl font-bold text-foreground mb-8">Bize Mesaj Gönderin</h2>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground pl-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    placeholder="Caner Yaman"
                                    className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:border-foreground/30 focus:outline-none transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground pl-1">E-posta</label>
                                <input
                                    type="email"
                                    placeholder="caner@example.com"
                                    className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:border-foreground/30 focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground pl-1">Konu</label>
                            <select className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:border-foreground/30 focus:outline-none transition-colors text-sm appearance-none">
                                <option>Destek Talebi</option>
                                <option>İş Birliği</option>
                                <option>Geri Bildirim</option>
                                <option>Diğer</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground pl-1">Mesajınız</label>
                            <textarea
                                rows={5}
                                placeholder="Size nasıl yardımcı olabiliriz?"
                                className="w-full px-5 py-4 rounded-2xl bg-muted/30 border border-border focus:border-foreground/30 focus:outline-none transition-colors text-sm resize-none"
                            />
                        </div>
                        <button className="w-full py-4 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-2 hover:bg-foreground/85 transition-colors shadow-lg shadow-black/5">
                            <Send className="w-4 h-4" />
                            Gönder
                        </button>
                    </form>
                </section>
            </div>
        </ContentLayout>
    );
}
