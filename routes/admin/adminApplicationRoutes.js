import express from 'express';
import applicationController from '../../controllers/applicationController.js';
// import authMiddleware from '../middleware/authMiddleware';
// import adminAuthMiddleware from '../middleware/adminAuthMiddleware';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';

const router = express.Router();
export default function adminApplicationRoutes(app, io, sequelize) {
    // Admin can manage applications
    router.post('/applications', authenticateToken, applicationController.createApplication);
    router.get('/applications', authenticateToken, applicationController.getAllApplications);
    router.get('/applications/user/:userId', authenticateToken, applicationController.getApplicationsByUserId);
    router.get('/applications/:id', authenticateToken, applicationController.getApplicationById);
    router.put('/applications/:id', authenticateToken, applicationController.updateApplication);
    // router.put('/applications/:id/status', authenticateToken, applicationController.updateApplicationStatus);
    // router.put('/applications/:id/program', authenticateToken, applicationController.updateApplicationProgram);
    router.put('/applications/:id/reject', authenticateToken, applicationController.rejectApplication);
    router.put('/applications/:id/accept', authenticateToken, applicationController.acceptApplication);
    router.delete('/applications/:id', authenticateToken, applicationController.deleteApplication);
    
    // application payment
    router.post('/applications/:id/pay/application', authenticateToken, applicationController.payForApplication);
    router.post('/applications/:id/pay/acceptance', authenticateToken, applicationController.payForAcceptance);
    router.get('/applications/payment/application/verify', applicationController.verifyApplicationPayment);
    router.get('/applications/payment/acceptance/verify', applicationController.verifyAcceptancePayment);
    
    app.use('/api/admin', router);
}