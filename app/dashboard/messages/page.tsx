'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Section } from '@/components/dashboard/dashboard-ui';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchConversations, fetchMessages, sendMessage, type ChatMessage, type ConversationSummary } from '@/lib/supabase/messages';
import { useMessagesRealtime } from '@/lib/supabase/use-messages-realtime';
import { ConversationList } from './_components/ConversationList';
import { ConversationThread } from './_components/ConversationThread';

export default function DashboardMessagesPage() {
  const { profile } = useAppSelector((s) => s.user);
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversation');

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      if (!profile?.id) return;
      setLoadingConversations(true);
      const data = await fetchConversations(profile.id);
      setConversations(data);
      setLoadingConversations(false);
      const conv =
        conversationIdFromUrl && data.length > 0
          ? data.find((c) => c.id === conversationIdFromUrl) ?? data[0]
          : data.length > 0
            ? data[0]
            : null;
      setSelectedConversation(conv);
    }
    void load();
  }, [profile?.id, conversationIdFromUrl]);

  useEffect(() => {
    if (!selectedConversation || !profile?.id) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    fetchMessages(selectedConversation.id, profile.id).then((msgs) => {
      setMessages(msgs);
      setLoadingMessages(false);
    });
  }, [selectedConversation?.id, profile?.id]);

  useMessagesRealtime(selectedConversation?.id ?? null, profile?.id ?? null, (msg) => {
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = replyText.trim();
    if (!content || !profile || !selectedConversation || sending) return;
    setSending(true);
    const saved = await sendMessage({
      conversationId: selectedConversation.id,
      senderId: profile.id,
      receiverId: selectedConversation.otherUserId,
      content,
    });
    setSending(false);
    setReplyText('');
    if (saved) setMessages((prev) => (prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]));
    const fresh = await fetchMessages(selectedConversation.id, profile.id);
    setMessages(fresh);
  };

  if (!profile?.id) return null;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section title="Mesajlar" description="Gelen mesajları görüntüleyin ve cevap yazın." />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr] rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id ?? null}
          loading={loadingConversations}
        />
        <div className="flex flex-col max-h-[calc(100vh-12rem)] min-h-[420px]">
          <ConversationThread
            conversation={selectedConversation}
            messages={messages}
            loadingMessages={loadingMessages}
            replyText={replyText}
            setReplyText={setReplyText}
            sending={sending}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
