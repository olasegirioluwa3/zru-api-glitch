import mongoose from 'mongoose';

const facultyMemberSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyDepartment',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  memberName: {
    type: String,
    required: true,
    default: '',
  },
  designation: {
    type: String,
    default: '',
  },
  researchInterests: {
    type: String,
    default: '',
  },
  membershipDetail: {
    type: String,
    default: '',
  },
  membershipStatus: {
    type: String,
    enum: ['pending', 'current', 'past', 'other'],
    default: 'pending',
  },
  startDateAt: {
    type: Date,
    default: null,
  },
  endDateAt: {
    type: Date,
    default: null,
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

const FacultyMember = mongoose.model('FacultyMember', facultyMemberSchema);

export default FacultyMember;
