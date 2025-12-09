import { model, models, Schema } from 'mongoose';
import { InternalServerError } from '../../libs/error/HttpErrors';

import { enums } from '../../utils/enum';
import { generateToken } from '../../utils/auth';
import { TEAM_MEMBER } from '../../libs/application-const';

const RegistrationTypes = enums.registrationTypes.map((data) => data?.value);
const LoginMethods = enums.loginMethods.map((data) => data?.value);
const UserRoles = enums.userRole.map((data) => data?.value);

const UserTeamMemberSchema = new Schema(
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
      default: TEAM_MEMBER,
    },
    teamMemberId: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
    passKey: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accountCode: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    isOnboardingComplete: {
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

UserTeamMemberSchema.methods.generateAccessJWT = function () {
  try {
    const payload = {
      _id: this._id,
      contactNumber: this.contactNumber,
      emailAddress: this.emailAddress,
      registrationType: this.registrationType,
      loginMethod: this.loginMethod,
      userRole: this.userRole,
      teamMemberId: this.teamMemberId,
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

export default models.UserTeamMember
  ? models.UserTeamMember
  : model('UserTeamMember', UserTeamMemberSchema);
