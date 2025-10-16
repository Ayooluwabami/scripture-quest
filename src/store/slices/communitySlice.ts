import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    badge?: string;
  };
  category: string;
  replies: number;
  likes: number;
  timestamp: string;
  isPopular?: boolean;
}

interface VerseCard {
  id: string;
  verse: string;
  reference: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  shares: number;
  background: string;
  createdAt: string;
}

interface CommunityState {
  forumPosts: ForumPost[];
  verseCards: VerseCard[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  forumPosts: [],
  verseCards: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchForumPosts = createAsyncThunk(
  'community/fetchForumPosts',
  async (filters?: { category?: string; search?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/community/posts?${queryParams}`);
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch forum posts');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchVerseCards = createAsyncThunk(
  'community/fetchVerseCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/community/verse-cards`);
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch verse cards');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createForumPost = createAsyncThunk(
  'community/createPost',
  async (
    postData: { title: string; content: string; category: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getState().auth.accessToken}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create post');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createVerseCard = createAsyncThunk(
  'community/createVerseCard',
  async (
    cardData: { verse: string; reference: string; background: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/community/verse-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create verse card');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          // TODO: Add authorization header
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to like post');
      }

      return { postId };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const likeVerseCard = createAsyncThunk(
  'community/likeVerseCard',
  async (cardId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/community/verse-cards/${cardId}/like`, {
        method: 'POST',
        headers: {
          // TODO: Add authorization header
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to like verse card');
      }

      return { cardId };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch forum posts
    builder
      .addCase(fetchForumPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchForumPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.forumPosts = action.payload;
        state.error = null;
      })
      .addCase(fetchForumPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch verse cards
    builder
      .addCase(fetchVerseCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVerseCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verseCards = action.payload;
        state.error = null;
      })
      .addCase(fetchVerseCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create forum post
    builder
      .addCase(createForumPost.fulfilled, (state, action) => {
        state.forumPosts.unshift(action.payload);
      })
      .addCase(createForumPost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Create verse card
    builder
      .addCase(createVerseCard.fulfilled, (state, action) => {
        state.verseCards.unshift(action.payload);
      })
      .addCase(createVerseCard.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Like post
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.forumPosts.find(p => p.id === action.payload.postId);
        if (post) {
          post.likes += 1;
        }
      });

    // Like verse card
    builder
      .addCase(likeVerseCard.fulfilled, (state, action) => {
        const card = state.verseCards.find(c => c.id === action.payload.cardId);
        if (card) {
          card.likes += 1;
        }
      });
  },
});

export const { clearError } = communitySlice.actions;
export default communitySlice.reducer;