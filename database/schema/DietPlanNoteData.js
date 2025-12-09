import mongoose from 'mongoose';
import { enums } from '../../utils/enum';

const weightUOMEnum = enums.weightUOM.map((data) => data?.value);

const BreakfastPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  weightUOM: {
    type: Number,
    enum: weightUOMEnum,
  },
  duration: {
    type: Number,
  },
});

const DietPlanNoteDataSchema = new mongoose.Schema({
  instructions: {
    type: String,
  },
  breakfastPlan: {
    type: BreakfastPlanSchema,
  },
});

export default DietPlanNoteDataSchema;
