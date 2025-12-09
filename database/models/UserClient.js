import { model, models, Schema } from 'mongoose';
import { InternalServerError } from '../../libs/error/HttpErrors';

import { enums } from '../../utils/enum';
import { generateToken } from '../../utils/auth';

const RegistrationTypes = enums.registrationTypes.map((data) => data?.value);
const LoginMethods = enums.loginMethods.map((data) => data?.value);
const UserRoles = enums.userRole.map((data) => data?.value);

const UserClientSchema = new Schema(
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
      default: 'Client',
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    publicProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'PublicProfile',
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    rootUser: {
      type: Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      immutable: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
  },
  { timestamps: true }
);

UserClientSchema.methods.generateAccessJWT = function () {
  try {
    const payload = {
      _id: this._id,
      contactNumber: this.contactNumber,
      emailAddress: this.emailAddress,
      registrationType: this.registrationType,
      loginMethod: this.loginMethod,
      userRole: this.userRole,
      clientId: this.clientId,
      publicProfileId: this.publicProfileId,
      isActive: this.isActive,
      mobileVerified: this.mobileVerified,
      emailVerified: this.emailVerified,
      rootUser: this.rootUser,
      createdBy: this.createdBy,
    };
    return generateToken(payload);
  } catch (error) {
    console.log('ERROR in JWT create: ', error);
    throw new InternalServerError(error);
  }
};

export default models.UserClient ? models.UserClient : model('UserClient', UserClientSchema);
