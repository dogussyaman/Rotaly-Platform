'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ChatMessage } from '@/lib/supabase/messages';

/**
 * Bu konuşmaya eklenen her yeni mesajı (INSERT) dinler ve onNewMessage ile bildirir.
 * conversationId veya currentUserId yoksa abonelik kurulmaz.
 */
export function useMessagesRealtime(
  conversationId: string | null,
  currentUserId: string | null,
  onNewMessage: (message: ChatMessage) => void,
) {
  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as { id: string; sender_id: string; content: string; created_at: string };
          if (!row?.id) return;
          const message: ChatMessage = {
            id: row.id,
            conversationId,
            senderId: row.sender_id,
            content: row.content,
            createdAt: row.created_at,
            isCurrentUser: row.sender_id === currentUserId,
          };
          onNewMessageRef.current(message);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);
}
