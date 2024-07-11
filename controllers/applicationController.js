// applicationController.js
import Application from '../models/application.js';
import useraccess from '../utils/userAccess.js';
import FacultyProgram from '../models/facultyprogram.js';
import PaymentType from '../models/paymenttype.js';
import Payment from '../models/payment.js';
import User from '../models/user.js';
import PaymentGateway from '../services/gateways/paymentGateway.js';
import PaystackGateway from '../services/gateways/paystackGateway.js';
import StripeGateway from '../services/gateways/stripeGateway.js';

export const createApplication = async (req, res) => {
  const { userId, programId, entryType } = req.body;
  try {
    const application = new Application({
      userId,
      programId,
      entryType
    });

    const hasAccess = useraccess.userHaveAccess(req.user._id, userId, req.user.role);
    if (!hasAccess) return res.status(400).json({ message: "user access denied" });

    const program = await FacultyProgram.findById(programId);
    if (!program) {
      return res.status(400).json({ message: 'Invalid programId' });
    }
    application.courseName = program.programName;

    const savedApplication = await application.save();
    res.status(201).json({ message: 'Application submitted successfully', savedApplication });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('userId', 'firstName lastName email');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id).populate('userId', 'firstName lastName email');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { applicationStatus } = req.body;
  try {
    const application = await Application.findByIdAndUpdate(id, 
      {applicationStatus}, { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserApplication = async (req, res) => {
  const { id } = req.params;
  const { userId, programId } = req.body;
  const updateData = req.body;

  const checkApplication = await Application.findOne({ _id: id, userId: userId, applicationStatus: "pending" });
  if (!checkApplication) {
    return res.status(400).json({ message: 'Application not accessible' });
  }

  const program = await FacultyProgram.findById(programId);
  if (!program) {
    return res.status(400).json({ message: 'Invalid programId' });
  }
  updateData.courseName = program.programName;
  
  try {
    const application = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplicationsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const applications = await Application.find({ userId }).populate('userId', 'firstName lastName email');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Controllers

export const createUserApplication = async (req, res) => {
  const { programId, courseName, entryType, applicationDetails, applicationStatus } = req.body;
  try {
    const application = new Application({
      userId: req.user._id,
      programId,
      courseName,
      entryType,
      applicationDetails,
      applicationStatus
    });
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const hasAccess = useraccess.userHaveAccess(req.user._id, userId, req.user.role);
    if (!hasAccess) return res.status(400).json({ message: "user access denied" });

    const applications = await Application.find({ userId: userId }).populate('userId', 'firstName lastName email');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id).populate('userId', 'firstName lastName email');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplicationProgram = async (req, res) => {
  const { id } = req.params;
  const { applicationDetails, programId} = req.body;
  try {
    const program = await FacultyProgram.findById(programId);
    if (!program) {
      return res.status(400).json({ message: 'Invalid programId' });
    }
    const courseName = program.programName;
    
    const application = await Application.findOneAndUpdate(
      { _id: id },
      { programId, courseName, applicationDetails },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUserApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const payForApplication = async (req, res) => {
  const { id } = req.params;
  const { gateway, currency, userId } = req.body;

  try {
    let paymentData = {};
    const application = await Application.findOne( {_id: id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.applicationStatus !== 'pending') {
      return res.status(400).json({ message: 'Only applications with status pending can make registration payment' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'unknown user' });
    }

    const paymentType = await PaymentType.findOne({ ptPurpose: 'application', programId: application.programId, ptStatus: "active" });
    if (!paymentType) {
      return res.status(400).json({ message: `Registration fee is not available for ${application.courseName}, please, contact your admin` });
    }

    const amount = parseInt(paymentType.ptAmount, 10);
    const fullName = `${user.firstName} ${user.lastName}`;

    // initiate payment
    paymentData.email = user.email;
    paymentData.full_name = fullName;

    // get cost info of the service
    paymentData.gateway = gateway;
    paymentData.currency = currency;

    // Calculate price and paymentNextDate
    let price = parseInt(amount, 10);

    let paymentGateway = PaymentGateway;
    let finalAmount;

    if (paymentData.gateway === 'paystack') {
      paymentGateway = new PaystackGateway();
      const decimalFee = 1.95 / 100.0;
      const flatFee = (parseInt(price, 10) * (1.5 / 100)) + 100;
      const capFee = 2000.0;
      const applicableFees = (parseInt(decimalFee, 10) * parseInt(price, 10)) + parseInt(flatFee, 10);
      finalAmount = applicableFees >= capFee ? parseInt(price, 10) + parseInt(capFee, 10) : ((parseInt(price, 10) + parseInt(flatFee, 10)) / (1 - parseInt(decimalFee, 10))) + 0.01;
    } else if (paymentData.gateway === 'stripe') {
      paymentGateway = new StripeGateway();
    } else {
      return res.status(400).send({ status: 'failed', error: 'Invalid payment gateway' });
    }

    paymentData.amount = parseInt(finalAmount, 10);
    const callbackUrl = `${process.env.APP_WEBSITE_URL}/applications/payment/application/verify`;
    const paymentDetails = await paymentGateway.initiatePayment(paymentData.amount, paymentData.currency, paymentData, callbackUrl);
    let paymentdetails = paymentDetails.data;
    paymentData = {
      userId: userId,
      paymentTypeId: paymentType._id,
      paymentFor: 'application',
      paymentForId: id,
      amount,
      amountPaid: 0,
      gateway,
      currency,
      amountRemaining: amount,
      paymentStatus: 'pending',
      paymentFullfilled: 'no',
      paymentReference: paymentDetails.data.reference,
      paymentLink: paymentDetails.data.authorization_url,
    };

    const payment = new Payment(paymentData);
    await payment.save();

    res.status(201).json({ payment, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const payForAcceptance = async (req, res) => {
  const { id } = req.params;
  const { gateway, currency, userId } = req.body;

  try {
    let paymentData = {};
    const application = await Application.findOne( {_id: id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.applicationStatus !== 'accepted') {
      return res.status(400).json({ message: 'Only applications with status accepted can pay acceptance fee' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'unknown user' });
    }

    const paymentType = await PaymentType.findOne({ ptPurpose: 'acceptance', programId: application.programId, ptStatus: "active" });
    if (!paymentType) {
      return res.status(400).json({ message: `Acceptance fee is not available for ${application.courseName}, please, contact your admin` });
    }

    const amount = parseInt(paymentType.ptAmount, 10);
    const fullName = `${user.firstName} ${user.lastName}`;

    // initiate payment
    paymentData.email = user.email;
    paymentData.full_name = fullName;

    // get cost info of the service
    paymentData.gateway = gateway;
    paymentData.currency = currency;

    // Calculate price and paymentNextDate
    let price = parseInt(amount, 10);

    let paymentGateway = PaymentGateway;
    let finalAmount;

    if (paymentData.gateway === 'paystack') {
      paymentGateway = new PaystackGateway();
      const decimalFee = 1.95 / 100.0;
      const flatFee = (parseInt(price, 10) * (1.5 / 100)) + 100;
      const capFee = 2000.0;
      const applicableFees = (parseInt(decimalFee, 10) * parseInt(price, 10)) + parseInt(flatFee, 10);
      finalAmount = applicableFees >= capFee ? parseInt(price, 10) + parseInt(capFee, 10) : ((parseInt(price, 10) + parseInt(flatFee, 10)) / (1 - parseInt(decimalFee, 10))) + 0.01;
    } else if (paymentData.gateway === 'stripe') {
      paymentGateway = new StripeGateway();
    } else {
      return res.status(400).send({ status: 'failed', error: 'Invalid payment gateway' });
    }

    paymentData.amount = parseInt(finalAmount, 10);
    const callbackUrl = `${process.env.APP_WEBSITE_URL}/api/user/applications/payment/acceptance/verify`;
    const paymentDetails = await paymentGateway.initiatePayment(paymentData.amount, paymentData.currency, paymentData, callbackUrl);
    let paymentdetails = paymentDetails.data;
    paymentData = {
      userId: userId,
      paymentTypeId: paymentType._id,
      paymentFor: 'application',
      paymentForId: id,
      amount,
      amountPaid: 0,
      gateway,
      currency,
      amountRemaining: amount,
      paymentStatus: 'pending',
      paymentFullfilled: 'no',
      paymentReference: paymentDetails.data.reference,
      paymentLink: paymentDetails.data.authorization_url,
    };

    const payment = new Payment(paymentData);
    await payment.save();

    res.status(201).json({ payment, paymentdetails, paymentUrl: paymentdetails.authorization_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyApplicationPayment = async (req, res) => {
  const { reference } = req.query;

  try {
    const payment = await Payment.findOne({ paymentReference: reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    let paymentDetails;
    
    let paymentGateway = PaymentGateway;
    if (payment.gateway === 'paystack') {
      paymentGateway = new PaystackGateway();
    } else if (payment.gateway === 'stripe') {
      paymentGateway = new StripeGateway();
    } else {
      return res.status(400).json({ message: 'Invalid payment gateway' });
    }
    paymentDetails = await paymentGateway.verifyPayment(reference);

    if (paymentDetails.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    payment.paymentStatus = 'completed';
    payment.paymentFullfilled = 'yes';
    payment.amountPaid = paymentDetails.data.amount;
    payment.amountRemaining = payment.amount - payment.amountPaid;

    await payment.save();

    const application = await Application.findById(payment.paymentForId);
    if (application.applicationStatus === 'pending') {
      application.applicationStatus = 'in-review';
      await application.save();
    } else {
      return res.status(400).json({ message: 'Application Fee Payment already verified' });
    }

    res.status(200).json({ message: 'Payment verified successfully', payment, application });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const verifyAcceptancePayment = async (req, res) => {
  const { reference } = req.query;

  try {
    const payment = await Payment.findOne({ paymentReference: reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    let paymentDetails;
    
    let paymentGateway = PaymentGateway;
    if (payment.gateway === 'paystack') {
      paymentGateway = new PaystackGateway();
    } else if (payment.gateway === 'stripe') {
      paymentGateway = new StripeGateway();
    } else {
      return res.status(400).json({ message: 'Invalid payment gateway' });
    }
    paymentDetails = await paymentGateway.verifyPayment(reference);
    console.log(paymentDetails);

    if (paymentDetails.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    payment.paymentStatus = 'completed';
    payment.paymentFullfilled = 'yes';
    payment.amountPaid = paymentDetails.data.amount;
    payment.amountRemaining = payment.amount - payment.amountPaid;

    await payment.save();

    const application = await Application.findById(payment.paymentForId);
    if (application.applicationStatus === 'accepted') {
      application.applicationStatus = 'completed';
      await application.save();
    } else {
      return res.status(400).json({ message: 'Acceptance Fee Payment already verified' });
    }
    res.status(200).json({ message: 'Payment verified successfully', payment, application });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const applicationController = {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplication,
  deleteUserApplication,
  getUserApplicationById,
  getApplicationsByUserId,
  updateApplicationStatus,
  updateApplicationProgram,
  updateUserApplication,
  payForApplication,
  payForAcceptance,
  verifyApplicationPayment,
  verifyAcceptancePayment
}

export default applicationController