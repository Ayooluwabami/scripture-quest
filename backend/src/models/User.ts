import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  username: string;
  progress: Array<{
    journeyId?: string;
    level: number;
    score: number;
    completedAt: Date;
  }>;
  memorizedVerses: Array<{
    verseId: string;
    reference: string;
    mastered: boolean;
    reviewCount: number;
    lastReviewed?: Date;
  }>;
  badges: string[];
  role: 'guest' | 'user' | 'admin';
  avatar: string;
  preferences: {
    bibleTranslation: string;
    kidFriendlyMode: boolean;
    notifications: boolean;
    soundEnabled: boolean;
  };
  stats: {
    totalGamesPlayed: number;
    totalScore: number;
    versesMemorized: number;
    streakDays: number;
    lastActive: Date;
  };
  socialLogin?: {
    googleId?: string;
    facebookId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  __v?: number;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function (this: IUser): boolean {
      return !this.socialLogin?.googleId && !this.socialLogin?.facebookId;
    },
    minlength: 8,
    select: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  progress: [{
    journeyId: { type: String },
    level: { type: Number, required: true, min: 1 },
    score: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, default: Date.now }
  }],
  memorizedVerses: [{
    verseId: { type: String, required: true },
    reference: { type: String, required: true },
    mastered: { type: Boolean, default: false },
    reviewCount: { type: Number, default: 0 },
    lastReviewed: { type: Date }
  }],
  badges: [{ type: String }],
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  preferences: {
    bibleTranslation: { type: String, default: 'NIV' },
    kidFriendlyMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true }
  },
  stats: {
    totalGamesPlayed: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    versesMemorized: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  socialLogin: {
    googleId: { type: String, sparse: true },
    facebookId: { type: String, sparse: true }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (_doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         username:
 *           type: string
 *           description: Unique username
 *         progress:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               journeyId:
 *                 type: string
 *               level:
 *                 type: number
 *               score:
 *                 type: number
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *         memorizedVerses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               verseId:
 *                 type: string
 *               reference:
 *                 type: string
 *               mastered:
 *                 type: boolean
 *         badges:
 *           type: array
 *           items:
 *             type: string
 *         role:
 *           type: string
 *           enum: [guest, user, admin]
 *         avatar:
 *           type: string
 *         preferences:
 *           type: object
 *           properties:
 *             bibleTranslation:
 *               type: string
 *             kidFriendlyMode:
 *               type: boolean
 *             notifications:
 *               type: boolean
 *             soundEnabled:
 *               type: boolean
 *         stats:
 *           type: object
 *           properties:
 *             totalGamesPlayed:
 *               type: number
 *             totalScore:
 *               type: number
 *             versesMemorized:
 *               type: number
 *             streakDays:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export const User = mongoose.model<IUser>('User', userSchema);