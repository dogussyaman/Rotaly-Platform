'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppSelector } from '@/lib/store/hooks';
import {
  createTourGuide,
  fetchMyTourGuides,
  resolveTourOperatorForUser,
  updateTourGuide,
  type MyTourGuideRow,
  type MyTourOperator,
} from '@/lib/supabase/tours-admin';

export default function TourGuidesPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState<MyTourOperator | null>(null);
  const [guides, setGuides] = useState<MyTourGuideRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('0');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);
    const op = await resolveTourOperatorForUser(profile.id, {
      isHost: profile.isHost,
      isTourOperator: profile.isTourOperator,
    });
    setOperator(op);
    if (op) {
      setGuides(await fetchMyTourGuides(op.id));
    } else {
      setGuides([]);
    }
    setLoading(false);
  }, [profile?.id, profile?.isHost, profile?.isTourOperator]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!operator || !fullName.trim()) return;
    setSaving(true);
    const id = await createTourGuide(operator.id, {
      fullName: fullName.trim(),
      phone: phone.trim() || null,
      bio: bio.trim() || null,
      experienceYears: Number(experienceYears) || 0,
    });
    setSaving(false);
    if (id) {
      setFullName('');
      setPhone('');
      setBio('');
      setExperienceYears('0');
      setShowForm(false);
      void load();
    }
  }

  async function toggleActive(guide: MyTourGuideRow) {
    await updateTourGuide(guide.id, { isActive: !guide.isActive });
    void load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="p-6">
        <ContentCard title="Bilgi">
          <p className="text-sm text-muted-foreground">
            Önce Turlarım sayfasından tur satışını etkinleştirin veya tur şirketi rolünüzün atandığından emin olun.
          </p>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Section
        title="Tur Rehberleri"
        description="Rehber ekleyin; turlarınıza atayabilirsiniz"
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-2 h-4 w-4" />
            Rehber ekle
          </Button>
        }
      >
        {showForm && (
          <div className="mb-4">
          <ContentCard title="Yeni rehber">
            <form onSubmit={(e) => void handleCreate(e)} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="gname">Ad soyad *</Label>
                <Input id="gname" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gphone">Telefon</Label>
                <Input id="gphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gexp">Deneyim (yıl)</Label>
                <Input
                  id="gexp"
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="gbio">Biyografi</Label>
                <Textarea id="gbio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Kaydet
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  İptal
                </Button>
              </div>
            </form>
          </ContentCard>
          </div>
        )}

        <ContentCard title="Rehber listesi">
          {guides.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <User className="h-10 w-10 opacity-40" />
              Henüz rehber eklenmedi.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rehber</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Deneyim</TableHead>
                  <TableHead>Puan</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">{guide.fullName}</TableCell>
                    <TableCell>{guide.phone ?? '—'}</TableCell>
                    <TableCell>{guide.experienceYears} yıl</TableCell>
                    <TableCell>{guide.averageRating.toFixed(1)}</TableCell>
                    <TableCell>
                      <Badge variant={guide.isActive ? 'default' : 'secondary'}>
                        {guide.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => void toggleActive(guide)}>
                        {guide.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ContentCard>
      </Section>
    </div>
  );
}
