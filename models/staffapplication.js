import mongoose from 'mongoose';

const staffApplicationSchema = new mongoose.Schema({
  userId: {  // Foreign key to User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.trim() !== '';
      },
      message: props => `${props.value} is empty!`
    }
  },
  jobPosition: {
    type: String,
    default: '',
  },
  CV: {
    type: String,
    default: '',
  },
  coverLetter: {
    type: String,
    default: '',
  },
  applicationDetails: {
    type: String,
    default: '',
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'processing'],
    default: 'pending'
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
staffApplicationSchema.methods.isAccepted = function() {
  return this.applicationStatus === 'accepted';
};

staffApplicationSchema.methods.isRejected = function() {
  return this.applicationStatus === 'rejected';
};

staffApplicationSchema.methods.isProcessing = function() {
  return this.applicationStatus === 'processing';
};

const StaffApplication = mongoose.model('StaffApplication', staffApplicationSchema);

export default StaffApplication;
