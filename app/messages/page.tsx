'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ChatWindow } from '@/components/messaging/chat-window';
import { useLocale } from '@/lib/i18n/locale-context';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchUserProfile } from '@/lib/store/slices/user-slice';
import { fetchConversations, fetchMessages, sendMessage, type ChatMessage, type ConversationSummary } from '@/lib/supabase/messages';
import { useMessagesRealtime } from '@/lib/supabase/use-messages-realtime';
import { MessagesSidebar } from './_components/MessagesSidebar';
import { MessagesEmptyState } from './_components/MessagesEmptyState';

const FALLBACK_AVATAR = '/placeholder-user.jpg';

function MessagesPageContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const { t } = useLocale();
  const { profile, loading: profileLoading, initialized } = useAppSelector((s) => s.user);
  const searchParams = useSearchParams();
  const initialConversationId = searchParams.get('conversation');

  useEffect(() => {
    if (!initialized && !profileLoading) void dispatch(fetchUserProfile());
  }, [dispatch, initialized, profileLoading]);

  useEffect(() => {
    if (initialized && !profileLoading && !profile) router.replace('/auth/login');
  }, [initialized, profileLoading, profile, router]);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const data = await fetchConversations(profile.id);
      setConversations(data);
      if (data.length === 0) {
        setSelectedConversation(null);
        setMessages([]);
        return;
      }
      const initial = (initialConversationId && data.find((c) => c.id === initialConversationId)) || data[0];
      setSelectedConversation(initial);
      const msgs = await fetchMessages(initial.id, profile.id);
      setMessages(msgs);
    };
    void load();
  }, [profile, initialConversationId]);

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conv) => (conv.otherUserName ?? '').toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  useMessagesRealtime(selectedConversation?.id ?? null, profile?.id ?? null, (msg) => {
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
  });

  const handleSendMessage = async (messageContent: string) => {
    if (!profile || !selectedConversation) return;
    const saved = await sendMessage({
      conversationId: selectedConversation.id,
      senderId: profile.id,
      receiverId: selectedConversation.otherUserId,
      content: messageContent,
    });
    if (saved) setMessages((prev) => (prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]));
    const fresh = await fetchMessages(selectedConversation.id, profile.id);
    setMessages(fresh);
  };

  if (!initialized || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Rotaly</Link>
          <h1 className="text-2xl font-bold text-foreground">{t.messagesTitle as string}</h1>
          <div className="w-24" />
        </div>
      </div>
      <div className="flex h-screen max-h-[calc(100vh-73px)]">
        <MessagesSidebar
          conversations={conversations}
          filteredConversations={filteredConversations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedConversation={selectedConversation}
          onSelectConversation={(c) => {
            setSelectedConversation(c);
            fetchMessages(c.id, profile.id).then(setMessages);
            setIsMobile(true);
          }}
          isMobile={isMobile}
          hasSelection={!!selectedConversation}
          t={t}
        />
        {selectedConversation ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col relative">
            <button onClick={() => setIsMobile(false)} className="absolute left-4 top-4 md:hidden z-50 p-2 hover:bg-muted rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ChatWindow
              conversationId={selectedConversation.id}
              otherUserName={selectedConversation.otherUserName ?? 'Kullanıcı'}
              otherUserAvatar={selectedConversation.otherUserAvatar ?? FALLBACK_AVATAR}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        ) : (
          <MessagesEmptyState t={t} />
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <MessagesPageContent />
    </Suspense>
  );
}
