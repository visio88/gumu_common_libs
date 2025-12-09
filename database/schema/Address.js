import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  addressLine1: { type: String },
  addressLine2: { type: String },
  country: { type: String },
  province: { type: String },
  district: { type: String },
  city: { type: String },
  postcode: { type: Number },
});

export default AddressSchema;
