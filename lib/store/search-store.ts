import { create } from 'zustand';

export interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  priceMin: number;
  priceMax: number;
  propertyType: string[];
  amenities: string[];
}

interface SearchStore {
  filters: SearchFilters;
  setLocation: (location: string) => void;
  setCheckIn: (date: Date | null) => void;
  setCheckOut: (date: Date | null) => void;
  setGuests: (guests: number) => void;
  setPriceRange: (min: number, max: number) => void;
  setPropertyType: (types: string[]) => void;
  setAmenities: (amenities: string[]) => void;
  resetFilters: () => void;
}

const initialFilters: SearchFilters = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: 1,
  priceMin: 0,
  priceMax: 10000,
  propertyType: [],
  amenities: [],
};

export const useSearchStore = create<SearchStore>((set) => ({
  filters: initialFilters,
  setLocation: (location) =>
    set((state) => ({
      filters: { ...state.filters, location },
    })),
  setCheckIn: (checkIn) =>
    set((state) => ({
      filters: { ...state.filters, checkIn },
    })),
  setCheckOut: (checkOut) =>
    set((state) => ({
      filters: { ...state.filters, checkOut },
    })),
  setGuests: (guests) =>
    set((state) => ({
      filters: { ...state.filters, guests },
    })),
  setPriceRange: (priceMin, priceMax) =>
    set((state) => ({
      filters: { ...state.filters, priceMin, priceMax },
    })),
  setPropertyType: (propertyType) =>
    set((state) => ({
      filters: { ...state.filters, propertyType },
    })),
  setAmenities: (amenities) =>
    set((state) => ({
      filters: { ...state.filters, amenities },
    })),
  resetFilters: () =>
    set({
      filters: initialFilters,
    }),
}));
