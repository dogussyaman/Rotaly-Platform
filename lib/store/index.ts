import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/search-slice';
import userReducer from './slices/user-slice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // checkIn/checkOut ISO string olarak tutulduğu için sorun yok
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
