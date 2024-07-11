import mongoose from 'mongoose';

const admissionTestSubjectSchema = new mongoose.Schema({
  atsName: {
    type: String,
    required: true,
    default: '',
  },
  atsValue: {
    type: String,
    required: true,
    default: ''
  },
  atsDesc: {
    type: String,
    default: '',
  },
  atId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdmissionTest',
    default: null,
  }
}, {
  timestamps: true
});

const AdmissionTestSubject = mongoose.model('AdmissionTestSubject', admissionTestSubjectSchema);

export default AdmissionTestSubject;
