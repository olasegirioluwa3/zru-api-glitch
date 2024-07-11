// routes/admissionTestRoutes.js
import express from 'express';
import admissionTestController from '../../controllers/admissionTestController.js';
import admissionTestSubjectController from '../../controllers/admissionTestSubjectController.js';
import studentAdmissionTestResultController from '../../controllers/studentAdmissionTestResultController.js';

const router = express.Router();  
export default function adminAdmissionTestRoutes(app, io, sequelize) {

    // studentAdmissionTestResultRoutes
    router.post('/studadmissiontr/', studentAdmissionTestResultController.createStudentAdmissionTestResult);
    router.get('/studadmissiontr/:id', studentAdmissionTestResultController.getStudentAdmissionTestResultById);
    router.put('/studadmissiontr/:id', studentAdmissionTestResultController.updateStudentAdmissionTestResult);
    router.delete('/studadmissiontr/:id', studentAdmissionTestResultController.deleteStudentAdmissionTestResult);

    // admissionTestSubjectRoutes
    router.post('/admissionts/', admissionTestSubjectController.createAdmissionTestSubject);
    router.get('/admission/ts/:id', admissionTestSubjectController.getAdmissionTestSubjectById);
    router.put('/admissionts/:id', admissionTestSubjectController.updateAdmissionTestSubject);
    router.delete('/admissionts/:id', admissionTestSubjectController.deleteAdmissionTestSubject);

    // admissionTestRoutes
    router.post('/admissiont/', admissionTestController.createAdmissionTest);
    router.get('/admissiont/:id', admissionTestController.getAdmissionTestById);
    router.put('/admissiont/:id', admissionTestController.updateAdmissionTest);
    router.delete('/admissiont/:id', admissionTestController.deleteAdmissionTest);
    app.use('/api/admin', router);
}
