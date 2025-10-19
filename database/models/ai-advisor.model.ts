import { Document, Schema, model, models } from 'mongoose';

import { nanoid } from 'nanoid';

export interface IAIAdvisor extends Document {
  _id: string;
  name: string;
  userId: Schema.Types.ObjectId;
  instructions: string;
  personality: 'conservative' | 'aggressive' | 'balanced' | 'analytical';
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIAdvisorSchema = new Schema<IAIAdvisor>({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  personality: {
    type: String,
    enum: ['conservative', 'aggressive', 'balanced', 'analytical'],
    required: true,
    default: 'balanced',
  },
  avatar: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AIAdvisorSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const AIAdvisor = models.AIAdvisor || model<IAIAdvisor>('AIAdvisor', AIAdvisorSchema);

export default AIAdvisor;

