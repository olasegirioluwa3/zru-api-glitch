import express from 'express';
import applicationController from '../../controllers/applicationController.js';
import authenticateToken from '../../middlewares/auth.user.middleware.js';

const router = express.Router();
export default function userApplicationRoutes(app, io, sequelize) {
    // User can manage applications
    router.post('/applications', authenticateToken, applicationController.createApplication);
    router.get('/applications/user/:userId', authenticateToken, applicationController.getApplicationsByUserId);
    
    router.get('/applications/:id', authenticateToken, applicationController.getApplicationById);
    router.put('/applications/:id', authenticateToken, applicationController.updateUserApplication);
    router.put('/applications/:id/revise', authenticateToken, applicationController.reviseUserApplication);
    // router.put('/applications/:id/program', authenticateToken, applicationController.updateApplicationProgram);
    router.delete('/applications/:id', authenticateToken, applicationController.deleteApplication);
    
    // application payment
    router.post('/applications/:id/pay/application', authenticateToken, applicationController.payForApplication);
    router.post('/applications/:id/pay/acceptance', authenticateToken, applicationController.payForAcceptance);
    router.get('/applications/payment/application/verify', applicationController.verifyApplicationPayment);
    router.get('/applications/payment/acceptance/verify', applicationController.verifyAcceptancePayment);

    router.post('/applications/:id/pay/generate-matric', authenticateToken, applicationController.generateMatric);
    router.post('/applications/payment/firsttuition/verify', authenticateToken, applicationController.verifyFirstTuition);

    app.use('/api/user', router);
}
