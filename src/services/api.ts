import { store } from '@/src/store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data: T;
  message: string;
  error: string | null;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();
    return data.data;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/api/v1/auth/login', credentials),
  
  register: (userData: { email: string; password: string; username: string }) =>
    apiClient.post('/api/v1/auth/register', userData),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/refresh', { refreshToken }),
  
  logout: () =>
    apiClient.post('/api/v1/auth/logout'),
  
  getCurrentUser: () =>
    apiClient.get('/api/v1/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/api/v1/auth/reset-password', { token, password }),
};

export const gameApi = {
  getGames: (filters?: { type?: string; difficulty?: string; isMultiplayer?: boolean }) =>
    apiClient.get('/api/v1/games', filters),
  
  getGameById: (id: string) =>
    apiClient.get(`/api/v1/games/${id}`),
  
  createGameSession: (gameId: string) =>
    apiClient.post(`/api/v1/games/${gameId}/session`),
  
  submitAnswer: (sessionId: string, data: { questionId: string; answer: string | string[] }) =>
    apiClient.post(`/api/v1/games/session/${sessionId}/answer`, data),
};

export const userApi = {
  getUserById: (id: string) =>
    apiClient.get(`/api/v1/users/${id}`),
  
  updateUser: (id: string, data: any) =>
    apiClient.put(`/api/v1/users/${id}`, data),
  
  getUserProgress: (id: string) =>
    apiClient.get(`/api/v1/users/${id}/progress`),
  
  updateProgress: (id: string, progressData: any) =>
    apiClient.post(`/api/v1/users/${id}/progress`, progressData),
  
  addMemorizedVerse: (id: string, verseData: any) =>
    apiClient.post(`/api/v1/users/${id}/verses`, verseData),
  
  updateVerseProgress: (id: string, verseId: string, updates: any) =>
    apiClient.put(`/api/v1/users/${id}/verses/${verseId}`, updates),
};

export const communityApi = {
  getForumPosts: (filters?: { category?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get('/api/v1/community/posts', filters),
  
  createForumPost: (postData: { title: string; content: string; category: string }) =>
    apiClient.post('/api/v1/community/posts', postData),
  
  likePost: (postId: string) =>
    apiClient.post(`/api/v1/community/posts/${postId}/like`),
  
  getVerseCards: () =>
    apiClient.get('/api/v1/community/verse-cards'),
  
  createVerseCard: (cardData: { verse: string; reference: string; background: string }) =>
    apiClient.post('/api/v1/community/verse-cards', cardData),
  
  likeVerseCard: (cardId: string) =>
    apiClient.post(`/api/v1/community/verse-cards/${cardId}/like`),
};

export const progressApi = {
  getLeaderboard: (type?: string, limit?: number) =>
    apiClient.get('/api/v1/progress/leaderboard', { type, limit: limit?.toString() }),
  
  getDailyChallenge: () =>
    apiClient.get('/api/v1/progress/daily-challenge'),
  
  completeDailyChallenge: (data: { challengeId: string; score: number }) =>
    apiClient.post('/api/v1/progress/daily-challenge/complete', data),
  
  getUserBadges: (userId: string) =>
    apiClient.get(`/api/v1/progress/badges/${userId}`),
};