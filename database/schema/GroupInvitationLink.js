import mongoose from "mongoose";

const GroupInvitationLinkSchema = new mongoose.Schema({
  link: { type: String },
  linkType: { type: String },
});

export default GroupInvitationLinkSchema;
