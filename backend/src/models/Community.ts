import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunity extends Document {
  _id: mongoose.Types.ObjectId;
  type: 'forum-post' | 'verse-card' | 'prayer-request';
  title?: string;
  content: string;
  category?: string;
  author: mongoose.Types.ObjectId;
  likes: number;
  likedBy: string[];
  replies?: number;
  shares?: number;
  metadata?: {
    reference?: string;
    background?: string;
    tags?: string[];
  };
  isActive: boolean;
  isModerated: boolean;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const communitySchema = new Schema<ICommunity>({
  type: {
    type: String,
    required: true,
    enum: ['forum-post', 'verse-card', 'prayer-request']
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  likedBy: [{
    type: String // User IDs who liked this content
  }],
  replies: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    reference: { type: String }, // Bible reference for verse cards
    background: { type: String }, // Background image URL for verse cards
    tags: [{ type: String }] // Tags for categorization
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
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
communitySchema.index({ type: 1, isActive: 1 });
communitySchema.index({ author: 1 });
communitySchema.index({ category: 1 });
communitySchema.index({ createdAt: -1 });
communitySchema.index({ likes: -1 });

/**
 * @swagger
 * components:
 *   schemas:
 *     CommunityPost:
 *       type: object
 *       required:
 *         - type
 *         - content
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: Post ID
 *         type:
 *           type: string
 *           enum: [forum-post, verse-card, prayer-request]
 *           description: Type of community content
 *         title:
 *           type: string
 *           description: Post title (for forum posts)
 *         content:
 *           type: string
 *           description: Post content
 *         category:
 *           type: string
 *           description: Post category
 *         author:
 *           type: string
 *           description: Author user ID
 *         likes:
 *           type: number
 *           description: Number of likes
 *         replies:
 *           type: number
 *           description: Number of replies
 *         shares:
 *           type: number
 *           description: Number of shares
 *         metadata:
 *           type: object
 *           properties:
 *             reference:
 *               type: string
 *             background:
 *               type: string
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *         isActive:
 *           type: boolean
 *           description: Whether content is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export const Community = mongoose.model<ICommunity>('Community', communitySchema);