import express from 'express';
import authenticateToken from '../../middlewares/auth.user.middleware.js';
import schoolLeavingExamController from '../../controllers/schoolLeavingExamController.js';
import studentSchoolLeavingExamResultController from '../../controllers/studentSchoolLeavingExamResult.js';
import schoolLeavingExamSubjectController from '../../controllers/schoolLeavingExamSubjectController.js';
import schoolLeavingExamGradeController from '../../controllers/schoolLeavingExamGradeController.js';

const router = express.Router();
export default function userSchoolLeavingRoutes(app, io, sequelize) {
    // student school leaving exam result routes )elsr
    router.post('/sler/', authenticateToken, (req, res) => {
        try {
            // check if userId is req.body is for the user
            studentSchoolLeavingExamResultController.createStudentSchoolLeavingExamResult
        } catch (error){

        }
    });

    // student school leaving exam result routes )elsr
    router.get('/sler/:id', authenticateToken, (req, res) => {
        try {
            // check if result belong to user
            studentSchoolLeavingExamResultController.getStudentSchoolLeavingExamResult;
        } catch (error){

        }
    });

    // student school leaving exam result routes )elsr
    router.put('/sler/:id', authenticateToken, (req, res) => {
        try {
            // check if result belong to user
            studentSchoolLeavingExamResultController.updateStudentSchoolLeavingExamResult;
        } catch (error){

        }
    });

    // school leaving exam routes (/sle)
    router.get('/sle/:id', authenticateToken, schoolLeavingExamController.getSchoolLeavingExam);
    router.get('/sle/:id/grades', authenticateToken, schoolLeavingExamController.getSchoolLeavingExamGrades);
    router.get('/sle/:id/subjects', authenticateToken, schoolLeavingExamController.getSchoolLeavingExamSubjects);

    // school leaving exam subject (sles)
    router.get('/sles/:id', authenticateToken, schoolLeavingExamSubjectController.getSchoolLeavingExamSubject);

    // school leaving exam grade (sleg)
    router.get('/sleg/:id', authenticateToken, schoolLeavingExamGradeController.getSchoolLeavingExamGrade);
    app.use('/api/user', router);
}