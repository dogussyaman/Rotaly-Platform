-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hosts policies
CREATE POLICY "hosts_select_all" ON public.hosts FOR SELECT USING (true);
CREATE POLICY "hosts_insert_own" ON public.hosts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hosts_update_own" ON public.hosts FOR UPDATE USING (auth.uid() = user_id);

-- Listings policies (public read, owner write)
CREATE POLICY "listings_select_all" ON public.listings FOR SELECT USING (true);
CREATE POLICY "listings_insert_host" ON public.listings FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.hosts WHERE id = host_id AND user_id = auth.uid()));
CREATE POLICY "listings_update_host" ON public.listings FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.hosts WHERE id = host_id AND user_id = auth.uid()));
CREATE POLICY "listings_delete_host" ON public.listings FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.hosts WHERE id = host_id AND user_id = auth.uid()));

-- Listing images policies
CREATE POLICY "listing_images_select_all" ON public.listing_images FOR SELECT USING (true);
CREATE POLICY "listing_images_insert_host" ON public.listing_images FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));
CREATE POLICY "listing_images_delete_host" ON public.listing_images FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

-- Amenities policies (public read)
CREATE POLICY "amenities_select_all" ON public.amenities FOR SELECT USING (true);

-- Listing amenities policies
CREATE POLICY "listing_amenities_select_all" ON public.listing_amenities FOR SELECT USING (true);
CREATE POLICY "listing_amenities_insert_host" ON public.listing_amenities FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

-- House rules policies
CREATE POLICY "house_rules_select_all" ON public.house_rules FOR SELECT USING (true);
CREATE POLICY "house_rules_insert_host" ON public.house_rules FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

-- Bookings policies
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT 
  USING (guest_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));
CREATE POLICY "bookings_insert_guest" ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "bookings_update_own" ON public.bookings FOR UPDATE 
  USING (guest_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

-- Availability calendar policies
CREATE POLICY "availability_select_all" ON public.availability_calendar FOR SELECT USING (true);
CREATE POLICY "availability_insert_host" ON public.availability_calendar FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));
CREATE POLICY "availability_update_host" ON public.availability_calendar FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.listings l 
    JOIN public.hosts h ON l.host_id = h.id 
    WHERE l.id = listing_id AND h.user_id = auth.uid()
  ));

-- Reviews policies
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_id);

-- Wishlists policies
CREATE POLICY "wishlists_select_own" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlists_insert_own" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlists_update_own" ON public.wishlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "wishlists_delete_own" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Wishlist items policies
CREATE POLICY "wishlist_items_select_own" ON public.wishlist_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid()));
CREATE POLICY "wishlist_items_insert_own" ON public.wishlist_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid()));
CREATE POLICY "wishlist_items_delete_own" ON public.wishlist_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid()));

-- Messages policies
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT 
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update_receiver" ON public.messages FOR UPDATE 
  USING (receiver_id = auth.uid());

-- Conversations policies
CREATE POLICY "conversations_select_own" ON public.conversations FOR SELECT 
  USING (participant_1 = auth.uid() OR participant_2 = auth.uid());
CREATE POLICY "conversations_insert_own" ON public.conversations FOR INSERT 
  WITH CHECK (participant_1 = auth.uid() OR participant_2 = auth.uid());
