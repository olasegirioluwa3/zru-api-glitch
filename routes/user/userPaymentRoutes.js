import express from 'express';
import paymentTypeController from '../../controllers/paymentTypeController.js';
import paymentController from '../../controllers/paymentController.js';
import authenticateToken from '../../middlewares/auth.user.middleware.js';

const router = express.Router();
export default function userPaymentRoutes(app, io, sequelize) {
    // User can manage payment types
    router.get('/paymenttype', authenticateToken, paymentTypeController.getActivePaymentTypes);
    router.get('/paymenttype/:id', authenticateToken, paymentTypeController.getActivePaymentTypeById);

    // User can manage payments
    router.post('/payments', authenticateToken, paymentController.createPayment);
    router.get('/payments/:id', authenticateToken, paymentController.getPaymentById);
    router.put('/payments/:id', authenticateToken, paymentController.updatePayment);
    router.delete('/payments/:id', authenticateToken, paymentController.deletePayment);
    router.get('/payments/user/:userId', authenticateToken, paymentController.getPaymentsByUserId);
    router.get('/payments/user/:userId/paymenttype/:paymentTypeId', authenticateToken, paymentController.getPaymentsByUserIdAndPaymentTypeId);
    
    app.use('/api/user', router);
}