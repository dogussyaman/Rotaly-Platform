'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  fetchMessages, 
  sendMessage, 
  getOrCreateConversation, 
  type ChatMessage 
} from '@/lib/supabase/messages';
import { format } from 'date-fns';
import { useLocale } from '@/lib/i18n/locale-context';
import { dateFnsLocale } from '@/lib/i18n/format';

interface BookingMessagesProps {
  bookingId: string;
  guestId: string;
  hostUserId: string;
  onClose: () => void;
}

export function BookingMessages({ bookingId, guestId, hostUserId, onClose }: BookingMessagesProps) {
  const { t, locale } = useLocale();
  const dateLocale = dateFnsLocale(locale);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const convId = await getOrCreateConversation(guestId, hostUserId);
      if (convId) {
        setConversationId(convId);
        const msgs = await fetchMessages(convId, guestId);
        setMessages(msgs);
      }
      setLoading(false);
    };
    initChat();
  }, [guestId, hostUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !conversationId || sending) return;

    setSending(true);
    const msg = await sendMessage({
      conversationId,
      senderId: guestId,
      receiverId: hostUserId,
      content: inputText.trim()
    });

    if (msg) {
      setMessages(prev => [...prev, msg]);
      setInputText('');
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[400px] bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-border bg-muted/30 flex justify-between items-center">
        <h4 className="text-sm font-bold">{t.profileChatTitle as string}</h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-7 rounded-full">
          {t.profileClose as string}
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-muted-foreground italic">{t.profileChatEmpty as string}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.isCurrentUser 
                    ? 'bg-amber-500 text-foreground rounded-tr-none' 
                    : 'bg-muted text-foreground rounded-tl-none border border-border'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 opacity-60 ${msg.isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {format(new Date(msg.createdAt), 'HH:mm', { locale: dateLocale })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border bg-muted/10 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.profileChatPlaceholder as string}
          className="flex-1 bg-background border border-input rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <Button 
          size="icon" 
          onClick={handleSend} 
          disabled={!inputText.trim() || sending}
          className="rounded-xl shrink-0 h-9 w-9 bg-amber-500 text-foreground hover:bg-amber-600"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
