'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/locale-context';
import { createClient } from '@/lib/supabase/client';
import { LoginLeftPanel } from './_components/LoginLeftPanel';
import { LoginFormPanel } from './_components/LoginFormPanel';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError(t.loginErrorGeneric as string);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` },
    });
    if (oauthError) setError(oauthError.message);
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      <LoginLeftPanel />
      <LoginFormPanel
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        googleLoading={googleLoading}
        error={error}
        t={t}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
      />
    </div>
  );
}
