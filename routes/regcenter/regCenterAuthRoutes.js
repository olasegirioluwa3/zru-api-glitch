import express from 'express';
import authRegCenterMiddleware from '../../middlewares/auth.regcenter.middleware.js';
import regCenterController from '../../controllers/regCenterController.js';

const router = express.Router();

export default function regCenterRoutes(app, io, sequelize) {
    router.post('/register', async (req, res) => {
        try {
            await regCenterController.register(req, res, req.body);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: 'Failed to send welcome message', error: error.message });
        }
    });
    // router.post('/register', register);
    router.post('/login', regCenterController.login);
    router.post('/verify-account-email/:emailVerificationToken', async (req, res) => {
        try {
            await regCenterController.verifyEmail(req, res, req.params);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: 'Failed to send welcome message', error: error.message });
        }
    });
    router.post('/forgot-password', async (req, res) => {
        try {
          console.log("api/users/forgot-password");
        //   const { data, errors } = await validateUserData( req.body );
        //   if (errors.length > 0) {
        //     return res.status(400).json({ errors });
        //   }
          await regCenterController.forgotPassword(req, res, req.body);
        } catch (error) {
          console.error(error);
          res.status(500).send({ status: "failed", message: 'Failed to send reset password link', error: error.message });
        }
      });
    router.post('/forgot-password-init/:resetPasswordToken', async (req, res) => {
        try {
            console.log("api/regcenter/forgot-password-init/:resetPasswordToken");
            // const { data, errors } = await validateUserData( req.params );
            // if (errors.length > 0) {
            //     return res.status(400).json({ errors });
            // }
            await regCenterController.resetPasswordInit(req, res, req.params);
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "failed", message: 'Failed to reset password', error: error.message });
        }
    });

    router.post('/forgot-password-final', async (req, res) => {
        try {
            console.log("api/regcenter/forgot-password-final");
            // const { data, errors } = await validateUserData( req.body );
            // if (errors.length > 0) {
            //     return res.status(400).json({ errors });
            // }
            await regCenterController.resetPasswordFinal(req, res, req.body);
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "failed", message: 'Failed to reset password', error: error.message });
        }
    });

    router.post('/reset-password', authRegCenterMiddleware, async (req, res) => {
        try {
            await regCenterController.resetPassword(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: "failed", message: 'Failed to reset password', error: error.message });
        }
    });
    router.get('/candidates', authRegCenterMiddleware, regCenterController.listCandidates);
    router.get('/candidates/:id', authRegCenterMiddleware, regCenterController.viewCandidate);
    router.patch('/candidates/:id', authRegCenterMiddleware, regCenterController.updateCandidate);
    // the rest is not tested.
    router.get('/applications', authRegCenterMiddleware, regCenterController.listApplications);
    router.patch('/applications/:id', authRegCenterMiddleware, regCenterController.updateApplication);
    router.post('/withdraw', authRegCenterMiddleware, regCenterController.withdraw);
    app.use('/api/regcenter', router);
}
