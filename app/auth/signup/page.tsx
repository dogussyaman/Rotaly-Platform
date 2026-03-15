'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/locale-context';
import { createClient } from '@/lib/supabase/client';
import { SignupLeftPanel } from './_components/SignupLeftPanel';
import { SignupFormPanel, type SignupFormData } from './_components/SignupFormPanel';

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { t } = useLocale();
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreeTerms) {
      setError(t.signupErrorTerms as string);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.signupErrorPasswordMismatch as string);
      return;
    }
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, role: 'guest' } },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError(t.signupErrorGeneric as string);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      <SignupLeftPanel />
      <SignupFormPanel
        formData={formData}
        setFormData={setFormData}
        agreeTerms={agreeTerms}
        setAgreeTerms={setAgreeTerms}
        loading={loading}
        googleLoading={googleLoading}
        error={error}
        t={t}
        onSignUp={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
      />
    </div>
  );
}
