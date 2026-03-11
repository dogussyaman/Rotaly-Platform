'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountSectionProps {
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  savingProfile: boolean;
  profileMessage: string | null;
  onUpdateProfile: () => void;
  onChangePassword: () => void;
  passwordSaving: boolean;
  passwordMessage: string | null;
  onDeleteAccount: () => void;
  accountDeleting: boolean;
  accountMessage: string | null;
}

export function AccountSection({
  fullName, setFullName,
  phone, setPhone,
  bio, setBio,
  savingProfile, profileMessage, onUpdateProfile,
  onChangePassword, passwordSaving, passwordMessage,
  onDeleteAccount, accountDeleting, accountMessage
}: AccountSectionProps) {
  return (
    <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-7 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold">Profil & Hesap Ayarları</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Ad Soyad</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="+90 ..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Hakkımda / Not</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-[72px] rounded-2xl border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Kendiniz hakkında kısa bir not ekleyebilirsiniz."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="rounded-2xl px-4" onClick={onUpdateProfile} disabled={savingProfile}>
              {savingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Kaydediliyor...</> : 'Profili Güncelle'}
            </Button>
            {profileMessage && <span className="text-xs text-muted-foreground">{profileMessage}</span>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Şifre Değiştir</p>
              <p className="text-xs text-muted-foreground">Güvenliğiniz için şifrenizi düzenli aralıklarla yenileyin.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-2xl px-4" onClick={onChangePassword} disabled={passwordSaving}>
              {passwordSaving ? 'Güncelleniyor...' : 'Şifreyi Değiştir'}
            </Button>
          </div>
          {passwordMessage && <p className="text-xs text-muted-foreground">{passwordMessage}</p>}

          <div className="h-px bg-border my-1" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-destructive">Hesabı Sil</p>
              <p className="text-xs text-muted-foreground">Tüm profil ve rezervasyon verileriniz silinir. Bu işlem geri alınamaz.</p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-2xl px-4" onClick={onDeleteAccount} disabled={accountDeleting}>
              {accountDeleting ? 'Siliniyor...' : 'Hesabı Sil'}
            </Button>
          </div>
          {accountMessage && <p className="text-xs text-muted-foreground">{accountMessage}</p>}
        </div>
      </div>
    </section>
  );
}
