'use client';

import { useEffect, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { BooleanBadge, ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchConversations, ConversationSummary } from '@/lib/supabase/messages';

export default function MessagesPage() {
  const { profile } = useAppSelector((s) => s.user);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      if (profile?.id) {
        const data = await fetchConversations(profile.id);
        setConversations(data);
      }
      setLoading(false);
    }
    loadConversations();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 py-6 lg:px-7">
      <Section title="Mesajlar" description="Misafirlerinizle olan tüm iletişiminiz.">
        <div className="grid gap-4 xl:grid-cols-1">
          <ContentCard title="Konuşmalar" description="Gelen mesajlar ve aktif görüşmeler">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Misafir</TableHead>
                  <TableHead>Son Mesaj Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Henüz mesaj bulunmuyor.
                    </TableCell>
                  </TableRow>
                ) : (
                  conversations.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            {conv.otherUserAvatar ? (
                              <img src={conv.otherUserAvatar} alt="" className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <MessageCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p>{conv.otherUserName ?? 'Misafir'}</p>
                            <p className="text-[10px] text-muted-foreground font-normal">ID: {conv.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleString('tr-TR') : '—'}
                      </TableCell>
                      <TableCell>
                        {conv.unreadCount > 0 ? (
                          <Badge variant="destructive">{conv.unreadCount} Yeni</Badge>
                        ) : (
                          <Badge variant="outline">Okundu</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="text-xs text-primary hover:underline font-medium">Görüntüle</button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}
