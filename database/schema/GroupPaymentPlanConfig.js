import mongoose from "mongoose";

const GroupPaymentPlanConfigSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentPlan" },
  isDefault: { type: Boolean },
});

export default GroupPaymentPlanConfigSchema;
