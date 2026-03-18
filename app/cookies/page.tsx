'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { motion } from 'framer-motion';

export default function CookiesPage() {
  const sections = [
    {
      title: 'Zorunlu Çerezler',
      content:
        'Bu çerezler, web sitesinin düzgün çalışması için zorunludur. Oturum yönetimi, güvenlik ve temel işlevler için kullanılır. Bu çerezler devre dışı bırakılamaz; ancak tarayıcınızı bu çerezleri engelleyecek şekilde ayarlayabilirsiniz.',
      examples: ['Oturum tanımlayıcısı (session token)', 'CSRF güvenlik tokenı', 'Dil ve bölge tercihleri'],
    },
    {
      title: 'Analitik Çerezler',
      content:
        'Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur. Hangi sayfaların ne sıklıkla ziyaret edildiği, kullanıcıların sitede ne kadar zaman geçirdiği gibi bilgileri toplar. Tüm veriler anonim olarak işlenir.',
      examples: ['Google Analytics', 'Vercel Analytics', 'Sayfa görüntüleme istatistikleri'],
    },
    {
      title: 'Fonksiyonel Çerezler',
      content:
        'Kullanıcı deneyimini iyileştirmek amacıyla tercihlerinizi hatırlar. Örneğin tema seçiminiz, dil ayarınız ve arama filtreleriniz bu çerezler aracılığıyla korunur.',
      examples: ['Tema tercihi (açık/koyu)', 'Oturum kapat uyarısı', 'Arama geçmişi ve filtreler'],
    },
    {
      title: 'Pazarlama Çerezleri',
      content:
        'Size ilgi alanlarınıza uygun reklamlar göstermek ve kampanyalarımızın etkinliğini ölçmek için kullanılır. Bu çerezleri kabul etmezseniz yine de reklamlar görebilirsiniz, ancak bunlar size özel olmayacaktır.',
      examples: ['Yeniden hedefleme (retargeting)', 'Kampanya performans takibi', 'Ortak platform entegrasyonları'],
    },
    {
      title: 'Çerez Tercihlerinizi Yönetme',
      content:
        'Tarayıcı ayarlarınızdan çerezleri istediğiniz zaman silebilir veya engelleyebilirsiniz. Zorunlu çerezler dışındakileri reddetmeniz bazı özelliklerin çalışmamasına neden olabilir. Tercihlerinizi dilediğiniz zaman sayfanın altındaki "Çerez Ayarları" bağlantısından güncelleyebilirsiniz.',
      examples: [
        'Chrome: Ayarlar → Gizlilik ve Güvenlik → Çerezler',
        'Firefox: Seçenekler → Gizlilik ve Güvenlik',
        'Safari: Tercihler → Gizlilik',
      ],
    },
  ];

  return (
    <ContentLayout
      title="Çerez Politikası"
      subtitle="Rotaly'nin çerezleri nasıl kullandığını ve verilerinizi nasıl koruduğunu öğrenin."
    >
      <div className="space-y-16 py-10">
        <section className="prose prose-slate prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Rotaly olarak, web sitemizde çerezler (cookies) ve benzer izleme teknolojileri kullanmaktayız. Bu politika,
            hangi çerezleri neden kullandığımızı ve KVKK kapsamındaki haklarınızı açıklamaktadır. Sitemizi kullanmaya
            devam ederek çerez politikamızı kabul etmiş sayılırsınız.
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
              <p className="text-muted-foreground text-lg leading-relaxed pl-11">{section.content}</p>
              {section.examples && (
                <ul className="pl-11 space-y-1.5">
                  {section.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-foreground/40" />
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <section className="bg-muted p-10 rounded-[2.5rem] mt-20 text-center space-y-6">
          <h4 className="text-xl font-bold">Sorularınız mı var?</h4>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Çerez politikamızla ilgili herhangi bir sorunuz varsa lütfen{' '}
            <a href="mailto:privacy@rotaly.com" className="underline font-semibold">
              privacy@rotaly.com
            </a>{' '}
            adresinden bize ulaşın.
          </p>
        </section>
      </div>
    </ContentLayout>
  );
}
