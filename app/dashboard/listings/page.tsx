import { ContentCard, ListingsTable, Section } from '@/components/dashboard/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LISTINGS, LISTING_IMAGES, AMENITIES, LISTING_AMENITIES, HOUSE_RULES } from '@/lib/mock/dashboard';

export default function ListingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-6 lg:px-6">
      <Section title="İlanlar" description="İlan içerikleri, görseller, imkanlar ve kurallar.">
        <div className="grid gap-4 xl:grid-cols-3">
          <ContentCard title="İlanlar" description="property_type, fiyat ve aktiflik durumu">
            <ListingsTable listings={LISTINGS} />
          </ContentCard>

          <div className="grid gap-4">
            <ContentCard title="Görseller" description="listing_images tablosu">
              <div className="space-y-2 text-sm">
                {LISTING_IMAGES.map((image) => (
                  <div key={image.url} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{image.listing}</p>
                      <p className="text-xs text-muted-foreground">{image.url}</p>
                    </div>
                    <Badge variant={image.isPrimary ? 'default' : 'outline'}>#{image.sortOrder}</Badge>
                  </div>
                ))}
              </div>
            </ContentCard>

            <ContentCard title="İmkanlar & Kurallar" description="amenities, listing_amenities, house_rules">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Temel İmkanlar</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {AMENITIES.map((amenity) => (
                      <Badge key={amenity.name} variant="secondary">
                        {amenity.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                {LISTING_AMENITIES.map((mapping) => (
                  <div key={mapping.listing}>
                    <p className="font-medium">{mapping.listing}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mapping.amenities.map((amenity) => (
                        <Badge key={`${mapping.listing}-${amenity}`} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <Separator />
                {HOUSE_RULES.map((rule) => (
                  <div key={rule.listing} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{rule.listing}:</span>{' '}
                    Sigara {rule.smoking ? 'serbest' : 'yasak'}, Evcil hayvan {rule.pets ? 'serbest' : 'yasak'}, Parti{' '}
                    {rule.parties ? 'serbest' : 'yasak'}
                  </div>
                ))}
              </div>
            </ContentCard>
          </div>
        </div>
      </Section>
    </div>
  );
}

