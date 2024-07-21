import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyProgram',
    required: true,
    default: null,
  },
  courseName: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: props => `${props.value} is not a valid course name!`
    }
  },
  entryType: {
    type: String,
    default: '',
  },
  applicationDetails: {  // Keep log of actions of this application timestamp - event
    type: String,
    default: '',
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'in-review', 'accepted', 'rejected', 'completed', 'isstudent'], // complete means the acceptance fee has been paid
    default: 'pending',
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

// Application status methods
applicationSchema.methods.isPending = function() {
  return this.applicationStatus === 'pending';
};

applicationSchema.methods.isProcessing = function() {
  return this.applicationStatus === 'processing';
};

applicationSchema.methods.isAccepted = function() {
  return this.applicationStatus === 'accepted';
};

applicationSchema.methods.isRejected = function() {
  return this.applicationStatus === 'rejected';
};

applicationSchema.methods.isCompleted = function() {
  return this.applicationStatus === 'completed';
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;
