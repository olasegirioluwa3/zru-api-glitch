import mongoose from 'mongoose';

const courseAllocationSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyProgram',
    required: true,
  },
  level: {
    type: String,
    enum: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
    default: '100',
  },
  semester: {
    type: String,
    enum: ['first', 'second', 'third', 'fourth'],
    default: 'first',
  },
  courseType: {
    type: String,
    enum: ['compulsory', 'elective', 'optional'],
    default: 'compulsory',
  },
  allocationDetails: {
    type: String,
    default: '',
  }
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

const CourseAllocation = mongoose.model('CourseAllocation', courseAllocationSchema);

export default CourseAllocation;
