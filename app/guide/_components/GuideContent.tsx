'use client';

import { ShieldCheck } from 'lucide-react';
import type { GuideSection } from './GuideSidebar';

interface GuideContentProps {
  sections: GuideSection[];
  faqQuestions: string[];
  faqAnswers: string[];
  includesQuery: (text: string) => boolean;
  t: Record<string, unknown>;
}

export function GuideContent({ sections, faqQuestions, faqAnswers, includesQuery, t }: GuideContentProps) {
  if (sections.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-dashed border-border bg-muted/30 p-10 text-center">
        <h2 className="text-xl font-black text-foreground">{t.guideNoResultsTitle as string}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.guideNoResultsSubtitle as string}</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-9 space-y-24">
      {sections.map((s, idx) => (
        <section key={s.id} id={s.id} className="scroll-mt-32 space-y-8">
          <div className="flex items-center gap-4 text-foreground">
            <div className="p-3 rounded-2xl bg-muted">
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground">{s.title}</h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium mt-1">{s.intro}</p>
            </div>
          </div>
          {s.id !== 'faq' ? (
            <div className="rounded-[2.5rem] border border-border bg-card/60 p-8 md:p-10 shadow-sm">
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground font-medium">
                {s.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              {faqQuestions
                .map((q, i) => ({ q, a: faqAnswers[i] ?? '' }))
                .filter((item) => includesQuery(item.q) || includesQuery(item.a))
                .map((item, i) => (
                  <div key={`${item.q}-${i}`} className="rounded-[2.5rem] border border-border bg-card/60 p-8 md:p-10 shadow-sm space-y-2">
                    <h3 className="text-base md:text-lg font-black text-foreground">{item.q}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
            </div>
          )}
          {idx === 1 && (
            <div className="rounded-[2.5rem] bg-foreground text-background p-8 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <p className="text-xs font-black tracking-widest uppercase text-amber-400">{t.guideProTipBadge as string}</p>
              </div>
              <p className="text-sm md:text-base opacity-85 leading-relaxed">{t.guideProTipText as string}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
