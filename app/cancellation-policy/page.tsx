'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CancellationPage() {
  const { t } = useLocale();

  return (
    <ContentLayout title={t.cancellationTitle as string} subtitle={t.cancellationPageSubtitle as string}>
      <div className="space-y-12">
        <section className="prose prose-slate max-w-none">
          <p className="text-muted-foreground leading-relaxed">{t.cancellationIntro as string}</p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold border-b pb-4">{t.cancellationTypesTitle as string}</h2>

          <div className="grid gap-8">
            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.cancellationFlexTitle as string}</h3>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">
                  {t.cancellationFlexBadge as string}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{t.cancellationFlexDesc as string}</p>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-45">{t.cancellationTableTiming as string}</TableHead>
                    <TableHead>{t.cancellationTableRefund as string}</TableHead>
                    <TableHead>{t.cancellationTableNotes as string}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-emerald-600">{t.cancellationFlexR1T as string}</TableCell>
                    <TableCell>{t.cancellationFlexR1R as string}</TableCell>
                    <TableCell>{t.cancellationFlexR1N as string}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-amber-600">{t.cancellationFlexR2T as string}</TableCell>
                    <TableCell>{t.cancellationFlexR2R as string}</TableCell>
                    <TableCell>{t.cancellationFlexR2N as string}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-rose-600">{t.cancellationFlexR3T as string}</TableCell>
                    <TableCell>{t.cancellationFlexR3R as string}</TableCell>
                    <TableCell>{t.cancellationFlexR3N as string}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.cancellationModTitle as string}</h3>
                <Badge variant="secondary" className="px-3 py-1">
                  {t.cancellationModBadge as string}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{t.cancellationModDesc as string}</p>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-45">{t.cancellationTableTiming as string}</TableHead>
                    <TableHead>{t.cancellationTableRefund as string}</TableHead>
                    <TableHead>{t.cancellationTableNotes as string}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-emerald-600">{t.cancellationModR1T as string}</TableCell>
                    <TableCell>{t.cancellationModR1R as string}</TableCell>
                    <TableCell>{t.cancellationModR1N as string}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-amber-600">{t.cancellationModR2T as string}</TableCell>
                    <TableCell>{t.cancellationModR2R as string}</TableCell>
                    <TableCell>{t.cancellationModR2N as string}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-rose-600">{t.cancellationModR3T as string}</TableCell>
                    <TableCell>{t.cancellationModR3R as string}</TableCell>
                    <TableCell>{t.cancellationModR3N as string}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-card border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{t.cancellationStrictTitle as string}</h3>
                <Badge variant="destructive" className="bg-rose-50 text-rose-600 hover:bg-rose-50 border-rose-100 px-3 py-1">
                  {t.cancellationStrictBadge as string}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{t.cancellationStrictDesc as string}</p>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-45">{t.cancellationTableTiming as string}</TableHead>
                    <TableHead>{t.cancellationTableRefund as string}</TableHead>
                    <TableHead>{t.cancellationTableNotes as string}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-emerald-600">{t.cancellationStrR1T as string}</TableCell>
                    <TableCell>{t.cancellationStrR1R as string}</TableCell>
                    <TableCell>{t.cancellationStrR1N as string}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-amber-600">{t.cancellationStrR2T as string}</TableCell>
                    <TableCell>{t.cancellationStrR2R as string}</TableCell>
                    <TableCell>{t.cancellationStrR2N as string}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-rose-600">{t.cancellationStrR3T as string}</TableCell>
                    <TableCell>{t.cancellationStrR3R as string}</TableCell>
                    <TableCell>{t.cancellationStrR3N as string}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-background rounded-3xl p-10 space-y-6">
          <h2 className="text-2xl font-bold text-secondary">{t.cancellationNoticeTitle as string}</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <h4 className="font-bold text-white">{t.cancellationForceTitle as string}</h4>
              <p className="text-gray-300 leading-relaxed">{t.cancellationForceBody as string}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">{t.cancellationRefundTitle as string}</h4>
              <p className="text-gray-300 leading-relaxed">{t.cancellationRefundBody as string}</p>
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
