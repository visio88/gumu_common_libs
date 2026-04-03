import { model, models, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { InternalServerError } from '../../libs/error/HttpErrors';

import { enums } from '../../utils/enum';
import { generateToken } from '../../utils/auth';

const RegistrationTypes = enums.registrationTypes.map((data) => data?.value);
const LoginMethods = enums.loginMethods.map((data) => data?.value);
const UserRoles = enums.userRole.map((data) => data?.value);

const UserAccountOwnerSchema = new Schema(
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
      default: 'Account Owner',
    },
    teamMemberId: {
      type: Types.ObjectId,
      ref: 'TeamMember',
    },
    passKey: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedAt: {
      type: Date,
    },
    blockedReason: {
      type: String,
      trim: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free',
      },
      billingCycle: {
        type: String,
        enum: ['monthly', 'quarterly', 'semi_annual', 'annual'],
        default: 'monthly',
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'LKR',
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'pending',
      },
      lastPaymentDate: {
        type: Date,
      },
      nextPaymentDate: {
        type: Date,
      },
    },
    paymentHistory: [{
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'LKR',
      },
      paymentDate: {
        type: Date,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'credit_card', 'debit_card', 'online_payment'],
      },
      description: {
        type: String,
      },
      transactionId: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded', 'rejected'],
        default: 'completed',
      },
      submittedBy: {
        type: String,
        enum: ['account_owner', 'superadmin'],
      },
      reviewedAt: {
        type: Date,
      },
    }],
    accountCode: {
      type: String,
      unique: true,
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
    activeFinancialPosition: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'FinancialPosition',
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
    
    // Organization Settings
    settings: {
      // Fingerprint device configuration
      fingerprintDevice: {
        deviceCode: {
          type: String,
          trim: true,
        },
        deviceName: {
          type: String,
          trim: true,
        },
        serverUrl: {
          type: String,
          trim: true,
        },
        isEnabled: {
          type: Boolean,
          default: false,
        },
        lastConnected: {
          type: Date,
        },
      },
      // General settings
      timezone: {
        type: String,
        default: 'Asia/Colombo',
      },
      currency: {
        type: String,
        default: 'LKR',
      },
      dateFormat: {
        type: String,
        default: 'DD/MM/YYYY',
      },
      language: {
        type: String,
        default: 'en',
      },
    },
  },
  { timestamps: true }
);

UserAccountOwnerSchema.methods.generateAccessJWT = function () {
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

// Post-save middleware to automatically create financial position for new users
UserAccountOwnerSchema.post('save', async function(doc) {
  try {
    // Only create financial position if it's a new document and doesn't have an active financial position
    if (doc.isNew && !doc.activeFinancialPosition) {
      const FinancialPosition = mongoose.model('FinancialPosition');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      // Create period from January 1st to December 31st of the current year
      const periodStart = new Date(currentYear, 0, 1); // January 1st
      const periodEnd = new Date(currentYear, 11, 31); // December 31st
      
      const financialPosition = new FinancialPosition({
        periodName: 'First Financial Position',
        periodStart: periodStart,
        periodEnd: periodEnd,
        organization: doc._id,
        createdBy: doc.createdBy,
        type: 'annual',
        status: 'active',
        openingBalance: 0,
        currency: 'USD',
        cashflow: [],
        relatedMembershipFees: [],
        relatedPenalties: [],
        relatedLoans: [],
        incomeBreakdown: {
          membershipFees: 0,
          penalties: 0,
          loanInterest: 0,
          otherIncome: 0
        },
        expenseBreakdown: {
          operational: 0,
          administrative: 0,
          maintenance: 0,
          otherExpenses: 0
        },
        notes: 'Initial financial position created for new user account',
        internalNotes: 'Auto-generated during account creation'
      });
      
      await financialPosition.save();
      
      // Update the user account with the active financial position
      doc.activeFinancialPosition = financialPosition._id;
      await doc.save();
      
      console.log(`Financial position created for user account: ${doc.accountCode}`);
    }
  } catch (error) {
    console.error('Error creating financial position for new user:', error);
    // Don't throw error to avoid breaking the user creation process
  }
});

// Virtual references for related data
UserAccountOwnerSchema.virtual('financialPositions', {
  ref: 'FinancialPosition',
  localField: '_id',
  foreignField: 'organization',
  justOne: false
});

UserAccountOwnerSchema.virtual('membershipFees', {
  ref: 'MembershipFee',
  localField: '_id',
  foreignField: 'organization',
  justOne: false
});

UserAccountOwnerSchema.virtual('penalties', {
  ref: 'Penalty',
  localField: '_id',
  foreignField: 'organization',
  justOne: false
});

UserAccountOwnerSchema.virtual('loans', {
  ref: 'Loan',
  localField: '_id',
  foreignField: 'organization',
  justOne: false
});

// Ensure virtuals are included in JSON output
UserAccountOwnerSchema.set('toJSON', { virtuals: true });
UserAccountOwnerSchema.set('toObject', { virtuals: true });

// Unique sparse index on deviceCode - ensures deviceCode is unique across all account owners
// Sparse index allows null/undefined values (accounts without deviceCode won't conflict)
UserAccountOwnerSchema.index(
  { 'settings.fingerprintDevice.deviceCode': 1 },
  { unique: true, sparse: true }
);

export default models.UserAccountOwner
  ? models.UserAccountOwner
  : model('UserAccountOwner', UserAccountOwnerSchema);
