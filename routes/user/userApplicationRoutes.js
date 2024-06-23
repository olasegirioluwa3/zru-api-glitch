import express from 'express';
const router = express.Router();
import authenticateToken from '../../middlewares/auth.user.middleware.js';
import uploads from '../../middlewares/upload.user.middleware.js';
const { uploadProfilePicture, deleteExistingProfilePicture, uploadCoverPicture, deleteExistingCoverPicture } = uploads;
import userController from '../../controllers/userController.js';
import validateUserData from "../../middlewares/validator/userValidator.js";

/**
   * user application routes
   */

export default function userApplicationRoutes (app, io, sequelize) {
  // Create a new application
  router.post('/create', authenticateToken, async (req, res) => {
    try {
      console.log("api/users/applications/register");
      const { data, errors } = await validateUserData( req.body );
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      await userController.registerUser(req, res, data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: "failed", message: 'Register failed on R', error: error.message });
    }
  });
  
  // Update payment status after payment
  router.patch('/applications/update-payment/:id', authenticateToken, async (req, res) => {
    try {
      const applicationId = req.params.id;
      const application = await Application.findByPk(applicationId);
      
      if (!application) return res.status(404).send({ status: "failed", message: 'Application not found!' });

      application.paymentStatus = req.body.paymentStatus;
      application.paymentReference = req.body.paymentReference;
      await application.save();

      res.send({ application, status: "success", message: 'Payment status updated successfully!' });
    } catch (error) {
      res.status(500).send({ status: "failed", message: 'Failed to update payment status', error });
    }
  });

  // Fetch all applications of a user
  router.get('/applications/user/:userId', authenticateToken, async (req, res) => {
    try {
      const userId = req.params.userId;
      const applications = await Application.findAll({ where: { userId: userId } });
      res.send({ status: "success", applications });
    } catch (error) {
      res.status(500).send({ status: "failed", message: 'Failed to fetch applications', error });
    }
  });

  router.get('/', (req, res) => {
    res.status(200).send({ status: "success", message: 'API user called' });
  });

  app.use('/api/users/applications', router);
};