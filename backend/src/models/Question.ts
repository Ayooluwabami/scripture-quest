import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'fill-in' | 'drawing' | 'ordering' | 'audio' | 'matching' | 'true-false';
  answer: string | string[];
  options?: string[];
  reference?: string;
  clues?: string[];
  theme?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  hints?: string[];
  images?: string[];
  audioUrl?: string;
  gameTypes: string[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const questionSchema = new Schema<IQuestion>({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'open-ended', 'fill-in', 'drawing', 'ordering', 'audio', 'matching', 'true-false']
  },
  answer: {
    type: Schema.Types.Mixed, // Can be string or array of strings
    required: true
  },
  options: [{
    type: String,
    trim: true
  }],
  reference: {
    type: String,
    trim: true,
    maxlength: 100
  },
  clues: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  theme: {
    type: String,
    trim: true,
    maxlength: 50
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: 500
  },
  hints: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  images: [{
    type: String // URLs to images
  }],
  audioUrl: {
    type: String // URL to audio file
  },
  gameTypes: [{
    type: String,
    enum: ['rescue', 'quiz', 'pictionary', 'memory', 'scavenger', 'verse', 'timeline', 'beatitudes', 'wordsearch', 'parable', 'audio', 'fourpictures']
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
questionSchema.index({ type: 1, isActive: 1 });
questionSchema.index({ theme: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ gameTypes: 1 });
questionSchema.index({ reference: 1 });

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - text
 *         - type
 *         - answer
 *       properties:
 *         id:
 *           type: string
 *           description: Question ID
 *         text:
 *           type: string
 *           description: Question text
 *         type:
 *           type: string
 *           enum: [multiple-choice, open-ended, fill-in, drawing, ordering, audio, matching, true-false]
 *           description: Type of question
 *         answer:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *           description: Correct answer(s)
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: Multiple choice options
 *         reference:
 *           type: string
 *           description: Bible reference (e.g., John 3:16)
 *         clues:
 *           type: array
 *           items:
 *             type: string
 *           description: Hints for the question
 *         theme:
 *           type: string
 *           description: Question theme
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Question difficulty
 *         explanation:
 *           type: string
 *           description: Explanation of the answer
 *         hints:
 *           type: array
 *           items:
 *             type: string
 *           description: Progressive hints
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Image URLs for visual questions
 *         audioUrl:
 *           type: string
 *           description: Audio file URL
 *         gameTypes:
 *           type: array
 *           items:
 *             type: string
 *           description: Compatible game types
 *         isActive:
 *           type: boolean
 *           description: Whether question is active
 *         createdBy:
 *           type: string
 *           description: ID of user who created the question
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export const Question = mongoose.model<IQuestion>('Question', questionSchema);