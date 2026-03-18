'use client';

import { motion } from 'framer-motion';
import { SearchHeader } from '@/components/header/search-header';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const jobs = [
  { title: "Senior Frontend Developer", team: "Engineering", location: "Remote / İstanbul", type: "Full-time" },
  { title: "Product Designer", team: "Design", location: "Remote / Londra", type: "Full-time" },
  { title: "Community Manager", team: "Marketing", location: "Remote / Berlin", type: "Full-time" },
  { title: "Customer Success Specialist", team: "Operations", location: "Remote / İstanbul", type: "Part-time" }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <SearchHeader />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-black mb-8">Geleceği Birlikte İnşa Edelim</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Seyahat severleri ve teknoloji tutkunlarını bir araya getiren ekibimize katılın. 
            Dünyayı keşfetme biçimimizi değiştirmek için sizi bekliyoruz.
          </p>
        </motion.div>

        <div className="space-y-6">
          <h2 className="text-3xl font-black mb-8">Açık Pozisyonlar</h2>
          {jobs.map((job, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-8 rounded-[2rem] border border-border hover:border-primary transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.team}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</div>
                </div>
              </div>
              <button className="bg-foreground text-background font-bold px-6 py-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">Başvur</button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
