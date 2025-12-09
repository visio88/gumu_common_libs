import mongoose from "mongoose";
import { enums } from "../../utils/enum";

const ClientRelationshipTypes = enums.clientEmergencyContactRelationship.map(
  (data) => data?.value
);

const EmergencyContactSchema = new mongoose.Schema({
  relationship: { type: String, enum: ClientRelationshipTypes },
  contactName: { type: String },
  phoneNumber: { type: String },
  phoneNumberCountryCode: { type: String, default: "+94" },
  whatsappNumber: { type: String },
  whatsappNumberCountryCode: { type: String, default: "+94" },
});

export default EmergencyContactSchema;
