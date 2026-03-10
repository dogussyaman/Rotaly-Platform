'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { motion } from 'framer-motion';

export default function AboutPage() {
    const { t } = useLocale();

    const stats = [
        { label: 'Kullanıcı', value: '500K+' },
        { label: 'Konaklama Yeri', value: '1.2M' },
        { label: 'Ülke', value: '190+' },
        { label: 'Yıllık Rezervasyon', value: '2M+' },
    ];

    return (
        <ContentLayout
            title={t.aboutTitle as string}
            subtitle="StayHub olarak dünyayı herkes için daha erişilebilir ve konforlu bir yer haline getirmeyi hedefliyoruz."
        >
            <div className="space-y-20 py-10">
                {/* Mission */}
                <section className="relative overflow-hidden rounded-[3rem] bg-card border p-12 lg:p-16">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-foreground">Misyonumuz</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                StayHub, seyahat etmeyi sadece bir yerden bir yere gitmek değil, yeni kültürler tanımak ve unutulmaz anılar biriktirmek olarak görür. Teknolojiyi ve tasarımı birleştirerek, gezginler ile ev sahipleri arasında güvenli bir köprü kuruyoruz.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Herkesin hayalindeki konaklamayı bulabileceği, şeffaf ve güvenilir bir ekosistem inşa ediyoruz.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-muted p-6 rounded-3xl text-center flex flex-col justify-center items-center space-y-2">
                                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story */}
                <section className="space-y-8">
                    <h2 className="text-4xl font-bold text-center">Hikayemiz</h2>
                    <div className="max-w-3xl mx-auto space-y-6 text-muted-foreground text-lg leading-relaxed text-center">
                        <p>
                            2020 yılında sadece birkaç ev ilanıyla başladığımız bu yolculukta, bugün dünyanın dört bir yanındaki milyonlarca insana ulaşıyoruz. İstanbul merkezli bir teknoloji şirketi olarak, seyahat endüstrisinde dijital dönüşümün öncüsü olmaktan gurur duyuyoruz.
                        </p>
                        <p>
                            Sıradan bir otel odasından ziyade, kendinizi evinizde hissedeceğiniz o özel köşeyi bulmanız için çalışıyoruz. İster bir dağ evi, ister modern bir şehir dairesi; StayHub yanınızda.
                        </p>
                    </div>
                </section>

                {/* Values */}
                <section className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Şeffaflık', desc: 'Gizli ücretler yok, her şey açık ve net.', icon: '🔍' },
                        { title: 'Güvenlik', desc: 'AirCover ile hem misafirler hem ev sahipleri koruma altında.', icon: '🛡️' },
                        { title: 'Topluluk', desc: 'Sadece bir platform değil, kocaman bir aileyiz.', icon: '🤝' },
                    ].map((val, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            className="bg-card border rounded-[2.5rem] p-10 text-center space-y-4 shadow-sm"
                        >
                            <div className="text-4xl">{val.icon}</div>
                            <h3 className="text-xl font-bold text-foreground">{val.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{val.desc}</p>
                        </motion.div>
                    ))}
                </section>
            </div>
        </ContentLayout>
    );
}
