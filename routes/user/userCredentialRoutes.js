import express from 'express';
import authenticateToken from '../../middlewares/auth.user.middleware.js';
import credentialController from '../../controllers/credentialController.js';
import { upload } from '../../middlewares/cloudinary.middleware.js'; // Assuming you have a middleware for Cloudinary upload

const router = express.Router();

export default function userCredentialRoutes(app) {
    // User routes for managing credentials
    router.get('/credentials', authenticateToken, credentialController.getAllUserCredentials);
    router.get('/credentials/:id', authenticateToken, credentialController.getCredentialById);
    router.post('/credentials', authenticateToken, upload.single('credentialFile'), credentialController.createCredential);
    router.post('/credentials/:id', authenticateToken, upload.single('credentialFile'), credentialController.addFileToCredential); //add file to credential
    router.put('/credentials/:id', authenticateToken, credentialController.updateCredential);
    router.put('/credentials/:id/revise', authenticateToken, credentialController.reviseCredential);
    router.delete('/credentials/:id', authenticateToken, credentialController.deleteCredential);
    router.delete('/credentials/:id/file/:fileURL', authenticateToken, credentialController.removeFileFromCredential); // remove file from credential

    app.use('/api/user', router);
}