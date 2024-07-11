import express from 'express';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';
import schoolLeavingExamController from '../../controllers/schoolLeavingExamController.js';
import studentSchoolLeavingExamResultController from '../../controllers/studentSchoolLeavingExamResult.js';
import schoolLeavingExamSubjectController from '../../controllers/schoolLeavingExamSubjectController.js';
import schoolLeavingExamGradeController from '../../controllers/schoolLeavingExamGradeController.js';

const router = express.Router();
export default function adminSchoolLeavingRoutes(app, io, sequelize) {
    // student school leaving exam result routes )elsr
    router.post('/sler/', studentSchoolLeavingExamResultController.createStudentSchoolLeavingExamResult);
    router.get('/sler/:id', studentSchoolLeavingExamResultController.getStudentSchoolLeavingExamResult);
    router.put('/sler/:id', studentSchoolLeavingExamResultController.updateStudentSchoolLeavingExamResult);
    router.delete('/sler/:id', studentSchoolLeavingExamResultController.deleteStudentSchoolLeavingExamResult);

    // school leaving exam routes (/sle)
    router.post('/sle/', schoolLeavingExamController.createSchoolLeavingExam);
    router.get('/sle/:id', schoolLeavingExamController.getSchoolLeavingExam);
    router.put('/sle/:id', schoolLeavingExamController.updateSchoolLeavingExam);
    router.delete('/sle/:id', schoolLeavingExamController.deleteSchoolLeavingExam);
    router.get('/sle/:id/grades', schoolLeavingExamController.getSchoolLeavingExamGrades);
    router.get('/sle/:id/subjects', schoolLeavingExamController.getSchoolLeavingExamSubjects);

    // school leaving exam subject (sles)
    router.post('/sles/', schoolLeavingExamSubjectController.createSchoolLeavingExamSubject);
    router.get('/sles/:id', schoolLeavingExamSubjectController.getSchoolLeavingExamSubject);
    router.put('/sles/:id', schoolLeavingExamSubjectController.updateSchoolLeavingExamSubject);
    router.delete('/sles/:id', schoolLeavingExamSubjectController.deleteSchoolLeavingExamSubject);

    // school leaving exam grade (sleg)
    router.post('/sleg/', schoolLeavingExamGradeController.createSchoolLeavingExamGrade);
    router.get('/sleg/:id', schoolLeavingExamGradeController.getSchoolLeavingExamGrade);
    router.put('/sleg/:id', schoolLeavingExamGradeController.updateSchoolLeavingExamGrade);
    router.delete('/sleg/:id', schoolLeavingExamGradeController.deleteSchoolLeavingExamGrade);

    app.use('/api/admin', router);
}