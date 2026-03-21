import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { createBooking, type CreateBookingInput } from '@/lib/supabase/bookings';

type BookingRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface BookingState {
  createStatus: BookingRequestStatus;
  lastBookingId: string | null;
  error: string | null;
}

const initialState: BookingState = {
  createStatus: 'idle',
  lastBookingId: null,
  error: null,
};

export const submitBooking = createAsyncThunk<
  { id: string },
  CreateBookingInput,
  { rejectValue: string }
>('booking/submitBooking', async (payload, { rejectWithValue }) => {
  const result = await createBooking(payload);
  if (!result) {
    return rejectWithValue('Rezervasyon oluşturulamadı');
  }
  return result;
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBookingState(state) {
      state.createStatus = 'idle';
      state.lastBookingId = null;
      state.error = null;
    },
    clearBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(submitBooking.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.createStatus = 'succeeded';
        state.lastBookingId = action.payload.id;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Bilinmeyen hata';
      });
  },
});

export const { resetBookingState, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
