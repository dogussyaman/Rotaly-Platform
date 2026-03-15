'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';

type ProfileRow = { id: string; full_name: string | null; email: string | null; is_host: boolean; is_verified: boolean; created_at: string };
type RoleRow = { id: string; role: string; created_at: string; profiles: { full_name: string | null } | null };

export default function UsersPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [pRes, rRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, is_host, is_verified, created_at').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('id, role, created_at, profiles(full_name)').order('created_at', { ascending: false }),
      ]);
      setProfiles((pRes.data ?? []) as ProfileRow[]);
      setRoles((rRes.data ?? []) as RoleRow[]);
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <div className="grid gap-6 xl:grid-cols-2">
          <ContentCard title="Profiller" description="Auth kullanıcılarına bağlı profiller">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Ev Sahibi</TableHead>
                  <TableHead>Doğrulandı</TableHead>
                  <TableHead>Kayıt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name ?? '—'}</TableCell>
                      <TableCell>{p.email ?? '—'}</TableCell>
                      <TableCell><BooleanBadge value={!!p.is_host} /></TableCell>
                      <TableCell><BooleanBadge value={!!p.is_verified} /></TableCell>
                      <TableCell>{formatDate(p.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Roller" description="Yetki ve erişim seviyeleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Atanma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Veri yok</TableCell>
                  </TableRow>
                ) : (
                  roles.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{(r.profiles as { full_name: string | null } | null)?.full_name ?? '—'}</TableCell>
                      <TableCell className="capitalize">{r.role}</TableCell>
                      <TableCell>{formatDate(r.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
