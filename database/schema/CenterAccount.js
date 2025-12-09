import mongoose from "mongoose";

const CenterAccountSchema = new mongoose.Schema({
  account: { type: String },
  branchRegion: { type: String },
  branchName: { type: String },
  bankName: { type: String },
  holderName: { type: String },
  raxNumber: { type: String },
});

export default CenterAccountSchema;
