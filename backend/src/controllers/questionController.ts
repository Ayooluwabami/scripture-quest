import { Request, Response, NextFunction } from 'express';
import { Question } from '@/models/Question';
import { NotFoundError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

export class QuestionController {
  /**
   * Get all questions with filtering
   */
  async getAllQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, type, theme, difficulty, gameType } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build filter object
      const filter: any = { isActive: true };
      if (type) filter.type = type;
      if (theme) filter.theme = new RegExp(theme as string, 'i');
      if (difficulty) filter.difficulty = difficulty;
      if (gameType) filter.gameTypes = { $in: [gameType] };

      const questions = await Question.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Question.countDocuments(filter);

      res.json({
        data: {
          questions,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        },
        message: 'Questions retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get question by ID
   */
  async getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const question = await Question.findById(id);
      if (!question) {
        throw new NotFoundError('Question not found');
      }

      res.json({
        data: question.toJSON(),
        message: 'Question retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new question (admin only)
   */
  async createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questionData = {
        ...req.body,
        createdBy: req.user?.id
      };

      const question = new Question(questionData);
      await question.save();

      logger.info(`New question created: ${question.text.substring(0, 50)}... by ${req.user?.email}`);

      res.status(201).json({
        data: question.toJSON(),
        message: 'Question created successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update question (admin only)
   */
  async updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const question = await Question.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!question) {
        throw new NotFoundError('Question not found');
      }

      logger.info(`Question updated: ${question.text.substring(0, 50)}... by ${req.user?.email}`);

      res.json({
        data: question.toJSON(),
        message: 'Question updated successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete question (admin only)
   */
  async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const question = await Question.findByIdAndDelete(id);
      if (!question) {
        throw new NotFoundError('Question not found');
      }

      logger.info(`Question deleted: ${question.text.substring(0, 50)}... by ${req.user?.email}`);

      res.json({
        data: null,
        message: 'Question deleted successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get random questions for game
   */
  async getRandomQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { gameType, difficulty, count = 10 } = req.query;

      const filter: any = {
        isActive: true,
        gameTypes: { $in: [gameType] }
      };

      if (difficulty) filter.difficulty = difficulty;

      const questions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: Number(count) } }
      ]);

      res.json({
        data: questions,
        message: 'Random questions retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}