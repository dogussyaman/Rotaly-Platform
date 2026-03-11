'use client';

import Image from 'next/image';
import { Star, TicketPercent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
  profile: {
    avatarUrl?: string | null;
    fullName?: string | null;
    email: string;
    points: number;
    isHost?: boolean;
  };
  lifetimePoints?: number;
}

export function ProfileHeader({ profile, lifetimePoints }: ProfileHeaderProps) {
  return (
    <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-foreground/10 flex items-center justify-center">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.fullName ?? profile.email}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-xl font-black text-foreground">
              {(profile.fullName ?? profile.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {profile.fullName ?? profile.email}
          </h1>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
            Misafir hesabı
          </Badge>
          {profile.isHost && (
            <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-foreground text-card">
              Ev Sahibi
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {profile.points.toLocaleString('tr-TR')} sadakat puanı
          </span>
          {lifetimePoints !== undefined && (
            <span className="flex items-center gap-1">
              <TicketPercent className="w-3 h-3" />
              Toplam {lifetimePoints.toLocaleString('tr-TR')} puan kazanıldı
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
