'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function TermsPage() {
    const { t } = useLocale();

    const terms = [
        {
            title: 'Hizmet Kapsamı',
            content: 'Rotaly, ev sahipleri ile misafirleri buluşturan bir platformdur. Rezervasyon sırasında sağlanan her türlü veri ve mülk bilgisi ev sahiplerinin sorumluluğundadır.',
        },
        {
            title: 'Rezervasyon ve Ödemeler',
            content: 'Tüm rezervasyonlar Rotaly güvenli ödeme sistemi üzerinden gerçekleştirilir. Ödemeler ancak rezervasyon onaylandıktan sonra kesinleşir.',
        },
        {
            title: 'İptal ve Rezervasyon Değişiklikleri',
            content: 'Her bir konaklama ilanında belirtilen özel iptal politikaları geçerlidir. Rezervasyonunuzu değiştirmek isterseniz ev sahibi ile iletişime geçmeniz gerekir.',
        },
        {
            title: 'Kullanım Kuralları',
            content: 'Hesap bilgilerinizi güncel tutmak ve güvende saklamak sizin sorumluluğunuzdadır. Diğer kullanıcıları taciz etmek veya yanıltıcı bilgi vermek platformdan uzaklaştırılma sebebidir.',
        },
        {
            title: 'Sorumluluk Reddi',
            content: 'Rotaly, platformdaki ilanların doğruluğunu denetlemek için çalışsa da her zaman tam doğruluğu garanti edemez. Sorumluluk mülk sahiplerindedir.',
        },
        {
            title: 'Uyuşmazlıkların Çözümü',
            content: 'Misafir ve ev sahibi arasındaki uyuşmazlıklarda Rotaly arabuluculuk yapmaya çalışır. Mevcut yerel yasalar uyuşmazlığın çözümünde temel alınır.',
        },
    ];

    return (
        <ContentLayout
            title={t.termsTitle as string}
            subtitle="Rotaly hizmetlerini kullanırken tabi olduğunuz kuralları ve koşulları içerir."
        >
            <div className="py-10 space-y-16">
                <section className="bg-foreground text-background rounded-[2.5rem] p-12 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-emerald-400 text-foreground font-bold border-none px-3 py-1 uppercase tracking-wider text-[10px]">
                                Son Güncelleme: Mart 2026
                            </Badge>
                            <h2 className="text-3xl font-bold text-white max-w-md">Sorumlu ve Güvenilir Bir Platform İçin</h2>
                            <p className="text-gray-400 max-w-sm leading-relaxed">
                                Rotaly topluluğuna katılarak, aşağıda belirtilen hizmet koşullarını kabul etmiş sayılmaktasınız.
                            </p>
                        </div>
                        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shrink-0">
                            <svg className="w-20 h-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3 6-6M2.25 12a9.75 9.75 0 1119.5 0 9.75 9.75 0 01-19.5 0z" />
                            </svg>
                        </div>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-10">
                    {terms.map((term, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 border border-border/60 bg-card rounded-3xl hover:border-foreground/20 transition-all shadow-sm"
                        >
                            <h3 className="text-xl font-bold mb-4 text-foreground">{term.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {term.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <section className="prose prose-slate max-w-none text-muted-foreground italic text-center text-sm pt-8">
                    <p>
                        *Rotaly bir aracılık hizmeti olup mülklerin doğrudan yönetilmesi veya mülkiyeti ile bir ilişiği yoktur.*
                    </p>
                </section>
            </div>
        </ContentLayout>
    );
}
