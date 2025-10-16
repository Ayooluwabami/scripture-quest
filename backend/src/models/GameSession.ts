import mongoose, { Document, Schema } from 'mongoose';

export interface IGameSession extends Document {
  _id: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  players: mongoose.Types.ObjectId[];
  currentQuestion: number;
  questions: mongoose.Types.ObjectId[];
  scores: Map<string, number>;
  timeRemaining: number;
  status: 'waiting' | 'playing' | 'finished';
  settings: {
    allowHints: boolean;
    hintCost: number;
    timeLimit: number;
  };
  startedAt?: Date;
  finishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const gameSessionSchema = new Schema<IGameSession>({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  currentQuestion: {
    type: Number,
    default: 0,
    min: 0
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  scores: {
    type: Map,
    of: Number,
    default: new Map()
  },
  timeRemaining: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished'],
    default: 'waiting'
  },
  settings: {
    allowHints: { type: Boolean, default: true },
    hintCost: { type: Number, default: 5 },
    timeLimit: { type: Number, required: true }
  },
  startedAt: {
    type: Date
  },
  finishedAt: {
    type: Date
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
gameSessionSchema.index({ gameId: 1 });
gameSessionSchema.index({ players: 1 });
gameSessionSchema.index({ status: 1 });
gameSessionSchema.index({ createdAt: -1 });

export const GameSession = mongoose.model<IGameSession>('GameSession', gameSessionSchema);