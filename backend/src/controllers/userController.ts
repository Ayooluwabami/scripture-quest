import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/User';
import { NotFoundError, AuthorizationError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

export class UserController {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      res.json({
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        },
        message: 'Users retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Users can only view their own profile unless admin
      if (req.user?.id !== id && req.user?.role !== 'admin') {
        throw new AuthorizationError('Cannot access other user profiles');
      }

      const user = await User.findById(id).select('-password');
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({
        data: user.toJSON(),
        message: 'User retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Users can only update their own profile unless admin
      if (req.user?.id !== id && req.user?.role !== 'admin') {
        throw new AuthorizationError('Cannot update other user profiles');
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new NotFoundError('User not found');
      }

      logger.info(`User profile updated: ${user.email}`);

      res.json({
        data: user.toJSON(),
        message: 'User updated successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account (GDPR compliance)
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Users can only delete their own account unless admin
      if (req.user?.id !== id && req.user?.role !== 'admin') {
        throw new AuthorizationError('Cannot delete other user accounts');
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      logger.info(`User account deleted: ${user.email}`);

      res.json({
        data: null,
        message: 'User account deleted successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user progress
   */
  async getUserProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Users can only view their own progress unless admin
      if (req.user?.id !== id && req.user?.role !== 'admin') {
        throw new AuthorizationError('Cannot access other user progress');
      }

      const user = await User.findById(id).select('progress memorizedVerses badges stats');
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({
        data: {
          progress: user.progress,
          memorizedVerses: user.memorizedVerses,
          badges: user.badges,
          stats: user.stats
        },
        message: 'User progress retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user progress
   */
  async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const progressData = req.body;

      // Users can only update their own progress
      if (req.user?.id !== id) {
        throw new AuthorizationError('Cannot update other user progress');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Add new progress entry
      user.progress.push({
        ...progressData,
        completedAt: new Date()
      });

      // Update stats
      user.stats.totalGamesPlayed += 1;
      user.stats.totalScore += progressData.score;
      user.stats.lastActive = new Date();

      await user.save();

      logger.info(`Progress updated for user: ${user.email}`);

      res.status(201).json({
        data: user.progress[user.progress.length - 1],
        message: 'Progress updated successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add memorized verse
   */
  async addMemorizedVerse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { verseId, reference } = req.body;

      // Users can only update their own verses
      if (req.user?.id !== id) {
        throw new AuthorizationError('Cannot update other user verses');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if verse already exists
      const existingVerse = user.memorizedVerses.find(v => v.verseId === verseId);
      if (existingVerse) {
        res.json({
          data: existingVerse,
          message: 'Verse already in memory bank',
          error: null
        });
        return;
      }

      // Add new verse
      const newVerse = {
        verseId,
        reference,
        mastered: false,
        reviewCount: 0,
        lastReviewed: new Date()
      };

      user.memorizedVerses.push(newVerse);
      user.stats.versesMemorized += 1;

      await user.save();

      logger.info(`Verse added to memory bank: ${reference} for user ${user.email}`);

      res.status(201).json({
        data: newVerse,
        message: 'Verse added to memory bank successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update verse progress
   */
  async updateVerseProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, verseId } = req.params;
      const updates = req.body;

      // Users can only update their own verses
      if (req.user?.id !== id) {
        throw new AuthorizationError('Cannot update other user verses');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const verseIndex = user.memorizedVerses.findIndex(v => v.verseId === verseId);
      if (verseIndex === -1) {
        throw new NotFoundError('Verse not found in memory bank');
      }

      // Update verse
      user.memorizedVerses[verseIndex] = {
        ...user.memorizedVerses[verseIndex],
        ...updates,
        reviewCount: user.memorizedVerses[verseIndex].reviewCount + 1,
        lastReviewed: new Date()
      };

      await user.save();

      res.json({
        data: user.memorizedVerses[verseIndex],
        message: 'Verse progress updated successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}