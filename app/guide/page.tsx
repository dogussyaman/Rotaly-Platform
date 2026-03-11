'use client';

import { useLocale } from '@/lib/i18n/locale-context';
import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Search,
    MapPin,
    CreditCard,
    FileText,
    ShieldCheck,
    Clock,
    Home,
    HelpCircle,
    Info,
    Zap,
    ChevronRight,
    Plane,
    Globe,
    AlertTriangle,
    Umbrella,
    MessageSquare,
    DollarSign,
    Coffee,
    CheckCircle2,
    XCircle,
    Briefcase,
    GraduationCap,
    Scale
} from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';

// ─── CONTENT DATA ────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: 'booking', title: 'Rezervasyon Süreci', icon: Search },
    { id: 'visa', title: 'Vize ve Belgeler', icon: Plane },
    { id: 'entry', title: 'Giriş ve Sınır Kontrolü', icon: Globe },
    { id: 'payment', title: 'Ödeme ve Fiyatlandırma', icon: DollarSign },
    { id: 'cancellation', title: 'İptal ve Değişiklik', icon: Zap },
    { id: 'rules', title: 'Konaklama Kuralları', icon: Home },
    { id: 'safety', title: 'Güvenlik ve Sigorta', icon: ShieldCheck },
    { id: 'types', title: 'Konaklama Türleri', icon: Coffee },
    { id: 'faq', title: 'Sık Sorulan Sorular', icon: HelpCircle },
    { id: 'tips', title: 'Seyahat İpuçları', icon: BookOpen },
    { id: 'ux', title: 'Kullanıcı Rehberi', icon: MessageSquare },
];

