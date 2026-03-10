'use client';

import { SearchHeader } from '@/components/header/search-header';
import { MainFooter } from '@/components/footer/main-footer';
import { motion } from 'framer-motion';

interface ContentLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
}

export function ContentLayout({ children, title, subtitle, className = "" }: ContentLayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans">
            <SearchHeader />

            <main className={`pt-24 pb-16 lg:pt-32 lg:pb-24 ${className}`}>
                {title && (
                    <div className="max-w-4xl mx-auto px-6 mb-12 lg:mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                            <div className="h-1 w-20 bg-foreground/10 rounded-full" />
                        </motion.div>
                    </div>
                )}

                <div className="max-w-4xl mx-auto px-6">
                    {children}
                </div>
            </main>

            <MainFooter />
        </div>
    );
}
