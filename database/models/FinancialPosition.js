import mongoose from 'mongoose';
import CashflowSchema from '../schema/Cashflow';

const FinancialPositionSchema = new mongoose.Schema(
  {
    // Financial period identification
    periodName: {
      type: String,
      required: true,
      trim: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    
    // Organization and user references
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
      immutable: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    
    // Financial position type
    type: {
      type: String,
      required: true,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'custom'],
      default: 'annual',
    },
    
    // Status and visibility
    status: {
      type: String,
      required: true,
      enum: ['draft', 'active', 'closed', 'archived'],
      default: 'draft',
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    
    // Financial summary
    totalIncome: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalExpenses: {
      type: Number,
      default: 0,
      min: 0,
    },
    netPosition: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    closingBalance: {
      type: Number,
      default: 0,
    },
    
    // Income breakdown by source
    incomeBreakdown: {
      membershipFees: {
        type: Number,
        default: 0,
        min: 0,
      },
      penalties: {
        type: Number,
        default: 0,
        min: 0,
      },
      loanInterest: {
        type: Number,
        default: 0,
        min: 0,
      },
      otherIncome: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    
    // Expense breakdown by category
    expenseBreakdown: {
      operational: {
        type: Number,
        default: 0,
        min: 0,
      },
      administrative: {
        type: Number,
        default: 0,
        min: 0,
      },
      maintenance: {
        type: Number,
        default: 0,
        min: 0,
      },
      otherExpenses: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    
    // Currency and exchange rates
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    },
    exchangeRate: {
      type: Number,
      default: 1,
      min: 0,
    },
    
    // Cashflow details
    cashflow: { 
      type: [CashflowSchema],
      default: [],
    },
    
    // Related financial records
    relatedMembershipFees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipFee',
    }],
    relatedPenalties: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Penalty',
    }],
    relatedLoans: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
    }],
    
    // Notes and comments
    notes: {
      type: String,
      trim: true,
    },
    internalNotes: {
      type: String,
      trim: true,
    },
    
    // Audit information
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now,
    },
    
    // Approval workflow
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
    approvedAt: {
      type: Date,
    },
    approvalNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
FinancialPositionSchema.index({ organization: 1, periodStart: 1, periodEnd: 1 });
FinancialPositionSchema.index({ organization: 1, status: 1 });
FinancialPositionSchema.index({ periodStart: 1, periodEnd: 1 });
FinancialPositionSchema.index({ type: 1, status: 1 });

// Pre-save middleware to calculate net position
FinancialPositionSchema.pre('save', function(next) {
  // Calculate net position
  this.netPosition = this.totalIncome - this.totalExpenses;
  
  // Calculate closing balance
  this.closingBalance = this.openingBalance + this.netPosition;
  
  // Update last modified timestamp
  if (this.isModified()) {
    this.lastModifiedAt = new Date();
  }
  
  next();
});

