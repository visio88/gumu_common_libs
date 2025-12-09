import mongoose from "mongoose";
import IncomeSchema from "../schema/Income";

export default mongoose.models.Income
  ? mongoose.models.Income
  : mongoose.model("Income", IncomeSchema); 