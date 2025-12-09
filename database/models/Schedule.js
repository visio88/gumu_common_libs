import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema(
  {
    // Client reference
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    
    // Workout plan details
    date: {
      type: Date,
      required: true,
    },
    workoutType: {
      type: String,
      required: true,
      trim: true,
    },
    exercises: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number, // Duration in minutes
    },
    note: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    
    // Organization and user references
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
      immutable: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
ScheduleSchema.index({ clientId: 1, date: -1 });
ScheduleSchema.index({ organization: 1, date: -1 });

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);

