import express from 'express';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';
import studentController from '../../controllers/studentController.js';

const router = express.Router();
export default function adminAcademicRoutes(app, io, sequelize) {
    // Admin can manage student
    router.post('/student', authenticateToken, studentController.createStudent);
    router.get('/students', authenticateToken, studentController.getAllStudents);
    router.get('/student/:id', authenticateToken, studentController.getStudentById);
    router.put('/student/:id', authenticateToken, studentController.updateStudent);
    router.delete('/student/:id', authenticateToken, studentController.deleteStudent);
};