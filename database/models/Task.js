import { model, models, Schema } from 'mongoose';
import RecurrenceSchema from '../schema/RecurrenceSchema';
import TaskReminderSchema from '../schema/TaskReminderSchema';
import { enums } from '../../utils/enum';

const taskStatusEnums = enums.taskStatus.map((i) => i.value);
const priorityLevelEnums = enums.priorityLevels.map((i) => i.value);

const TaskSchema = new Schema(
  {
    assignedClient: { type: String },
    title: { type: String },
    assignees: {
      type: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: 'TeamMember',
          },
        },
      ],
    }, // check the type and update it
    clientMustCompleteTask: { type: Boolean },
    description: { type: String },
    timestampCreated: { type: Date },
    dueDate: { type: { date: String, time: String } },
    timestampUpdated: { type: Date },
    recurrence: { type: RecurrenceSchema },
    partnerToComplete: { type: Boolean },
    priority: { type: String, enums: priorityLevelEnums },
    notifications: { type: { sendNotifications: Boolean } },
    isModernModal: { type: Boolean },
    individualToComplete: { type: Boolean },
    completionDate: { type: Date },
    rootUser: {
      type: Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
      immutable: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    completedBy: { type: String },
    subTasks: {
      type: [
        {
          id: Number,
          status: String,
          itemName: String,
          updated_at: { type: Date },
        },
      ],
    },
    taskStatus: { type: String, enum: taskStatusEnums },
    originalAssignees: { type: [] },
    reminders: { type: String }, // type is not decided
    timeLogged: { type: Date },
    isDeleted: { type: Boolean, default: false },
    taskReminders: { type: [TaskReminderSchema] },
  },
  { timestamps: true }
);

TaskSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

TaskSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

TaskSchema.pre('save', function (next) {
  this.subTasks.updated_at = Date.now();
  next();
});

// pre-sorted composite index for sorted data on Find Filter pagination
TaskSchema.index({
  _id: -1,
  createdAt: -1,
});

export default models.Task ? models.Task : model('Task', TaskSchema);
