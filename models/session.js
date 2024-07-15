import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionName: {
    type: String,
    required: true,
  },
  sessionStart: {
    type: Date,
    required: true,
    unique: true,
  },
  sessionEnd: {
    type: Date,
    required: false,
  },
  sessionDescription: {
    type: String,
    default: '',
  },
  sessionStatus: {
    type: String,
    enum: ['pending', 'active', 'removed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
