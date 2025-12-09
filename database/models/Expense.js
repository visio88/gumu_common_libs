import { model, models, Schema } from 'mongoose';

const ExpenseSchema = new Schema(
  {
    // Basic expense information
    expenseName: {
      type: String,
      required: true,
      trim: true,
    },
    expenseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
    // Expense categorization
    category: {
      type: String,
      required: true,
      enum: ['operational', 'administrative', 'maintenance', 'utilities', 'electricity', 'water', 'rent', 'salaries', 'wages', 'insurance', 'marketing', 'training', 'equipment', 'supplies', 'other_expenses'],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    
    // Amount and currency
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
      enum: ['LKR', 'NPR', 'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    },
    
    // Expense type and frequency
    expenseType: {
      type: String,
      required: true,
      enum: ['one_time', 'recurring', 'variable'],
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom'],
      default: 'monthly',
    },
    
    // Dates
    expenseDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    nextDueDate: {
      type: Date,
    },
    
    // Payment information
    paymentMethod: {
      type: String,
      enum: ['cash', 'check', 'bank_transfer', 'credit_card', 'debit_card', 'online_payment'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'cancelled'],
      default: 'pending',
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Vendor/Supplier information
    vendor: {
      name: {
        type: String,
        trim: true,
      },
      contactPerson: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    
    // Organization and user references
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'UserAccountOwner',
      required: true,
      immutable: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true,
      immutable: true,
    },
    
    // Status and visibility
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
    approvedAt: {
      type: Date,
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
    internalNotes: {
      type: String,
      trim: true,
    },
    
    // Receipt and documentation
    receiptNumber: {
      type: String,
      trim: true,
    },
    receiptFile: {
      type: String, // File path or URL
    },
    attachments: [{
      fileName: String,
      filePath: String,
      fileType: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    
    // Budget and approval
    budgetCategory: {
      type: String,
      trim: true,
    },
    budgetAmount: {
      type: Number,
      min: 0,
    },
    isOverBudget: {
      type: Boolean,
      default: false,
    },
    
    // Tags for additional categorization
    tags: [{
      type: String,
      trim: true,
    }],
    
    // Recurring expense settings
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringEndDate: {
      type: Date,
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'],
    },
    
    // Audit information
    lastModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
ExpenseSchema.index({ organization: 1, isActive: 1 });
ExpenseSchema.index({ category: 1, isActive: 1 });
ExpenseSchema.index({ expenseDate: 1 });
ExpenseSchema.index({ paymentStatus: 1 });
ExpenseSchema.index({ vendor: 1 });

// Virtual for checking if expense is overdue
ExpenseSchema.virtual('isOverdue').get(function() {
  if (this.dueDate && this.paymentStatus === 'pending') {
    return new Date() > this.dueDate;
  }
  return false;
});

// Virtual for remaining amount
ExpenseSchema.virtual('remainingAmount').get(function() {
  return this.amount - this.paidAmount;
});

// Virtual for checking if expense is fully paid
ExpenseSchema.virtual('isFullyPaid').get(function() {
  return this.paidAmount >= this.amount;
});

// Virtual for checking if expense is over budget
ExpenseSchema.virtual('isOverBudgetCalculated').get(function() {
  if (this.budgetAmount) {
    return this.amount > this.budgetAmount;
  }
  return false;
});

// Pre-save middleware to update lastModifiedAt
ExpenseSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastModifiedAt = new Date();
  }
  next();
});

// Method to mark as paid
ExpenseSchema.methods.markAsPaid = function(paidAmount, paidBy, notes = '') {
  this.paymentStatus = 'paid';
  this.paidAmount = paidAmount;
  this.lastModifiedBy = paidBy;
  this.lastModifiedAt = new Date();
  this.notes = notes;
  
  return this.save();
};

// Method to approve expense
ExpenseSchema.methods.approve = function(approvedBy, notes = '') {
  this.isApproved = true;
  this.approvedBy = approvedBy;
  this.approvedAt = new Date();
  this.approvalNotes = notes;
  this.lastModifiedBy = approvedBy;
  this.lastModifiedAt = new Date();
  
  return this.save();
};

// Method to calculate recurring next due date
ExpenseSchema.methods.calculateNextDueDate = function() {
  if (!this.isRecurring || !this.expenseDate) {
    return null;
  }
  
  const currentDate = new Date(this.expenseDate);
  let nextDate = new Date(currentDate);
  
  switch (this.recurringPattern) {
    case 'daily':
      nextDate.setDate(currentDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(currentDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(currentDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(currentDate.getMonth() + 3);
      break;
    case 'annual':
      nextDate.setFullYear(currentDate.getFullYear() + 1);
      break;
  }
  
  return nextDate;
};

// Ensure virtuals are included in JSON output
ExpenseSchema.set('toJSON', { virtuals: true });
ExpenseSchema.set('toObject', { virtuals: true });

export default models.Expense ? models.Expense : model('Expense', ExpenseSchema); 