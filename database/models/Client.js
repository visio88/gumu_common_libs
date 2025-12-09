import { model, models, Schema } from 'mongoose';
import { enums } from '../../utils/enum';

import AddressSchema from '../schema/Address';
import EmergencyContactSchema from '../schema/EmergencyContact';
const GenderTypes = enums.genderTypes.map((data) => data?.value);
const TitleTypes = enums.titles.map((data) => data?.value);

const ClientSchema = new Schema(
  {
    accountCode: {
      type: String,
    },
    gestId: {
      type: String,
    },
  //   templateId: {
  //   type: Number,
  //   unique: true,
  //   sparse: true
  // },
  uniqueId: {
      type: Number,
      required: true,
      unique: true,
      min: 0,
      max: 1000,
    },
    sensorId: { type: String },
    fingerprintData:{
      type: Buffer,
    },
    fingerPosition: {
     type: String,
     enum: ['left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_little', 
           'right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_little'],
  },
    attendance: { type: String },
    message: {
      type: String,
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    preferredName: { type: String },
    title: {
      type: String,
      enum: TitleTypes,
    },
    primaryEmailAddress: { type: String },
    secondaryEmailAddress: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: GenderTypes },

    primaryMobileNumber: { type: String },
    secondaryMobileNumber: { type: String },
    postalAddress: { type: AddressSchema },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
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
    
    attendanceRecords: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attendance', // Reference to Attendance schema
      },
    ],
    membershipPackage: {
      type: Schema.Types.ObjectId,
      ref: 'MembershipPackage',
    },
    membershipStartDate: {
      type: Date,
    },
    membershipEndDate: {
      type: Date,
    },
    emergencyContact: {
      type: EmergencyContactSchema,
    },
  },
  { timestamps: true }
);

// pre-sorted composite index for sorted data on Find Filter pagination
ClientSchema.index({
  _id: -1,
  createdAt: -1,
});

// Ensure uniqueId is unique across all documents
// Note: uniqueId already has unique: true in schema definition

// // Add pre-save middleware to auto-increment templateId
// ClientSchema.pre('save', async function(next) {
//   // Only auto-assign templateId if it's a new document and templateId is not already set
//   if (this.isNew && this.templateId === undefined) {
//     try {
//       // Find the highest templateId
//       const highestClient = await this.constructor.findOne({}, { templateId: 1 })
//         .sort({ templateId: -1 })
//         .limit(1);
      
//       // Set templateId to 1 if no clients exist, otherwise increment by 1
//       this.templateId = highestClient && highestClient.templateId ? highestClient.templateId + 1 : 1;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

export default models.Client ? models.Client : model('Client', ClientSchema);
