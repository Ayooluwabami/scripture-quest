import crypto from 'crypto';
import { logger } from '@/middleware/logger';

/**
 * Generate a secure random string
 */
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a string using SHA-256
 */
export const hashString = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Generate pagination metadata
 */
export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

/**
 * Calculate game difficulty score multiplier
 */
export const getDifficultyMultiplier = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy': return 1.0;
    case 'medium': return 1.5;
    case 'hard': return 2.0;
    default: return 1.0;
  }
};

/**
 * Format duration in seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Generate unique session ID
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomPart}`;
};

/**
 * Validate Bible reference format
 */
export const isValidBibleReference = (reference: string): boolean => {
  // Basic validation for Bible references like "John 3:16" or "1 Corinthians 13:4-7"
  const referenceRegex = /^(1|2|3)?\s*[A-Za-z]+\s+\d+:\d+(-\d+)?$/;
  return referenceRegex.test(reference.trim());
};

/**
 * Calculate user level based on total score
 */
export const calculateUserLevel = (totalScore: number): number => {
  // Level progression: 0-99: Level 1, 100-299: Level 2, etc.
  return Math.floor(totalScore / 100) + 1;
};

/**
 * Get next level requirements
 */
export const getNextLevelRequirements = (currentScore: number): {
  currentLevel: number;
  nextLevel: number;
  pointsNeeded: number;
  progress: number;
} => {
  const currentLevel = calculateUserLevel(currentScore);
  const nextLevel = currentLevel + 1;
  const pointsForNextLevel = nextLevel * 100;
  const pointsNeeded = pointsForNextLevel - currentScore;
  const levelStartPoints = (currentLevel - 1) * 100;
  const progress = ((currentScore - levelStartPoints) / 100) * 100;

  return {
    currentLevel,
    nextLevel,
    pointsNeeded,
    progress: Math.min(progress, 100)
  };
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Debounce function to limit API calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait) as unknown as NodeJS.Timeout;
  };
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        logger.error(`Function failed after ${maxRetries} attempts:`, error);
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Validate and parse JSON safely
 */
export const safeJsonParse = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logger.warn('Failed to parse JSON:', error);
    return defaultValue;
  }
};

/**
 * Generate avatar URL based on username
 */
export const generateAvatarUrl = (username: string): string => {
  const hash = hashString(username.toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

/**
 * Check if user is eligible for badge
 */
export const checkBadgeEligibility = (
  badgeId: string,
  userStats: any,
  userBadges: string[]
): boolean => {
  if (userBadges.includes(badgeId)) {
    return false; // Already has badge
  }

  const badgeRequirements: { [key: string]: (stats: any) => boolean } = {
    'high-scorer': (stats) => stats.totalScore >= 1000,
    'game-veteran': (stats) => stats.totalGamesPlayed >= 50,
    'memory-master': (stats) => stats.versesMemorized >= 20,
    '7-day-streak': (stats) => stats.streakDays >= 7,
    '30-day-streak': (stats) => stats.streakDays >= 30,
    'quiz-champion': (stats) => stats.totalScore >= 500 && stats.totalGamesPlayed >= 10,
    'faith-warrior': (stats) => stats.totalScore >= 750,
    'squad-leader': (stats) => stats.totalGamesPlayed >= 25
  };

  const requirement = badgeRequirements[badgeId];
  return requirement ? requirement(userStats) : false;
};

/**
 * Calculate streak bonus points
 */
export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays >= 30) return 100;
  if (streakDays >= 14) return 50;
  if (streakDays >= 7) return 25;
  return 0;
};

/**
 * Get time-based greeting
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Calculate reading time for text
 */
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};