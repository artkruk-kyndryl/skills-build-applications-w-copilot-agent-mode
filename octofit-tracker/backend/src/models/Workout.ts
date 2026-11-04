import { Schema, model } from 'mongoose';

const workoutSchema = new Schema({
  title: { type: String, required: true, trim: true },
  focus: { type: String, required: true, trim: true },
  minutes: {
    type: Number,
    required: true,
    validate: { validator: (value: number) => Number.isFinite(value) && value > 0, message: 'Minutes must be positive' },
  },
  difficulty: { type: String, required: true, trim: true },
});

export const Workout = model('Workout', workoutSchema);
