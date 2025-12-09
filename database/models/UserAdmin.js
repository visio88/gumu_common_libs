import { model, models, Schema } from 'mongoose';
import { InternalServerError } from '../../libs/error/HttpErrors';

import { enums } from '../../utils/enum';
import { generateToken } from '../../utils/auth';

const RegistrationTypes = enums.registrationTypes.map((data) => data?.value);
const LoginMethods = enums.loginMethods.map((data) => data?.value);
const UserRoles = enums.userRole.map((data) => data?.value);

const UserAdminSchema = new Schema(
  {
    emailAddress: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    registrationType: {
      type: String,
      enum: RegistrationTypes,
    },
    loginMethod: {
      type: String,
      enum: LoginMethods,
    },
    userRole: {
      type: String,
      enum: UserRoles,
      default: 'Administrator',
    },
    passKey: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserAdminSchema.methods.generateAccessJWT = function () {
  try {
    const payload = {
      _id: this._id,
      contactNumber: this.contactNumber,
      emailAddress: this.emailAddress,
      registrationType: this.registrationType,
      loginMethod: this.loginMethod,
      userRole: this.userRole,
      isActive: this.isActive,
    };
    return generateToken(payload);
  } catch (error) {
    console.log('ERROR in JWT create: ', error);
    throw new InternalServerError(error);
  }
};

export default models.UserAdmin ? models.UserAdmin : model('UserAdmin', UserAdminSchema);
