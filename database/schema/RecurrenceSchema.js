import { Schema } from 'mongoose';

import { enums } from '../../utils/enum';

const repeatFrequencyUOM = enums.repeatFrequencyUOM.map((i) => i.value);
const endRecurringTask = enums.endRecurringTask.map((i) => i.value);

const RecurrenceSchema = new Schema({
  repeatFrequency: { type: Number },
  repeatFrequencyUnit: { type: String, enum: repeatFrequencyUOM },
  endRecurringTask: { type: String, enum: endRecurringTask },
  endOnDueTime: { type: String },
  endOnDueDate: { type: String },
  numOfOccurrences: { type: Number },
});

export default RecurrenceSchema;
