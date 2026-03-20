'use client';
'use client';

import { useEffect, useRef } from 'react';
import { Send, MessageCircleDashed, Loader2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ChatMessage, ConversationSummary } from '@/lib/supabase/messages';

function initials(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatMsgTime(iso: string) {
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso: string) {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  /* ── No conversation selected ── */
  if (!conversation) {
    return (
      <div className="flex flex-1 h-full items-center justify-center bg-muted/20 p-8">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageCircleDashed className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Bir konuşma seçin</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sol panelden bir konuşma seçin veya rezervasyon sayfasından misafire mesaj gönderin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/70 backdrop-blur-sm shrink-0">
        <Avatar className="h-9 w-9 shrink-0">
          {conversation.otherUserAvatar && (
            <AvatarImage src={conversation.otherUserAvatar} alt={conversation.otherUserName ?? ''} />
          )}
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
            {initials(conversation.otherUserName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold leading-none">
            {conversation.otherUserName ?? 'Kullanıcı'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Konuşma</p>
        </div>
      </div>

      {/* ── Messages ── */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-4">
          {loadingMessages ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={cn('flex gap-2', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
                  {i % 2 === 0 && <Skeleton className="h-7 w-7 rounded-full shrink-0 self-end" />}
                  <Skeleton className={cn('h-10 rounded-2xl', i % 2 === 0 ? 'w-48 rounded-bl-sm' : 'w-60 rounded-br-sm')} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-50 py-12 text-center">
              <MessageCircleDashed className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Henüz mesaj yok</p>
              <p className="text-xs text-muted-foreground/60 mt-1">İlk mesajı siz yazın.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {messages.map((msg, idx) => {
                const showDateSep =
                  idx === 0 || !isSameDay(messages[idx - 1].createdAt, msg.createdAt);
                const prevMsg = messages[idx - 1] ?? null;
                const nextMsg = messages[idx + 1] ?? null;
                const isGroupEnd = !nextMsg || nextMsg.isCurrentUser !== msg.isCurrentUser;
                const isGroupStart = !prevMsg || prevMsg.isCurrentUser !== msg.isCurrentUser;

                return (
                  <div key={msg.id}>
                    {/* Date separator */}
                    {showDateSep && (
                      <div className="flex items-center gap-3 my-5">
                        <div className="h-px flex-1 bg-border/50" />
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted/70 rounded-full px-2.5 py-0.5">
                          {dayLabel(msg.createdAt)}
                        </span>
                        <div className="h-px flex-1 bg-border/50" />
                      </div>
                    )}

                    {/* Bubble row */}
                    <div
                      className={cn(
                        'flex items-end gap-2',
                        msg.isCurrentUser ? 'flex-row-reverse' : 'flex-row',
                        isGroupEnd ? 'mb-3' : 'mb-0.5',
                        isGroupStart && !showDateSep ? 'mt-3' : '',
                      )}
                    >
                      {/* Other-user avatar (only on last bubble in group) */}
                      {!msg.isCurrentUser && (
                        <div className="w-7 shrink-0">
                          {isGroupEnd && (
                            <Avatar className="h-7 w-7">
                              {conversation.otherUserAvatar && (
                                <AvatarImage
                                  src={conversation.otherUserAvatar}
                                  alt={conversation.otherUserName ?? ''}
                                />
                              )}
                              <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                                {initials(conversation.otherUserName)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={cn(
                          'flex flex-col gap-1 max-w-[72%]',
                          msg.isCurrentUser ? 'items-end' : 'items-start',
                        )}
                      >
                        <div
                          className={cn(
                            'px-3.5 py-2 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap',
                            msg.isCurrentUser
                              ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm shadow-sm'
                              : 'bg-muted text-foreground rounded-2xl rounded-bl-sm',
                            !isGroupEnd && msg.isCurrentUser && 'rounded-br-2xl rounded-tr-sm',
                            !isGroupEnd && !msg.isCurrentUser && 'rounded-bl-2xl rounded-tl-sm',
                          )}
                        >
                          {msg.content}
                        </div>
                        {isGroupEnd && (
                          <span className="text-[10px] text-muted-foreground px-1">
                            {formatMsgTime(msg.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ── Input area ── */}
      <div className="px-4 py-3 border-t border-border bg-card/70 shrink-0">
        <form onSubmit={onSend} className="flex items-end gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            rows={1}
            disabled={sending}
            className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 max-h-30 overflow-y-auto field-sizing-content"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-xl h-10.5 w-10.5 shrink-0"
            disabled={!replyText.trim() || sending}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-1.5 pl-1">
          Enter ile gönder · Shift+Enter ile satır ekle
        </p>
      </div>
    </div>
  );
}
