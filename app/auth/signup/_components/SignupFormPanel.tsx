'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, ArrowRight, Chrome, ChevronLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormPanelProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  loading: boolean;
  googleLoading: boolean;
  error: string;
  t: Record<string, unknown>;
  onSignUp: (e: React.FormEvent) => void;
  onGoogleSignUp: () => void;
}

export function SignupFormPanel({
  formData,
  setFormData,
  agreeTerms,
  setAgreeTerms,
  loading,
  googleLoading,
  error,
  t,
  onSignUp,
  onGoogleSignUp,
}: SignupFormPanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col bg-background relative overflow-y-auto">
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="white" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-bold text-lg text-foreground">Rotaly</span>
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
          className="w-full max-w-100 space-y-8 py-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t.signupPageTitle as string}
            </h1>
            <p className="text-muted-foreground">{t.signupPageSubtitle as string}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={googleLoading}
            onClick={onGoogleSignUp}
            className="w-full h-12 rounded-2xl border-border bg-background hover:bg-muted shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin rounded-full" />
            ) : (
              <Chrome className="w-5 h-5 text-rose-500" />
            )}
            <span className="font-semibold text-sm">{t.signupWithGoogle as string}</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="px-3 bg-background text-muted-foreground/60">veya bilgilerini gir</span>
            </div>
          </div>

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

          <form onSubmit={onSignUp} className="space-y-5">
            <div className="space-y-4">
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
              <p className="text-[10px] text-muted-foreground px-1">{t.signupPasswordHint as string}</p>
            </div>
            <div className="flex gap-3 pt-2 px-1">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-0.5 shrink-0 rounded-sm border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
              {/* Label UI bileşeni flex kullandığı için parça parça dikey diziliyordu; düz metin için native label */}
              <label
                htmlFor="terms"
                className="min-w-0 flex-1 cursor-pointer text-left text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs sm:leading-relaxed"
              >
                <span className="inline">
                  {t.signupTermsText as string}{' '}
                  <Link href="/terms" className="font-semibold text-foreground underline-offset-2 hover:underline">
                    {t.loginTerms as string}
                  </Link>{' '}
                  {t.loginAnd as string}{' '}
                  <Link href="/privacy" className="font-semibold text-foreground underline-offset-2 hover:underline">
                    {t.loginPrivacy as string}
                  </Link>{' '}
                  {t.loginAgreeSuffix as string}
                </span>
              </label>
            </div>
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
  );
}
