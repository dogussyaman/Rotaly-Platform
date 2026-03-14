import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';

const FAQ = [
  { q: 'Rezervasyon durumu ne zaman güncellenir?', a: 'Mock veride sabit. Gerçekte webhook/cron ile güncellenir.' },
  { q: 'Kupon kullanım limitleri nasıl çalışır?', a: 'Kuponlar kullanım kayıtlarıyla takip edilir.' },
  { q: 'Mesajlar neden okunmamış görünüyor?', a: 'Okunma durumu mesaj tablosundan yönetilir.' },
];

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Yardım" description="Sık sorulan sorular ve destek.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="SSS" description="En sık gelen sorular">
            <div className="space-y-4">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <p className="font-medium">{item.q}</p>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard title="Destek" description="Bizimle iletişime geçin">
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Canlı destek ve ticket sistemi yakında eklenecek. Şimdilik iletişim sayfasını kullanabilirsiniz.
              </p>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/contact">İletişim</Link>
              </Button>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
