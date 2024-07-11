import PaymentType from '../models/paymenttype.js';
import FacultyProgram from '../models/facultyprogram.js';

// Create a new payment type
const createPaymentType = async (req, res) => {
  const { programId, ptPurpose, ptAmount, ptDefaultCurrency, ptAmountInternationalStudent, ptDefaultCurrencyInternationalStudent, ptStatus, courseLevel, courseSemester, ptDetails } = req.body;
  try {
    const program = await FacultyProgram.findById(programId);

    if (!program) {
      return res.status(400).json({ message: 'Invalid program' });
    }

    const paymentType = new PaymentType({
      programId,
      ptPurpose,
      ptAmount,
      ptDefaultCurrency,
      ptAmountInternationalStudent,
      ptDefaultCurrencyInternationalStudent,
      ptStatus,
      courseLevel,
      courseSemester,
      ptDetails,
    });

    await paymentType.save();
    res.status(201).json({ message: 'Payment type created successfully', paymentType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payment types
const getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.find()
      .populate('programId', 'programName');
    res.status(200).json(paymentTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all active payment types
const getActivePaymentTypes = async (req, res) => {
    try {
      const paymentTypes = await PaymentType.find({ ptStatus: 'active' });
      res.status(200).json(paymentTypes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Get a specific payment type by ID
const getPaymentTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentType = await PaymentType.findById(id)
      .populate('programId', 'programName');
    if (!paymentType) {
      return res.status(404).json({ message: 'Payment type not found' });
    }
    res.status(200).json(paymentType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific payment type by ID
const getActivePaymentTypeById = async (req, res) => {
    const { id } = req.params;
    try {
      const paymentType = await PaymentType.findOne({ _id: id, ptStatus: 'active' })
        .populate('programId', 'programName');
      if (!paymentType) {
        return res.status(404).json({ message: 'Payment type not found' });
      }
      res.status(200).json(paymentType);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Update a payment type
const updatePaymentType = async (req, res) => {
  const { id } = req.params;
  const { programId, ptPurpose, ptAmount, ptDefaultCurrency, ptAmountInternationalStudent, ptDefaultCurrencyInternationalStudent, ptStatus, courseLevel, courseSemester, ptDetails } = req.body;
  try {
    const paymentType = await PaymentType.findById(id);
    if (!paymentType) {
      return res.status(404).json({ message: 'Payment type not found' });
    }

    paymentType.programId = programId || paymentType.programId;
    paymentType.ptPurpose = ptPurpose || paymentType.ptPurpose;
    paymentType.ptAmount = ptAmount || paymentType.ptAmount;
    paymentType.ptDefaultCurrency = ptDefaultCurrency || paymentType.ptDefaultCurrency;
    paymentType.ptAmountInternationalStudent = ptAmountInternationalStudent || paymentType.ptAmountInternationalStudent;
    paymentType.ptDefaultCurrencyInternationalStudent = ptDefaultCurrencyInternationalStudent || paymentType.ptDefaultCurrencyInternationalStudent;
    paymentType.ptStatus = ptStatus || paymentType.ptStatus;
    paymentType.courseLevel = courseLevel || paymentType.courseLevel;
    paymentType.courseSemester = courseSemester || paymentType.courseSemester;
    paymentType.ptDetails = ptDetails || paymentType.ptDetails;

    await paymentType.save();
    res.status(200).json({ message: 'Payment type updated successfully', paymentType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a payment type
const deletePaymentType = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentType = await PaymentType.findByIdAndDelete(id);
    if (!paymentType) {
      return res.status(404).json({ message: 'Payment type not found' });
    }
    return res.status(200).json({ message: 'Payment type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const paymentTypeController = {
    createPaymentType,
    getPaymentTypeById,
    getActivePaymentTypeById,
    getAllPaymentTypes,
    updatePaymentType,
    deletePaymentType,
    getActivePaymentTypes,
};
  
export default paymentTypeController;  