import Payment from '../models/payment.js';
import PaymentType from '../models/paymenttype.js';
import User from '../models/user.js';
import useraccess from '../utils/useraccess.js';

// Create a new payment
const createPayment = async (req, res) => {
    const {
        userId,
        paymentTypeId,
        paymentFor,
        paymentForId,
        amount,
        amountPaid,
        amountRemaining,
        paymentStatus,
        paymentFullfilled,
        paymentReference,
        paymentDate,
        gateway,
        currency,
        paymentDueDate,
        paymentNextDate,
        quantity
    } = req.body;
  
    try {
        // Check user access
        const hasAccess = useraccess.userHaveAccess(req.user._id, userId, req.user.role);
        if (!hasAccess) return res.status(400).json({ message: "user access denied" });
        
        const payment = new Payment({
            userId,
            paymentTypeId,
            paymentFor,
            paymentForId,
            amount,
            amountPaid,
            amountRemaining,
            paymentStatus,
            paymentFullfilled,
            paymentReference,
            paymentDate,
            gateway,
            currency,
            paymentDueDate,
            paymentNextDate,
            quantity
        });

        const user = await User.findOne({ _id: userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const paymentType = await PaymentType.findOne({ _id: paymentTypeId});
        if (!paymentType) {
            return res.status(404).json({ message: 'Payment type not found' });
        }

        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'firstName lastName email')
      .populate('paymentTypeId', 'ptPurpose ptAmount');

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the payment by ID
        const checkpayment = await Payment.findById(id);

        // Check user access
        const hasAccess = useraccess.userHaveAccess(req.user._id, checkpayment.userId, req.user.role);
        if (!hasAccess) return res.status(400).json({ message: "user access denied" });

        // Populate user and payment type information
        const payment = await Payment.findById(id)
            .populate('userId', 'firstName lastName email')
            .populate('paymentTypeId', 'ptPurpose ptAmount');
        
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a specific payment
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Check user access
        const checkpayment = await Payment.findById( id );
        const hasAccess = useraccess.userHaveAccess(req.user._id, checkpayment.userId, req.user.role);
        if (!hasAccess) return res.status(400).json({ message: "user access denied" });
        
        const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment updated successfully', payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a specific payment
const deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const checkpayment = await Payment.findById( id );
    const hasAccess = useraccess.userHaveAccess(req.user._id, checkpayment.userId, req.user.role);
    if (!hasAccess) return res.status(400).json({ message: "user access denied" });
    
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payments by user ID
const getPaymentsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check user access
    const hasAccess = useraccess.userHaveAccess(req.user._id, userId, req.user.role);
    if (!hasAccess) return res.status(400).json({ message: "user access denied" });

    const payments = await Payment.find({ userId })
      .populate('userId', 'firstName lastName email')
      .populate('paymentTypeId', 'ptPurpose ptAmount');
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payments for a specific payment type
const getPaymentsByPaymentTypeId = async (req, res) => {
    const { paymentTypeId } = req.params;
    try {
        const payments = await Payment.find({ paymentTypeId })
            .populate('userId', 'firstName lastName email')
            .populate('paymentTypeId', 'ptPurpose ptAmount');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
// Get all pending payments
const getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ paymentStatus: 'pending' })
            .populate('userId', 'firstName lastName email')
            .populate('paymentTypeId', 'ptPurpose ptAmount');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all completed payments
const getCompletedPayments = async (req, res) => {
    try {
      const payments = await Payment.find({ paymentStatus: 'completed' })
        .populate('userId', 'firstName lastName email')
        .populate('paymentTypeId', 'ptPurpose ptAmount');
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
// Get payments for a specific user and payment type
const getPaymentsByUserIdAndPaymentTypeId = async (req, res) => {
    const { userId, paymentTypeId } = req.params;
    try {
        // Check user access
        console.log(req.user._id+' '+userId)
        const hasAccess = useraccess.userHaveAccess(req.user._id, userId, req.user.role);
        if (!hasAccess) return res.status(400).json({ message: "user access denied" });

        const payments = await Payment.find({ userId, paymentTypeId })
            .populate('userId', 'firstName lastName email')
            .populate('paymentTypeId', 'ptPurpose ptAmount');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const paymentController = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    getPaymentsByUserId,
    getPaymentsByPaymentTypeId,
    getPendingPayments,
    getCompletedPayments,
    getPaymentsByUserIdAndPaymentTypeId,
};

export default paymentController;