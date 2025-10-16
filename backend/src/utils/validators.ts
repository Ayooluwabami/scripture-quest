import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// User schemas
export const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  preferences: z.object({
    bibleTranslation: z.string().optional(),
    kidFriendlyMode: z.boolean().optional(),
    notifications: z.boolean().optional(),
    soundEnabled: z.boolean().optional()
  }).optional()
});

// Game schemas
export const createGameSchema = z.object({
  type: z.enum(['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  theme: z.string().min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  isMultiplayer: z.boolean().optional(),
  maxPlayers: z.number().min(1).max(8).optional(),
  timeLimit: z.number().min(30).optional(),
  settings: z.object({
    allowHints: z.boolean().optional(),
    hintCost: z.number().min(0).optional(),
    passOnWrong: z.boolean().optional(),
    randomizeQuestions: z.boolean().optional()
  }).optional()
});

export const updateGameSchema = createGameSchema.partial();

// Question schemas
export const createQuestionSchema = z.object({
  text: z.string().min(1).max(1000),
  type: z.enum(['multiple-choice', 'open-ended', 'fill-in', 'drawing', 'ordering', 'audio', 'matching', 'true-false']),
  answer: z.union([z.string(), z.array(z.string())]),
  options: z.array(z.string()).optional(),
  reference: z.string().max(100).optional(),
  clues: z.array(z.string()).optional(),
  theme: z.string().max(50).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  explanation: z.string().max(500).optional(),
  hints: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  audioUrl: z.string().url().optional(),
  gameTypes: z.array(z.enum(['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']))
});

export const updateQuestionSchema = createQuestionSchema.partial();

// Level schemas
export const createLevelSchema = z.object({
  journeyId: z.string().min(1),
  gameId: z.string().min(1),
  orderIndex: z.number().min(0),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  timeLimit: z.number().min(30),
  pointsToPass: z.number().min(0),
  rewards: z.object({
    points: z.number().min(0),
    badges: z.array(z.string()).optional(),
    unlocks: z.array(z.string()).optional()
  }),
  prerequisites: z.array(z.string()).optional()
});

export const updateLevelSchema = createLevelSchema.partial();

// Progress schemas
export const updateProgressSchema = z.object({
  journeyId: z.string().optional(),
  level: z.number().min(1),
  score: z.number().min(0),
  timeSpent: z.number().min(0).optional(),
  hintsUsed: z.number().min(0).optional()
});

// Query schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10')
});

export const gameQuerySchema = paginationSchema.extend({
  type: z.enum(['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']).optional(),
  theme: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  isMultiplayer: z.string().transform(Boolean).optional()
});

export const questionQuerySchema = paginationSchema.extend({
  type: z.enum(['multiple-choice', 'open-ended', 'fill-in', 'drawing', 'ordering', 'audio', 'matching', 'true-false']).optional(),
  theme: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  gameType: z.enum(['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']).optional()
});

export const levelQuerySchema = paginationSchema.extend({
  journeyId: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional()
});

// Parameter schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});