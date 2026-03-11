import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  location: string;
  checkIn: string | null;  // ISO string (Date serialize edilemez)
  checkOut: string | null;
  guests: number;
}

const initialState: SearchState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: 1,
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
