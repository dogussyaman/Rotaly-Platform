import { ContentCard, ReviewsTable, Section } from '@/components/dashboard/dashboard-ui';
import { REVIEWS } from '@/lib/mock/dashboard';

export default function ReviewsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Değerlendirmeler" description="Puan kırılımı ve yorum yönetimi.">
        <ContentCard title="Yorumlar" description="Temizlik, iletişim ve değer puanları">
          <ReviewsTable reviews={REVIEWS} />
        </ContentCard>
      </Section>
    </div>
  );
}

