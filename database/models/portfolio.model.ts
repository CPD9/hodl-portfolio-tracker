import { Document, Schema, model, models } from 'mongoose';

export interface IPortfolio extends Document {
  userId: string;
  symbol: string;
  type: 'STOCK' | 'CRYPTO';
  quantity: number;
  avgPrice: number;
  totalInvested: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  lastUpdated: Date;
}

const PortfolioSchema = new Schema<IPortfolio>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ['STOCK', 'CRYPTO'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  avgPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalInvested: {
    type: Number,
    required: true,
    default: 0,
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  pnl: {
    type: Number,
    default: 0,
  },
  pnlPercentage: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
PortfolioSchema.index({ userId: 1, symbol: 1, type: 1 }, { unique: true });

const Portfolio = models.Portfolio || model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;

