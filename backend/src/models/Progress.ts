import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  sessionId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  hintsUsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gameType: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const progressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  hintsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  gameType: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
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
progressSchema.index({ userId: 1, completedAt: -1 });
progressSchema.index({ gameId: 1 });
progressSchema.index({ score: -1 });
progressSchema.index({ gameType: 1 });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);