'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Loader2, MessageCircle } from 'lucide-react';
import type { ConversationSummary } from '@/lib/supabase/messages';

interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  loading: boolean;
}

export function ConversationList({ conversations, selectedId, loading }: ConversationListProps) {
  return (
    <div className="border-r border-[#e5e7eb] flex flex-col max-h-[calc(100vh-12rem)] min-h-[420px]">
      <div className="p-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
        <p className="text-xs font-medium text-muted-foreground">Konuşmalar</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Henüz mesaj bulunmuyor.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/messages?conversation=${encodeURIComponent(conv.id)}`}
              className={`flex items-center gap-3 border-b border-[#f3f4f6] p-3 transition-colors hover:bg-[#f0fdfa]/60 ${selectedId === conv.id ? 'bg-[#f0fdfa]' : ''}`}
            >
              <div className="h-10 w-10 shrink-0 rounded-full bg-muted overflow-hidden">
                {conv.otherUserAvatar ? (
                  <Image src={conv.otherUserAvatar} alt={conv.otherUserName ?? ''} width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-[#111] truncate">{conv.otherUserName ?? 'Misafir'}</p>
                <p className="text-xs text-muted-foreground">
                  {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString('tr-TR') : '—'}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="shrink-0 h-5 min-w-[20px] rounded-full bg-[#0d9488] text-white text-xs font-semibold flex items-center justify-center px-1.5">
                  {conv.unreadCount}
                </span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
