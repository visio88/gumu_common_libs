import mongoose from "mongoose";

const AttendancePermissionSchema = new mongoose.Schema({
  isClientAttendanceMarkAllowed: {
    type: Boolean,
    default: true,
  },
});

const GroupFeaturesSchema = new mongoose.Schema({
  isAttendanceEnabled: { type: Boolean, default: true },
  attendancePermissions: { type: AttendancePermissionSchema },
  isNoteEnabled: { type: Boolean, default: true },
  isPaymentsEnabled: { type: Boolean, default: true },
  isMeasurementsEnabled: { type: Boolean, default: false },
});

export default GroupFeaturesSchema;
