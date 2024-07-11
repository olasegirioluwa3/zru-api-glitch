import mongoose from 'mongoose';

const { Schema } = mongoose;

const facultyProgramSchema = new Schema({
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'FacultyDepartment',
    required: true,
  },
  programName: {
    type: String,
    required: true,
    default: '',
  },
  programCode: {
    type: String,
    default: '',
  },
  programCourse: {
    type: String,
    default: '',
  },
  degreeType: {
    type: String,
    default: '',
  },
  programDetails: {
    type: String,
    default: '',
  },
  programStatus: {
    type: String,
    enum: ['pending', 'in-review', 'active', 'removed'],
    default: 'pending',
  },
  programDuration: {
    type: String,
    default: '',
  },
  graduationRequirements: {
    type: String,
    default: '',
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

const FacultyProgram = mongoose.model('FacultyProgram', facultyProgramSchema);

export default FacultyProgram;
