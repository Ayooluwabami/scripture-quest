import mongoose, { Document, Schema } from 'mongoose';

export interface ILevel extends Document {
  _id: mongoose.Types.ObjectId;
  journeyId: string;
  gameId: mongoose.Types.ObjectId;
  orderIndex: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tasks: mongoose.Types.ObjectId[];
  timeLimit: number;
  pointsToPass: number;
  rewards: {
    points: number;
    badges: string[];
    unlocks: string[];
  };
  prerequisites: string[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const levelSchema = new Schema<ILevel>({
  journeyId: {
    type: String,
    required: true,
    trim: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  orderIndex: {
    type: Number,
    required: true,
    min: 0
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  timeLimit: {
    type: Number, // in seconds
    required: true,
    min: 30
  },
  pointsToPass: {
    type: Number,
    required: true,
    min: 0
  },
  rewards: {
    points: { type: Number, required: true, min: 0 },
    badges: [{ type: String }],
    unlocks: [{ type: String }] // IDs of items unlocked
  },
  prerequisites: [{
    type: String // Level IDs that must be completed first
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (_doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
levelSchema.index({ gameId: 1 });
levelSchema.index({ difficulty: 1 });
levelSchema.index({ isActive: 1 });

// Ensure unique order within journey
levelSchema.index({ journeyId: 1, orderIndex: 1 }, { unique: true });

/**
 * @swagger
 * components:
 *   schemas:
 *     Level:
 *       type: object
 *       required:
 *         - journeyId
 *         - gameId
 *         - orderIndex
 *         - title
 *         - description
 *         - timeLimit
 *         - pointsToPass
 *       properties:
 *         id:
 *           type: string
 *           description: Level ID
 *         journeyId:
 *           type: string
 *           description: Journey identifier
 *         gameId:
 *           type: string
 *           description: Associated game ID
 *         orderIndex:
 *           type: number
 *           description: Order of level in journey
 *         title:
 *           type: string
 *           description: Level title
 *         description:
 *           type: string
 *           description: Level description
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Level difficulty
 *         tasks:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of question/task IDs
 *         timeLimit:
 *           type: number
 *           description: Time limit in seconds
 *         pointsToPass:
 *           type: number
 *           description: Minimum points needed to pass
 *         rewards:
 *           type: object
 *           properties:
 *             points:
 *               type: number
 *             badges:
 *               type: array
 *               items:
 *                 type: string
 *             unlocks:
 *               type: array
 *               items:
 *                 type: string
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           description: Required completed levels
 *         isActive:
 *           type: boolean
 *           description: Whether level is active
 *         createdBy:
 *           type: string
 *           description: ID of user who created the level
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export const Level = mongoose.model<ILevel>('Level', levelSchema);