const FAQ_ITEMS = [
    { q: 'Rezervasyonumu nasıl iptal ederim?', a: 'Profilinizdeki "Seyahatlerim" bölümüne gidip ilgili rezervasyonu seçerek "İptal Et" butonuna tıklayabilirsiniz. İade tutarı, seçtiğiniz tesisin iptal politikasına bağlıdır.' },
    { q: 'Check-in saatini değiştirebilir miyim?', a: 'Evet, ancak bu tamamen ev sahibinin onayına bağlıdır. Mesajlar bölümünden ev sahibiyle iletişime geçerek erken giriş veya geç çıkış talebinde bulunabilirsiniz.' },
    { q: 'Evcil hayvan getirebilir miyim?', a: 'İlan detaylarındaki "Ev Kuralları" bölümünde evcil hayvan kabul edilip edilmediği belirtilir. Bazı ev sahipleri ek temizlik ücreti talep edebilir.' },
    { q: 'Vize alamazsam param iade edilir mi?', a: 'Vize reddi genellikle standart iptal koşullarına tabidir. Bu riskten korunmak için "Ücretsiz İptal" seçeneği olan ilanları tercih etmenizi öneririz.' },
    { q: 'Fiyatlara vergiler dahil mi?', a: 'StayHub üzerinde gördüğünüz toplam fiyata genellikle tüm KDV ve konaklama vergileri dahildir. Şehir vergileri bazen tesiste nakit tahsil edilebilir.' },
    { q: 'Kredi kartı bilgilerim güvende mi?', a: 'Evet, StayHub uçtan uca şifreli ödeme altyapısı (PCI-DSS uyumlu) kullanır. Ev sahibi asla kart bilgilerinizi görmez.' },
    { q: 'Hasar depozitosu nedir?', a: 'Bazı ev sahipleri mülkü korumak amacıyla bir depozito talep edebilir. Bu tutar genellikle çıkıştan sonraki 48 saat içinde, bir hasar yoksa kartınıza iade edilir.' },
    { q: 'Anında rezervasyon ne demek?', a: 'Ev sahibinden onay beklemeden, ödemeyi yaptığınız an rezervasyonunuzun kesinleştiği ilanlardır.' },
    { q: 'Fiyatlar kişi başı mı yoksa oda başı mı?', a: 'İlanlar genellikle tüm mekan veya oda bazında fiyatlandırılır, ancak misafir sayısı fiyatı etkileyebilir.' },
    { q: 'Check-in sırasında pasaport göstermek zorunlu mu?', a: 'Yerel yasalar gereği ev sahipleri kimlik bildirimi yapmak zorundadır. Bu nedenle pasaport veya kimlik ibrazı istenecektir.' },
    { q: 'Rezervasyon değişikliğini nasıl yaparım?', a: 'Seyahatlerim bölümünden "Rezervasyonu Düzenle" diyerek tarih veya misafir sayısı değişikliği talep edebilirsiniz. Ev sahibi onaylarsa fiyat farkı yansıtılır.' },
    { q: 'Ulaşım hizmeti fiyata dahil mi?', a: 'Aksini ilan açıklamasında belirtilmediği sürece ulaşım fiyata dahil değildir.' },
    { q: 'Şirketim için fatura alabilir miyim?', a: 'Evet, ödeme sırasında kurumsal fatura bilgilerini girerek e-fatura oluşturulmasını sağlayabilirsiniz.' },
    { q: 'Bebek yatağı sağlanıyor mu?', a: 'Olanaklar bölümünde "Bebek yatağı" olup olmadığını kontrol edin veya ev sahibine mesaj atın.' },
    { q: 'Giriş şifresini ne zaman alacağım?', a: 'Giriş kodları veya anahtar teslim bilgileri genellikle varıştan 24 saat önce sizinle paylaşılır.' },
    { q: 'İndes edilemez (Non-refundable) ne demek?', a: 'Bu tür rezervasyonlar daha ucuzdur ancak iptal durumunda hiçbir iade yapılmaz.' },
    { q: 'WiFi hızı yeterli mi?', a: 'İş amaçlı seyahat edenler için ilanlarda WiFi hızı test sonuçlarını paylaşan ev sahiplerini tercih edebilirsiniz.' },
    { q: 'Evde eksik veya bozuk bir şey var, ne yapmalıyım?', a: 'Durumu hemen (ilk 24 saat içinde) fotoğraflayıp ev sahibine ve StayHub desteğine bildirin.' },
    { q: 'Sigara içilebilir mi?', a: 'Çoğu kapalı mekanda sigara yasaktır. Balkon veya bahçe kullanımı için ev kurallarına bakın.' },
    { q: 'Geç check-in yapabilir miyim?', a: 'Self check-in (şifreli giriş) olan evlerde istediğiniz saatte girebilirsiniz. Manuel teslim varsa ev sahibiyle önceden saat belirleyin.' },
    { q: 'Schengen vizesi için rezervasyon çıktısı geçerli mi?', a: 'Evet, StayHub üzerinden aldığınız onay belgesi konsolosluklarda konaklama kanıtı olarak kabul edilir.' },
    { q: 'Ödeme yaptıktan sonra ek ücret çıkar mı?', a: 'İlan detayında belirtilmeyen, zorunlu olmayan hiçbir ek ücret ödemek zorunda değilsiniz.' },
    { q: 'Ev sahibi rezervasyonumu iptal ederse ne olur?', a: 'StayHub paranızı anında iade eder veya benzer bir yere yerleşmeniz için size ek kredi sağlar.' },
    { q: 'Yorum yapmak zorunlu mu?', a: 'Zorunlu değil ama topluluğa yardımcı olmak için teşvik edilir. Konaklamadan sonraki 14 gün içinde yorum yapabilirsiniz.' },
    { q: 'Hostel ve Apart arasındaki fark nedir?', a: 'Hostellerde genellikle paylaşımlı yatakhaneler bulunur; apartlar ise mutfağı ve özel alanı olan bağımsız dairelerdir.' },
    { q: 'Cleaning fee (Temizlik ücreti) kime gider?', a: 'Bu ücret, mülkün bir sonraki misafir için profesyonelce temizlenmesi amacıyla ev sahibine iletilir.' },
    { q: 'Service fee neden alınıyor?', a: 'Bu ücret, StayHub platformunun 7/24 destek hizmeti, güvenli ödeme ve sigorta sistemlerini sürdürebilmesi için alınır.' },
    { q: 'Gürültü şikayeti gelirse ne olur?', a: 'Ev kurallarına uymamak rezervasyonunuzun tazminatsız iptaline ve hesabınızın askıya alınmasına neden olabilir.' },
    { q: 'Mutfakta temel malzemeler var mı?', a: 'Tuz, yağ, kahve gibi temel malzemeler çoğu ev sahibinde bulunur ama garanti değildir.' },
    { q: 'Rezervasyon iptal edildiğinde iade ne zaman yatar?', a: 'İptal onaylandığında bankanıza bağlı olarak 3-15 iş günü içinde iade gerçekleşir.' },
];

