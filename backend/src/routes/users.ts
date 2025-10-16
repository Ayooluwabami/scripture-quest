import express from 'express';
import { UserController } from '@/controllers/userController';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { 
  updateUserSchema, 
  idParamSchema,
  paginationSchema,
  updateProgressSchema 
} from '@/utils/validators';

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of users
 */
router.get('/', authenticateToken, requireAdmin, validateQuery(paginationSchema), userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
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
 *         description: User profile
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken, validateParams(idParamSchema), userController.getUserById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', authenticateToken, validateParams(idParamSchema), validateBody(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
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
 *         description: User deleted successfully
 */
router.delete('/:id', authenticateToken, validateParams(idParamSchema), userController.deleteUser);

/**
 * @swagger
 * /api/v1/users/{id}/progress:
 *   get:
 *     summary: Get user progress
 *     tags: [Users]
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
 *         description: User progress data
 */
router.get('/:id/progress', authenticateToken, validateParams(idParamSchema), userController.getUserProgress);

/**
 * @swagger
 * /api/v1/users/{id}/progress:
 *   post:
 *     summary: Update user progress
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               journeyId:
 *                 type: string
 *               level:
 *                 type: number
 *               score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Progress updated successfully
 */
router.post('/:id/progress', authenticateToken, validateParams(idParamSchema), validateBody(updateProgressSchema), userController.updateProgress);

/**
 * @swagger
 * /api/v1/users/{id}/verses:
 *   post:
 *     summary: Add memorized verse
 *     tags: [Users]
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
 *         description: Verse added successfully
 */
router.post('/:id/verses', authenticateToken, validateParams(idParamSchema), userController.addMemorizedVerse);

/**
 * @swagger
 * /api/v1/users/{id}/verses/{verseId}:
 *   put:
 *     summary: Update verse progress
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verse progress updated
 */
router.put('/:id/verses/:verseId', authenticateToken, userController.updateVerseProgress);

export default router;