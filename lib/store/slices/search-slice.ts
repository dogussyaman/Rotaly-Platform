import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchState {
  location: string;
  checkIn: string | null;  // ISO string (Date serialize edilemez)
  checkOut: string | null;
  guests: GuestCounts;
}

const initialState: SearchState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: {
    adults: 1,
    children: 0,
    infants: 0,
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<Partial<SearchState>>) {
      return { ...state, ...action.payload };
    },
    resetSearch() {
      return initialState;
    },
  },
});

export const { setSearch, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
