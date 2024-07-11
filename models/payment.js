import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentType',
    required: true,
  },
  paymentFor: { // model name e.g application
    type: String,
    default: '',
  },
  paymentForId: {  // pk for paymentFor
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0,
  },
  amountRemaining: {
    type: Number,
    required: true,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentFullfilled: {
    type: String,
    enum: ['no', 'yes', 'in-progress'],
    default: 'no',
  },
  paymentReference: {
    type: String,
    default: '',
  },
  paymentLink: {
    type: String,
    default: '',
  },
  paymentProof: { // multiple files seperated by comma
    type: String,
    default: '',
  },
  paymentDate: {
    type: Date,
    default: new Date(),
  },
  gateway: {
    type: String,
    required: true,
    enum: ['stripe', 'paystack', 'transfer'/*... other gateways ...*/],
  },
  currency: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 3 && /^[A-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid ISO currency code!`
    }
  },
  paymentDueDate: {
    type: Date,
    default: new Date(),
  },
  paymentNextDate: {
    type: Date,
    default: new Date(),
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  }
}, {
  timestamps: true,  // Enable timestamps
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  }
});

// Adding methods to the schema
paymentSchema.methods.isCompleted = function() {
  return this.paymentStatus === 'Completed';
};

paymentSchema.methods.notCompleted = function() {
  return this.paymentStatus === 'Failed';
};

paymentSchema.methods.isPending = function() {
  return this.paymentStatus === 'Pending';
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;