'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';

interface ToursCtaSectionProps {
  ctaBadge: string;
  ctaTitle: string;
  ctaSubtitle: string;
  feature1Title: string;
  feature1Subtitle: string;
  feature2Title: string;
  feature2Subtitle: string;
  ctaButton: string;
  ctaImageAlt: string;
}

export function ToursCtaSection({
  ctaBadge,
  ctaTitle,
  ctaSubtitle,
  feature1Title,
  feature1Subtitle,
  feature2Title,
  feature2Subtitle,
  ctaButton,
  ctaImageAlt,
}: ToursCtaSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-20">
      <div className="bg-muted/40 rounded-[3rem] p-12 relative overflow-hidden group border border-border/60">
        <div className="relative z-10 max-w-xl">
          <Badge className="bg-sky-500 text-white border-none font-black mb-6 uppercase tracking-widest">
            {ctaBadge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{ctaTitle}</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">{ctaSubtitle}</p>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                <Layers className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h4 className="font-black text-sm">{feature1Title}</h4>
                <p className="text-xs text-muted-foreground">{feature1Subtitle}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                <Layers className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h4 className="font-black text-sm">{feature2Title}</h4>
                <p className="text-xs text-muted-foreground">{feature2Subtitle}</p>
              </div>
            </div>
          </div>
          <Button size="lg" className="rounded-2xl font-black px-10 h-16 shadow-2xl">
            {ctaButton}
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block relative">
          <Image
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=800&fit=crop"
            alt={ctaImageAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-muted/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
