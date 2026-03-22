-- Allow hosts to update their listing images (sort_order, is_primary, alt_text)
CREATE POLICY "listing_images_update_host" ON public.listing_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      JOIN public.hosts h ON l.host_id = h.id
      WHERE l.id = listing_images.listing_id AND h.user_id = auth.uid()
    )
  );
