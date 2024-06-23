// routes/transactionRoutes.js
import express from 'express';
import TransactionController from '../../controllers/transactionController';

const router = express.Router();

export default function adminRoutes(app, io, sequelize) {
    // Welcome route
    router.post('/transactions', async (req, res) => {
        try {
            await TransactionController.createTransaction(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: `Failed to withdraw`, error: error.message });
        }
    });

    router.post('/transactions/withdraw', async (req, res) => {
        try {
            await TransactionController.withdrawAmount(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: `Failed to withdraw`, error: error.message });
        }
    });

  app.use('/api', router);
}