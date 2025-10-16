import express from 'express';
import { CommunityController } from '@/controllers/communityController';
import { validateParams, validateQuery } from '@/middleware/validation';
import { authenticateToken, optionalAuth } from '@/middleware/auth';
import { idParamSchema, paginationSchema } from '@/utils/validators';

const router = express.Router();
const communityController = new CommunityController();

/**
 * @swagger
 * /api/v1/community/posts:
 *   get:
 *     summary: Get forum posts
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of forum posts
 */
router.get('/posts', optionalAuth, validateQuery(paginationSchema), communityController.getForumPosts);

/**
 * @swagger
 * /api/v1/community/posts:
 *   post:
 *     summary: Create forum post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/posts', authenticateToken, communityController.createForumPost);

/**
 * @swagger
 * /api/v1/community/posts/{id}/like:
 *   post:
 *     summary: Like a forum post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked successfully
 */
router.post('/posts/:id/like', authenticateToken, validateParams(idParamSchema), communityController.likePost);

/**
 * @swagger
 * /api/v1/community/verse-cards:
 *   get:
 *     summary: Get verse cards
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: List of verse cards
 */
router.get('/verse-cards', optionalAuth, communityController.getVerseCards);

/**
 * @swagger
 * /api/v1/community/verse-cards:
 *   post:
 *     summary: Create verse card
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verse:
 *                 type: string
 *               reference:
 *                 type: string
 *               background:
 *                 type: string
 *     responses:
 *       201:
 *         description: Verse card created successfully
 */
router.post('/verse-cards', authenticateToken, communityController.createVerseCard);

/**
 * @swagger
 * /api/v1/community/verse-cards/{id}/like:
 *   post:
 *     summary: Like a verse card
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verse card liked successfully
 */
router.post('/verse-cards/:id/like', authenticateToken, validateParams(idParamSchema), communityController.likeVerseCard);

export default router;