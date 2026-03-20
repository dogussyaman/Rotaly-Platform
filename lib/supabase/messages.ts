import { createClient } from '@/lib/supabase/client';

export interface ConversationSummary {
  id: string;
  otherUserId: string;
  otherUserName: string | null;
  otherUserAvatar: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
}

export async function fetchConversations(currentUserId: string): Promise<ConversationSummary[]> {
  const supabase = createClient();

  const { data: rows, error } = await supabase
    .from('conversations')
    .select('id, participant_1, participant_2, last_message_at')
    .or(`participant_1.eq.${currentUserId},participant_2.eq.${currentUserId}`)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('fetchConversations error:', error.message);
    return [];
  }

  if (!rows?.length) return [];

  const conversationIds = (rows as any[]).map((r) => r.id).filter(Boolean);
  const latestMessageMap = new Map<string, { content: string | null; created_at: string | null }>();

  if (conversationIds.length > 0) {
    const { data: latestMessages, error: latestMessagesError } = await supabase
      .from('messages')
      .select('conversation_id, content, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    if (latestMessagesError) {
      console.error('fetchConversations latest messages error:', latestMessagesError.message);
    } else {
      for (const msg of latestMessages ?? []) {
        const conversationId = (msg as any).conversation_id as string;
        if (!latestMessageMap.has(conversationId)) {
          latestMessageMap.set(conversationId, {
            content: (msg as any).content ?? null,
            created_at: (msg as any).created_at ?? null,
          });
        }
      }
    }
  }

  const otherUserIds = [...new Set(
    (rows as any[]).map((r) =>
      r.participant_1 === currentUserId ? r.participant_2 : r.participant_1
    )
  )].filter(Boolean);

  const profileMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
  if (otherUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', otherUserIds);
    for (const p of profiles ?? []) {
      profileMap.set((p as any).id, {
        full_name: (p as any).full_name ?? null,
        avatar_url: (p as any).avatar_url ?? null,
      });
    }
  }

  const { data: unreadData, error: unreadError } = await supabase
    .from('messages')
    .select('conversation_id')
    .eq('receiver_id', currentUserId)
    .eq('is_read', false);

  const unreadMap = new Map<string, number>();
  if (!unreadError && unreadData) {
    for (const row of unreadData as any[]) {
      unreadMap.set(row.conversation_id, (unreadMap.get(row.conversation_id) ?? 0) + 1);
    }
  }

  const withOther = (rows as any[]).map((row) => {
    const isParticipant1 = row.participant_1 === currentUserId;
    const otherUserId = isParticipant1 ? row.participant_2 : row.participant_1;
    const profile = otherUserId ? profileMap.get(otherUserId) : null;
    const latestMessage = latestMessageMap.get(row.id);

    return {
      id: row.id,
      otherUserId: otherUserId ?? '',
      otherUserName: profile?.full_name ?? null,
      otherUserAvatar: profile?.avatar_url ?? null,
      lastMessage: latestMessage?.content ?? null,
      lastMessageTime: latestMessage?.created_at ?? row.last_message_at,
      unreadCount: unreadMap.get(row.id) ?? 0,
    } as ConversationSummary;
  });

  // One row per other user: keep the conversation with latest last_message_at
  const byOther = new Map<string, ConversationSummary>();
  for (const row of withOther) {
    const existing = byOther.get(row.otherUserId);
    const rowTime = row.lastMessageTime ? new Date(row.lastMessageTime).getTime() : 0;
    const existingTime = existing?.lastMessageTime ? new Date(existing.lastMessageTime).getTime() : 0;
    if (!existing || rowTime > existingTime) {
      byOther.set(row.otherUserId, row);
    }
  }
  return Array.from(byOther.values()).sort((a, b) => {
    const tA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const tB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return tB - tA;
  });
}

export async function fetchMessages(
  conversationId: string,
  currentUserId: string
): Promise<ChatMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, created_at, is_read')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('fetchMessages error:', error.message);
    return [];
  }

  // Gelen okunmamış mesajları okundu işaretle
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .eq('receiver_id', currentUserId)
    .eq('is_read', false);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at,
    isCurrentUser: row.sender_id === currentUserId,
  }));
}

export interface SendMessageInput {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

export async function sendMessage(input: SendMessageInput): Promise<ChatMessage | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: input.conversationId,
      sender_id: input.senderId,
      receiver_id: input.receiverId,
      content: input.content,
    })
    .select('id, conversation_id, sender_id, content, created_at')
    .single();

  if (error) {
    console.error('sendMessage error:', error.message);
    return null;
  }

  // Konuşmanın son mesaj zamanını güncelle
  await supabase
    .from('conversations')
    .update({ last_message_at: data.created_at })
    .eq('id', input.conversationId);

  return {
    id: data.id,
    conversationId: data.conversation_id,
    senderId: data.sender_id,
    content: data.content,
    createdAt: data.created_at,
    isCurrentUser: true,
  };
}

export async function getOrCreateConversation(
  user1Id: string,
  user2Id: string
): Promise<string | null> {
  const supabase = createClient();

  // Find existing conversation with two explicit lookups (same order as insert: p1 < p2)
  const p1 = user1Id < user2Id ? user1Id : user2Id;
  const p2 = user1Id < user2Id ? user2Id : user1Id;

  const { data: existing1 } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1', p1)
    .eq('participant_2', p2)
    .maybeSingle();

  if (existing1) return existing1.id;

  const { data: existing2 } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1', p2)
    .eq('participant_2', p1)
    .maybeSingle();

  if (existing2) return existing2.id;

  // Create new with canonical order (participant_1 < participant_2)
  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({
      participant_1: p1,
      participant_2: p2,
    })
    .select('id')
    .single();

  if (createError) {
    console.error('getOrCreateConversation error:', createError.message);
    return null;
  }

  return created.id;
}

