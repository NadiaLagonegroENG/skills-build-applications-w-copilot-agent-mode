import { Schema, model, models } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, trim: true },
    teamName: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    badge: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default models.LeaderboardEntry || model('LeaderboardEntry', leaderboardEntrySchema);
