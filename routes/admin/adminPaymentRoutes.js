import express from 'express';
import paymentTypeController from '../../controllers/paymentTypeController.js';
import paymentController from '../../controllers/paymentController.js';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';

const router = express.Router();
export default function adminPaymentRoutes(app, io, sequelize) {
    // Admin can manage payment types
    router.post('/paymenttype', authenticateToken, paymentTypeController.createPaymentType);
    router.get('/paymenttype', authenticateToken, paymentTypeController.getAllPaymentTypes);
    router.get('/paymenttype/active', authenticateToken, paymentTypeController.getActivePaymentTypes);
    router.get('/paymenttype/:id', authenticateToken, paymentTypeController.getPaymentTypeById);
    router.put('/paymenttype/:id', authenticateToken, paymentTypeController.updatePaymentType);
    router.delete('/paymenttype/:id', authenticateToken, paymentTypeController.deletePaymentType);

    // Admin can manage payments
    router.post('/payments', authenticateToken, paymentController.createPayment);
    router.get('/payments', authenticateToken, paymentController.getAllPayments);
    router.get('/payments/pending', authenticateToken, paymentController.getPendingPayments);
    router.get('/payments/completed', authenticateToken, paymentController.getCompletedPayments);
    router.get('/payments/:id', authenticateToken, paymentController.getPaymentById);
    router.put('/payments/:id', authenticateToken, paymentController.updatePayment);
    router.delete('/payments/:id', authenticateToken, paymentController.deletePayment);
    router.get('/payments/user/:userId', authenticateToken, paymentController.getPaymentsByUserId);
    router.get('/payments/paymenttype/:paymentTypeId', authenticateToken, paymentController.getPaymentsByPaymentTypeId);
    router.get('/payments/user/:userId/paymenttype/:paymentTypeId', authenticateToken, paymentController.getPaymentsByUserIdAndPaymentTypeId);
    
    app.use('/api/admin', router);
}