import express from 'express';
import { ProgressController } from '@/controllers/progressController';
import { validateParams } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { idParamSchema } from '@/utils/validators';

const router = express.Router();
const progressController = new ProgressController();

/**
 * @swagger
 * /api/v1/progress/leaderboard:
 *   get:
 *     summary: Get global leaderboard
 *     tags: [Progress]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [global, weekly, monthly]
 *           default: global
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Leaderboard data
 */
router.get('/leaderboard', progressController.getLeaderboard);

/**
 * @swagger
 * /api/v1/progress/daily-challenge:
 *   get:
 *     summary: Get today's daily challenge
 *     tags: [Progress]
 *     responses:
 *       200:
 *         description: Daily challenge data
 */
router.get('/daily-challenge', progressController.getDailyChallenge);

/**
 * @swagger
 * /api/v1/progress/daily-challenge/complete:
 *   post:
 *     summary: Complete daily challenge
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challengeId:
 *                 type: string
 *               score:
 *                 type: number
 *     responses:
 *       200:
 *         description: Challenge completed successfully
 */
router.post('/daily-challenge/complete', authenticateToken, progressController.completeDailyChallenge);

/**
 * @swagger
 * /api/v1/progress/badges/{userId}:
 *   get:
 *     summary: Get user badges
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User badges
 */
router.get('/badges/:userId', authenticateToken, validateParams(idParamSchema), progressController.getUserBadges);

export default router;