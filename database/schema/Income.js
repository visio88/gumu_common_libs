import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
  // Basic income information
  incomeName: {
    type: String,
    required: true,
    trim: true,
  },
  incomeCode: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  
  // Financial details
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD',"LKR"],
  },
  
  // Income categorization
  incomeType: {
    type: String,
    required: true,
    enum: [
      'membership_fees',
      'penalties',
      'loan_interest',
      'donations',
      'grants',
      'investment_income',
      'service_fees',
      'rental_income',
      'other_income'
    ],
  },
  
  // Income source and method
  source: {
    type: String,
    required: true,
    enum: [
      'membership_payment',
      'penalty_payment',
      'loan_repayment',
      'donation',
      'grant',
      'investment',
      'service_payment',
      'rental_payment',
      'other'
    ],
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'debit_card', 'online_payment', 'other'],
  },
  
  // Date and timing
  incomeDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  
  // Status and tracking
  status: {
    type: String,
    enum: ['pending', 'received', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom'],
  },
  
  // Organization and user references
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserAccountOwner",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember",
  },
  
  // Related records (for tracking source)
  relatedRecord: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedRecordModel',
  },
  relatedRecordModel: {
    type: String,
    enum: ['MembershipFee', 'Penalty', 'Loan', 'LoanRepayment', 'Client'],
  },
  
  // Additional details
  transactionId: {
    type: String,
    trim: true,
  },
  receiptNumber: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  internalNotes: {
    type: String,
    trim: true,
  },
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
  }],
  
  // Verification and audit
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMember",
  },
  
  // Active status
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps on save
IncomeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient querying
IncomeSchema.index({ organization: 1, isActive: 1 });
IncomeSchema.index({ incomeType: 1, isActive: 1 });
IncomeSchema.index({ status: 1, isActive: 1 });
IncomeSchema.index({ incomeDate: 1 });
IncomeSchema.index({ source: 1 });
IncomeSchema.index({ createdBy: 1 });
IncomeSchema.index({ relatedRecord: 1, relatedRecordModel: 1 });

// Virtual for formatted amount
IncomeSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for income status
IncomeSchema.virtual('isOverdue').get(function() {
  if (this.dueDate && this.status === 'pending') {
    return new Date() > this.dueDate;
  }
  return false;
});

// Method to mark as received
IncomeSchema.methods.markAsReceived = function(verifiedBy) {
  this.status = 'received';
  this.verifiedAt = new Date();
  this.verifiedBy = verifiedBy;
  return this.save();
};

// Method to confirm income
IncomeSchema.methods.confirm = function(confirmedBy) {
  this.status = 'confirmed';
  this.verifiedAt = new Date();
  this.verifiedBy = confirmedBy;
  return this.save();
};

// Method to cancel income
IncomeSchema.methods.cancel = function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.notes = reason || 'Cancelled by user';
  this.updatedBy = cancelledBy;
  return this.save();
};

export default IncomeSchema; 