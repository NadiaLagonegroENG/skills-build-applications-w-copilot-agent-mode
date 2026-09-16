import { Schema, model, models } from 'mongoose';

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    note: { type: String, trim: true }
  },
  { timestamps: true }
);

export default models.Activity || model('Activity', activitySchema);
