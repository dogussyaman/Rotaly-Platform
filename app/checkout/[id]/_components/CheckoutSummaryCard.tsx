'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Lock, ShieldCheck, Star } from 'lucide-react';
import type { ListingDetail } from '@/lib/supabase/bookings';

interface CheckoutSummaryCardProps {
  listing: ListingDetail;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  totalLabel: string;
}

export function CheckoutSummaryCard({
  listing,
  nights,
  subtotal,
  cleaningFee,
  serviceFee,
  total,
  totalLabel,
}: CheckoutSummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <Badge className="bg-foreground/5 text-foreground border-none font-bold">
          Premium Seçenek
        </Badge>
      </div>

      <div className="flex gap-4 pb-8 border-b border-border">
        <div className="w-32 h-24 rounded-2xl overflow-hidden relative shrink-0 shadow-lg">
          <Image
            src={
              listing.images[0] ??
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop'
            }
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">
            Mülk Sahibi: {listing.host?.fullName ?? 'Ev Sahibi'}
          </div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2">{listing.title}</h3>
          <div className="flex items-center gap-1.5 mt-2 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold">{listing.rating.toFixed(2)}</span>
            <span className="text-muted-foreground">({listing.totalReviews} yorum)</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">Fiyat Özeti</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-medium">
              ₺{listing.pricePerNight.toLocaleString('tr-TR')} x {nights} gece
            </span>
            <span className="font-bold text-foreground">
              ₺{subtotal.toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-medium">Temizlik ücreti</span>
            <span className="font-bold text-foreground">
              ₺{cleaningFee.toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="font-medium">StayHub hizmet bedeli</span>
            <span className="font-bold text-foreground">
              ₺{serviceFee.toLocaleString('tr-TR')}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t-2 border-dashed font-black text-2xl text-foreground">
          <span>{totalLabel}</span>
          <span>₺{total.toLocaleString('tr-TR')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 bg-muted/30 rounded-2xl text-center space-y-1">
          <Lock className="w-5 h-5 mx-auto text-muted-foreground" />
          <div className="text-[10px] font-black uppercase text-muted-foreground">
            Güvenli Ödeme
          </div>
        </div>
        <div className="p-4 bg-muted/30 rounded-2xl text-center space-y-1">
          <ShieldCheck className="w-5 h-5 mx-auto text-muted-foreground" />
          <div className="text-[10px] font-black uppercase text-muted-foreground">
            StayHub Koruma
          </div>
        </div>
      </div>
    </div>
  );
}
