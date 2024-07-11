import mongoose from 'mongoose';

const { Schema } = mongoose;

const schoolLeavingExamSubjectSchema = new Schema({
  slesName: {
    type: String,
    required: true,
    default: '',
  },
  slesValue: {
    type: String,
    required: true,
    default: '',
  },
  slesDesc: {
    type: String,
    default: '',
  },
  sleId: {
    type: Schema.Types.ObjectId,
    ref: 'SchoolLeavingExam',
    default: null,
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

const SchoolLeavingExamSubject = mongoose.model('SchoolLeavingExamSubject', schoolLeavingExamSubjectSchema);

export default SchoolLeavingExamSubject;
