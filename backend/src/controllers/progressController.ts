import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/User';
import { NotFoundError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'memory' | 'quiz' | 'verse';
  points: number;
  data: any;
  expiresAt: Date;
}

export class ProgressController {
  /**
   * Get global leaderboard
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type = 'global', limit = 10 } = req.query;

      let dateFilter = {};
      const now = new Date();

      if (type === 'weekly') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { 'stats.lastActive': { $gte: weekAgo } };
      } else if (type === 'monthly') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { 'stats.lastActive': { $gte: monthAgo } };
      }

      const leaderboard = await User.find(dateFilter)
        .select('username avatar stats badges')
        .sort({ 'stats.totalScore': -1 })
        .limit(Number(limit));

      res.json({
        data: {
          leaderboard: leaderboard.map((user, index) => ({
            rank: index + 1,
            user: {
              id: user._id,
              username: user.username,
              avatar: user.avatar,
              badges: user.badges
            },
            score: user.stats.totalScore,
            gamesPlayed: user.stats.totalGamesPlayed,
            versesMemorized: user.stats.versesMemorized
          })),
          type
        },
        message: 'Leaderboard retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get today's daily challenge
   */
  async getDailyChallenge(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Generate daily challenge based on current date
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);

      const challenges: DailyChallenge[] = [
        {
          id: 'memory-1',
          title: 'Memory Verse Master',
          description: 'Memorize Psalm 23:1 and recite it perfectly',
          type: 'memory',
          points: 50,
          data: {
            verse: 'The Lord is my shepherd; I shall not want.',
            reference: 'Psalm 23:1'
          },
          expiresAt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        {
          id: 'quiz-1',
          title: 'Quiz Champion',
          description: 'Answer 10 questions about the Gospel of John',
          type: 'quiz',
          points: 30,
          data: {
            category: 'Gospel of John',
            questionCount: 10
          },
          expiresAt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        {
          id: 'verse-1',
          title: 'Complete the Verse',
          description: 'Complete 5 verses from the Book of Proverbs',
          type: 'verse',
          points: 40,
          data: {
            book: 'Proverbs',
            verseCount: 5
          },
          expiresAt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      ];

      // Select challenge based on day of year
      const todaysChallenge = challenges[dayOfYear % challenges.length];

      res.json({
        data: todaysChallenge,
        message: 'Daily challenge retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete daily challenge
   */
  async completeDailyChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { challengeId, score } = req.body;
      const userId = req.user?.id;

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if challenge already completed today
      const today = new Date().toDateString();
      const lastChallengeDate = user.stats.lastActive.toDateString();

      if (lastChallengeDate === today) {
        res.json({
          data: null,
          message: 'Daily challenge already completed today',
          error: null
        });
        return;
      }

      // Award points and update stats
      user.stats.totalScore += score;
      user.stats.lastActive = new Date();

      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (user.stats.lastActive.toDateString() === yesterday.toDateString()) {
        user.stats.streakDays += 1;
      } else {
        user.stats.streakDays = 1;
      }

      // Award streak badges
      if (user.stats.streakDays === 7 && !user.badges.includes('7-day-streak')) {
        user.badges.push('7-day-streak');
      }
      if (user.stats.streakDays === 30 && !user.badges.includes('30-day-streak')) {
        user.badges.push('30-day-streak');
      }

      await user.save();

      logger.info(`Daily challenge completed: ${challengeId} by ${user.email}`);

      res.json({
        data: {
          pointsEarned: score,
          newBadges: user.badges.slice(-2), // Return last 2 badges in case new ones were earned
          streakDays: user.stats.streakDays
        },
        message: 'Daily challenge completed successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user badges
   */
  async getUserBadges(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select('badges stats');
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Define all available badges
      const allBadges = [
        {
          id: 'faith-warrior',
          name: 'Faith Warrior',
          description: 'Complete the Journey of Faith',
          icon: '⚔️',
          earned: user.badges.includes('faith-warrior')
        },
        {
          id: 'memory-master',
          name: 'Memory Master',
          description: 'Memorize 50 verses',
          icon: '🧠',
          earned: user.stats.versesMemorized >= 50
        },
        {
          id: 'quiz-champion',
          name: 'Quiz Champion',
          description: 'Score 100% on 10 quizzes',
          icon: '🏆',
          earned: user.badges.includes('quiz-champion')
        },
        {
          id: 'squad-leader',
          name: 'Squad Leader',
          description: 'Lead 5 successful rescue missions',
          icon: '👑',
          earned: user.badges.includes('squad-leader')
        },
        {
          id: '7-day-streak',
          name: 'Daily Devotion',
          description: 'Play games for 7 consecutive days',
          icon: '📅',
          earned: user.stats.streakDays >= 7
        },
        {
          id: '30-day-streak',
          name: 'Faithful Servant',
          description: 'Play games for 30 consecutive days',
          icon: '🌟',
          earned: user.stats.streakDays >= 30
        }
      ];

      res.json({
        data: allBadges,
        message: 'User badges retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}