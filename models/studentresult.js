import mongoose from 'mongoose';
import Mycourse from '../../mycourse/models/mycourse.model';
import Student from '../../student/models/student.model';

const studentResultSchema = new mongoose.Schema({
    mcId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mycourse',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    firstCa: {
        type: Number,
        required: true,
    },
    secondCa: {
        type: Number,
        required: true,
    },
    thirdCa: {
        type: Number,
        required: true,
    },
    studentResult: {
        type: Number,
        required: true,
    },
    workshop: {
        type: Number,
        required: true,
    },
    pratical: {
        type: Number,
        required: true,
    },
    exam: {
        type: Number,
        required: true,
    },
    grade: {
        type: String,
        required: false,
    },
    comment: {
        type: String,
        required: false,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentResult: {
        type: Number,
        required: true
    },
    workshop: {
        type: Number,
        required: true
    },
    attendance: {
        type: Number,
        required: true
    },
    sessionName: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
  timestamps: true,
});

const StudentResult = mongoose.model('StudentResult', studentResultSchema);
export default StudentResult;
