import { model, models, Schema } from "mongoose";

import { enums } from "../../utils/enum";

const userRoles = enums.userRole.map((data) => data?.value);

const RevokedTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userRole: {
      type: String,
      enum: userRoles,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.RevokedToken
  ? models.RevokedToken
  : model("RevokedToken", RevokedTokenSchema);
