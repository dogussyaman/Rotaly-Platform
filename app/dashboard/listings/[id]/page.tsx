'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCard, Section } from '@/components/dashboard/dashboard-ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppSelector } from '@/lib/store/hooks';
import { fetchListingById, type ListingDetail } from '@/lib/supabase/bookings';
import { fetchHostByUserId } from '@/lib/supabase/host';
import { updateListing, deleteListing, type UpdateListingInput } from '@/lib/supabase/listings';
import {
  getListingImages,
  addListingImage,
  uploadListingImage,
  setPrimaryImage,
  deleteListingImage,
  type ListingImageRow,
} from '@/lib/supabase/listing-images';
import { ListingDetailImages } from './_components/ListingDetailImages';
import { ListingDetailSummary } from './_components/ListingDetailSummary';
import { ListingDetailDescription } from './_components/ListingDetailDescription';
import { ListingDetailLocation } from './_components/ListingDetailLocation';
import { ListingEditForm } from './_components/ListingEditForm';
import { ListingSeasonalPricing } from './_components/ListingSeasonalPricing';

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.user);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentHostId, setCurrentHostId] = useState<string | null>(null);
  const [imageRows, setImageRows] = useState<ListingImageRow[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addImagePending, setAddImagePending] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateListingInput>({});
  const [savePending, setSavePending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const isOwner = !!(
    listing?.hostId &&
    currentHostId &&
    listing.hostId === currentHostId
  );

  useEffect(() => {
    (async () => {
      const data = await fetchListingById(id);
      setListing(data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!profile?.id) return;
    fetchHostByUserId(profile.id).then((host) => {
      setCurrentHostId(host?.hostId ?? null);
    });
  }, [profile?.id]);

  useEffect(() => {
    if (!isOwner || !id) return;
    getListingImages(id).then(setImageRows);
  }, [id, isOwner]);

  async function handleAddImageByUrl() {
    const url = newImageUrl.trim();
    if (!url || !id || addImagePending) return;
    setAddImagePending(true);
    const result = await addListingImage(id, { url, isPrimary: imageRows.length === 0 });
    setAddImagePending(false);
    if (result) {
      setNewImageUrl('');
      const list = await getListingImages(id);
      setImageRows(list);
      const next = await fetchListingById(id);
      if (next) setListing(next);
    }
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !id || imageLoading) return;
    e.target.value = '';
    setImageLoading(true);
    const result = await uploadListingImage(id, file, {
      isPrimary: imageRows.length === 0,
    });
    setImageLoading(false);
    if (result) {
      const list = await getListingImages(id);
      setImageRows(list);
      const next = await fetchListingById(id);
      if (next) setListing(next);
    }
  }

  async function handleSetPrimary(img: ListingImageRow) {
    if (!id || img.isPrimary) return;
    const ok = await setPrimaryImage(id, img.id);
    if (ok) {
      const list = await getListingImages(id);
      setImageRows(list);
      const next = await fetchListingById(id);
      if (next) setListing(next);
    }
  }

  async function handleDeleteImage(img: ListingImageRow) {
    if (!img.id) return;
    const ok = await deleteListingImage(img.id);
    if (ok) {
      setImageRows((prev) => prev.filter((i) => i.id !== img.id));
      const next = await fetchListingById(id);
      if (next) setListing(next);
    }
  }

  function openEditForm() {
    if (!listing) return;
    setEditForm({
      title: listing.title,
      description: listing.description ?? undefined,
      address: listing.address ?? undefined,
      city: listing.city ?? undefined,
      country: listing.country ?? undefined,
      pricePerNight: listing.pricePerNight,
      cleaningFee: listing.cleaningFee,
      serviceFee: listing.serviceFee,
      baseGuests: listing.baseGuests ?? 1,
      extraGuestFee: listing.extraGuestFee ?? 0,
      discountPercent: listing.discountPercent ?? undefined,
      maxGuests: listing.maxGuests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
    });
    setEditOpen(true);
  }

  async function handleSaveListing() {
    if (!id || savePending) return;
    setSavePending(true);
    const ok = await updateListing(id, editForm);
    setSavePending(false);
    if (ok) {
      const next = await fetchListingById(id);
      if (next) setListing(next);
      setEditOpen(false);
    }
  }

  async function handleDeleteListing() {
    if (!id || deletePending) return;
    setDeletePending(true);
    const ok = await deleteListing(id);
    setDeletePending(false);
    setDeleteDialogOpen(false);
    if (ok) router.push('/dashboard/listings');
  }

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  if (!listing) return null;

  const displayImages =
    listing.images?.length > 0
      ? listing.images
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'];
  const imagesToShow = isOwner && imageRows.length > 0 ? imageRows : null;

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Section
        title=""
        description=""
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link href="/dashboard/listings">Listeye dön</Link>
            </Button>
            <Button asChild size="sm" className="rounded-lg bg-[#0d9488] hover:bg-[#0f766e]">
              <Link href="/dashboard/availability">
                <Calendar className="mr-1.5 h-4 w-4" />
                Uygunluk
              </Link>
            </Button>
            {isOwner && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={openEditForm}
                >
                  <Pencil className="mr-1.5 h-4 w-4" />
                  İlanı düzenle
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  İlanı sil
                </Button>
              </>
            )}
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ListingDetailImages
            imageRows={imagesToShow}
            displayImages={displayImages}
            isOwner={isOwner}
            newImageUrl={newImageUrl}
            setNewImageUrl={setNewImageUrl}
            addImagePending={addImagePending}
            imageLoading={imageLoading}
            onAddByUrl={handleAddImageByUrl}
            onUpload={handleUploadImage}
            onSetPrimary={handleSetPrimary}
            onDelete={handleDeleteImage}
          />
          <ListingDetailSummary listing={listing} />
          <ListingDetailDescription description={listing.description} />
          <ListingDetailLocation listing={listing} />
        </div>

        {isOwner && (
          <div className="mt-6">
            <ListingSeasonalPricing listingId={id} />
          </div>
        )}

        {editOpen && (
          <ListingEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            savePending={savePending}
            onSave={handleSaveListing}
            onCancel={() => setEditOpen(false)}
          />
        )}

        {!isOwner && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            İlan güncelleme ve görsel yönetimi sadece ilan sahibi için görünür.
          </p>
        )}
      </Section>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>İlanı sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu ilanı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteListing();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePending}
            >
              {deletePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
