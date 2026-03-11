'use client';

import Link from 'next/link';

interface HostCtaSectionProps {
    t: any;
}

export function HostCtaSection({ t }: HostCtaSectionProps) {
    return (
        <section className="bg-background px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="bg-foreground rounded-3xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-3xl font-bold text-card mb-3 text-balance">
                            {t.hostTitle as string}
                        </h2>
                        <p className="text-card/60 max-w-md text-balance leading-relaxed">
                            {t.hostSubtitle as string}
                        </p>
                    </div>
                    <Link
                        href="/become-host"
                        className="flex-shrink-0 bg-secondary text-foreground font-bold px-8 py-4 rounded-full hover:bg-secondary/85 transition-colors text-sm whitespace-nowrap"
                    >
                        {t.getStarted as string}
                    </Link>
                </div>
            </div>
        </section>
    );
}
