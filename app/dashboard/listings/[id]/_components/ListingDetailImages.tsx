'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentCard } from '@/components/dashboard/dashboard-ui';
import { Loader2, Plus, Star, Trash2, ImagePlus } from 'lucide-react';
import type { ListingImageRow } from '@/lib/supabase/listing-images';

interface ListingDetailImagesProps {
  imageRows: ListingImageRow[] | null;
  displayImages: string[];
  isOwner: boolean;
  newImageUrl: string;
  setNewImageUrl: (v: string) => void;
  addImagePending: boolean;
  imageLoading: boolean;
  onAddByUrl: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetPrimary: (img: ListingImageRow) => void;
  onDelete: (img: ListingImageRow) => void;
}

export function ListingDetailImages({
  imageRows,
  displayImages,
  isOwner,
  newImageUrl,
  setNewImageUrl,
  addImagePending,
  imageLoading,
  onAddByUrl,
  onUpload,
  onSetPrimary,
  onDelete,
}: ListingDetailImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <ContentCard title="Görseller" description="İlan görselleri">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {imageRows && imageRows.length > 0
            ? imageRows.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.altText ?? ''}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {item.isPrimary ? (
                      <span className="rounded bg-[#0d9488] px-2 py-1 text-xs font-medium text-white">
                        Ana görsel
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs"
                        onClick={() => onSetPrimary(item)}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Ana yap
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-8 text-xs"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            : displayImages.map((url, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
        </div>
        {isOwner && (
          <div className="flex flex-col gap-2 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground">Görsel ekle</p>
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Görsel URL'si"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="max-w-xs"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={addImagePending || !newImageUrl.trim()}
                onClick={onAddByUrl}
              >
                {addImagePending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                URL ile ekle
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={onUpload}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={imageLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                {imageLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                Dosya yükle
              </Button>
            </div>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
