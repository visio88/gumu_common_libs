import mongoose from "mongoose";
import AttendanceSchema from "../schema/Attendance";

export default mongoose.models.Attendance
  ? mongoose.models.Attendance
  : mongoose.model("Attendance", AttendanceSchema);
