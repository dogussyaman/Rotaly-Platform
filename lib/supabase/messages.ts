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

  const { data, error } = await supabase
    .from('conversations')
    .select(
      `
        id,
        participant_1,
        participant_2,
        last_message_at,
        profiles_participant_1:profiles!conversations_participant_1_fkey (
          id,
          full_name,
          avatar_url
        ),
        profiles_participant_2:profiles!conversations_participant_2_fkey (
          id,
          full_name,
          avatar_url
        )
      `
    )
    .or(`participant_1.eq.${currentUserId},participant_2.eq.${currentUserId}`)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('fetchConversations error:', error.message);
    return [];
  }

  // Unread counts: query messages where receiver = currentUser and is_read = false
  const { data: unreadData, error: unreadError } = await supabase
    .from('messages')
    .select('conversation_id, is_read')
    .eq('receiver_id', currentUserId)
    .eq('is_read', false);

  const unreadMap = new Map<string, number>();
  if (!unreadError && unreadData) {
    for (const row of unreadData as any[]) {
      unreadMap.set(row.conversation_id, (unreadMap.get(row.conversation_id) ?? 0) + 1);
    }
  }

  return (data ?? []).map((row: any) => {
    const isParticipant1 = row.participant_1 === currentUserId;
    const otherProfile = isParticipant1 ? row.profiles_participant_2 : row.profiles_participant_1;

    return {
      id: row.id,
      otherUserId: otherProfile?.id ?? '',
      otherUserName: otherProfile?.full_name ?? null,
      otherUserAvatar: otherProfile?.avatar_url ?? null,
      lastMessage: null,
      lastMessageTime: row.last_message_at,
      unreadCount: unreadMap.get(row.id) ?? 0,
    } as ConversationSummary;
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

  // Try to find existing conversation
  // Note: Standard Supabase .or() with complex and/or might be tricky,
  // we'll try a simpler approach if needed, but this is the logical way.
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant_1.eq.${user1Id},participant_2.eq.${user2Id}),and(participant_1.eq.${user2Id},participant_2.eq.${user1Id})`)
    .maybeSingle();

  if (existing) {
    return existing.id;
  }

  // Create new if not found
  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({
      participant_1: user1Id < user2Id ? user1Id : user2Id,
      participant_2: user1Id < user2Id ? user2Id : user1Id,
    })
    .select('id')
    .single();

  if (createError) {
    console.error('getOrCreateConversation error:', createError.message);
    return null;
  }

  return created.id;
}

