'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';
import { createListing, type UpdateListingInput } from '@/lib/supabase/listings';
import { fetchHostByUserId } from '@/lib/supabase/host';

export default function NewListingPage() {
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const [hostId, setHostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<UpdateListingInput>({
    title: '',
    description: '',
    propertyType: 'apartment',
    city: '',
    country: '',
    pricePerNight: 0,
    cleaningFee: 0,
    baseGuests: 1,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    isActive: true,
  });

  useEffect(() => {
    if (!profile?.id) return;
    fetchHostByUserId(profile.id).then((host) => {
      setHostId(host?.hostId ?? null);
      setLoading(false);
    });
  }, [profile?.id]);

  const handleCreate = async () => {
    if (!hostId) {
      alert('Host bilgisi yüklenemiyor');
      return;
    }

    if (!formData.title || !formData.city || !formData.country) {
      alert('Başlık, şehir ve ülke gerekli');
      return;
    }

    setCreating(true);
    const listingId = await createListing(hostId, formData);
    setCreating(false);

    if (listingId) {
      router.push(`/dashboard/listings/${listingId}`);
    } else {
      alert('İlan oluşturulamadı');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!hostId) {
    return (
      <Section>
        <ContentCard title="Host Profili" description="Host profili bulunamadı">
          <p className="text-sm text-muted-foreground">
            İlan oluşturabilmek için bir host profili gereklidir.
          </p>
          <Button className="mt-4" onClick={() => router.back()}>
            Geri Dön
          </Button>
        </ContentCard>
      </Section>
    );
  }

  return (
    <Section>
      <ContentCard title="Yeni İlan Oluştur" description="Yeni bir emlak ilanı oluşturun">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Başlık *
            </label>
            <Input
              value={formData.title ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
              placeholder="örn. Müstakil Ev, Şehir Merkezi İstanbul"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Açıklama
            </label>
            <Textarea
              value={formData.description ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              placeholder="Özellikler, konum ve sunulan hizmetleri açıklayın..."
              rows={4}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Emlak Türü
            </label>
            <select
              value={formData.propertyType ?? 'apartment'}
              onChange={(e) => setFormData((f) => ({ ...f, propertyType: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="apartment">Apartman</option>
              <option value="house">Ev</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="hotel">Otel</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Şehir *
            </label>
            <Input
              value={formData.city ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
              placeholder="örn. İstanbul"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Ülke *
            </label>
            <Input
              value={formData.country ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, country: e.target.value }))}
              placeholder="örn. Türkiye"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Gecelik Fiyat (₺)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.pricePerNight ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  pricePerNight: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Temizlik Ücreti (₺)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.cleaningFee ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  cleaningFee: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Yatak Odası Sayısı
            </label>
            <Input
              type="number"
              min={0}
              value={formData.bedrooms ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  bedrooms: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Yatak Sayısı
            </label>
            <Input
              type="number"
              min={0}
              value={formData.beds ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  beds: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Banyo Sayısı
            </label>
            <Input
              type="number"
              min={0}
              value={formData.bathrooms ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  bathrooms: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Fiyata Dahil Misafir Sayısı
            </label>
            <Input
              type="number"
              min={1}
              value={formData.baseGuests ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  baseGuests: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Maksimum Misafir Sayısı
            </label>
            <Input
              type="number"
              min={1}
              value={formData.maxGuests ?? ''}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  maxGuests: parseInt(e.target.value, 10) || 2,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              'İlan Oluştur'
            )}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
        </div>
      </ContentCard>
    </Section>
  );
}
