import mongoose from 'mongoose';

const CashflowSchema = new mongoose.Schema({
  // Basic cashflow information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ['Cash In', 'Cash Out'],
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  
  // Enhanced categorization
  category: {
    type: String,
    required: true,
    enum: [
      // Income categories
      'membership_fees',
      'admission_fees',
      'personal_training',
      'penalties',
      'donations',
      'grants',
      'investment_income',
      'product_sales',
      'other_income',
      
      // Expense categories
      'operational',
      'administrative',
      'maintenance',
      'utilities',
      'electricity',
      'water',
      'rent',
      'salaries',
      'wages',
      'insurance',
      'marketing',
      'training',
      'equipment',
      'supplies',
      'other_expenses'
    ],
  },
  
  // Source tracking for income
  source: {
    type: String,
    enum: [
      'membership_payment',
      'admission_payment',
      'training_payment',
      'penalty_payment',
      'loan_repayment',
      'loan_disbursement',
      'expense_payment',
      'income_payment',
      'donation',
      'grant',
      'investment',
      'product_sale',
      'other'
    ],
  },
  
  // Reference to related records
  relatedRecord: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedRecordModel',
  },
  relatedRecordModel: {
    type: String,
    enum: ['MembershipFee', 'Penalty', 'Loan', 'LoanRepayment', 'Expense', 'Income'],
  },
  
  // Payment method and transaction details
  paymentMethod: {
    type: String,
    enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'debit_card', 'online_payment', 'other'],
  },
  transactionId: {
    type: String,
    trim: true,
  },
  receiptNumber: {
    type: String,
    trim: true,
  },
  
  // Currency and exchange rate
  currency: {
    type: String,
    default: 'LKR',
    enum: ['LKR', 'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'NPR'],
  },
  exchangeRate: {
    type: Number,
    default: 1,
    min: 0,
  },
  
  // Status and verification
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'verified', 'cancelled', 'refunded'],
    default: 'confirmed',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  },
  verifiedAt: {
    type: Date,
  },
  
  // Tags for additional categorization
  tags: [{
    type: String,
    trim: true,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
    required: true,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeamMember',
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Indexes for efficient querying
CashflowSchema.index({ date: 1, type: 1 });
CashflowSchema.index({ category: 1, type: 1 });
CashflowSchema.index({ source: 1, type: 1 });
CashflowSchema.index({ status: 1 });
CashflowSchema.index({ relatedRecord: 1, relatedRecordModel: 1 });

// Virtual for formatted amount
CashflowSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency,
  }).format(this.amount);
});

// Virtual for checking if cashflow is income
CashflowSchema.virtual('isIncome').get(function() {
  return this.type === 'Cash In';
});

// Virtual for checking if cashflow is expense
CashflowSchema.virtual('isExpense').get(function() {
  return this.type === 'Cash Out';
});

// Pre-save middleware to update lastModifiedAt
CashflowSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastModifiedAt = new Date();
  }
  next();
});

// Method to mark as verified
CashflowSchema.methods.markAsVerified = function(verifiedBy, notes = '') {
  this.status = 'verified';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.notes = notes;
  this.lastModifiedBy = verifiedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Method to cancel cashflow
CashflowSchema.methods.cancelCashflow = function(cancelledBy, reason = '') {
  this.status = 'cancelled';
  this.notes = reason;
  this.lastModifiedBy = cancelledBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Method to get related record details
CashflowSchema.methods.getRelatedRecord = async function() {
  if (this.relatedRecord && this.relatedRecordModel) {
    const Model = mongoose.model(this.relatedRecordModel);
    return await Model.findById(this.relatedRecord);
  }
  return null;
};

// Method to check if cashflow is from membership fee
CashflowSchema.methods.isMembershipFee = function() {
  return this.category === 'membership_fees' && this.source === 'membership_payment';
};

// Method to check if cashflow is from penalty
CashflowSchema.methods.isPenalty = function() {
  return this.category === 'penalties' && this.source === 'penalty_payment';
};

// Method to check if cashflow is from loan interest
CashflowSchema.methods.isLoanInterest = function() {
  return this.category === 'loan_interest' && this.source === 'loan_repayment';
};

// Ensure virtuals are included in JSON output
CashflowSchema.set('toJSON', { virtuals: true });
CashflowSchema.set('toObject', { virtuals: true });

export default CashflowSchema;
