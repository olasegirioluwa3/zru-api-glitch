import mongoose from 'mongoose';

const facultyDepartmentSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  departmentName: {
    type: String,
    required: true,
    default: '',
  },
  departmentCode: {
    type: String,
    unique: true,
    default: '',
  },
  departmentCourse: {
    type: String,
    default: '',
  },
  degreeType: {
    type: String,
    default: '',
  },
  departmentDetails: {
    type: String,
    default: '',
  },
  departmentStatus: {
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

const FacultyDepartment = mongoose.model('FacultyDepartment', facultyDepartmentSchema);

export default FacultyDepartment;
