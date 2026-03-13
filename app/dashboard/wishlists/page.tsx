import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WISHLISTS, WISHLIST_ITEMS } from '@/lib/mock/dashboard';

export default function WishlistsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="Favoriler" description="Favori listeleri ve liste öğeleri.">
        <div className="grid gap-4 xl:grid-cols-2">
          <ContentCard title="Liste Başlıkları" description="Misafir favori listeleri">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liste</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>İçerik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WISHLISTS.map((list) => (
                  <TableRow key={list.name}>
                    <TableCell className="font-medium">{list.name}</TableCell>
                    <TableCell>{list.user}</TableCell>
                    <TableCell>{list.items} ilan</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ContentCard>

          <ContentCard title="Liste Öğeleri" description="wishlist_items ilişkisi">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Liste</TableHead>
                  <TableHead>İlan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WISHLIST_ITEMS.map((item) => (
                  <TableRow key={`${item.wishlist}-${item.listing}`}>
                    <TableCell>{item.wishlist}</TableCell>
                    <TableCell>{item.listing}</TableCell>
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

