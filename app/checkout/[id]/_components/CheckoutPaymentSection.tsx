'use client';

import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

export function CheckoutPaymentSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold">Ödeme Yöntemi</h2>
        <div className="flex gap-2">
          <div className="w-10 h-6 bg-muted rounded border border-border/50" />
          <div className="w-10 h-6 bg-muted rounded border border-border/50" />
          <div className="w-10 h-6 bg-muted rounded border border-border/50" />
        </div>
      </div>

      <div className="space-y-4 opacity-70 pointer-events-none">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
              Kart Sahibi
            </label>
            <input
              type="text"
              placeholder="Caner Yaman"
              className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border font-medium"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
              Kart Numarası
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full h-14 px-5 pr-12 rounded-2xl bg-muted/50 border border-border font-medium font-mono"
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
              Son Kullanma Tarihi
            </label>
            <input
              type="text"
              placeholder="AA/YY"
              className="w-full h-14 px-5 rounded-2xl bg-muted/50 border border-border font-medium font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">
              CVV
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="***"
                className="w-full h-14 px-5 pr-12 rounded-2xl bg-muted/50 border border-border font-medium font-mono"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted/20 border rounded-2xl text-xs text-muted-foreground leading-relaxed flex gap-3 italic">
        <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-600" />
        Ödemeniz, Rezervasyon Koruması tarafından uçtan uca şifrelenir ve korunur.
      </div>
    </section>
  );
}
