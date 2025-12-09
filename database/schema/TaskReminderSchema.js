import { Schema } from 'mongoose';
import { enums } from '../../utils/enum';

const reminderTypes = enums.reminderTypes.map((i) => i.value);

const TaskReminderSchema = new Schema({
  reminderType: { type: String, enums: reminderTypes },
  reminderTime: { type: Number },
  reminderUnit: { type: String },
});

export default TaskReminderSchema;
