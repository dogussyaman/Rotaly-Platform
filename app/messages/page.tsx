'use client';

import { useState } from 'react';
import { ChatWindow } from '@/components/messaging/chat-window';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Conversation {
  id: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    otherUserName: 'Sarah Wilson',
    otherUserAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    lastMessage: "Thanks for the quick response! See you next week.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isActive: false,
  },
  {
    id: 'conv-2',
    otherUserName: 'James Mitchell',
    otherUserAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    lastMessage: 'Can you tell me more about the amenities?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
    isActive: true,
  },
  {
    id: 'conv-3',
    otherUserName: 'Emma Davis',
    otherUserAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    lastMessage: 'Perfect! I will check in early.',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 0,
    isActive: false,
  },
];

const MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'James Mitchell',
    senderAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content: 'Hi, I am interested in your listing. Can I ask a few questions?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isCurrentUser: false,
  },
  {
    id: 'msg-2',
    sender: 'You',
    senderAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content: 'Of course! Feel free to ask anything.',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    isCurrentUser: true,
  },
  {
    id: 'msg-3',
    sender: 'James Mitchell',
    senderAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content: 'Can you tell me more about the amenities?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isCurrentUser: false,
  },
  {
    id: 'msg-4',
    sender: 'James Mitchell',
    senderAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content:
      'Specifically, does it have WiFi? And is there a kitchen for cooking?',
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
    isCurrentUser: false,
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    CONVERSATIONS[1]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [isMobile, setIsMobile] = useState(false);

  const filteredConversations = CONVERSATIONS.filter((conv) =>
    conv.otherUserName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (messageContent: string) => {
    const newMessage: Message = {
      id: `msg-${messages.length + 1}`,
      sender: 'You',
      senderAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      content: messageContent,
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);

    // Simulate a response
    setTimeout(() => {
      const response: Message = {
        id: `msg-${messages.length + 2}`,
        sender: selectedConversation.otherUserName,
        senderAvatar: selectedConversation.otherUserAvatar,
        content: "Thanks for the information! I'll let you know soon.",
        timestamp: new Date(),
        isCurrentUser: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StayHub
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
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
                placeholder="Search conversations..."
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
                      {conversation.otherUserName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
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
                <p className="text-sm">No conversations found</p>
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
                Select a conversation
              </h2>
              <p className="text-sm">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
