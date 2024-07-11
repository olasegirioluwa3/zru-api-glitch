import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: true,
    default: '',
  },
  facultySlug: {
    type: String,
    required: true,
    unique: true,
    default: '',
  },
  facultyStatus: {
    type: String,
    enum: ['pending', 'in-review', 'active', 'removed'],
    default: 'pending',
  },
  welcomeMessage: {
    type: String,
    default: '',
  },
  objectives: {
    type: String,
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
  }
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
