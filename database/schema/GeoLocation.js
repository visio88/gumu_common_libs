import mongoose from "mongoose";

const GeoLocationSchema = new mongoose.Schema({
  areaName: { type: String },
  addressDescription: { type: String },
  areaCode: { type: String },
  latitude: { type: String },
  longitude: { type: String },
});

export default GeoLocationSchema;
