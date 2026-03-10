-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Seed amenities data
INSERT INTO public.amenities (name, icon, category) VALUES
('WiFi', 'wifi', 'essentials'),
('Kitchen', 'utensils', 'essentials'),
('Air Conditioning', 'wind', 'climate'),
('Heating', 'thermometer', 'climate'),
('Pool', 'waves', 'outdoor'),
('Hot Tub', 'bath', 'outdoor'),
('Free Parking', 'car', 'parking'),
('TV', 'tv', 'entertainment'),
('Washer', 'shirt', 'laundry'),
('Dryer', 'shirt', 'laundry'),
('Workspace', 'laptop', 'work'),
('Beach Access', 'umbrella-beach', 'outdoor'),
('Garden View', 'leaf', 'views'),
('Mountain View', 'mountain', 'views'),
('Ocean View', 'sunset', 'views'),
('Gym', 'dumbbell', 'fitness'),
('BBQ Grill', 'flame', 'outdoor'),
('Fire Pit', 'flame', 'outdoor'),
('Balcony', 'home', 'outdoor'),
('Pets Allowed', 'paw-print', 'policies'),
('Breakfast Included', 'coffee', 'meals'),
('24h Check-in', 'clock', 'access'),
('Elevator', 'arrow-up', 'access'),
('Security Cameras', 'video', 'safety')
ON CONFLICT (name) DO NOTHING;

-- Function to update listing rating
CREATE OR REPLACE FUNCTION public.update_listing_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.listings
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE listing_id = NEW.listing_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE listing_id = NEW.listing_id)
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_listing_rating();
