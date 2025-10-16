import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import gameSlice from './slices/gameSlice';
import userSlice from './slices/userSlice';
import communitySlice from './slices/communitySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    game: gameSlice,
    user: userSlice,
    community: communitySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;