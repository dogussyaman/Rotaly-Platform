import {
  Compass,
  Mountain,
  Utensils,
  Trees,
  Camera,
  Waves,
} from 'lucide-react';

export const TOUR_CATEGORY_META = [
  { icon: Compass, color: 'bg-amber-100 text-amber-600' },
  { icon: Mountain, color: 'bg-sky-100 text-sky-600' },
  { icon: Utensils, color: 'bg-rose-100 text-rose-600' },
  { icon: Trees, color: 'bg-emerald-100 text-emerald-600' },
  { icon: Camera, color: 'bg-indigo-100 text-indigo-600' },
  { icon: Waves, color: 'bg-cyan-100 text-cyan-600' },
] as const;

export const MOCK_TOURS_BASE = [
  { id: '1', price: 4500, rating: 4.98, reviews: 1240, maxGuests: 12, image: 'https://images.unsplash.com/photo-1544833055-175c0cfcebb0?w=800&h=600&fit=crop&auto=format', gradient: 'from-amber-500 to-orange-600', titleIndex: 0, locationIndex: 0, durationIndex: 0, badgeIndex: 0 },
  { id: '2', price: 2200, rating: 4.85, reviews: 856, maxGuests: 50, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop&auto=format', gradient: 'from-sky-500 to-indigo-700', titleIndex: 1, locationIndex: 1, durationIndex: 1, badgeIndex: 1 },
  { id: '3', price: 1800, rating: 4.92, reviews: 2100, maxGuests: 15, image: 'https://images.unsplash.com/photo-1558642891-54be180ea339?w=800&h=600&fit=crop&auto=format', gradient: 'from-stone-600 to-amber-800', titleIndex: 2, locationIndex: 2, durationIndex: 2, badgeIndex: 2 },
  { id: '4', price: 3800, rating: 4.99, reviews: 450, maxGuests: 1, image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=600&fit=crop&auto=format', gradient: 'from-cyan-500 to-sky-700', titleIndex: 3, locationIndex: 3, durationIndex: 3, badgeIndex: 3 },
  { id: '5', price: 1200, rating: 4.78, reviews: 620, maxGuests: 25, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format', gradient: 'from-teal-500 to-emerald-700', titleIndex: 4, locationIndex: 4, durationIndex: 4, badgeIndex: 4 },
  { id: '6', price: 1500, rating: 4.96, reviews: 310, maxGuests: 8, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop&auto=format', gradient: 'from-rose-500 to-pink-700', titleIndex: 5, locationIndex: 5, durationIndex: 5, badgeIndex: 5 },
] as const;
