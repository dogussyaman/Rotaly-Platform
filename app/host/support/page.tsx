'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

export default function HostSupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-6">Ev Sahibi Destek Merkezi</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Size her adımda yardımcı olmak için buradayız. Sorularınız için bize dilediğiniz zaman ulaşabilirsiniz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: MessageCircle, title: "Canlı Sohbet", desc: "7/24 anında destek alın.", action: "Sohbeti Başlat" },
            { icon: Phone, title: "Telefon", desc: "Acil durumlar için bizi arayın.", action: "0850 123 45 67" },
            { icon: Mail, title: "E-posta", desc: "Detaylı sorularınız için yazın.", action: "host-support@rotaly.com" },
            { icon: HelpCircle, title: "Yardım Rehberi", desc: "Sıkça sorulan sorulara göz atın.", action: "Rehbere Git" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-10 rounded-[2.5rem] border border-border flex flex-col items-center text-center hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-6">{item.desc}</p>
              <button className="text-primary font-black hover:underline mt-auto">{item.action}</button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
