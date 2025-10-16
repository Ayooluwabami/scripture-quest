import { Request, Response, NextFunction } from 'express';
import { Level } from '@/models/Level';
import { NotFoundError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

export class LevelController {
  /**
   * Get all levels with filtering
   */
  async getAllLevels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, journeyId, difficulty } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build filter object
      const filter: any = { isActive: true };
      if (journeyId) filter.journeyId = journeyId;
      if (difficulty) filter.difficulty = difficulty;

      const levels = await Level.find(filter)
        .populate('gameId', 'title type theme')
        .populate('tasks', 'text type difficulty')
        .skip(skip)
        .limit(Number(limit))
        .sort({ journeyId: 1, orderIndex: 1 });

      const total = await Level.countDocuments(filter);

      res.json({
        data: {
          levels,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        },
        message: 'Levels retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get level by ID
   */
  async getLevelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const level = await Level.findById(id)
        .populate('gameId')
        .populate('tasks');

      if (!level) {
        throw new NotFoundError('Level not found');
      }

      res.json({
        data: level.toJSON(),
        message: 'Level retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new level (admin only)
   */
  async createLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const levelData = {
        ...req.body,
        createdBy: req.user?.id
      };

      const level = new Level(levelData);
      await level.save();

      logger.info(`New level created: ${level.title} by ${req.user?.email}`);

      res.status(201).json({
        data: level.toJSON(),
        message: 'Level created successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update level (admin only)
   */
  async updateLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const level = await Level.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!level) {
        throw new NotFoundError('Level not found');
      }

      logger.info(`Level updated: ${level.title} by ${req.user?.email}`);

      res.json({
        data: level.toJSON(),
        message: 'Level updated successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete level (admin only)
   */
  async deleteLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const level = await Level.findByIdAndDelete(id);
      if (!level) {
        throw new NotFoundError('Level not found');
      }

      logger.info(`Level deleted: ${level.title} by ${req.user?.email}`);

      res.json({
        data: null,
        message: 'Level deleted successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}