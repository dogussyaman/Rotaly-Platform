'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from '@/lib/i18n/locale-context';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  otherUserName: string;
  otherUserAvatar: string;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatWindow({
  conversationId,
  otherUserName,
  otherUserAvatar,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={otherUserAvatar}
              alt={otherUserName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h2 className="font-semibold text-foreground">{otherUserName}</h2>
              <p className="text-xs text-muted-foreground">
                {t.chatActiveNow as string}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.isCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 max-w-xs ${
                  message.isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!message.isCurrentUser && (
                  <Image
                    src={otherUserAvatar}
                    alt={otherUserName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div
                  className={`flex flex-col ${
                    message.isCurrentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatTime(new Date(message.createdAt))}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <Image
              src={otherUserAvatar}
              alt={otherUserName}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-border bg-card/50 backdrop-blur-sm p-4"
      >
        <div className="flex gap-2 items-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            placeholder={t.messagesInputPlaceholder as string}
            className="bg-background border-border flex-1"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
