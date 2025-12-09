import { model, models, Schema } from 'mongoose';

const MembershipFeeSchema = new Schema(
  {
    // Basic fee information
    feeName: {
      type: String,
      required: true,
      trim: true,
    },
    feeType: {
      type: String,
      required: true,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'one-time', 'custom'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'LKR'],
    },
    description: {
      type: String,
      trim: true,
    },
    
    // Fee structure and rules
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    dueDate: {
      type: Date, // Day of month when fee is due
      
    },
    gracePeriod: {
      type: Number, // Days after due date before penalty applies
      default: 7,
      min: 0,
    },
    
    // Organization and client references
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
      immutable: true,
    },
    applicableClients: [{
      type: Schema.Types.ObjectId,
      ref: 'Client',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    
    // Fee categories and tags
    category: {
      type: String,
      enum: ['basic', 'premium', 'vip', 'student', 'senior', 'corporate', 'custom'],
      default: 'basic',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    
    // Auto-renewal settings
    autoRenewal: {
      type: Boolean,
      default: false,
    },
    renewalNoticeDays: {
      type: Number,
      default: 30,
      min: 0,
    },
    
    // Discount and promotion settings
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    discountValidUntil: {
      type: Date,
    },
    
    // Payment methods accepted
    acceptedPaymentMethods: [{
      type: String,
      enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'debit_card', 'online_payment'],
    }],
  },
  { timestamps: true }
);

// Indexes for efficient querying
MembershipFeeSchema.index({ organization: 1, isActive: 1 });
MembershipFeeSchema.index({ feeType: 1, isActive: 1 });
MembershipFeeSchema.index({ category: 1, isActive: 1 });
MembershipFeeSchema.index({ startDate: 1, endDate: 1 });

// Virtual for calculating discounted amount
MembershipFeeSchema.virtual('discountedAmount').get(function() {
  if (this.discountPercentage > 0 && (!this.discountValidUntil || new Date() <= this.discountValidUntil)) {
    return this.amount * (1 - this.discountPercentage / 100);
  }
  return this.amount;
});

// Virtual references for related data
MembershipFeeSchema.virtual('organizationDetails', {
  ref: 'UserAccountOwner',
  localField: 'organization',
  foreignField: '_id',
  justOne: true
});

MembershipFeeSchema.virtual('financialPositions', {
  ref: 'FinancialPosition',
  localField: '_id',
  foreignField: 'relatedMembershipFees',
  justOne: false
});

// Ensure virtuals are included in JSON output
MembershipFeeSchema.set('toJSON', { virtuals: true });
MembershipFeeSchema.set('toObject', { virtuals: true });

export default models.MembershipFee ? models.MembershipFee : model('MembershipFee', MembershipFeeSchema); 