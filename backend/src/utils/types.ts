// import type { Request } from 'express';

// Extend Express Request interface
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'guest' | 'user' | 'admin';
      };
    }
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  error: string | null;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  message: string;
  error: string | null;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

// User Types
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role: 'guest' | 'user' | 'admin';
  badges: string[];
  stats: UserStats;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  versesMemorized: number;
  streakDays: number;
  lastActive: string;
}

export interface UserPreferences {
  bibleTranslation: string;
  kidFriendlyMode: boolean;
  notifications: boolean;
  soundEnabled: boolean;
}

export interface UserProgress {
  journeyId?: string;
  level: number;
  score: number;
  completedAt: string;
}

export interface MemorizedVerse {
  verseId: string;
  reference: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

// Game Types
export interface GameData {
  id: string;
  type: GameType;
  title: string;
  description: string;
  theme: string;
  difficulty: Difficulty;
  isMultiplayer: boolean;
  maxPlayers: number;
  timeLimit?: number;
  estimatedTime: string;
  settings: GameSettings;
  isActive: boolean;
  createdAt: string;
}

export interface GameSettings {
  allowHints: boolean;
  hintCost: number;
  passOnWrong: boolean;
  randomizeQuestions: boolean;
}

export interface GameSession {
  id: string;
  gameId: string;
  players: string[];
  currentQuestion: number;
  questions: QuestionData[];
  scores: { [playerId: string]: number };
  timeRemaining: number;
  status: 'waiting' | 'playing' | 'finished';
  settings: GameSettings;
  startedAt?: string;
}

export interface QuestionData {
  id: string;
  text: string;
  type: QuestionType;
  answer: string | string[];
  options?: string[];
  reference?: string;
  hints?: string[];
  images?: string[];
  audioUrl?: string;
  theme?: string;
  difficulty: Difficulty;
  gameTypes: GameType[];
}

export interface LevelData {
  id: string;
  journeyId: string;
  gameId: string;
  orderIndex: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  tasks: string[];
  timeLimit: number;
  pointsToPass: number;
  rewards: LevelRewards;
  prerequisites: string[];
  isActive: boolean;
}

export interface LevelRewards {
  points: number;
  badges: string[];
  unlocks: string[];
}

// Community Types
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    badges: string[];
  };
  likes: number;
  replies: number;
  createdAt: string;
}

export interface VerseCard {
  id: string;
  verse: string;
  reference: string;
  background: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  shares: number;
  createdAt: string;
}

// Progress Types
export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar: string;
    badges: string[];
  };
  score: number;
  gamesPlayed: number;
  versesMemorized: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'memory' | 'quiz' | 'verse';
  points: number;
  data: any;
  expiresAt: string;
}

// Enum Types
export type GameType =
  | 'rescue'
  | 'quiz'
  | 'pictionary'
  | 'memory'
  | 'scavenger'
  | 'verse'
  | 'timeline'
  | 'beatitudes'
  | 'wordsearch'
  | 'parable'
  | 'audio'
  | 'fourpictures';

export type QuestionType =
  | 'multiple-choice'
  | 'open-ended'
  | 'fill-in'
  | 'drawing'
  | 'ordering'
  | 'audio'
  | 'matching'
  | 'true-false';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type UserRole = 'guest' | 'user' | 'admin';

// Socket.IO Types
export interface SocketGameMove {
  gameId: string;
  playerId: string;
  questionId: string;
  answer: string | string[];
  timestamp: string;
}

export interface SocketChatMessage {
  gameId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

export interface SquadData {
  id: string;
  name: string;
  leader: string;
  members: SquadMember[];
  maxMembers: number;
  gameType: string;
  status: 'waiting' | 'ready' | 'playing';
  settings: GameSettings;
}

export interface SquadMember {
  id: string;
  username: string;
  avatar: string;
  isReady: boolean;
  isLeader: boolean;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Bible API Types
export interface BibleVerse {
  reference: string;
  text: string;
  translation: string;
}

export interface BibleSearchResult {
  verses: BibleVerse[];
  total: number;
}

// Analytics Types
export interface GameAnalytics {
  gameId: string;
  gameType: GameType;
  playersCount: number;
  averageScore: number;
  averageTime: number;
  completionRate: number;
  popularQuestions: string[];
}

export interface UserAnalytics {
  userId: string;
  totalPlayTime: number;
  favoriteGameTypes: GameType[];
  averageScore: number;
  improvementRate: number;
  lastActiveDate: string;
}