import { model, models, Schema } from "mongoose";

import { enums } from "../../utils/enum";

const UserRoles = enums.userRole.map((data) => data?.value);
const EmailVerificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userRole: {
      type: String,
      enum: UserRoles,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.EmailVerificationToken
  ? models.EmailVerificationToken
  : model("EmailVerificationToken", EmailVerificationTokenSchema);
