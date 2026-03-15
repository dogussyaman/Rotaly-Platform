'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ContentCard, Section, StatusBadge } from '@/components/dashboard/dashboard-ui';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import type { HostBooking, HostListingCard } from '@/lib/supabase/host';
import type { BookingWithListing } from '@/lib/supabase/bookings';
import type { ConversationSummary } from '@/lib/supabase/messages';

type Role = 'admin' | 'host' | 'guest';

interface SearchResultsTabsProps {
  q: string;
  role: Role;
  activeTab: string;
  setActiveTab: (v: 'listings' | 'bookings' | 'messages') => void;
  listings: { rows: HostListingCard[]; total: number; pageSize: number };
  listingsPage: number;
  setListingsPage: (n: number) => void;
  hostBookings: { rows: HostBooking[]; total: number; pageSize: number };
  guestBookings: { rows: BookingWithListing[]; total: number; pageSize: number };
  bookingsPage: number;
  setBookingsPage: (n: number) => void;
  conversationsPaged: { rows: ConversationSummary[]; total: number; pageSize: number };
  messagesPage: number;
  setMessagesPage: (n: number) => void;
}

export function SearchResultsTabs({
  q,
  role,
  activeTab,
  setActiveTab,
  listings,
  listingsPage,
  setListingsPage,
  hostBookings,
  guestBookings,
  bookingsPage,
  setBookingsPage,
  conversationsPaged,
  messagesPage,
  setMessagesPage,
}: SearchResultsTabsProps) {
  return (
    <Section title="Arama" description={q ? `"${q}" için sonuçlar` : 'Aramak için üstteki arama alanını kullanın.'}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'listings' | 'bookings' | 'messages')}>
        <TabsList className="rounded-2xl bg-[#F4F7F6] p-1">
          {role === 'host' ? <TabsTrigger value="listings" className="rounded-xl">İlanlar</TabsTrigger> : null}
          <TabsTrigger value="bookings" className="rounded-xl">Rezervasyonlar</TabsTrigger>
          <TabsTrigger value="messages" className="rounded-xl">Mesajlar</TabsTrigger>
        </TabsList>

        {role === 'host' ? (
          <TabsContent value="listings" className="mt-4">
            <ContentCard title="İlan Sonuçları" description="Eşleşen ilanlar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>İlan</TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Sonuç bulunamadı.</TableCell>
                    </TableRow>
                  ) : (
                    listings.rows.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium">{l.title}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{l.location}</TableCell>
                        <TableCell>{l.isActive ? <Badge>Aktif</Badge> : <Badge variant="secondary">Pasif</Badge>}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="pt-4 flex justify-center">
                <PaginationControls page={listingsPage} pageSize={listings.pageSize} total={listings.total} onPageChange={setListingsPage} />
              </div>
            </ContentCard>
          </TabsContent>
        ) : null}

        <TabsContent value="bookings" className="mt-4">
          <ContentCard title="Rezervasyon Sonuçları" description="Eşleşen rezervasyonlar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İlan</TableHead>
                  <TableHead>Tarih</TableHead>
                  {role === 'host' ? <TableHead>Misafir</TableHead> : null}
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {role === 'host'
                  ? hostBookings.rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Sonuç bulunamadı.</TableCell>
                      </TableRow>
                    ) : hostBookings.rows.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.listingTitle ?? 'İlan'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{b.checkIn} → {b.checkOut}</TableCell>
                          <TableCell className="text-xs">{b.guestName ?? 'Misafir'}</TableCell>
                          <TableCell><StatusBadge status={b.status} /></TableCell>
                        </TableRow>
                      ))
                  : guestBookings.rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Sonuç bulunamadı.</TableCell>
                      </TableRow>
                    ) : guestBookings.rows.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.listing?.title ?? 'İlan'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{b.checkIn} → {b.checkOut}</TableCell>
                          <TableCell><StatusBadge status={b.status} /></TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>
            <div className="pt-4 flex justify-center">
              <PaginationControls
                page={bookingsPage}
                pageSize={10}
                total={role === 'host' ? hostBookings.total : guestBookings.total}
                onPageChange={setBookingsPage}
              />
            </div>
          </ContentCard>
        </TabsContent>

        <TabsContent value="messages" className="mt-4">
          <ContentCard title="Mesaj Sonuçları" description="Eşleşen konuşmalar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Son Mesaj</TableHead>
                  <TableHead>Okunmamış</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversationsPaged.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Sonuç bulunamadı.</TableCell>
                  </TableRow>
                ) : (
                  conversationsPaged.rows.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.otherUserName ?? 'Kullanıcı'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleString('tr-TR') : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={c.unreadCount > 0 ? 'destructive' : 'outline'}>{c.unreadCount}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/messages?conversation=${encodeURIComponent(c.id)}`} className="text-xs text-primary hover:underline font-medium">Görüntüle</Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="pt-4 flex justify-center">
              <PaginationControls
                page={messagesPage}
                pageSize={conversationsPaged.pageSize}
                total={conversationsPaged.total}
                onPageChange={setMessagesPage}
              />
            </div>
          </ContentCard>
        </TabsContent>
      </Tabs>
    </Section>
  );
}
