import mongoose from 'mongoose';

const { Schema } = mongoose;

const schoolLeavingExamSchema = new Schema({
  sleName: {
    type: String,
    required: true,
    default: '',
  },
  sleValue: {
    type: String,
    required: true,
    default: '',
  },
  sleDesc: {
    type: String,
    default: '',
  },
  sleRegion: {
    type: String,
    default: '',
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

const SchoolLeavingExam = mongoose.model('SchoolLeavingExam', schoolLeavingExamSchema);

export default SchoolLeavingExam;
