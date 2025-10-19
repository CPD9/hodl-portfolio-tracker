import { Document, Schema, model, models } from 'mongoose';

import { nanoid } from 'nanoid';

export type ConsultationStatus = 'upcoming' | 'active' | 'completed' | 'processing' | 'cancelled';

export interface IConsultation extends Document {
  _id: string;
  name: string;
  userId: Schema.Types.ObjectId;
  advisorId: string;
  status: ConsultationStatus;
  startedAt?: Date;
  endedAt?: Date;
  transcriptUrl?: string;
  recordingUrl?: string;
  summary?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>({
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
  advisorId: {
    type: String,
    ref: 'AIAdvisor',
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'processing', 'cancelled'],
    required: true,
    default: 'upcoming',
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
  transcriptUrl: {
    type: String,
  },
  recordingUrl: {
    type: String,
  },
  summary: {
    type: String,
  },
  duration: {
    type: Number,
    default: 0,
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

ConsultationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ConsultationSchema.index({ userId: 1, status: 1 });
ConsultationSchema.index({ advisorId: 1 });

const Consultation = models.Consultation || model<IConsultation>('Consultation', ConsultationSchema);

export default Consultation;

