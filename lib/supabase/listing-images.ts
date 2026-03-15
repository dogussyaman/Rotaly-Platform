'use client';

import { createClient } from '@/lib/supabase/client';

export interface ListingImageRow {
  id: string;
  listingId: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export async function getListingImages(listingId: string): Promise<ListingImageRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('listing_images')
    .select('id, listing_id, url, alt_text, is_primary, sort_order')
    .eq('listing_id', listingId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('getListingImages error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    listingId: row.listing_id,
    url: row.url,
    altText: row.alt_text ?? null,
    isPrimary: !!row.is_primary,
    sortOrder: row.sort_order ?? 0,
  }));
}

export interface AddListingImageInput {
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

export async function addListingImage(
  listingId: string,
  input: AddListingImageInput,
): Promise<{ id: string } | null> {
  const supabase = createClient();

  const { count } = await supabase
    .from('listing_images')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingId);

  const sortOrder = (count ?? 0);

  const { data, error } = await supabase
    .from('listing_images')
    .insert({
      listing_id: listingId,
      url: input.url,
      alt_text: input.altText ?? null,
      is_primary: input.isPrimary ?? false,
      sort_order: sortOrder,
    })
    .select('id')
    .single();

  if (error) {
    console.error('addListingImage error:', error.message);
    return null;
  }

  if (input.isPrimary) {
    await setPrimaryListingImage(listingId, data.id);
  }

  return { id: data.id as string };
}

/** Upload file to Supabase Storage and add a listing_images row with the public URL */
export async function uploadListingImage(
  listingId: string,
  file: File,
  options?: { altText?: string | null; isPrimary?: boolean },
): Promise<{ id: string } | null> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${listingId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error('uploadListingImage storage error:', uploadError.message);
    return null;
  }

  const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path);
  return addListingImage(listingId, {
    url: urlData.publicUrl,
    altText: options?.altText ?? null,
    isPrimary: options?.isPrimary ?? false,
  });
}

export async function updateListingImage(
  imageId: string,
  payload: { altText?: string | null; isPrimary?: boolean; sortOrder?: number },
): Promise<boolean> {
  const supabase = createClient();
  const update: Record<string, unknown> = {};
  if (payload.altText !== undefined) update.alt_text = payload.altText;
  if (payload.isPrimary !== undefined) update.is_primary = payload.isPrimary;
  if (payload.sortOrder !== undefined) update.sort_order = payload.sortOrder;

  if (Object.keys(update).length === 0) return true;

  const { error } = await supabase
    .from('listing_images')
    .update(update)
    .eq('id', imageId);

  if (error) {
    console.error('updateListingImage error:', error.message);
    return false;
  }

  if (payload.isPrimary === true) {
    const { data: row } = await supabase
      .from('listing_images')
      .select('listing_id')
      .eq('id', imageId)
      .single();
    if (row?.listing_id) await setPrimaryListingImage(row.listing_id as string, imageId);
  }

  return true;
}

async function setPrimaryListingImage(listingId: string, primaryImageId: string): Promise<void> {
  const supabase = createClient();
  await supabase
    .from('listing_images')
    .update({ is_primary: false })
    .eq('listing_id', listingId);
  await supabase
    .from('listing_images')
    .update({ is_primary: true })
    .eq('id', primaryImageId);
}

export async function setPrimaryImage(listingId: string, imageId: string): Promise<boolean> {
  await setPrimaryListingImage(listingId, imageId);
  return true;
}

export async function deleteListingImage(imageId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('listing_images').delete().eq('id', imageId);
  if (error) {
    console.error('deleteListingImage error:', error.message);
    return false;
  }
  return true;
}

/** Update sort_order for each image by id order (index = sort_order) */
export async function reorderListingImages(
  listingId: string,
  imageIdsInOrder: string[],
): Promise<boolean> {
  const supabase = createClient();
  for (let i = 0; i < imageIdsInOrder.length; i++) {
    const { error } = await supabase
      .from('listing_images')
      .update({ sort_order: i })
      .eq('id', imageIdsInOrder[i])
      .eq('listing_id', listingId);
    if (error) {
      console.error('reorderListingImages error:', error.message);
      return false;
    }
  }
  return true;
}
