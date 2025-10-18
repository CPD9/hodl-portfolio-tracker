import { Document, Schema, model, models } from 'mongoose';

export interface IUserBalance extends Document {
  userId: string;
  paperBalance: number; // Virtual money for stock trading
  cryptoWalletAddress?: string;
  totalTrades: number;
  successfulTrades: number;
  winRate: number;
  totalPnL: number;
  lastTradeDate?: Date;
}

const UserBalanceSchema = new Schema<IUserBalance>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  paperBalance: {
    type: Number,
    default: 100000, // Start with $100k paper money
    min: 0,
  },
  cryptoWalletAddress: {
    type: String,
    sparse: true,
  },
  totalTrades: {
    type: Number,
    default: 0,
  },
  successfulTrades: {
    type: Number,
    default: 0,
  },
  winRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  totalPnL: {
    type: Number,
    default: 0,
  },
  lastTradeDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const UserBalance = models.UserBalance || model<IUserBalance>('UserBalance', UserBalanceSchema);

export default UserBalance;

