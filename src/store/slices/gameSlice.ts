import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Game {
  id: string;
  type: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isMultiplayer: boolean;
  maxPlayers: number;
  estimatedTime: string;
  theme: string;
}

interface Question {
  id: string;
  text: string;
  type: string;
  answer: string | string[];
  options?: string[];
  reference?: string;
  hints?: string[];
  images?: string[];
}

interface GameSession {
  id: string;
  gameId: string;
  players: string[];
  currentQuestion: number;
  questions: Question[];
  scores: { [playerId: string]: number };
  timeRemaining: number;
  status: 'waiting' | 'playing' | 'finished';
  startedAt?: string;
}

interface GameState {
  games: Game[];
  currentSession: GameSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: [],
  currentSession: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGames = createAsyncThunk(
  'game/fetchGames',
  async (filters?: { type?: string; difficulty?: string; isMultiplayer?: boolean }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters?.isMultiplayer !== undefined) queryParams.append('isMultiplayer', filters.isMultiplayer.toString());

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/games?${queryParams}`);
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch games');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createGameSession = createAsyncThunk(
  'game/createSession',
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/games/${gameId}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create game session');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'game/submitAnswer',
  async (
    { sessionId, questionId, answer }: { sessionId: string; questionId: string; answer: string | string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/games/session/${sessionId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify({ questionId, answer }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to submit answer');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    updateSessionTime: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.timeRemaining = action.payload;
      }
    },
    updateSessionScore: (state, action: PayloadAction<{ playerId: string; score: number }>) => {
      if (state.currentSession) {
        state.currentSession.scores[action.payload.playerId] = action.payload.score;
      }
    },
    nextQuestion: (state) => {
      if (state.currentSession && state.currentSession.currentQuestion < state.currentSession.questions.length - 1) {
        state.currentSession.currentQuestion += 1;
      }
    },
    setSessionStatus: (state, action: PayloadAction<'waiting' | 'playing' | 'finished'>) => {
      if (state.currentSession) {
        state.currentSession.status = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch games
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create game session
    builder
      .addCase(createGameSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGameSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(createGameSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit answer
    builder
      .addCase(submitAnswer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update session with response data
        if (state.currentSession && action.payload.session) {
          state.currentSession = { ...state.currentSession, ...action.payload.session };
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentSession,
  updateSessionTime,
  updateSessionScore,
  nextQuestion,
  setSessionStatus,
  clearError,
} = gameSlice.actions;

export default gameSlice.reducer;