'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Chrome, ChevronLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

interface LoginFormPanelProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  googleLoading: boolean;
  error: string;
  t: Record<string, unknown>;
  onLogin: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
}

export function LoginFormPanel({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  googleLoading,
  error,
  t,
  onLogin,
  onGoogleLogin,
}: LoginFormPanelProps) {
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
          <Link href="/" className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors" title="Geri Dön">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-100 space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.loginPageTitle as string}</h1>
            <p className="text-muted-foreground">{t.loginPageSubtitle as string}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading}
            onClick={onGoogleLogin}
            className="w-full h-12 rounded-2xl border-border bg-background hover:bg-muted shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground animate-spin rounded-full" />
            ) : (
              <Chrome className="w-5 h-5 text-rose-500" />
            )}
            <span className="font-semibold text-sm">{t.loginWithGoogle as string}</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="px-3 bg-background text-muted-foreground/60">veya e-posta ile</span>
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
          <form onSubmit={onLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground/80 font-semibold px-1">{t.loginEmailLabel as string}</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ad.soyad@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-11 rounded-2xl bg-muted/30 border-border group-focus-within:bg-background transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password" className="text-foreground/80 font-semibold">{t.loginPasswordLabel as string}</Label>
                  <Link href="/auth/forgot-password" className="text-xs font-bold text-foreground/40 hover:text-foreground transition-colors">{t.loginForgot as string}</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-11 rounded-2xl bg-muted/30 border-border group-focus-within:bg-background transition-all"
                  />
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-foreground text-background font-bold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 overflow-hidden relative group">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-background/20 border-t-background animate-spin rounded-full" />
                ) : (
                  <>
                    <span>{t.loginPrimaryButton as string}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
          <div className="space-y-6 pt-4">
            <p className="text-center text-sm font-medium text-muted-foreground">
              {t.loginNoAccount as string}{' '}
              <Link href="/auth/signup" className="text-foreground font-bold hover:underline underline-offset-4">{t.loginCreateOne as string}</Link>
            </p>
            <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
              {t.loginAgreeText as string}{' '}
              <Link href="/terms" className="text-foreground/40 hover:text-foreground hover:underline underline-offset-4">{t.loginTerms as string}</Link>{' '}
              {t.loginAnd as string}{' '}
              <Link href="/privacy" className="text-foreground/40 hover:text-foreground hover:underline underline-offset-4">{t.loginPrivacy as string}</Link>
              {t.loginAgreeSuffix as string}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
