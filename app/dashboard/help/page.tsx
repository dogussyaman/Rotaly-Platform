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
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-6 xl:grid-cols-2">
          <ContentCard title="SSS" description="En sık gelen sorular">
            <div className="space-y-4">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <p className="text-sm font-medium text-[#111]">{item.q}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard title="Destek" description="Bizimle iletişime geçin">
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Canlı destek ve ticket sistemi yakında eklenecek. Şimdilik iletişim sayfasını kullanabilirsiniz.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-lg border-[#0d9488] text-[#0d9488] hover:bg-[#f0fdfa]">
                <Link href="/contact">İletişim</Link>
              </Button>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
