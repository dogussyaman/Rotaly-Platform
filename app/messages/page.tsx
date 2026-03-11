'use client';

import { useEffect, useState } from 'react';
import { ChatWindow } from '@/components/messaging/chat-window';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n/locale-context';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchConversations, fetchMessages, sendMessage, type ConversationSummary, type ChatMessage } from '@/lib/supabase/messages';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLocale();
  const { profile } = useAppSelector((s) => s.user);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const data = await fetchConversations(profile.id);
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
        const msgs = await fetchMessages(data[0].id, profile.id);
        setMessages(msgs);
      }
    };
    load();
  }, [profile]);

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (messageContent: string) => {
    if (!profile || !selectedConversation) return;
    sendMessage({
      conversationId: selectedConversation.id,
      senderId: profile.id,
      receiverId: selectedConversation.otherUserId,
      content: messageContent,
    }).then((saved) => {
      if (saved) {
        setMessages((prev) => [...prev, saved]);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StayHub
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {t.messagesTitle as string}
          </h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="flex h-screen max-h-[calc(100vh-73px)]">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`${
            isMobile && selectedConversation ? 'hidden' : 'flex flex-col'
          } w-full md:w-80 border-r border-border bg-card/30`}
        >
          {/* Search */}
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

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <motion.button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    if (profile) {
                      fetchMessages(conversation.id, profile.id).then(setMessages);
                    }
                    setIsMobile(true);
                  }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  className={`w-full border-b border-border p-4 flex items-center gap-3 transition-colors ${
                    selectedConversation.id === conversation.id
                      ? 'bg-muted'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={conversation.otherUserAvatar}
                      alt={conversation.otherUserName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {conversation.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-semibold text-foreground truncate">
                    {conversation.otherUserName ?? 'Kullanıcı'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage ?? ''}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0"
                    >
                      {conversation.unreadCount}
                    </motion.div>
                  )}
                </motion.button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare className="w-8 h-8 mb-2" />
                <p className="text-sm">
                  {t.messagesNoConversations as string}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        {selectedConversation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col relative"
          >
            {/* Mobile Back Button */}
            <button
              onClick={() => setIsMobile(false)}
              className="absolute left-4 top-4 md:hidden z-50 p-2 hover:bg-muted rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <ChatWindow
              conversationId={selectedConversation.id}
              otherUserName={selectedConversation.otherUserName}
              otherUserAvatar={selectedConversation.otherUserAvatar}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedConversation && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex flex-1 items-center justify-center text-muted-foreground"
          >
            <div className="text-center space-y-4">
              <MessageSquare className="w-12 h-12 mx-auto opacity-50" />
              <h2 className="text-lg font-semibold text-foreground">
                {t.messagesSelectConversation as string}
              </h2>
              <p className="text-sm">
                {t.messagesSelectConversationSubtitle as string}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
