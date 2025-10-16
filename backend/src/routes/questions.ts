import express from 'express';
import { QuestionController } from '@/controllers/questionController';
import { validateBody, validateParams, validateQuery } from '@/middleware/validation';
import { authenticateToken, requireAdmin, optionalAuth } from '@/middleware/auth';
import { 
  createQuestionSchema, 
  updateQuestionSchema,
  idParamSchema,
  questionQuerySchema 
} from '@/utils/validators';

const router = express.Router();
const questionController = new QuestionController();

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [multiple-choice, open-ended, fill-in, drawing, ordering, audio, matching, true-false]
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *       - in: query
 *         name: gameType
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
 *         description: List of questions
 */
router.get('/', optionalAuth, validateQuery(questionQuerySchema), questionController.getAllQuestions);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */
router.get('/:id', optionalAuth, validateParams(idParamSchema), questionController.getQuestionById);

/**
 * @swagger
 * /api/v1/questions:
 *   post:
 *     summary: Create new question (admin only)
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully
 */
router.post('/', authenticateToken, requireAdmin, validateBody(createQuestionSchema), questionController.createQuestion);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   put:
 *     summary: Update question (admin only)
 *     tags: [Questions]
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
 *         description: Question updated successfully
 */
router.put('/:id', authenticateToken, requireAdmin, validateParams(idParamSchema), validateBody(updateQuestionSchema), questionController.updateQuestion);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   delete:
 *     summary: Delete question (admin only)
 *     tags: [Questions]
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
 *         description: Question deleted successfully
 */
router.delete('/:id', authenticateToken, requireAdmin, validateParams(idParamSchema), questionController.deleteQuestion);

/**
 * @swagger
 * /api/v1/questions/random:
 *   get:
 *     summary: Get random questions for game
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: gameType
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Random questions for game
 */
router.get('/random', optionalAuth, questionController.getRandomQuestions);

export default router;