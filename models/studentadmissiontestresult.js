import mongoose from 'mongoose';

const { Schema } = mongoose;

const studentAdmissionTestResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true,
  },
  examName: {
    type: String,
    default: '',
  },
  examYear: {
    type: String,
    default: '',
  },
  examNumber: {
    type: String,
    default: '',
  },
  examTotalScore: {
    type: String,
    default: '',
  },
  resultDetails: {
    type: String,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'in-review'],
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

const StudentAdmissionTestResult = mongoose.model('StudentAdmissionTestResult', studentAdmissionTestResultSchema);

export default StudentAdmissionTestResult;
