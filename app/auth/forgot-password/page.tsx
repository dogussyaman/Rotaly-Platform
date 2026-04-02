'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/lib/i18n/locale-context';

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (authError) {
      setError(t.forgotErrorSend as string);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const sentBody = (t.forgotEmailSentBody as string).replace('{email}', email.trim());

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-foreground rounded-2xl mx-auto flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t.forgotTitle as string}</h1>
          <p className="text-muted-foreground text-sm">
            {sent ? (t.forgotSubtitleSent as string) : (t.forgotSubtitleIdle as string)}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-emerald-800">{t.forgotEmailSentTitle as string}</p>
                <p className="text-sm text-emerald-700">{sentBody}</p>
              </div>
              <p className="text-xs text-emerald-600">{t.forgotSpamHint as string}</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-xs font-medium text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground/80 font-semibold px-1">
                  {t.forgotEmailLabel as string}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.forgotEmailPlaceholder as string}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-11 rounded-2xl bg-muted/30 border-border"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-12 rounded-2xl bg-foreground text-background font-bold hover:bg-foreground/90 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (t.forgotSubmit as string)}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.forgotBackLogin as string}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
