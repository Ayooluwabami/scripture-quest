import express from 'express';
import { GameController } from '@/controllers/gameController';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { authenticateToken, requireAdmin, optionalAuth } from '@/middleware/auth';
import { 
  createGameSchema, 
  updateGameSchema,
  idParamSchema,
  gameQuerySchema 
} from '@/utils/validators';

const router = express.Router();
const gameController = new GameController();

/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Get all games
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [rescue, quiz, pictionary, memory, scavenger, verse, timeline, beatitudes, wordsearch, parable, audio, fourpictures]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *       - in: query
 *         name: isMultiplayer
 *         schema:
 *           type: boolean
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
 *         description: List of games
 */
router.get('/', optionalAuth, validateQuery(gameQuerySchema), gameController.getAllGames);

/**
 * @swagger
 * /api/v1/games/{id}:
 *   get:
 *     summary: Get game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game details
 *       404:
 *         description: Game not found
 */
router.get('/:id', optionalAuth, validateParams(idParamSchema), gameController.getGameById);

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Create new game (admin only)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Game created successfully
 */
router.post('/', authenticateToken, requireAdmin, validateBody(createGameSchema), gameController.createGame);

/**
 * @swagger
 * /api/v1/games/{id}:
 *   put:
 *     summary: Update game (admin only)
 *     tags: [Games]
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
 *         description: Game updated successfully
 */
router.put('/:id', authenticateToken, requireAdmin, validateParams(idParamSchema), validateBody(updateGameSchema), gameController.updateGame);

/**
 * @swagger
 * /api/v1/games/{id}:
 *   delete:
 *     summary: Delete game (admin only)
 *     tags: [Games]
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
 *         description: Game deleted successfully
 */
router.delete('/:id', authenticateToken, requireAdmin, validateParams(idParamSchema), gameController.deleteGame);

/**
 * @swagger
 * /api/v1/games/{id}/session:
 *   post:
 *     summary: Create game session
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Game session created
 */
router.post('/:id/session', authenticateToken, validateParams(idParamSchema), gameController.createGameSession);

/**
 * @swagger
 * /api/v1/games/session/{sessionId}/answer:
 *   post:
 *     summary: Submit answer to game session
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 */
router.post('/session/:sessionId/answer', authenticateToken, gameController.submitAnswer);

export default router;