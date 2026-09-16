import { Schema, model, models } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    targetLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    focus: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    assignedRoles: [{ type: String, enum: ['student', 'teacher'] }]
  },
  { timestamps: true }
);

export default models.Workout || model('Workout', workoutSchema);
