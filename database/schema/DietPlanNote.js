import mongoose from 'mongoose';

const DietPlanNoteSchema = new mongoose.Schema(
  {
    rootUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
    },
    //todo
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
    },
  },
  { timestamps: true }
);

export default DietPlanNoteSchema;
