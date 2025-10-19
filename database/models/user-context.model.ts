import { Document, Schema, model, models } from 'mongoose';

export interface IUserContext extends Document {
  userId: string;
  contextSummary: string; // OpenAI-generated summary of user's investment profile
  dataHash: string; // Hash of the data used to generate the context
  lastUpdated: Date;
}

const UserContextSchema = new Schema<IUserContext>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  contextSummary: {
    type: String,
    required: true,
  },
  dataHash: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const UserContext = models.UserContext || model<IUserContext>('UserContext', UserContextSchema);

export default UserContext;
