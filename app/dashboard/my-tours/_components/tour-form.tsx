'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  fetchMyTourGuides,
  fetchTourCategories,
  type CreateTourInput,
  type MyTourGuideRow,
  type TourCategoryOption,
  type TourFormat,
} from '@/lib/supabase/tours-admin';

export type TourFormValues = CreateTourInput;

interface TourFormProps {
  operatorId: string;
  initial?: Partial<TourFormValues>;
  submitLabel: string;
  onSubmit: (values: TourFormValues) => Promise<boolean>;
  onCancel: () => void;
}

export function TourForm({ operatorId, initial, submitLabel, onSubmit, onCancel }: TourFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'Türkiye');
  const [tourFormat, setTourFormat] = useState<TourFormat>(initial?.tourFormat ?? 'group');
  const [durationMinutes, setDurationMinutes] = useState(String(initial?.durationMinutes ?? 120));
  const [minParticipants, setMinParticipants] = useState(String(initial?.minParticipants ?? 2));
  const [maxParticipants, setMaxParticipants] = useState(String(initial?.maxParticipants ?? 15));
  const [basePrice, setBasePrice] = useState(String(initial?.basePrice ?? ''));
  const [meetingPoint, setMeetingPoint] = useState(initial?.meetingPoint ?? '');
  const [detailedItinerary, setDetailedItinerary] = useState(initial?.detailedItinerary ?? '');
  const [tourCategoryId, setTourCategoryId] = useState(initial?.tourCategoryId ?? '');
  const [tourGuideId, setTourGuideId] = useState(initial?.tourGuideId ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? false);
  const [categories, setCategories] = useState<TourCategoryOption[]>([]);
  const [guides, setGuides] = useState<MyTourGuideRow[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchTourCategories().then(setCategories);
    void fetchMyTourGuides(operatorId).then(setGuides);
  }, [operatorId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !basePrice) return;
    setSaving(true);
    const ok = await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      city: city.trim() || null,
      country: country.trim() || null,
      tourFormat,
      durationMinutes: Number(durationMinutes) || null,
      minParticipants: tourFormat === 'group' ? Number(minParticipants) || 1 : 1,
      maxParticipants: tourFormat === 'group' ? Number(maxParticipants) || 1 : 1,
      basePrice: Number(basePrice),
      tourCategoryId: tourCategoryId || null,
      tourGuideId: tourGuideId || null,
      meetingPoint: meetingPoint.trim() || null,
      detailedItinerary: detailedItinerary.trim() || null,
      isActive,
    });
    setSaving(false);
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Tur başlığı *</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Tur formatı *</Label>
          <Select value={tourFormat} onValueChange={(v) => setTourFormat(v as TourFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="group">Grup turu</SelectItem>
              <SelectItem value="individual">Bireysel tur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="basePrice">Temel fiyat (TRY) *</Label>
          <Input
            id="basePrice"
            type="number"
            min={0}
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Ülke</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Süre (dakika)</Label>
          <Input
            id="duration"
            type="number"
            min={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select value={tourCategoryId || '_none'} onValueChange={(v) => setTourCategoryId(v === '_none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">—</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {tourFormat === 'group' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="minP">Min. katılımcı</Label>
              <Input
                id="minP"
                type="number"
                min={1}
                value={minParticipants}
                onChange={(e) => setMinParticipants(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxP">Max. katılımcı</Label>
              <Input
                id="maxP"
                type="number"
                min={1}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label>Tur rehberi</Label>
          <Select value={tourGuideId || '_none'} onValueChange={(v) => setTourGuideId(v === '_none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Rehber seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">Atanmadı</SelectItem>
              {guides.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="meeting">Buluşma noktası</Label>
          <Input id="meeting" value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="desc">Açıklama</Label>
          <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="itinerary">Detaylı program</Label>
          <Textarea
            id="itinerary"
            rows={4}
            value={detailedItinerary}
            onChange={(e) => setDetailedItinerary(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          <Label htmlFor="active">Yayında (aktif)</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </form>
  );
}
