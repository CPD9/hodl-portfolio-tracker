import { Document, Schema, model, models } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  symbol: string;
  type: 'STOCK' | 'CRYPTO';
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  fee: number;
  timestamp: Date;
  txHash?: string; // For crypto trades on blockchain
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

const TransactionSchema = new Schema<ITransaction>({
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
  action: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  txHash: {
    type: String,
    sparse: true, // Only for crypto trades
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED',
  },
}, {
  timestamps: true,
});

// Index for efficient querying
TransactionSchema.index({ userId: 1, timestamp: -1 });
TransactionSchema.index({ userId: 1, symbol: 1 });

const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

