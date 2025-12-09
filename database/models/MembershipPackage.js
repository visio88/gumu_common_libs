import { model, models, Schema } from 'mongoose';

const MembershipPackageSchema = new Schema(
  {
    // Package basic information
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      value: {
        type: Number,
        required: true,
        min: 1,
      },
      unit: {
        type: String,
        required: true,
        enum: ['days', 'months', 'years'],
        default: 'months',
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'LKR',
      enum: ['LKR', 'NPR', 'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    },
    description: {
      type: String,
      trim: true,
    },
    
    // Package status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Features and benefits
    features: [{
      type: String,
      trim: true,
    }],
    
    // Organization reference
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
    
    // Additional settings
    maxMembers: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      enum: ['regular', 'premium', 'vip', 'trial', 'custom'],
      default: 'regular',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
MembershipPackageSchema.index({ organization: 1, isActive: 1 });
MembershipPackageSchema.index({ organization: 1, displayOrder: 1 });
MembershipPackageSchema.index({ category: 1, isActive: 1 });

// Virtual for calculating duration in days
MembershipPackageSchema.virtual('durationInDays').get(function() {
  const { value, unit } = this.duration;
  switch (unit) {
    case 'days':
      return value;
    case 'months':
      return value * 30; // Approximate
    case 'years':
      return value * 365; // Approximate
    default:
      return value;
  }
});

// Virtual to get formatted duration string
MembershipPackageSchema.virtual('formattedDuration').get(function() {
  const { value, unit } = this.duration;
  return `${value} ${unit}`;
});

// Ensure virtuals are included in JSON output
MembershipPackageSchema.set('toJSON', { virtuals: true });
MembershipPackageSchema.set('toObject', { virtuals: true });

export default models.MembershipPackage ? models.MembershipPackage : model('MembershipPackage', MembershipPackageSchema);

