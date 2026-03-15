'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import { Loader2 } from 'lucide-react';
import type { UpdateListingInput } from '@/lib/supabase/listings';

interface ListingEditFormProps {
  editForm: UpdateListingInput;
  setEditForm: React.Dispatch<React.SetStateAction<UpdateListingInput>>;
  savePending: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function ListingEditForm({
  editForm,
  setEditForm,
  savePending,
  onSave,
  onCancel,
}: ListingEditFormProps) {
  return (
    <ContentCard
      title="İlanı düzenle"
      description="Değişiklikleri kaydedin"
      className="mt-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Başlık</label>
          <Input
            value={editForm.title ?? ''}
            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Başlık"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Gecelik fiyat (₺)
          </label>
          <Input
            type="number"
            min={0}
            value={editForm.pricePerNight ?? ''}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                pricePerNight: parseFloat(e.target.value) || undefined,
              }))
            }
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Açıklama</label>
          <textarea
            className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            value={editForm.description ?? ''}
            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Açıklama"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Şehir</label>
          <Input
            value={editForm.city ?? ''}
            onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="Şehir"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Ülke</label>
          <Input
            value={editForm.country ?? ''}
            onChange={(e) => setEditForm((f) => ({ ...f, country: e.target.value }))}
            placeholder="Ülke"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Adres</label>
          <Input
            value={editForm.address ?? ''}
            onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Adres"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Misafir sayısı
          </label>
          <Input
            type="number"
            min={1}
            value={editForm.maxGuests ?? ''}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                maxGuests: parseInt(e.target.value, 10) || undefined,
              }))
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Yatak odası
          </label>
          <Input
            type="number"
            min={0}
            value={editForm.bedrooms ?? ''}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                bedrooms: parseInt(e.target.value, 10) || undefined,
              }))
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Banyo</label>
          <Input
            type="number"
            min={0}
            step={0.5}
            value={editForm.bathrooms ?? ''}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                bathrooms: parseFloat(e.target.value) || undefined,
              }))
            }
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={onSave} disabled={savePending}>
          {savePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kaydet
        </Button>
        <Button variant="outline" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </ContentCard>
  );
}
