import { Schema, model, models } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coach: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default models.Team || model('Team', teamSchema);
