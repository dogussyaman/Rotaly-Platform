'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Chrome, ChevronLeft } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
        options: {
          data: {
            full_name: formData.fullName,
            role: 'guest',
          },
        },
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
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* ── Left Side: Visual ── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-foreground">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0 text-white/50">
          <img
            src="/auth_hero_image.png"
            alt="Luxury Villa"
            className="w-full h-full object-cover opacity-60 scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground via-foreground/20 to-transparent" />
        </div>

        {/* Content Top */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="black" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">StayHub</span>
          </Link>
        </div>

        {/* Content Bottom */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-lg space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Yolculuk <br />
              <span className="text-white/60">Burada Başlıyor.</span>
            </h2>
            <p className="text-lg text-white/70 font-medium">
              StayHub topluluğuna katılarak dünyanın her yerindeki özel konaklama yerlerine erişim sağla.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-8">
            <div>
              <p className="text-white font-bold text-xl">10k+</p>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">İlanlar</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">250+</p>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Destinasyon</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">4.9/5</p>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Müşteri Memnuniyeti</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right Side: Form ── */}
      <div className="flex flex-col bg-background relative overflow-y-auto">
        {/* Header Mobile / Navigation */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="white" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-bold text-lg text-foreground">StayHub</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              title="Geri Dön"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[400px] space-y-8 py-8"
          >
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {t.signupPageTitle as string}
              </h1>
              <p className="text-muted-foreground">
                {t.signupPageSubtitle as string}
              </p>
            </div>

            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              disabled={googleLoading}
              onClick={handleGoogleSignUp}
              className="w-full h-12 rounded-2xl border-border bg-background hover:bg-muted shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin rounded-full" />
              ) : (
                <Chrome className="w-5 h-5 text-rose-500" />
              )}
              <span className="font-semibold text-sm">{t.signupWithGoogle as string}</span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="px-3 bg-background text-muted-foreground/60">veya bilgilerini gir</span>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-xs font-medium text-destructive overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-foreground/80 font-semibold px-1">
                    {t.signupFullName as string}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Ad Soyad"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="h-12 pl-11 rounded-2xl bg-muted/30 border-border group-focus-within:bg-background transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-foreground/80 font-semibold px-1">
                    {t.loginEmailLabel as string}
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ad.soyad@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 pl-11 rounded-2xl bg-muted/30 border-border group-focus-within:bg-background transition-all"
                    />
                  </div>
                </div>

                {/* Password Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-foreground/80 font-semibold px-1">
                      {t.signupPasswordLabel as string}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-12 pl-11 rounded-2xl bg-muted/30 border-border group-focus-within:bg-background transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-foreground/80 font-semibold px-1">
                      {t.signupConfirmPasswordLabel as string}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="h-12 pl-11 rounded-2xl bg-muted/30 border-border group-focus-within:bg-background transition-all"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground px-1">
                  {t.signupPasswordHint as string}
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 pt-2 px-1">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1 rounded-sm border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                />
                <Label htmlFor="terms" className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer font-medium">
                  {t.signupTermsText as string}{' '}
                  <Link href="/terms" className="text-foreground hover:underline underline-offset-2">
                    {t.loginTerms as string}
                  </Link>{' '}
                  {t.loginAnd as string}{' '}
                  <Link href="/privacy" className="text-foreground hover:underline underline-offset-2">
                    {t.loginPrivacy as string}
                  </Link>
                  {' '}{t.loginAgreeSuffix as string}
                </Label>
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="w-full h-12 rounded-2xl bg-foreground text-background font-bold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 overflow-hidden relative group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/20 border-t-background animate-spin rounded-full" />
                  ) : (
                    <>
                      <span>{t.signupPrimaryButton as string}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Bottom Links */}
            <div className="space-y-6 pt-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                {t.signupHaveAccount as string}{' '}
                <Link
                  href="/auth/login"
                  className="text-foreground font-bold hover:underline underline-offset-4"
                >
                  {t.signupSignIn as string}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
