import { Request, Response, NextFunction } from 'express';
import { Game } from '@/models/Game';
import { NotFoundError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';
import { GameService } from '@/services/gameService';

export class GameController {
  private gameService = new GameService();

  /**
   * Get all games with filtering
   */
  async getAllGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, type, difficulty, isMultiplayer, theme } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build filter object
      const filter: any = { isActive: true };
      if (type) filter.type = type;
      if (difficulty) filter.difficulty = difficulty;
      if (isMultiplayer !== undefined) filter.isMultiplayer = isMultiplayer === 'true';
      if (theme) filter.theme = new RegExp(theme as string, 'i');

      const games = await Game.find(filter)
        .populate('questions', 'text type difficulty')
        .populate('levels', 'title difficulty orderIndex')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Game.countDocuments(filter);

      res.json({
        data: {
          games,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        },
        message: 'Games retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get game by ID
   */
  async getGameById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const game = await Game.findById(id)
        .populate('questions')
        .populate('levels');

      if (!game) {
        throw new NotFoundError('Game not found');
      }

      res.json({
        data: game.toJSON(),
        message: 'Game retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new game (admin only)
   */
  async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameData = {
        ...req.body,
        createdBy: req.user?.id
      };

      const game = new Game(gameData);
      await game.save();

      logger.info(`New game created: ${game.title} by ${req.user?.email}`);

      res.status(201).json({
        data: game.toJSON(),
        message: 'Game created successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update game (admin only)
   */
  async updateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const game = await Game.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!game) {
        throw new NotFoundError('Game not found');
      }

      logger.info(`Game updated: ${game.title} by ${req.user?.email}`);

      res.json({
        data: game.toJSON(),
        message: 'Game updated successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete game (admin only)
   */
  async deleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const game = await Game.findByIdAndDelete(id);
      if (!game) {
        throw new NotFoundError('Game not found');
      }

      logger.info(`Game deleted: ${game.title} by ${req.user?.email}`);

      res.json({
        data: null,
        message: 'Game deleted successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create game session
   */
  async createGameSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const game = await Game.findById(id).populate('questions');
      if (!game) {
        throw new NotFoundError('Game not found');
      }

      const session = await this.gameService.createGameSession(game, userId!);

      res.status(201).json({
        data: session,
        message: 'Game session created successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit answer to game session
   */
  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { questionId, answer } = req.body;
      const userId = req.user?.id;

      const result = await this.gameService.submitAnswer(sessionId, questionId, answer, userId!);

      res.json({
        data: result,
        message: 'Answer submitted successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}