'use client';

import { ContentLayout } from '@/components/layout/content-layout';
import { useLocale } from '@/lib/i18n/locale-context';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CancellationPage() {
    const { t } = useLocale();

    return (
        <ContentLayout
            title={t.cancellationTitle as string}
            subtitle="StayHub üzerinden yapılan tüm rezervasyonlar için geçerli iptal ve iade koşullarımız aşağıda detaylandırılmıştır."
        >
            <div className="space-y-12">
                {/* Intro */}
                <section className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                        Misafirlerimizin ve ev sahiplerimizin güvenini korumak en öncelikli görevimizdir. StayHub'daki her ilan, rezervasyon sırasında belirtilen belirli bir iptal politikasına tabidir. Lütfen rezervasyonunuzu onaylamadan önce bu politikayı dikkatlice inceleyin.
                    </p>
                </section>

                {/* Policy Types */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold border-b pb-4">İptal Politikası Türleri</h2>

                    <div className="grid gap-8">
                        {/* Esnek */}
                        <div className="bg-card border rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Esnek (Flexible)</h3>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1">En Çok Tercih Edilen</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">Misafir dostu bu politika, seyahat planları değişebilecek kişiler için idealdir.</p>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[180px]">Zamanlama</TableHead>
                                        <TableHead>İade Oranı</TableHead>
                                        <TableHead>Notlar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold text-emerald-600">Girişe 48 sa kala</TableCell>
                                        <TableCell>%100 İade</TableCell>
                                        <TableCell>Hizmet bedeli dahil tam iade.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-semibold text-amber-600">24 sa - 48 sa</TableCell>
                                        <TableCell>%50 İade</TableCell>
                                        <TableCell>İlk gece ücreti kesilir.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-semibold text-rose-600">24 sa'den az</TableCell>
                                        <TableCell>İade Yok</TableCell>
                                        <TableCell>Ödemenin tamamı ev sahibine aktarılır.</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Orta */}
                        <div className="bg-card border rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Orta (Moderate)</h3>
                                <Badge variant="secondary" className="px-3 py-1">Dengeli</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">Hem ev sahibini hem de misafiri koruyan dengeli bir yaklaşım.</p>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[180px]">Zamanlama</TableHead>
                                        <TableHead>İade Oranı</TableHead>
                                        <TableHead>Notlar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold text-emerald-600">5 gün öncesi</TableCell>
                                        <TableCell>%100 İade</TableCell>
                                        <TableCell>Tam iade yapılır.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-semibold text-amber-600">2-5 gün arası</TableCell>
                                        <TableCell>%50 İade</TableCell>
                                        <TableCell>Kalan günler için %50 iade.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-semibold text-rose-600">48 sa'den az</TableCell>
                                        <TableCell>İade Yok</TableCell>
                                        <TableCell>İade yapılmaz.</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Sıkı */}
                        <div className="bg-card border rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Sıkı (Strict)</h3>
                                <Badge variant="destructive" className="bg-rose-50 text-rose-600 hover:bg-rose-50 border-rose-100 px-3 py-1">En Katı</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">Popüler mülkler ve tatil sezonları için tercih edilen politikadır.</p>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[180px]">Zamanlama</TableHead>
                                        <TableHead>İade Oranı</TableHead>
                                        <TableHead>Notlar</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold text-emerald-600">30 gün öncesi</TableCell>
                                        <TableCell>%100 İade</TableCell>
                                        <TableCell>İşlem ücreti hariç tam iade.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-semibold text-amber-600">7-30 gün arası</TableCell>
                                        <TableCell>%50 İade</TableCell>
                                        <TableCell>Ücretin yarısı iade edilir.</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-semibold text-rose-600">7 günden az</TableCell>
                                        <TableCell>İade Yok</TableCell>
                                        <TableCell>İade imkanı sunulmamaktadır.</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>

                {/* Extra Info */}
                <section className="bg-foreground text-background rounded-3xl p-10 space-y-6">
                    <h2 className="text-2xl font-bold text-secondary">Önemli Bildirimler</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-sm">
                        <div className="space-y-3">
                            <h4 className="font-bold text-white">Pandemi ve Mücbir Sebepler</h4>
                            <p className="text-gray-300 leading-relaxed">
                                Doğal afetler veya hükümet kararları gibi öngörülemeyen durumlarda StayHub, ev sahibinin kendi politikasından bağımsız olarak misafire tam iade hakkı tanıyabilir.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-bold text-white">İade Süreci</h4>
                            <p className="text-gray-300 leading-relaxed">
                                Onaylanan iadeler, bankanıza bağlı olarak genellikle 5-10 iş günü içinde orijinal ödeme yönteminize yansır.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </ContentLayout>
    );
}
