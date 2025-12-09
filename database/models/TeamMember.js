import { model, models, Schema } from 'mongoose';

import { enums } from '../../utils/enum';

import AddressSchema from '../schema/Address';
import TeamMemberPermissionSchema from '../schema/TeamMemberPermissions';

const GenderTypes = enums.genderTypes.map((data) => data?.value);
const TitleTypes = enums.titles.map((data) => data?.value);
const UserRoleTypes = enums.userRole.map((data) => data?.value);

const TeamMemberSchema = new Schema(
  {
    accountCode: {
      type: String,
    },
    emailAddress: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
    },
    userRole: {
      type: String,
      enum: UserRoleTypes,
    },
    teamMemberRole: {
      type: String,
    },
    title: {
      type: String,
      enum: TitleTypes,
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    preferredName: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: GenderTypes,
    },
    joinedDate: {
      type: Date,
    },
    hourlyRate: {
      type: Number,
    },
    permissions: {
      type: TeamMemberPermissionSchema,
    },
    address: {
      type: AddressSchema,
    },
    contactNumber: {
      type: String,
    },
    contactNumberCountryCode: {
      type: String,
      default: '+94',
    },
    whatsappNumber: {
      type: String,
    },
    whatsappNumberCountryCode: {
      type: String,
      default: '+94',
    },
    profilePictureUrl: {
      type: String,
    },
    roleOfTheCenter: {
      type: String,
    },
    defaultCostRate: {
      type: Number,
    },
    exceptionalPeriods: {
      type: [
        {
          start: { type: Date },
          end: { type: Date },
          costRate: { type: Number },
        },
      ],
    },

    rootUser: {
      type: Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
    },
  },
  { timestamps: true }
);

export default models.TeamMember ? models.TeamMember : model('TeamMember', TeamMemberSchema);
