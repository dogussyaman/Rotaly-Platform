'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SearchHeader } from '@/components/header/search-header';
import { MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { useLocale } from '@/lib/i18n/locale-context';

export default function HostSupportPage() {
  const { t } = useLocale();

  const phone = t.hostSupportPhoneValue as string;
  const email = t.hostSupportEmailValue as string;

  const cards = [
    { icon: MessageCircle, title: t.hostSupportChatTitle, desc: t.hostSupportChatDesc, action: t.hostSupportChatAction, href: null as string | null },
    { icon: Phone, title: t.hostSupportPhoneTitle, desc: t.hostSupportPhoneDesc, action: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: Mail, title: t.hostSupportEmailTitle, desc: t.hostSupportEmailDesc, action: email, href: `mailto:${email}` },
    { icon: HelpCircle, title: t.hostSupportHelpTitle, desc: t.hostSupportHelpDesc, action: t.hostSupportHelpAction, href: '/faq' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-6">{t.hostSupportTitle as string}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.hostSupportSubtitle as string}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((item, i) => (
            <motion.div
              key={String(item.title)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-10 rounded-[2.5rem] border border-border flex flex-col items-center text-center hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title as string}</h3>
              <p className="text-muted-foreground text-sm mb-6">{item.desc as string}</p>
              {item.href ? (
                <Link href={item.href} className="text-primary font-black hover:underline mt-auto">
                  {item.action as string}
                </Link>
              ) : (
                <button type="button" className="text-primary font-black hover:underline mt-auto">
                  {item.action as string}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
