import mongoose from 'mongoose';

const admissionTestSchema = new mongoose.Schema({
  atName: {
    type: String,
    required: true,
    default: ''
  },
  atValue: {
    type: String,
    required: true,
    default: ''
  },
  atDesc: {
    type: String,
    default: ''
  },
  atEntryLevel: {
    type: String,
    default: '100'
  },
  atRegion: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const AdmissionTest = mongoose.model('AdmissionTest', admissionTestSchema);

export default AdmissionTest;
