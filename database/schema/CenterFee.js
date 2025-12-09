import mongoose from 'mongoose';

import { enums } from '../../utils/enum';

const FeeTypeEnum = enums.feeTypes.map((data) => data?.value);

const AdditionalChargesSchema = new mongoose.Schema({
  fee: {
    type: Number,
  },
  feeType: {
    type: String,
    enum: FeeTypeEnum,
  },
  feeDescription: {
    type: String,
  },
});

const CenterFeeSchema = new mongoose.Schema({
  keyAmount: { type: Number },
  additionalCharges: { type: [AdditionalChargesSchema] },
});

export default CenterFeeSchema;
