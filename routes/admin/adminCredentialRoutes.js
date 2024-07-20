import express from 'express';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';
import credentialController from '../../controllers/credentialController.js';
import { upload } from '../../middlewares/cloudinary.middleware.js'; // Assuming you have a middleware for Cloudinary upload

const router = express.Router();

export default function adminCredentialRoutes(app) {
    // Admin routes for managing credentials
    router.get('/credentials', authenticateToken, credentialController.getAllCredentials);
    router.get('/credentials/:id', authenticateToken, credentialController.getCredentialById);
    router.post('/credentials', authenticateToken, upload.single('credentialFile'), credentialController.createCredential);
    router.put('/credentials/:id', authenticateToken, credentialController.updateCredential);
    router.put('/credentials/:id/approve', authenticateToken, credentialController.approveCredential);
    router.put('/credentials/:id/reject', authenticateToken, credentialController.rejectCredential);
    router.delete('/credentials/:id', authenticateToken, credentialController.deleteCredential);
    router.delete('/credentials/:id/file/:fileURL', authenticateToken, credentialController.removeFileFromCredential);

    app.use('/api/admin', router);
}
