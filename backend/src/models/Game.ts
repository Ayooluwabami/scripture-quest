import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  type: 'rescue' | 'quiz' | 'pictionary' | 'memory' | 'scavenger' | 'verse' | 'timeline' | 'beatitudes' | 'wordsearch' | 'parable' | 'audio' | 'fourpictures';
  title: string;
  description: string;
  questions: mongoose.Types.ObjectId[];
  levels: mongoose.Types.ObjectId[];
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isMultiplayer: boolean;
  maxPlayers: number;
  timeLimit?: number;
  settings: {
    allowHints: boolean;
    hintCost: number;
    passOnWrong: boolean;
    randomizeQuestions: boolean;
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const gameSchema = new Schema<IGame>({
  type: {
    type: String,
    required: true,
    enum: ['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']
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
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  levels: [{
    type: Schema.Types.ObjectId,
    ref: 'Level'
  }],
  theme: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isMultiplayer: {
    type: Boolean,
    default: false
  },
  maxPlayers: {
    type: Number,
    default: 1,
    min: 1,
    max: 8
  },
  timeLimit: {
    type: Number, // in seconds
    min: 30
  },
  settings: {
    allowHints: { type: Boolean, default: true },
    hintCost: { type: Number, default: 5 },
    passOnWrong: { type: Boolean, default: false },
    randomizeQuestions: { type: Boolean, default: true }
  },
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
gameSchema.index({ type: 1, isActive: 1 });
gameSchema.index({ theme: 1 });
gameSchema.index({ difficulty: 1 });
gameSchema.index({ isMultiplayer: 1 });

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - description
 *         - theme
 *       properties:
 *         id:
 *           type: string
 *           description: Game ID
 *         type:
 *           type: string
 *           enum: [rescue, quiz, pictionary, memory, scavenger, verse, timeline, beatitudes, wordsearch, parable, audio, fourpictures]
 *           description: Type of game
 *         title:
 *           type: string
 *           description: Game title
 *         description:
 *           type: string
 *           description: Game description
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of question IDs
 *         levels:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of level IDs
 *         theme:
 *           type: string
 *           description: Game theme (e.g., Faith, Love, Courage)
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Game difficulty level
 *         isMultiplayer:
 *           type: boolean
 *           description: Whether game supports multiplayer
 *         maxPlayers:
 *           type: number
 *           description: Maximum number of players
 *         timeLimit:
 *           type: number
 *           description: Time limit in seconds
 *         settings:
 *           type: object
 *           properties:
 *             allowHints:
 *               type: boolean
 *             hintCost:
 *               type: number
 *             passOnWrong:
 *               type: boolean
 *             randomizeQuestions:
 *               type: boolean
 *         isActive:
 *           type: boolean
 *           description: Whether game is currently active
 *         createdBy:
 *           type: string
 *           description: ID of user who created the game
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export const Game = mongoose.model<IGame>('Game', gameSchema);