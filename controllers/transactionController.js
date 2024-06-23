// controllers/transactionController.js
import { Transaction, RegCenter } from '../models';

const TransactionController = {
  async createTransaction(req, res) {
    const { amount, transactionType, regCenterId, applicationId } = req.body;

    try {
      if (transactionType === 'credit' && applicationId) {
        // Check if the application has already been credited
        const existingTransaction = await Transaction.findOne({ where: { applicationId } });
        if (existingTransaction) {
          return res.status(400).json({ error: 'This application has already been credited.' });
        }
      }

      const transaction = await Transaction.create({
        amount,
        transactionType,
        regCenterId,
        applicationId,
      });

      return res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Failed to create transaction' });
    }
  },

  async withdrawAmount(req, res) {
    const { regCenterId, amount } = req.body;

    try {
      const regCenter = await RegCenter.findByPk(regCenterId);
      if (!regCenter) {
        return res.status(404).json({ error: 'RegCenter not found' });
      }

      // Create a debit transaction
      const transaction = await Transaction.create({
        amount,
        transactionType: 'debit',
        regCenterId,
      });

      return res.status(201).json(transaction);
    } catch (error) {
      console.error('Error withdrawing amount:', error);
      return res.status(500).json({ error: 'Failed to withdraw amount' });
    }
  },
};

export default TransactionController;
