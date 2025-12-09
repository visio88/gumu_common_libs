import mongoose from "mongoose";

const TeamMemberQualification = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  qualificationType: { type: String },
  qualificationImageUrl: { type: String },
});

export default TeamMemberQualification;
