'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { fetchMessages } from '@/lib/supabase/messages';
import type { ConversationSummary } from '@/lib/supabase/messages';

const FALLBACK_AVATAR = '/placeholder-user.jpg';

interface MessagesSidebarProps {
  conversations: ConversationSummary[];
  filteredConversations: ConversationSummary[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedConversation: ConversationSummary | null;
  onSelectConversation: (c: ConversationSummary) => void;
  isMobile: boolean;
  hasSelection: boolean;
  t: Record<string, unknown>;
}

export function MessagesSidebar({
  conversations,
  filteredConversations,
  searchQuery,
  setSearchQuery,
  selectedConversation,
  onSelectConversation,
  isMobile,
  hasSelection,
  t,
}: MessagesSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isMobile && hasSelection ? 'hidden' : 'flex flex-col'} w-full md:w-80 border-r border-border bg-card/30`}
    >
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t.messagesSearchPlaceholder as string}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <motion.button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              className={`w-full border-b border-border p-4 flex items-center gap-3 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : 'hover:bg-muted/50'
              }`}
            >
              <Image
                src={conversation.otherUserAvatar ?? FALLBACK_AVATAR}
                alt={conversation.otherUserName ?? 'Kullanıcı'}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-foreground truncate">{conversation.otherUserName ?? 'Kullanıcı'}</h3>
                <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage ?? ''}</p>
              </div>
              {conversation.unreadCount > 0 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0"
                >
                  {conversation.unreadCount}
                </motion.div>
              ) : null}
            </motion.button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p className="text-sm">{t.messagesNoConversations as string}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
