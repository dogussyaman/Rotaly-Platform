'use client';

import type { ComponentType } from 'react';

export type GuideSection = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  intro: string;
  bullets: string[];
};

interface GuideSidebarProps {
  sections: GuideSection[];
  activeSection: string;
  onSectionClick: (id: string) => void;
  t: Record<string, unknown>;
}

export function GuideSidebar({ sections, activeSection, onSectionClick, t }: GuideSidebarProps) {
  return (
    <aside className="lg:col-span-3">
      <div className="sticky top-32 space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 pl-4">
          {t.guideSidebarTitle as string}
        </h3>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSectionClick(s.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
              activeSection === s.id ? 'bg-amber-500 text-foreground shadow-lg shadow-amber-500/20' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <s.icon className={activeSection === s.id ? 'w-4 h-4 text-foreground' : 'w-4 h-4 text-muted-foreground'} />
            {s.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
