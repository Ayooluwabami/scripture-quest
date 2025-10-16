import { User } from '@/models/User';
import { Progress } from '@/models/Progress';
import { NotFoundError } from '@/middleware/errorHandler';
// import { GameSession } from '@/models/GameSession';
import mongoose from 'mongoose';
import { logger } from '@/middleware/logger';

export class ProgressService {
  /**
   * Update user progress after game completion
   */
  async updateUserProgress(
    userId: string,
    gameId: string,
    sessionData: {
      score: number;
      correctAnswers: number;
      totalQuestions: number;
      timeSpent: number;
      hintsUsed: number;
      difficulty: string;
      gameType: string;
    }
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Create progress record
      const progress = new Progress({
        userId,
        gameId,
        sessionId: `session_${Date.now()}`,
        ...sessionData,
        completedAt: new Date()
      });

      await progress.save();

      // Update user stats
      user.stats.totalGamesPlayed += 1;
      user.stats.totalScore += sessionData.score;
      user.stats.lastActive = new Date();

      // Update streak
      await this.updateStreak(user);

      // Award badges
      await this.checkAndAwardBadges(user);

      await user.save();

      logger.info(`Progress updated for user ${userId}: ${sessionData.score} points`);
    } catch (error) {
      logger.error('Error updating user progress:', error);
      throw error;
    }
  }

  /**
   * Update user streak
   */
  private async updateStreak(user: any): Promise<void> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastActiveDate = new Date(user.stats.lastActive);
    const lastActiveDateString = lastActiveDate.toDateString();
    const yesterdayString = yesterday.toDateString();
    const todayString = today.toDateString();

    if (lastActiveDateString === yesterdayString) {
      // Consecutive day
      user.stats.streakDays += 1;
    } else if (lastActiveDateString !== todayString) {
      // Streak broken
      user.stats.streakDays = 1;
    }
    // If lastActive is today, don't change streak
  }

  /**
   * Check and award badges based on user progress
   */
  private async checkAndAwardBadges(user: any): Promise<void> {
    const badges = [];

    // Score-based badges
    if (user.stats.totalScore >= 1000 && !user.badges.includes('high-scorer')) {
      badges.push('high-scorer');
    }

    // Game count badges
    if (user.stats.totalGamesPlayed >= 50 && !user.badges.includes('game-veteran')) {
      badges.push('game-veteran');
    }

    // Verse memorization badges
    if (user.stats.versesMemorized >= 20 && !user.badges.includes('memory-master')) {
      badges.push('memory-master');
    }

    // Streak badges
    if (user.stats.streakDays >= 7 && !user.badges.includes('7-day-streak')) {
      badges.push('7-day-streak');
    }

    if (user.stats.streakDays >= 30 && !user.badges.includes('30-day-streak')) {
      badges.push('30-day-streak');
    }

    // Add new badges
    badges.forEach(badge => {
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
      }
    });
  }

  /**
   * Get user leaderboard position
   */
  async getUserLeaderboardPosition(userId: string): Promise<number> {
    try {
      const user = await User.findById(userId);
      if (!user) return -1;

      const higherScoreCount = await User.countDocuments({
        'stats.totalScore': { $gt: user.stats.totalScore }
      });

      return higherScoreCount + 1;
    } catch (error) {
      logger.error('Error getting leaderboard position:', error);
      return -1;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const recentProgress = await Progress.find({ userId })
        .sort({ completedAt: -1 })
        .limit(10);

      const gameTypeStats = await Progress.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$gameType',
            totalGames: { $sum: 1 },
            averageScore: { $avg: '$score' },
            bestScore: { $max: '$score' }
          }
        }
      ]);

      return {
        user: user.toJSON(),
        recentProgress,
        gameTypeStats,
        leaderboardPosition: await this.getUserLeaderboardPosition(userId)
      };
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }
}