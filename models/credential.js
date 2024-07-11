import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
  userId: {  // Foreign key to User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  credentialName: {
    type: String,
    required: true,
  },
  credentialDetails: {
    type: String,
    default: '',
  },
  credentialFiles: {
    type: String,
    default: '',
  },
  credentialStatus: {
    type: String,
    enum: ['uploaded', 'verified', 'rejected'],
    default: 'uploaded'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  }
});

// Define instance methods
credentialSchema.methods.isAccepted = function() {
  return this.credentialStatus === 'uploaded';
};

credentialSchema.methods.isVerified = function() {
  return this.credentialStatus === 'verified';
};

credentialSchema.methods.isProcessing = function() {
  return this.credentialStatus === 'rejected';
};

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential;
