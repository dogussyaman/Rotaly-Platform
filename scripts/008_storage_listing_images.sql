-- Public bucket for listing images (hosts upload; everyone can read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Hosts can upload only under their listing folder: listing-images/{listing_id}/...
CREATE POLICY "listing_images_upload" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] IN (
      SELECT l.id::text FROM public.listings l
      JOIN public.hosts h ON l.host_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

-- Hosts can update/delete their listing's files
CREATE POLICY "listing_images_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] IN (
      SELECT l.id::text FROM public.listings l
      JOIN public.hosts h ON l.host_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

CREATE POLICY "listing_images_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] IN (
      SELECT l.id::text FROM public.listings l
      JOIN public.hosts h ON l.host_id = h.id
      WHERE h.user_id = auth.uid()
    )
  );

-- Public read (bucket is public)
CREATE POLICY "listing_images_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');
