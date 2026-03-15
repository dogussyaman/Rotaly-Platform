'use client';

import Image from 'next/image';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatMessage, ConversationSummary } from '@/lib/supabase/messages';

interface ConversationThreadProps {
  conversation: ConversationSummary | null;
  messages: ChatMessage[];
  loadingMessages: boolean;
  replyText: string;
  setReplyText: (v: string) => void;
  sending: boolean;
  onSend: (e: React.FormEvent) => void;
}

export function ConversationThread({
  conversation,
  messages,
  loadingMessages,
  replyText,
  setReplyText,
  sending,
  onSend,
}: ConversationThreadProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Bir konuşma seçin veya rezervasyon sayfasından misafire mesaj gönderin.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-muted overflow-hidden">
          {conversation.otherUserAvatar ? (
            <Image src={conversation.otherUserAvatar} alt={conversation.otherUserName ?? ''} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <p className="font-semibold text-sm text-[#111]">{conversation.otherUserName ?? 'Misafir'}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#0d9488]" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Henüz mesaj yok. İlk mesajı siz yazın.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  msg.isCurrentUser ? 'bg-[#0d9488] text-white rounded-br-md' : 'bg-[#f3f4f6] text-[#111] rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.isCurrentUser ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {new Date(msg.createdAt).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={onSend} className="p-3 border-t border-[#e5e7eb] bg-white">
        <div className="flex gap-2">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="rounded-xl flex-1"
            disabled={sending}
          />
          <Button type="submit" size="icon" className="rounded-xl bg-[#0d9488] hover:bg-[#0f766e] shrink-0" disabled={!replyText.trim() || sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </>
  );
}
