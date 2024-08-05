import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    programId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FacultyProgram', required: true 
    },
    applicationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Application', required: true 
    },
    courseName: { 
        type: String, required: true 
    },
    matricNumber: {
        type: String,
        unique: true,
        required: true,
    },
    courseLevel: {
        type: String,
        required: false,
    },
    studentStatus: {
        type: String,
        enum: ['graduate', 'active', 'transferred', 'pending', 'expelled', 'deferred'],
        default: 'pending',
    },
    lastMatricNumber: {
        type: String,
        default: '',
    },
    studentDetails: {
        type: String,
        default: '',
    },
    studentshipLog: { // only to be appended
        type: String,
        default: '',
    },
});

const Student = mongoose.model('Student', studentSchema);
export default Student;