import express from 'express';
import { LevelController } from '@/controllers/levelController';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { authenticateToken, requireAdmin, optionalAuth } from '@/middleware/auth';
import { 
  createLevelSchema, 
  updateLevelSchema,
  idParamSchema,
  levelQuerySchema 
} from '@/utils/validators';

const router = express.Router();
const levelController = new LevelController();

/**
 * @swagger
 * /api/v1/levels:
 *   get:
 *     summary: Get all levels
 *     tags: [Levels]
 *     parameters:
 *       - in: query
 *         name: journeyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
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
 *         description: List of levels
 */
router.get('/', optionalAuth, validateQuery(levelQuerySchema), levelController.getAllLevels);

/**
 * @swagger
 * /api/v1/levels/{id}:
 *   get:
 *     summary: Get level by ID
 *     tags: [Levels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Level details
 *       404:
 *         description: Level not found
 */
router.get('/:id', optionalAuth, validateParams(idParamSchema), levelController.getLevelById);

/**
 * @swagger
 * /api/v1/levels:
 *   post:
 *     summary: Create new level (admin only)
 *     tags: [Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Level'
 *     responses:
 *       201:
 *         description: Level created successfully
 */
router.post('/', authenticateToken, requireAdmin, validateBody(createLevelSchema), levelController.createLevel);

/**
 * @swagger
 * /api/v1/levels/{id}:
 *   put:
 *     summary: Update level (admin only)
 *     tags: [Levels]
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
 *         description: Level updated successfully
 */
router.put('/:id', authenticateToken, requireAdmin, validateParams(idParamSchema), validateBody(updateLevelSchema), levelController.updateLevel);

/**
 * @swagger
 * /api/v1/levels/{id}:
 *   delete:
 *     summary: Delete level (admin only)
 *     tags: [Levels]
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
 *         description: Level deleted successfully
 */
router.delete('/:id', authenticateToken, requireAdmin, validateParams(idParamSchema), levelController.deleteLevel);

export default router;