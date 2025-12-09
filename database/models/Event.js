import { model, models, Schema } from 'mongoose';

const eventSchema = new Schema({
  index: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: Date, required: true },
  date: { type: Date, required: true },
});

const EventSchema = new Schema(
  {
    accountCode: {
      type: String,
    },
    eventName: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    eventStartDate: {
      type: Date,
      required: true,
    },
    eventEndTime: {
      type: Date,
    },
    eventLocation: {
      type: String,
    },
    eventLocationLink: {
      type: String,
    },
    regards: {
      type: String,
    },
    theme: {
      type: String,
    },
    list: [eventSchema],
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
  },
  { timestamps: true }
);

// pre-sorted composite index for sorted data on Find Filter pagination
EventSchema.index({
  _id: -1,
  createdAt: -1,
});

export default models.Event ? models.Event : model('Event', EventSchema);
