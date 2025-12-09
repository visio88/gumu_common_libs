import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Reference to the user (e.g., Client)
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccountOwner", // Reference to the organization/account owner
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Excused"],
    required: true,
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  remarks: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember", // Reference to the user who created the record
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember", // Reference to the user who last updated the record
  },
}, { timestamps: true });

export default AttendanceSchema;
