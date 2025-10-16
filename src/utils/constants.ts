// Game Types
export const GAME_TYPES = {
  RESCUE: 'rescue',
  QUIZ: 'quiz',
  PICTIONARY: 'pictionary',
  MEMORY: 'memory',
  SCAVENGER: 'scavenger',
  VERSE: 'verse',
  TIMELINE: 'timeline',
  BEATITUDES: 'beatitudes',
  WORDSEARCH: 'wordsearch',
  PARABLE: 'parable',
  AUDIO: 'audio',
  FOURPICTURES: 'fourpictures'
} as const;

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  OPEN_ENDED: 'open-ended',
  FILL_IN: 'fill-in',
  DRAWING: 'drawing',
  ORDERING: 'ordering',
  AUDIO: 'audio',
  MATCHING: 'matching',
  TRUE_FALSE: 'true-false'
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

// User Roles
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin'
} as const;

// Journey Themes
export const JOURNEY_THEMES = {
  FAITH: 'faith',
  COURAGE: 'courage',
  LOVE: 'love',
  WISDOM: 'wisdom',
  HOPE: 'hope',
  PEACE: 'peace',
  FORGIVENESS: 'forgiveness',
  SALVATION: 'salvation'
} as const;

// Badge IDs
export const BADGES = {
  FAITH_WARRIOR: 'faith-warrior',
  MEMORY_MASTER: 'memory-master',
  QUIZ_CHAMPION: 'quiz-champion',
  SQUAD_LEADER: 'squad-leader',
  VERSE_COLLECTOR: 'verse-collector',
  DAILY_DEVOTION: '7-day-streak',
  FAITHFUL_SERVANT: '30-day-streak',
  HIGH_SCORER: 'high-scorer',
  GAME_VETERAN: 'game-veteran',
  COURAGE_CONQUEROR: 'courage-conqueror',
  WISDOM_SEEKER: 'wisdom-seeker',
  LOVE_AMBASSADOR: 'love-ambassador'
} as const;

// Bible Translations
export const BIBLE_TRANSLATIONS = {
  NIV: 'NIV',
  KJV: 'KJV',
  ESV: 'ESV',
  NASB: 'NASB',
  NLT: 'NLT'
} as const;

// Game Settings
export const GAME_SETTINGS = {
  DEFAULT_TIME_LIMIT: 600, // 10 minutes
  RESCUE_MISSION_TIME: 2400, // 40 minutes
  QUIZ_TIME_PER_QUESTION: 30, // 30 seconds
  MEMORY_VERSE_TIME: 300, // 5 minutes
  MAX_HINTS_PER_QUESTION: 3,
  HINT_COST: 5, // points
  TIME_BONUS_THRESHOLD: 10, // seconds for bonus
  MAX_SQUAD_SIZE: 6,
  MIN_SQUAD_SIZE: 2
} as const;

// Scoring
export const SCORING = {
  BASE_POINTS: {
    EASY: 10,
    MEDIUM: 15,
    HARD: 20
  },
  TIME_BONUS_MULTIPLIER: 0.5,
  HINT_PENALTY: 2,
  DAILY_CHALLENGE_BONUS: 50,
  STREAK_BONUS: {
    7: 100,
    14: 250,
    30: 500
  }
} as const;

// Community Categories
export const COMMUNITY_CATEGORIES = {
  PRAYER_SUPPORT: 'Prayer & Support',
  GAME_TIPS: 'Game Tips',
  SQUAD_RECRUITMENT: 'Squad Recruitment',
  VERSE_SHARING: 'Verse Sharing',
  GENERAL_DISCUSSION: 'General Discussion',
  TESTIMONIES: 'Testimonies'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me'
  },
  GAMES: {
    LIST: '/api/v1/games',
    DETAIL: '/api/v1/games/:id',
    SESSION: '/api/v1/games/:id/session',
    SUBMIT_ANSWER: '/api/v1/games/session/:sessionId/answer'
  },
  USERS: {
    LIST: '/api/v1/users',
    DETAIL: '/api/v1/users/:id',
    PROGRESS: '/api/v1/users/:id/progress',
    VERSES: '/api/v1/users/:id/verses'
  },
  COMMUNITY: {
    POSTS: '/api/v1/community/posts',
    VERSE_CARDS: '/api/v1/community/verse-cards',
    LIKE_POST: '/api/v1/community/posts/:id/like',
    LIKE_VERSE: '/api/v1/community/verse-cards/:id/like'
  },
  PROGRESS: {
    LEADERBOARD: '/api/v1/progress/leaderboard',
    DAILY_CHALLENGE: '/api/v1/progress/daily-challenge',
    BADGES: '/api/v1/progress/badges/:userId'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_EXISTS: 'User with this email already exists.',
  GAME_NOT_FOUND: 'Game not found.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INSUFFICIENT_PERMISSIONS: 'You don\'t have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  GAME_COMPLETED: 'Congratulations! Game completed successfully.',
  PROGRESS_SAVED: 'Your progress has been saved.',
  VERSE_MEMORIZED: 'Verse added to your memory bank!',
  BADGE_EARNED: 'New badge earned!',
  POST_CREATED: 'Your post has been shared with the community.',
  VERSE_CARD_CREATED: 'Your verse card has been created and shared!'
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Scripture Quest',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@scripturequest.com',
  PRIVACY_POLICY_URL: 'https://scripturequest.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://scripturequest.com/terms',
  DONATION_URL: 'https://scripturequest.com/donate',
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 30,
  MAX_POST_LENGTH: 2000,
  MAX_VERSE_CARD_TEXT: 500
} as const;