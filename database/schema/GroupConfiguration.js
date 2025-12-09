import mongoose from "mongoose";

const GroupConfigurationSchema = new mongoose.Schema({
  userWordSession: {
    type: String,
  },
});

export default GroupConfigurationSchema;
