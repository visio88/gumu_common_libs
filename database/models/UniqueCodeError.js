import { model, models, Schema } from 'mongoose';

import { enums } from '../../utils/enum';

const UserRoles = enums.userRole.map((data) => data?.value);

const UniqueCodeErrorSchema = new Schema(
  {
    documentName: {
      type: String,
    },
    attemptDescription: {
      type: String,
    },
    userRole: {
      type: String,
      enums: UserRoles,
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

export default models.UniqueCodeError
  ? models.UniqueCodeError
  : model('UniqueCodeError', UniqueCodeErrorSchema);
