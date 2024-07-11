import mongoose from 'mongoose';

const { Schema } = mongoose;

const schoolLeavingExamGradeSchema = new Schema({
  slegName: {
    type: String,
    required: true,
    default: '',
  },
  slegValue: {
    type: String,
    required: true,
    default: '',
  },
  slegDesc: {
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

const SchoolLeavingExamGrade = mongoose.model('SchoolLeavingExamGrade', schoolLeavingExamGradeSchema);

export default SchoolLeavingExamGrade;
