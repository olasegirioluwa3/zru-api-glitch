import mongoose from 'mongoose';

const mycourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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
}, {
  timestamps: true,
});

const Mycourse = mongoose.model('Mycourse', mycourseSchema);
export default Mycourse;