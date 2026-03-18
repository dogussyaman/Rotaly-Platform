'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, TicketPercent, ToggleLeft, ToggleRight, UserCog } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import {
  fetchFirstSignupCouponForAdmin,
  fetchRoleUsersForAdmin,
  setFirstSignupCouponActiveByAdmin,
  setUserRoleActiveByAdmin,
  setUserVerifiedByAdmin,
  upsertFirstSignupCouponByAdmin,
  type AdminManageableRole,
  type AdminRoleUserRow,
} from '@/lib/supabase/admin';

const ROLES: AdminManageableRole[] = ['admin', 'host', 'tour_operator'];

function roleLabel(role: AdminManageableRole): string {
  if (role === 'admin') return 'Admin';
  if (role === 'host') return 'Ev Sahibi';
  return 'Tur Operatörü';
}

export default function RolesPage() {
  const [rows, setRows] = useState<AdminRoleUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [processingKey, setProcessingKey] = useState<string | null>(null);
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponStatusSaving, setCouponStatusSaving] = useState(false);
  const [couponConfig, setCouponConfig] = useState({
    id: '',
    code: 'WELCOME20',
    discountValue: '20',
    expiresAt: '',
    isActive: true,
  });

  async function loadAll() {
    setLoading(true);
    try {
      const [users, coupon] = await Promise.all([
        fetchRoleUsersForAdmin(),
        fetchFirstSignupCouponForAdmin(),
      ]);

      setRows(users);
      if (coupon) {
        setCouponConfig({
          id: coupon.id,
          code: coupon.code,
          discountValue: String(coupon.discountValue),
          expiresAt: coupon.expiresAt ? String(coupon.expiresAt).slice(0, 10) : '',
          isActive: coupon.isActive,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const fullName = (row.fullName ?? '').toLowerCase();
      const email = (row.email ?? '').toLowerCase();
      const roleText = row.roles.join(' ').toLowerCase();
      return fullName.includes(q) || email.includes(q) || roleText.includes(q);
    });
  }, [rows, query]);

  function userHasRole(user: AdminRoleUserRow, role: AdminManageableRole): boolean {
    return user.roles.includes(role);
  }

  async function toggleRole(user: AdminRoleUserRow, role: AdminManageableRole) {
    const nextState = !userHasRole(user, role);
    const key = `${user.id}:${role}`;
    setProcessingKey(key);
    try {
      const ok = await setUserRoleActiveByAdmin(user.id, role, nextState);
      if (!ok) return;
      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== user.id) return row;
          const roleSet = new Set(row.roles);
          if (nextState) roleSet.add(role);
          else roleSet.delete(role);
          return {
            ...row,
            roles: Array.from(roleSet),
            isHost: role === 'host' ? nextState : row.isHost,
          };
        }),
      );
    } finally {
      setProcessingKey(null);
    }
  }

  async function toggleVerified(user: AdminRoleUserRow) {
    const key = `${user.id}:verified`;
    setProcessingKey(key);
    try {
      const nextState = !user.isVerified;
      const ok = await setUserVerifiedByAdmin(user.id, nextState);
      if (!ok) return;
      setRows((prev) => prev.map((row) => (row.id === user.id ? { ...row, isVerified: nextState } : row)));
    } finally {
      setProcessingKey(null);
    }
  }

  async function saveCouponConfig() {
    if (couponSaving) return;
    const discountValue = Number(couponConfig.discountValue.replace(',', '.'));
    if (!couponConfig.code.trim() || !Number.isFinite(discountValue) || discountValue <= 0) return;

    setCouponSaving(true);
    try {
      const ok = await upsertFirstSignupCouponByAdmin({
        code: couponConfig.code,
        discountValue,
        expiresAt: couponConfig.expiresAt || null,
      });
      if (ok) {
        await loadAll();
      }
    } finally {
      setCouponSaving(false);
    }
  }

  async function toggleCouponStatus() {
    if (!couponConfig.id || couponStatusSaving) return;
    setCouponStatusSaving(true);
    try {
      const ok = await setFirstSignupCouponActiveByAdmin(couponConfig.id, !couponConfig.isActive);
      if (ok) {
        setCouponConfig((prev) => ({ ...prev, isActive: !prev.isActive }));
      }
    } finally {
      setCouponStatusSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-75 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="" description="">
        <ContentCard title="Rol ve Yetki Yönetimi" description="Admin, ev sahibi ve operatör rollerini aktif/pasif yönet">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kullanıcı ara: ad, e-posta veya rol"
              className="max-w-md rounded-lg"
            />
            <div className="text-xs text-muted-foreground">Toplam kullanıcı: {filteredRows.length}</div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Roller</TableHead>
                <TableHead>Kayıt</TableHead>
                <TableHead>Doğrulama</TableHead>
                <TableHead className="text-right">Aksiyonlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Kullanıcı bulunamadı</TableCell>
                </TableRow>
              ) : (
                filteredRows.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.fullName ?? '—'}</div>
                      <div className="text-xs text-muted-foreground">{user.email ?? '—'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.length === 0 ? (
                          <Badge variant="secondary">rol yok</Badge>
                        ) : (
                          user.roles.map((role) => (
                            <Badge key={`${user.id}-${role}`} variant="outline" className="capitalize">
                              {role.replace('_', ' ')}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        disabled={processingKey === `${user.id}:verified`}
                        onClick={() => void toggleVerified(user)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                      >
                        {user.isVerified ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Doğrulandı
                          </>
                        ) : (
                          'Doğrulanmadı'
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        {ROLES.map((role) => {
                          const active = userHasRole(user, role);
                          const key = `${user.id}:${role}`;
                          return (
                            <Button
                              key={key}
                              type="button"
                              size="sm"
                              variant={active ? 'default' : 'outline'}
                              className="rounded-lg"
                              disabled={processingKey === key}
                              onClick={() => void toggleRole(user, role)}
                            >
                              <UserCog className="mr-1 h-3.5 w-3.5" />
                              {roleLabel(role)}
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ContentCard>
      </Section>

      <Section title="" description="">
        <ContentCard
          title="İlk Üyelik Kuponu"
          description="Yeni kullanıcıya özel tek-kullanımlık hoş geldin kuponunu yönet"
        >
          <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Kupon Kodu</label>
              <Input
                value={couponConfig.code}
                onChange={(event) => setCouponConfig((prev) => ({ ...prev, code: event.target.value }))}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">İndirim (%)</label>
              <Input
                value={couponConfig.discountValue}
                onChange={(event) => setCouponConfig((prev) => ({ ...prev, discountValue: event.target.value }))}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Bitiş Tarihi</label>
              <Input
                type="date"
                value={couponConfig.expiresAt}
                onChange={(event) => setCouponConfig((prev) => ({ ...prev, expiresAt: event.target.value }))}
                className="rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                className="w-full rounded-lg"
                disabled={couponSaving}
                onClick={() => void saveCouponConfig()}
              >
                {couponSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TicketPercent className="mr-2 h-4 w-4" />}
                Kuponu Kaydet
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-sm">
            <Badge variant={couponConfig.isActive ? 'default' : 'secondary'}>
              {couponConfig.isActive ? 'Aktif' : 'Pasif'}
            </Badge>
            <span className="text-muted-foreground">Kural: kullanıcı başına 1 kullanım</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto rounded-lg"
              disabled={!couponConfig.id || couponStatusSaving}
              onClick={() => void toggleCouponStatus()}
            >
              {couponConfig.isActive ? (
                <ToggleRight className="mr-1 h-4 w-4 text-primary" />
              ) : (
                <ToggleLeft className="mr-1 h-4 w-4" />
              )}
              Durumu Değiştir
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Bu ekran gerçek yönetim aksiyonları için tasarlandı. DB tarafında admin update policy yoksa butonlar işlem yapmaz.
          </div>
        </ContentCard>
      </Section>
    </div>
  );
}
