'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    const { t } = useLocale();

    const sections = [
        {
            title: '1. Bilgilerin Toplanması',
            content: 'Kaydı gerçekleştirdiğinizde sizden adınız, e-posta adresiniz, telefon numaranız ve ödeme bilgileriniz gibi bazı kişisel veriler toplarız. Rezervasyonlarınızı yönetmek ve size daha iyi hizmet sunabilmek için bu verilere ihtiyaç duyarız.',
        },
        {
            title: '2. Bilgilerin Kullanımı',
            content: 'Topladığımız verileri şu amaçlarla kullanırız: Rezervasyonların işlenmesi, ödemelerin yönetilmesi, size özel tekliflerin sunulması, hizmet kalitemizin artırılması ve sahtecilikle mücadele.',
        },
        {
            title: '3. Bilgi Paylaşımı',
            content: 'Verilerinizi yalnızca yasal zorunluluk hallerinde veya rezervasyon işlemlerini tamamlamak için gerekli olan durumlarda iş ortaklarımızla (örneğin ev sahipleriyle) paylaşırız.',
        },
        {
            title: '4. Veri Güvenliği',
            content: 'Kişisel verileriniz modern şifreleme yöntemleri ve güvenlik duvarları ile korunmaktadır. Paylaştığınız ödeme bilgileri doğrudan güvenli ödeme sistemlerine aktarılır ve sunucularımızda saklanmaz.',
        },
        {
            title: '5. Haklarınız',
            content: 'Kişisel verilerinize erişme, bunları düzeltme veya silme hakkına sahipsiniz. Dilediğiniz zaman pazarlama e-postalarından çıkabilir veya hesap silebilirsiniz.',
        },
    ];

    return (
        <ContentLayout
            title={t.privacyTitle as string}
            subtitle="Kişisel verilerinizin güvenliği bizim için her şeyden daha önemlidir."
        >
            <div className="space-y-16 py-10">
                <section className="prose prose-slate prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                        Rotaly, kullanıcılarının gizliliğine ve veri güvenliğine yüksek önem vermektedir. Bu gizlilik politikası, hizmetlerimizi kullanırken hangi verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
                    </p>
                </section>

                <div className="grid gap-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                <span className="shrink-0 w-8 h-8 rounded-full bg-foreground text-background text-sm flex items-center justify-center font-bold">
                                    {index + 1}
                                </span>
                                {section.title}
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed pl-11">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <section className="bg-muted p-10 rounded-[2.5rem] mt-20 text-center space-y-6">
                    <h4 className="text-xl font-bold">Sorularınız mı var?</h4>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Gizlilik politikamızla ilgili herhangi bir sorunuz varsa lütfen bize privacy@rotaly.com adresinden ulaşın.
                    </p>
                </section>
            </div>
        </ContentLayout>
    );
}
