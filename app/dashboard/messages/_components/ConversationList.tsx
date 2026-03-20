'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircleDashed, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/lib/supabase/messages';

function initials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function relativeTime(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7) return d.toLocaleDateString('tr-TR', { weekday: 'short' });
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  loading: boolean;
}

export function ConversationList({ conversations, selectedId, loading }: ConversationListProps) {
  const [q, setQ] = useState('');
  const list = q
    ? conversations.filter((c) =>
        (c.otherUserName ?? '').toLowerCase().includes(q.toLowerCase()),
      )
    : conversations;

  return (
    <div className="flex flex-col h-full border-r border-border bg-card/40">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Konuşmalar</span>
          {!loading && (
            <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 font-medium">
              {conversations.length}
            </span>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara..."
            className="pl-8 h-8 text-sm bg-muted/50 border-border/50 focus-visible:ring-1 rounded-lg"
          />
        </div>
      </div>

      <div className="h-px bg-border/60 mx-3 shrink-0" />

      {/* List */}
      <ScrollArea className="flex-1">
        <div className="py-2 px-2 space-y-0.5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
              </div>
            ))
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
              <MessageCircleDashed className="h-9 w-9 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                {q ? `"${q}" bulunamadı` : 'Henüz konuşma yok'}
              </p>
            </div>
          ) : (
            list.map((conv) => {
              const isSelected = selectedId === conv.id;
              const hasUnread = conv.unreadCount > 0;
              return (
                <Link
                  key={conv.id}
                  href={`/dashboard/messages?conversation=${encodeURIComponent(conv.id)}`}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    isSelected ? 'bg-primary/10' : 'hover:bg-muted/70',
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background">
                    {conv.otherUserAvatar && (
                      <AvatarImage src={conv.otherUserAvatar} alt={conv.otherUserName ?? ''} />
                    )}
                    <AvatarFallback
                      className={cn(
                        'text-xs font-semibold',
                        isSelected
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted-foreground/10 text-muted-foreground',
                      )}
                    >
                      {initials(conv.otherUserName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p
                        className={cn(
                          'text-sm truncate',
                          hasUnread
                            ? 'font-semibold text-foreground'
                            : 'font-medium text-foreground/80',
                        )}
                      >
                        {conv.otherUserName ?? 'Kullanıcı'}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {relativeTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          'text-xs truncate flex-1',
                          hasUnread
                            ? 'text-foreground/70 font-medium'
                            : 'text-muted-foreground',
                        )}
                      >
                        {conv.lastMessage ?? 'Konuşmayı başlat'}
                      </p>
                      {hasUnread && (
                        <span className="shrink-0 h-4.5 min-w-4.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1.5">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
