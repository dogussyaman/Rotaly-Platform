'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
    const { t } = useLocale();

    const faqs = [
        {
            question: 'Rotaly nedir?',
            answer: 'Rotaly, dünyanın dört bir yanındaki eşsiz konaklama yerlerini keşfetmenize, rezerve etmenize ve güvenle seyahat etmenize olanak tanıyan küresel bir konaklama platformudur.',
        },
        {
            question: 'Nasıl rezervasyon yaparım?',
            answer: "İstediğiniz konumu ve tarihleri aratarak mülkleri listeleyebilirsiniz. Beğendiğiniz bir mülkü seçtikten sonra 'Rezervasyon Yap' butonuna tıklayarak ödeme adımlarına geçebilirsiniz.",
        },
        {
            question: 'İptal politikası nasıl çalışır?',
            answer: "Her mülkün kendine özgü bir iptal politikası vardır. Genellikle rezervasyon tarihinden 48 saat öncesine kadar ücretsiz iptal imkanı sunulur. Detaylı bilgi için 'İptal ve İade Politikası' sayfamıza göz atabilirsiniz.",
        },
        {
            question: 'Ev sahibiyle nasıl iletişime geçerim?',
            answer: 'Bir ilanı incelerken veya rezervasyon yaptıktan sonra, mesajlar bölümünden veya ilan sayfasındaki iletişim butonu aracılığıyla ev sahibiyle doğrudan konuşabilirsiniz.',
        },
        {
            question: 'Rotaly güvenli mi?',
            answer: 'Evet. Rotaly, hem misafirleri hem de ev sahiplerini koruyan çeşitli güvenlik önlemlerine sahiptir. AirCover koruması sayesinde rezervasyonunuz güvence altındadır.',
        },
        {
            question: 'Ödeme yöntemleri nelerdir?',
            answer: 'Rotaly üzerinden tüm ana kredi kartları, banka kartları ve belirli bölgelerde yerel ödeme yöntemleri (Apple Pay, Google Pay vb.) ile ödeme yapabilirsiniz.',
        },
    ];

    return (
        <ContentLayout
            title={t.faqTitle as string}
            subtitle="Aklınıza takılan tüm soruların cevaplarını burada bulabilirsiniz."
        >
            <div className="bg-card border border-border rounded-3xl p-2 shadow-sm">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="px-6 border-b-border/40">
                            <AccordionTrigger className="text-base py-6 hover:no-underline font-semibold text-foreground">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="mt-16 p-8 bg-secondary rounded-3xl text-center space-y-4">
                <h3 className="text-xl font-bold text-foreground">Başka bir sorunuz mu var?</h3>
                <p className="text-muted-foreground">Destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
                <div className="pt-2">
                    <button className="bg-foreground text-background px-8 py-3 rounded-full font-bold hover:bg-foreground/85 transition-colors">
                        Destek Ekibiyle Görüş
                    </button>
                </div>
            </div>
        </ContentLayout>
    );
}
