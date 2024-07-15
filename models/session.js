import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionName: {
    type: String,
    required: true,
  },
  sessionStart: {
    type: Date,
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
    enum: ['pending', 'current', 'past'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;