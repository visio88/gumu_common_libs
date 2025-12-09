import mongoose from "mongoose";
import GroupPaymentPlanConfigSchema from "./GroupPaymentPlanConfig";

const GroupPlansSchema = new mongoose.Schema({
  plans: { type: [GroupPaymentPlanConfigSchema] },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

export default GroupPlansSchema;
