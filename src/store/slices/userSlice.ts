import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface UserProgress {
  journeyId?: string;
  level: number;
  score: number;
  completedAt: string;
}

interface MemorizedVerse {
  verseId: string;
  reference: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  versesMemorized: number;
  streakDays: number;
  lastActive: string;
}

interface UserState {
  progress: UserProgress[];
  memorizedVerses: MemorizedVerse[];
  badges: string[];
  stats: UserStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  progress: [],
  memorizedVerses: [],
  badges: [],
  stats: {
    totalGamesPlayed: 0,
    totalScore: 0,
    versesMemorized: 0,
    streakDays: 0,
    lastActive: new Date().toISOString(),
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProgress = createAsyncThunk(
  'user/fetchProgress',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/${userId}/progress`, {
        headers: {
          'Authorization': `Bearer ${getState().auth.accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch user progress');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateProgress = createAsyncThunk(
  'user/updateProgress',
  async (
    { userId, progressData }: { userId: string; progressData: Omit<UserProgress, 'completedAt'> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/${userId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify({
          ...progressData,
          completedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update progress');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const addMemorizedVerse = createAsyncThunk(
  'user/addMemorizedVerse',
  async (
    { userId, verse }: { userId: string; verse: Omit<MemorizedVerse, 'reviewCount' | 'lastReviewed'> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/${userId}/verses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify({
          ...verse,
          reviewCount: 0,
          lastReviewed: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add memorized verse');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateVerseProgress = createAsyncThunk(
  'user/updateVerseProgress',
  async (
    { userId, verseId, updates }: { userId: string; verseId: string; updates: Partial<MemorizedVerse> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/${userId}/verses/${verseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify({
          ...updates,
          lastReviewed: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update verse progress');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addBadge: (state, action: PayloadAction<string>) => {
      if (!state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    incrementStreak: (state) => {
      state.stats.streakDays += 1;
    },
    resetStreak: (state) => {
      state.stats.streakDays = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user progress
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload.progress || [];
        state.memorizedVerses = action.payload.memorizedVerses || [];
        state.badges = action.payload.badges || [];
        state.stats = { ...state.stats, ...action.payload.stats };
        state.error = null;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update progress
    builder
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.progress.push(action.payload);
        state.stats.totalGamesPlayed += 1;
        state.stats.totalScore += action.payload.score;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Add memorized verse
    builder
      .addCase(addMemorizedVerse.fulfilled, (state, action) => {
        state.memorizedVerses.push(action.payload);
        state.stats.versesMemorized += 1;
      })
      .addCase(addMemorizedVerse.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update verse progress
    builder
      .addCase(updateVerseProgress.fulfilled, (state, action) => {
        const index = state.memorizedVerses.findIndex(v => v.verseId === action.payload.verseId);
        if (index !== -1) {
          state.memorizedVerses[index] = action.payload;
        }
      })
      .addCase(updateVerseProgress.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  addBadge,
  updateStats,
  incrementStreak,
  resetStreak,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;