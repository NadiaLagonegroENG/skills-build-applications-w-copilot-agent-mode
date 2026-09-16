import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    goal: { type: String, required: true, trim: true },
    teamName: { type: String, trim: true }
  },
  { timestamps: true }
);

export default models.User || model('User', userSchema);