export default function GuidePage() {
    const { t } = useLocale();
    const [activeSection, setActiveSection] = useState('booking');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaqs = useMemo(() => {
        if (!searchQuery) return FAQ_ITEMS.slice(0, 10);
        return FAQ_ITEMS.filter(f =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const scrollTo = (id: string) => {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            <SearchHeader />

            <main className="pt-24 pb-32">
                {/* Modern Library Hero */}
                <section className="bg-foreground text-background py-20 px-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                        <BookOpen className="w-full h-full rotate-12 translate-x-12 translate-y-12" />
                    </div>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Badge className="bg-amber-500 text-foreground border-none font-black mb-6 px-4 py-1">PROFESYONEL SEYAHAT KÜTÜPHANESİ</Badge>
                            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">Nasıl Yardımcı <br /><span className="text-amber-500">Olabiliriz?</span></h1>
                        </motion.div>

                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Vize, iptal, ödeme veya konaklama hakkında bir soru yazın..."
                                className="w-full h-18 pl-16 pr-8 rounded-3xl bg-secondary/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-lg font-medium backdrop-blur-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-32 space-y-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 pl-4">Kategoriler</h3>
                            {SECTIONS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${activeSection === s.id
                                        ? 'bg-amber-500 text-foreground shadow-lg shadow-amber-500/20'
                                        : 'hover:bg-muted text-muted-foreground'
                                        }`}
                                >
                                    <s.icon className={`w-4 h-4 ${activeSection === s.id ? 'text-foreground' : 'text-muted-foreground'}`} />
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-32">

                        {/* 1. Rezervasyon Süreci */}
                        <section id="booking" className="scroll-mt-32 space-y-10">
                            <div className="flex items-center gap-4 text-amber-500">
                                <div className="p-3 rounded-2xl bg-amber-100"><Search className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Rezervasyon Süreci</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Nasıl Adım Atılır?</h3>
                                    <p className="text-muted-foreground leading-relaxed">StayHub üzerinden rezervasyon yapmak oldukça basittir. İstediğiniz şehri yazın, tarihlerinizi seçin ve misafir sayısını belirleyin. Filtreleri kullanarak (havuz, WiFi, mutfak vb.) kendinize en uygun mülkü bulun.</p>
                                    <div className="p-6 bg-muted/40 rounded-3xl border border-dashed border-border space-y-4">
                                        <div className="text-sm font-black uppercase">Fiyat Hesaplama Örneği:</div>
                                        <div className="space-y-2 text-sm font-medium">
                                            <div className="flex justify-between"><span>Gecelik Ücret (5 Gece x ₺4.000)</span><span>₺20.000</span></div>
                                            <div className="flex justify-between"><span>Temizlik Ücreti (Tek seferlik)</span><span>₺850</span></div>
                                            <div className="flex justify-between"><span>StayHub Hizmet Bedeli (~%12)</span><span>₺2.400</span></div>
                                            <div className="flex justify-between border-t pt-2 font-black text-lg"><span>Toplam</span><span>₺23.250</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Rezervasyon Türleri</h3>
                                    <div className="space-y-4">
                                        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100">
                                            <h4 className="font-bold mb-1">Anında Rezervasyon</h4>
                                            <p className="text-xs text-muted-foreground">Ev sahibinden onay beklemeden anında kesinleşen rezervasyonlardır. Acil seyahatler için idealdir.</p>
                                        </div>
                                        <div className="p-5 rounded-3xl bg-sky-50 border border-sky-100">
                                            <h4 className="font-bold mb-1">Onay Gereken Rezervasyon</h4>
                                            <p className="text-xs text-muted-foreground">Ev sahibine bir talep gönderirsiniz, ev sahibi 24 saat içinde yanıt verir. Daha butik veya özel mülkler için yaygındır.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Vize ve Seyahat Belgeleri */}
                        <section id="visa" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-sky-600">
                                <div className="p-3 rounded-2xl bg-sky-100"><Plane className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Vize ve Seyahat Belgeleri</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
                                        <Badge className="mb-4">SCHENGEN VİZESİ</Badge>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Avrupa Birliği ülkelerinin çoğunu kapsar. 6 aylık dönemde en fazla 90 gün kalış hakkı verir. Biyometrik veri (parmak izi) zorunludur.</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
                                        <Badge className="mb-4">E-VİZE (ONLINE)</Badge>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Büyükelçiliğe gitmeden, online form doldurarak alınan hızlı vize türüdür. Genellikle 24-72 saat içinde onaylanır.</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-card border border-border shadow-sm">
                                        <Badge className="mb-4">KAPIDA VİZE</Badge>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Varış havaalanında veya limanda ücret karşılığı alınan vizedir. Pasaportunuzun en az 6 ay geçerliği olması istenir.</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-foreground text-background rounded-[3rem] space-y-6">
                                    <h3 className="text-2xl font-black">Türk Vatandaşları İçin Vize Rehberi</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm opacity-80">
                                        <div className="space-y-4">
                                            <h4 className="font-black text-amber-500 flex items-center gap-2"><Globe className="w-4 h-4" /> Vizesiz Başlıca Ülkeler</h4>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Sırbistan, Bosna-Hersek, Karadağ, Arnavutluk</li>
                                                <li>Fas, Tunus, Ürdün, Lübnan</li>
                                                <li>Gürcistan (Kimlikle Giriş), Azerbaycan (Kimlikle Giriş)</li>
                                                <li>Brezilya, Arjantin, Japonya (90 Güne Kadar)</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-black text-amber-500 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Kritik Pasaport Kuralları</h4>
                                            <p>Pasaportunuzun seyahat bitişinden itibaren en az **6 ay** daha geçerli olması dünya genelindeki standart bir kuraldır. Bazı ülkeler pasaportta en az 2 boş sayfa olmasını şart koşar.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Giriş Kuralları */}
                        <section id="entry" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-emerald-600">
                                <div className="p-3 rounded-2xl bg-emerald-100"><Globe className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Giriş ve Sınır Kontrolü</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop" alt="Passport Control" fill className="object-cover" />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black">Sınırda Hazır Bulundurun</h3>
                                    <ul className="space-y-4">
                                        {[
                                            { label: 'Konaklama Onayı', desc: 'StayHub rezervasyon belgenizin çıktısı veya dijital hali.' },
                                            { label: 'Dönüş Bileti', desc: 'Ülkeden çıkacağınızı kanıtlayan uçak/otobüs bileti.' },
                                            { label: 'Finansal Yeterlilik', desc: 'Günlük yaklaşık 50-100€ arası bütçeniz olduğunu gösterir nakit veya kart.' },
                                            { label: 'Seyahat Sigortası', desc: 'Özellikle Schengen bölgesi için zorunludur.' },
                                        ].map((item) => (
                                            <li key={item.label} className="p-5 rounded-2xl bg-muted/40 border border-border/50">
                                                <div className="font-black text-sm mb-1">{item.label}</div>
                                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 4. Ödeme ve Fiyatlandırma */}
                        <section id="payment" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-rose-600">
                                <div className="p-3 rounded-2xl bg-rose-100"><CreditCard className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Ödeme ve Fiyatlandırma</h2>
                            </div>

                            <div className="bg-muted/30 p-10 rounded-[3rem] space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold flex items-center gap-2 text-foreground"><ShieldCheck className="w-5 h-5" /> Güvenli Ödeme</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">Tüm ödemeler StayHub platformu aracılığıyla yapılır. Ev sahibine doğrudan elden para vermeniz asla istenmez. Bu, hem sizin hem de ev sahibinin güvenliğini korur.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold flex items-center gap-2 text-foreground"><Scale className="w-5 h-5" /> Vergi ve Ücretler</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">Ekranımızda gördüğünüz "Toplam Fiyat" her şeyi içerir. Ancak bazı şehirlerde belediye tarafından alınan "Şehir Vergisi" tesiste nakit olarak talep edilebilir (ilan detayında belirtilir).</p>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-dashed border-border flex flex-wrap gap-4">
                                    {['Mastercard', 'Visa', 'American Express', 'PayPal', 'Apple Pay'].map((p) => (
                                        <div key={p} className="px-4 py-2 bg-white rounded-xl border border-border text-[10px] font-black uppercase text-muted-foreground">{p}</div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 5. İptal Politikaları */}
                        <section id="cancellation" className="scroll-mt-32 space-y-10">
                            <div className="flex items-center gap-4 text-amber-500">
                                <div className="p-3 rounded-2xl bg-amber-100"><Zap className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">İptal ve Değişiklik</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">!</div>
                                    <h4 className="font-bold">Esnek (Süper)</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Varıştan 24 saat öncesine kadar %100 iade. Güvenli ve risk almayan seyahatler için.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black">~</div>
                                    <h4 className="font-bold">Orta</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Varıştan 5 gün öncesine kadar ücretsiz iptal. En dengeli tercih.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-rose-50 border border-rose-100 space-y-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black">X</div>
                                    <h4 className="font-bold">Sıkı / İadesiz</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">İptal durumunda iade yapılmaz veya çok az yapılır. En ekonomik tercihtir.</p>
                                </div>
                            </div>
                        </section>

                        {/* 6. Konaklama Kuralları */}
                        <section id="rules" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-orange-600">
                                <div className="p-3 rounded-2xl bg-orange-100"><Home className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Konaklama Kuralları</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="w-5 h-5" /> Giriş ve Çıkış (Check-in/out)</h3>
                                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                                            <li className="flex justify-between border-b pb-2"><span>Standart Giriş (Check-in)</span><span className="text-foreground">14:00 - 16:00</span></li>
                                            <li className="flex justify-between border-b pb-2"><span>Standart Çıkış (Check-out)</span><span className="text-foreground">10:00 - 12:00</span></li>
                                            <li className="flex flex-col gap-2 pt-2">
                                                <span className="text-foreground font-bold">Erken Giriş / Geç Çıkış:</span>
                                                <span>Bu talepler tamamen ev sahibinin onayına ve müsaitlik durumuna bağlıdır. Bazı ev sahipleri bunun için ek bir saatlik ücret talep edebilir.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Yasaklar ve Sınırlar</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-muted/30">
                                                <div className="font-bold text-xs mb-1">Parti Yasağı</div>
                                                <p className="text-[10px] text-muted-foreground">StayHub genelinde tüm izinsiz partiler ve etkinlikler yasaktır.</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-muted/30">
                                                <div className="font-bold text-xs mb-1">Sessizlik Saatleri</div>
                                                <p className="text-[10px] text-muted-foreground">Genellikle 22:00 - 08:00 arası komşuların huzuru için önemlidir.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black">Ev Sahibi Kuralları</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Her mülkün kendine has kuralları olabilir. Rezervasyon yapmadan önce "Ev Kuralları" bölümünü mutlaka okuyun.</p>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Sigara Kullanımı', desc: 'Sadece açık alanlarda veya balkonlarda izin verilebilir, iç mekanda yasaktır.' },
                                            { label: 'Evcil Hayvanlar', desc: 'Evcil hayvan dostu mülklerde bile bazı cins kısıtlamaları veya ek depozito olabilir.' },
                                            { label: 'Hasar Tahsilatı', desc: 'Mülkte meydana gelen kalıcı hasarlar veya kayıp anahtarlar misafirden tahsil edilir.' },
                                            { label: 'Ek Misafir', desc: 'Rezervasyonda belirtilmeyen kişilerin konaklaması ek ücret veya iptal sebebidir.' },
                                        ].map((rule) => (
                                            <div key={rule.label} className="flex gap-4 p-5 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <div>
                                                    <div className="text-sm font-bold">{rule.label}</div>
                                                    <div className="text-xs text-muted-foreground">{rule.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 7. Güvenlik ve Sigorta */}
                        <section id="safety" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-sky-600">
                                <div className="p-3 rounded-2xl bg-sky-100"><ShieldCheck className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Güvenlik ve Sigorta</h2>
                            </div>

                            <div className="p-10 bg-sky-50 rounded-[3rem] border border-sky-100">
                                <div className="max-w-3xl space-y-6">
                                    <h3 className="text-3xl font-black text-sky-900">Seyahatinizi Koruma Altına Alın</h3>
                                    <p className="text-sky-800/70 font-medium">Bilinmeyen durumlara karşı kendinizi ve ailenizi korumak lüks değil, bir gerekliliktir. İşte bilmeniz gereken temel sigorta türleri:</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <h4 className="font-black text-sky-900 flex items-center gap-2"><Umbrella className="w-4 h-4" /> Sağlık Sigortası</h4>
                                            <p className="text-xs text-sky-800/60 leading-relaxed">Yurtdışındaki acil hastane masraflarınızı karşılar. Vizeli seyahatlerde (Schengen vb.) genellikle zorunludur.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-black text-sky-900 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Bagaj ve Eşya</h4>
                                            <p className="text-xs text-sky-800/60 leading-relaxed">Kaybolan, geç gelen veya hasar gören valizleriniz için tazminat sağlar.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-black text-sky-900 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Ev Sahibi Koruma</h4>
                                            <p className="text-xs text-sky-800/60 leading-relaxed">StayHub tarafından ev sahiplerine sağlanan, mülk hasarlarını kapsayan güvence programıdır.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-black text-sky-900 flex items-center gap-2"><Info className="w-4 h-4" /> Acil Durum İletişimi</h4>
                                            <p className="text-xs text-sky-800/60 leading-relaxed">Gideceğiniz ülkenin yerel acil numaralarını (112, 911 vb.) ve bölge polis amirliğini mutlaka not edin.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 8. Konaklama Türleri */}
                        <section id="types" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-amber-500">
                                <div className="p-3 rounded-2xl bg-amber-100"><Home className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Konaklama Türleri</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { title: 'Apartman Dairesi', desc: 'Ev konforu ve mutfak arayan aileler için ideal.', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop' },
                                    { title: 'Villa', desc: 'Havuzlu, lüks ve tam müstakil özel bir deneyim.', image: 'https://images.unsplash.com/photo-1580587771525-78b9bed22c83?w=600&h=400&fit=crop' },
                                    { title: 'Bungalov', desc: 'Doğa ile iç içe, ahşap ve romantik kaçamaklar.', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop' },
                                    { title: 'Tiny House', desc: 'Minimalizm ve şıklığın birleştiği yeni nesil akım.', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop' },
                                    { title: 'Hostel', desc: 'Sırt çantalı gezginler için sosyal ve ekonomik.', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop' },
                                    { title: 'Glamping', desc: 'Kamp ruhuyla beş yıldızlı otel lüksünün dansı.', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=400&fit=crop' },
                                ].map((t) => (
                                    <div key={t.title} className="group relative rounded-3xl overflow-hidden aspect-square shadow-lg">
                                        <Image src={t.image} alt={t.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                            <h4 className="text-xl font-black mb-2">{t.title}</h4>
                                            <p className="text-xs opacity-80 leading-relaxed">{t.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 9. SSS */}
                        <section id="faq" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-sky-500">
                                <div className="p-3 rounded-2xl bg-sky-100"><HelpCircle className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Sık Sorulan Sorular</h2>
                            </div>

                            <div className="space-y-4">
                                {filteredFaqs.map((f, i) => (
                                    <details key={i} className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:border-amber-500/30">
                                        <summary className="flex cursor-pointer items-center justify-between p-6 list-none">
                                            <h4 className="font-bold pr-6 group-open:text-amber-500 transition-colors">{f.q}</h4>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-90" />
                                        </summary>
                                        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                                            {f.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                            {filteredFaqs.length === 0 && (
                                <p className="text-center text-muted-foreground py-10">Aradığınız kriterlere uygun soru bulunamadı.</p>
                            )}
                        </section>

                        {/* 10. Seyahat İpuçları */}
                        <section id="tips" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-indigo-600">
                                <div className="p-3 rounded-2xl bg-indigo-100"><BookOpen className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Seyahat İpuçları</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 space-y-6">
                                    <h3 className="text-2xl font-black flex items-center gap-3"><Clock className="w-6 h-6" /> Ne Zaman Gitmeli?</h3>
                                    <p className="text-muted-foreground leading-relaxed">Pik sezonun hemen öncesi veya sonrası (**Shoulder Season**) hem fiyatların daha düşük olduğu hem de kalabalığın azaldığı en iyi zamandır. Hafta içi rezervasyonlar genellikle %15-20 daha ucuzdur.</p>
                                </div>
                                <div className="p-10 bg-amber-50 rounded-[3rem] border border-amber-100 space-y-6">
                                    <h3 className="text-2xl font-black flex items-center gap-3"><Umbrella className="w-6 h-6" /> Kültürel Etiket</h3>
                                    <p className="text-muted-foreground leading-relaxed">Gideceğiniz ülkenin selamlaşma adetlerini ve bahşiş (tipping) kültürünü önceden öğrenin. Bazı ülkelerde hesabın %10'u beklenirken, bazı yerlerde bahşiş hakaret kabul edilebilir.</p>
                                </div>
                            </div>
                        </section>

                        {/* 11. Kullanıcı Deneyimi Rehberi */}
                        <section id="ux" className="scroll-mt-32 space-y-12">
                            <div className="flex items-center gap-4 text-rose-600">
                                <div className="p-3 rounded-2xl bg-rose-100"><MessageSquare className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-foreground">Kullanıcı Rehberi</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black">Doğru Seçimi Yapmak</h3>
                                    <p className="text-muted-foreground font-medium">Binlerce ilan arasından size en uygun olanı bulmak için şu kriterlere dikkat edin:</p>

                                    <div className="space-y-4">
                                        {[
                                            { title: 'Yorumları Analiz Edin', desc: 'Sadece puana bakmayın, en son yapılan 3-4 yorumu mutlaka okuyun.' },
                                            { title: 'Ev Sahibiyle İletişim', desc: 'Rezervasyon öncesi aklınıza takılanları sorun. Yanıt hızı ev sahibinin ilgisini belli eder.' },
                                            { title: 'Konum Kontrolü', desc: 'Mülkün toplu taşımaya veya marketlere uzaklığını harita üzerinden doğrulayın.' },
                                            { title: 'Check-in Kolaylığı', desc: 'Self check-in (akıllı kilit) olan mülkler daha esnek giriş imkanı sunar.' },
                                        ].map((tip) => (
                                            <div key={tip.title} className="flex gap-4 p-5 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors group">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                                                    <Info className="w-4 h-4 text-rose-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">{tip.title}</div>
                                                    <div className="text-xs text-muted-foreground">{tip.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative aspect-square">
                                    <div className="absolute inset-0 bg-rose-100 rounded-[4rem] group overflow-hidden">
                                        <Image src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=800&fit=crop" alt="Experience" fill className="object-cover mix-blend-multiply opacity-80" />
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-border max-w-[200px]">
                                        <span className="text-3xl font-black text-rose-600">98%</span>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-2">Müşteri memnuniyet oranı</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            <MainFooter />
        </div>
    );
}
