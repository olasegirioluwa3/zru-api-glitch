import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyProgram',
    required: true,
  },
  courseCode: {
    type: String,
    default: '',
  },
  courseTitle: {
    type: String,
    default: '',
  },
  courseCredit: {
    type: String,
    default: '',
  },
  courseHour: {
    type: String,
    default: '',
  },
  courseDetails: {
    type: String,
    default: '',
  },
  courseStatus: {
    type: String,
    enum: ['pending', 'in-review', 'active', 'removed'],
    default: 'pending',
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

const Course = mongoose.model('Course', courseSchema);

export default Course;
