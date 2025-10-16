import { Request, Response, NextFunction } from 'express';
import { Community } from '@/models/Community';
import { NotFoundError } from '@/middleware/errorHandler';
import { logger } from '@/middleware/logger';

export class CommunityController {
  /**
   * Get forum posts
   */
  async getForumPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Build filter object
      const filter: any = { type: 'forum-post', isActive: true };
      if (category && category !== 'all') {
        filter.category = new RegExp(category as string, 'i');
      }
      if (search) {
        filter.$or = [
          { title: new RegExp(search as string, 'i') },
          { content: new RegExp(search as string, 'i') }
        ];
      }

      const posts = await Community.find(filter)
        .populate('author', 'username avatar badges')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Community.countDocuments(filter);

      res.json({
        data: {
          posts,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        },
        message: 'Forum posts retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create forum post
   */
  async createForumPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, content, category } = req.body;
      const userId = req.user?.id;

      const post = new Community({
        type: 'forum-post',
        title,
        content,
        category,
        author: userId,
        likes: 0,
        replies: 0
      });

      await post.save();
      await post.populate('author', 'username avatar badges');

      logger.info(`New forum post created: ${title} by ${req.user?.email}`);

      res.status(201).json({
        data: post.toJSON(),
        message: 'Forum post created successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Like a forum post
   */
  async likePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const post = await Community.findById(id);
      if (!post) {
        throw new NotFoundError('Post not found');
      }

      // Check if user already liked this post
      if (!post.likedBy) post.likedBy = [];

      if (post.likedBy.includes(userId!)) {
        res.json({
          data: { liked: true },
          message: 'Post already liked',
          error: null
        });
        return;
      }

      // Add like
      post.likes += 1;
      post.likedBy.push(userId!);
      await post.save();

      res.json({
        data: { liked: true, totalLikes: post.likes },
        message: 'Post liked successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get verse cards
   */
  async getVerseCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const verseCards = await Community.find({
        type: 'verse-card',
        isActive: true
      })
        .populate('author', 'username avatar')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await Community.countDocuments({ type: 'verse-card', isActive: true });

      res.json({
        data: {
          verseCards,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        },
        message: 'Verse cards retrieved successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create verse card
   */
  async createVerseCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { verse, reference, background } = req.body;
      const userId = req.user?.id;

      const verseCard = new Community({
        type: 'verse-card',
        content: verse,
        metadata: {
          reference,
          background
        },
        author: userId,
        likes: 0,
        shares: 0
      });

      await verseCard.save();
      await verseCard.populate('author', 'username avatar');

      logger.info(`New verse card created: ${reference} by ${req.user?.email}`);

      res.status(201).json({
        data: verseCard.toJSON(),
        message: 'Verse card created successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Like a verse card
   */
  async likeVerseCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const verseCard = await Community.findById(id);
      if (!verseCard) {
        throw new NotFoundError('Verse card not found');
      }

      // Check if user already liked this card
      if (!verseCard.likedBy) verseCard.likedBy = [];

      if (verseCard.likedBy.includes(userId!)) {
        res.json({
          data: { liked: true },
          message: 'Verse card already liked',
          error: null
        });
        return;
      }

      // Add like
      verseCard.likes += 1;
      verseCard.likedBy.push(userId!);
      await verseCard.save();

      res.json({
        data: { liked: true, totalLikes: verseCard.likes },
        message: 'Verse card liked successfully',
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}