// Virtual for period duration
FinancialPositionSchema.virtual('periodDuration').get(function() {
  const start = new Date(this.periodStart);
  const end = new Date(this.periodEnd);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for checking if period is current
FinancialPositionSchema.virtual('isCurrentPeriod').get(function() {
  const now = new Date();
  return this.periodStart <= now && this.periodEnd >= now;
});

// Virtual for checking if period is overdue
FinancialPositionSchema.virtual('isOverdue').get(function() {
  const now = new Date();
  return this.periodEnd < now && this.status !== 'closed';
});

// Virtual references for related data
FinancialPositionSchema.virtual('membershipFees', {
  ref: 'MembershipFee',
  localField: 'relatedMembershipFees',
  foreignField: '_id',
  justOne: false
});

FinancialPositionSchema.virtual('penalties', {
  ref: 'Penalty',
  localField: 'relatedPenalties',
  foreignField: '_id',
  justOne: false
});

FinancialPositionSchema.virtual('loans', {
  ref: 'Loan',
  localField: 'relatedLoans',
  foreignField: '_id',
  justOne: false
});

// Method to calculate income from membership fees
FinancialPositionSchema.methods.calculateMembershipIncome = async function() {
  const MembershipFee = mongoose.model('MembershipFee');
  
  const fees = await MembershipFee.find({
    organization: this.organization,
    isActive: true,
    startDate: { $lte: this.periodEnd },
    $or: [
      { endDate: { $gte: this.periodStart } },
      { endDate: null }
    ]
  });
  
  // Calculate total membership income for the period
  let totalMembershipIncome = 0;
  
  for (const fee of fees) {
    // Calculate fee income for this period
    let feeIncome = 0;
    
    if (fee.startDate <= this.periodEnd && (!fee.endDate || fee.endDate >= this.periodStart)) {
      const startDate = new Date(Math.max(fee.startDate.getTime(), this.periodStart.getTime()));
      const endDate = fee.endDate ? new Date(Math.min(fee.endDate.getTime(), this.periodEnd.getTime())) : this.periodEnd;
      
      const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (endDate.getMonth() - startDate.getMonth());
      
      if (fee.feeType === 'monthly') {
        feeIncome = fee.discountedAmount * (monthsDiff + 1);
      } else if (fee.feeType === 'annual') {
        feeIncome = fee.discountedAmount;
      } else if (fee.feeType === 'quarterly') {
        feeIncome = fee.discountedAmount * Math.ceil((monthsDiff + 1) / 3);
      }
    }
    
    totalMembershipIncome += feeIncome;
  }
  
  return totalMembershipIncome;
};

// Method to calculate income from penalties
FinancialPositionSchema.methods.calculatePenaltyIncome = async function() {
  const Penalty = mongoose.model('Penalty');
  
  const penalties = await Penalty.find({
    organization: this.organization,
    isActive: true,
    effectiveFrom: { $lte: this.periodEnd },
    $or: [
      { effectiveUntil: { $gte: this.periodStart } },
      { effectiveUntil: null }
    ]
  });
  
  // Calculate total penalty income for the period
  let totalPenaltyIncome = 0;
  
  for (const penalty of penalties) {
    // Simple calculation - in a real system, you'd track actual penalty applications
    if (penalty.isEffective) {
      // Estimate penalty income based on penalty configuration
      // This is a simplified calculation
      totalPenaltyIncome += penalty.baseAmount * 0.1; // Assume 10% of penalties are collected
    }
  }
  
  return totalPenaltyIncome;
};

// Method to calculate loan interest income
FinancialPositionSchema.methods.calculateLoanInterestIncome = async function() {
  const Loan = mongoose.model('Loan');
  
  const loans = await Loan.find({
    organization: this.organization,
    status: 'active'
  }).populate('repayments');
  
  let totalInterest = 0;
  
  for (const loan of loans) {
    if (loan.repayments) {
      const periodRepayments = loan.repayments.filter(repayment => {
        const repaymentDate = new Date(repayment.paymentDate);
        return repaymentDate >= this.periodStart && repaymentDate <= this.periodEnd;
      });
      
      totalInterest += periodRepayments.reduce((sum, repayment) => 
        sum + (repayment.interestAmount || 0), 0);
    }
  }
  
  return totalInterest;
};

// Method to update financial position with current data
FinancialPositionSchema.methods.updateFinancialPosition = async function() {
  try {
    // Calculate income from different sources
    const membershipIncome = await this.calculateMembershipIncome();
    const penaltyIncome = await this.calculatePenaltyIncome();
    const loanInterestIncome = await this.calculateLoanInterestIncome();
    
    // Update income breakdown
    this.incomeBreakdown.membershipFees = membershipIncome;
    this.incomeBreakdown.penalties = penaltyIncome;
    this.incomeBreakdown.loanInterest = loanInterestIncome;
    
    // Calculate total income
    this.totalIncome = membershipIncome + penaltyIncome + loanInterestIncome + this.incomeBreakdown.otherIncome;
    
    // Calculate total expenses
    this.totalExpenses = Object.values(this.expenseBreakdown).reduce((sum, amount) => sum + amount, 0);
    
    // Save the updated position
    return await this.save();
  } catch (error) {
    throw new Error(`Failed to update financial position: ${error.message}`);
  }
};

// Method to close financial period
FinancialPositionSchema.methods.closePeriod = async function(closedBy, notes = '') {
  if (this.status === 'closed') {
    throw new Error('Financial period is already closed');
  }
  
  if (this.isLocked) {
    throw new Error('Financial period is locked and cannot be closed');
  }
  
  // Update financial position with current data
  await this.updateFinancialPosition();
  
  // Close the period
  this.status = 'closed';
  this.lastModifiedBy = closedBy;
  this.lastModifiedAt = new Date();
  this.notes = notes;
  
  return await this.save();
};

// Method to lock financial period
FinancialPositionSchema.methods.lockPeriod = async function(lockedBy, notes = '') {
  if (this.isLocked) {
    throw new Error('Financial period is already locked');
  }
  
  this.isLocked = true;
  this.lastModifiedBy = lockedBy;
  this.lastModifiedAt = new Date();
  this.notes = notes;
  
  return await this.save();
};

// Ensure virtuals are included in JSON output
FinancialPositionSchema.set('toJSON', { virtuals: true });
FinancialPositionSchema.set('toObject', { virtuals: true });

export default mongoose.models.FinancialPosition ? mongoose.models.FinancialPosition : mongoose.model('FinancialPosition', FinancialPositionSchema); 