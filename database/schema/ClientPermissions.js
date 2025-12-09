import mongoose from "mongoose";

const ClientPermissionsSchema = new mongoose.Schema({
  isMarkAttendance: { type: Boolean },
  isViewClientPayments: { type: Boolean },
  isEditClientPayment: { type: Boolean },
});

export default ClientPermissionsSchema;
