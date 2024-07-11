import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  transactionType: {
    type: String,
    enum: ['undetermined', 'credit', 'debit'],
    required: true,
    default: 'undetermined',
  },
  regCenterId: {
    type: Schema.Types.ObjectId,
    ref: 'RegCenter',  // Reference to RegCenter model
    required: true,
  },
  applicationId: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
