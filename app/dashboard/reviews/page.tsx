import { ContentCard, ReviewsTable, Section } from '@/components/dashboard/dashboard-ui';
import { REVIEWS } from '@/lib/mock/dashboard';

export default function ReviewsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Değerlendirmeler" description="Puan kırılımı ve yorum yönetimi.">
        <ContentCard title="Yorumlar" description="Temizlik, iletişim ve değer puanları">
          <ReviewsTable reviews={REVIEWS} />
        </ContentCard>
      </Section>
    </div>
  );
}
