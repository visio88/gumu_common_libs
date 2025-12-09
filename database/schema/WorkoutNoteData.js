import mongoose from 'mongoose';
import { enums } from '../../utils/enum';

const weightUOMEnum = enums.weightUOM.map((data) => data?.value);
const durationUOMEnum = enums.durationUOM.map((data) => data?.value);
const lengthUOMEnum = enums.lengthUOM.map((data) => data?.value);

const NoteExercisesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
  },
  weightUOM: {
    type: String,
    enum: weightUOMEnum,
  },
  duration: {
    type: Number,
  },
  durationUOM: {
    type: String,
    enum: durationUOMEnum,
  },
  length: {
    type: Number,
  },
  lengthUOM: {
    type: String,
    enum: lengthUOMEnum,
  },
  reps: {
    type: Number,
  },
  sets: {
    type: Number,
  },
  restPeriod: {
    type: Number,
  },
  moreInstructions: {
    type: String,
  },
});

const WorkoutNoteDataSchema = new mongoose.Schema({
  instructions: {
    type: String,
    required: true,
  },
  exercises: {
    type: NoteExercisesSchema,
  },
});

export default WorkoutNoteDataSchema;
