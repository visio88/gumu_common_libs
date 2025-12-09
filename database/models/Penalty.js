import { model, models, Schema } from 'mongoose';

const PenaltySchema = new Schema(
  {
    // Penalty identification
    penaltyName: {
      type: String,
      required: true,
      trim: true,
    },
    penaltyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
    // Penalty type and category
    penaltyType: {
      type: String,
      required: true,
      enum: ['late_payment', 'rule_violation', 'attendance', 'behavior', 'damage', 'custom'],
    },
    category: {
      type: String,
      enum: ['minor', 'moderate', 'major', 'critical'],
      default: 'minor',
    },
    
    // Penalty calculation
    calculationType: {
      type: String,
      required: true,
      enum: ['fixed_amount', 'percentage', 'daily_rate', 'tiered'],
    },
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    dailyRate: {
      type: Number,
      min: 0,
    },
    
    // Tiered penalty structure
    tiers: [{
      daysFrom: {
        type: Number,
        required: true,
        min: 0,
      },
      daysTo: {
        type: Number,
        min: 0,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100,
      },
    }],
    
    // Currency and limits
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    },
    maximumAmount: {
      type: Number,
      min: 0,
    },
    minimumAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    
    // Application rules
    gracePeriod: {
      type: Number, // Days before penalty applies
      default: 0,
      min: 0,
    },
    maxDays: {
      type: Number, // Maximum days penalty can accumulate
      min: 0,
    },
    compounding: {
      type: Boolean, // Whether penalty compounds daily
      default: false,
    },
    
    // Organization and scope
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
      immutable: true,
    },
    applicableMembershipFees: [{
      type: Schema.Types.ObjectId,
      ref: 'MembershipFee',
    }],
    applicableClients: [{
      type: Schema.Types.ObjectId,
      ref: 'Client',
    }],
    
    // Status and visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    
    // Description and notes
    description: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    
    // Created by
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    
    // Effective dates
    effectiveFrom: {
      type: Date,
      required: true,
    },
    effectiveUntil: {
      type: Date,
    },
    
    // Notification settings
    notifyBeforeDays: {
      type: Number,
      default: 3,
      min: 0,
    },
    notificationMessage: {
      type: String,
      trim: true,
    },
    
    // Auto-application settings
    autoApply: {
      type: Boolean,
      default: false,
    },
    autoApplyDelay: {
      type: Number, // Days after due date to auto-apply
      default: 1,
      min: 0,
    },
    
    // Waiver settings
    canBeWaived: {
      type: Boolean,
      default: true,
    },
    waiverReasonRequired: {
      type: Boolean,
      default: true,
    },
    waiverApprovalRequired: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
PenaltySchema.index({ organization: 1, isActive: 1 });
PenaltySchema.index({ penaltyType: 1, isActive: 1 });
PenaltySchema.index({ category: 1, isActive: 1 });
PenaltySchema.index({ effectiveFrom: 1, effectiveUntil: 1 });

// Method to calculate penalty amount
PenaltySchema.methods.calculatePenalty = function(baseAmount, daysLate = 0) {
  let penaltyAmount = 0;
  
  switch (this.calculationType) {
    case 'fixed_amount':
      penaltyAmount = this.baseAmount;
      break;
      
    case 'percentage':
      penaltyAmount = (baseAmount * this.percentage) / 100;
      break;
      
    case 'daily_rate':
      penaltyAmount = this.dailyRate * daysLate;
      break;
      
    case 'tiered':
      if (this.tiers && this.tiers.length > 0) {
        const applicableTier = this.tiers.find(tier => 
          daysLate >= tier.daysFrom && (!tier.daysTo || daysLate <= tier.daysTo)
        );
        if (applicableTier) {
          penaltyAmount = applicableTier.amount;
          if (applicableTier.percentage) {
            penaltyAmount += (baseAmount * applicableTier.percentage) / 100;
          }
        }
      }
      break;
  }
  
  // Apply limits
  if (this.maximumAmount && penaltyAmount > this.maximumAmount) {
    penaltyAmount = this.maximumAmount;
  }
  if (this.minimumAmount && penaltyAmount < this.minimumAmount) {
    penaltyAmount = this.minimumAmount;
  }
  
  return Math.max(0, penaltyAmount);
};

// Virtual for checking if penalty is currently effective
PenaltySchema.virtual('isEffective').get(function() {
  const now = new Date();
  return this.isActive && 
         this.effectiveFrom <= now && 
         (!this.effectiveUntil || this.effectiveUntil >= now);
});

// Virtual references for related data
PenaltySchema.virtual('organizationDetails', {
  ref: 'UserAccountOwner',
  localField: 'organization',
  foreignField: '_id',
  justOne: true
});

PenaltySchema.virtual('financialPositions', {
  ref: 'FinancialPosition',
  localField: '_id',
  foreignField: 'relatedPenalties',
  justOne: false
});

// Ensure virtuals are included in JSON output
PenaltySchema.set('toJSON', { virtuals: true });
PenaltySchema.set('toObject', { virtuals: true });

export default models.Penalty ? models.Penalty : model('Penalty', PenaltySchema); 