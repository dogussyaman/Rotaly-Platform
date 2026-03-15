'use client';

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface MessagesEmptyStateProps {
  t: Record<string, unknown>;
}

export function MessagesEmptyState({ t }: MessagesEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden md:flex flex-1 items-center justify-center text-muted-foreground"
    >
      <div className="text-center space-y-4">
        <MessageSquare className="w-12 h-12 mx-auto opacity-50" />
        <h2 className="text-lg font-semibold text-foreground">{t.messagesSelectConversation as string}</h2>
        <p className="text-sm">{t.messagesSelectConversationSubtitle as string}</p>
      </div>
    </motion.div>
  );
}
