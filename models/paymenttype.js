import mongoose from 'mongoose';

const paymentTypeSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyProgram',
  },
  ptPurpose: {
    type: String,
    enum: ['application', 'acceptance', 'tuition', 'tuition-combined', 'portal', 'cbt', 'laboratory', 'hostel', 'library'],
    default: 'tuition',
  },
  ptAmount: {
    type: String,
    required: true,
    default: '1000',
  },
  ptDefaultCurrency: {
    type: String,
    required: true,
    default: 'NGN',
  },
  ptAmountInternationalStudent: {
    type: String,
    required: true,
    default: '100',
  },
  ptDefaultCurrencyInternationalStudent: {
    type: String,
    required: true,
    default: 'USD',
  },
  ptStatus: {
    type: String,
    enum: ['pending', 'removed', 'active'],
    default: 'pending',
  },
  courseLevel: {
    type: String,
    required: true,
    default: 'none',
  },
  courseSemester: {
    type: String,
    required: true,
    default: 'none',
  },
  ptSubscription: {
    type: String,
    enum: ['no', 'yes'],
    default: 'no',
  },
  ptSubscriptionFrequency: {
    type: String,
    enum: ['', 'monthly', 'dayly', 'weekly', 'yearly'],
    default: '',
  },
  ptDetails: {
    type: String,
    required: true,
    default: '',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
});

// Adding methods to the schema
paymentTypeSchema.methods.isAccepted = function() {
  return this.ptStatus === 'active';
};

paymentTypeSchema.methods.isRejected = function() {
  return this.ptStatus === 'removed';
};

paymentTypeSchema.methods.isProcessing = function() {
  return this.ptStatus === 'pending';
};

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);

export default PaymentType;