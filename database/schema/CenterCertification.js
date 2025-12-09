import mongoose from 'mongoose';

const CenterCertification = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  certificationImageUrl: { type: String },
});

export default CenterCertification;
