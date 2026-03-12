'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n/locale-context';

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
  const { t } = useLocale();

  return (
    <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-7 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold">{t.profileAccountTitle as string}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t.profileFullNameLabel as string}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
              placeholder={t.profileFullNamePlaceholder as string}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t.profilePhoneLabel as string}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
              placeholder="+90 ..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">{t.profileBioLabel as string}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-[72px] rounded-2xl border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder={t.profileBioPlaceholder as string}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="rounded-2xl px-4" onClick={onUpdateProfile} disabled={savingProfile}>
              {savingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t.profileSaving as string}</> : (t.profileUpdate as string)}
            </Button>
            {profileMessage && <span className="text-xs text-muted-foreground">{profileMessage}</span>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{t.profilePasswordTitle as string}</p>
              <p className="text-xs text-muted-foreground">{t.profilePasswordSubtitle as string}</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-2xl px-4" onClick={onChangePassword} disabled={passwordSaving}>
              {passwordSaving ? (t.profileUpdating as string) : (t.profileChangePassword as string)}
            </Button>
          </div>
          {passwordMessage && <p className="text-xs text-muted-foreground">{passwordMessage}</p>}

          <div className="h-px bg-border my-1" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-destructive">{t.profileDeleteAccountTitle as string}</p>
              <p className="text-xs text-muted-foreground">{t.profileDeleteAccountSubtitle as string}</p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-2xl px-4" onClick={onDeleteAccount} disabled={accountDeleting}>
              {accountDeleting ? (t.profileDeleting as string) : (t.profileDeleteAccountCta as string)}
            </Button>
          </div>
          {accountMessage && <p className="text-xs text-muted-foreground">{accountMessage}</p>}
        </div>
      </div>
    </section>
  );
}
