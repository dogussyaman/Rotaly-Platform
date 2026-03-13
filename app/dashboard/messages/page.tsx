import { BooleanBadge, ContentCard, ConversationsTable, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CONVERSATIONS, MESSAGES } from '@/lib/mock/dashboard';

export default function MessagesPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Mesajlar" description="Konuşmalar, mesajlar ve okunmamışlar.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Konuşmalar" description="conversations tablosu">
            <ConversationsTable conversations={CONVERSATIONS} />
          </ContentCard>

          <ContentCard title="Son Mesajlar" description="messages tablosu">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Konuşma</TableHead>
                  <TableHead>Gönderen</TableHead>
                  <TableHead>Mesaj</TableHead>
                  <TableHead>Okundu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MESSAGES.map((message) => (
                  <TableRow key={`${message.conversation}-${message.createdAt}`}>
                    <TableCell>{message.conversation}</TableCell>
                    <TableCell>{message.sender}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{message.content}</TableCell>
                    <TableCell>
                      <BooleanBadge value={message.isRead} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>
        </div>
      </Section>
    </div>
  );
}

