// applicationController.js
import Application from '../models/application.js';
import useraccess from '../utils/useraccess.js';
import FacultyProgram from '../models/facultyprogram.js';
import PaymentType from '../models/paymenttype.js';
import Payment from '../models/payment.js';
import User from '../models/user.js';
import Session from '../models/session.js';
import PaymentGateway from '../services/gateways/paymentGateway.js';
import PaystackGateway from '../services/gateways/paystackGateway.js';
import StripeGateway from '../services/gateways/stripeGateway.js';

export const createApplication = async (req, res) => {
  const { userId, sessionId, programId, entryType } = req.body;
  try {
    const hasAccess = useraccess.userHaveAccess(req.user._id, userId, req.user.role);
    if (!hasAccess) return res.status(400).json({ message: "user access denied" });

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ message: 'Invalid sessionId' });
    }

    const program = await FacultyProgram.findById(programId);
    if (!program) {
      return res.status(400).json({ message: 'Invalid programId' });
    }
    const courseName = program.programName;

    const application = new Application({
      userId,
      sessionId,
      programId,
      entryType,
      courseName
    });

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
    const application = await Application.findById(id)
    .populate('userId', 'firstName middleName lastName username email gender phoneNumber address city localGovernment state dateOfBirth')
    .populate('programId', 'programCourse programName programCode degreeType programDuration departmentId')
    .populate('sessionId', 'sessionName sessionStart sessionEnd sessionDescription');

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

export const reviseUserApplication = async (req, res) => {
  const { id } = req.params;
  const { applicationDetails, userId } = req.body;
  const applicationStatus = "in-review";
  try {
    const checkApplication = await Application.findOne({
      _id: id, userId: userId, applicationStatus: "rejected" 
    });
    if (!checkApplication) {
      return res.status(400).json({ message: 'Application not accessible' });
    }

    const application = await Application.findByIdAndUpdate(id, 
      { applicationDetails, applicationStatus }, { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// admin-only
export const rejectApplication = async (req, res) => {
  const { id } = req.params;
  const { applicationDetails } = req.body;
  const applicationStatus = "rejected";
  try {
    const application = await Application.findByIdAndUpdate(id, 
      { applicationDetails, applicationStatus }, { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// admin-only
export const acceptApplication = async (req, res) => {
  const { id } = req.params;
  const { applicationDetails } = req.body;
  const applicationStatus = "accepted";
  try {
    const application = await Application.findByIdAndUpdate(id, 
      { applicationDetails, applicationStatus }, { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// user update application
export const updateUserApplication = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const updateData = {};

  const checkApplication = await Application.findOne({
    _id: id, userId: userId, applicationStatus: "pending" 
  });
  if (!checkApplication) {
    return res.status(400).json({ message: 'Application not accessible' });
  }

  const program = await FacultyProgram.findById(req?.body?.programId);
  if (program) {
    updateData.programId = program?._id;
    updateData.courseName = program?.programName;
  }

  const entryType = req?.body?.entryType;
  if (entryType) {
    updateData.entryType = entryType;
  }
  
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

// admin-only
export const updateApplication = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  const checkApplication = await Application.findOne({
    _id: id
  });
  if (!checkApplication) {
    return res.status(400).json({ message: 'Application not accessible' });
  }

  const program = await FacultyProgram.findById(req?.body?.programId);
  if (program) {
    updateData.programId = program._id;
    updateData.courseName = program.programName;
  }

  const entryType = req.body.entryType;
  if (entryType) {
    updateData.entryType = entryType;
  }
  
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
  const { userId } = req.body;
  try {
    const checkApplication = await Application.findOne({
      _id: id, userId: userId, applicationStatus: "pending" 
    });
    if (!checkApplication) {
      return res.status(400).json({ message: 'Application not accessible' });
    }
    
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const applicationFeeInit = async (req, res) => {
  const { id } = req.params;
  const { gateway, currency, userId } = req.body;

  try {
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

    res.status(201).json({ paymentType });
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

const acceptanceFeeInit = async (req, res) => {
  const { id } = req.params;
  const { gateway, currency, userId } = req.body;

  try {
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

    res.status(201).json({ paymentType });
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

const generateMatric = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, programId, applicationId, courseName } = req.body;
    
    let paymentData = {};
    const application = await Application.findOne( {_id: id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.applicationStatus !== 'completed') {
      return res.status(400).json({ message: 'Only applications with status completed can make registration payment' });
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
    
    const matricNumber = generateMatricNumber();
    const paymentReference = `PAY${Date.now()}`;
    const paymentLink = `https://paymentgateway.com/pay?reference=${paymentReference}`;

    const payment = new Payment({
        userId,
        amount,
        reference: paymentReference,
        status: 'pending',
    });
    await payment.save();

      let student = await Student.findOne({ userId });
      if (!student) {
          student = new Student({
              userId,
              programId,
              applicationId,
              courseName,
              matricNumber,
              studentStatus: 'pending',
          });
      } else {
          student.matricNumber = matricNumber;
      }
      await student.save();

      res.status(201).json({ paymentLink, matricNumber });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const verifyFirstTuition = async (req, res) => {
// verifyFirstTuition: async (req, res) => {
  try {
      const { paymentReference } = req.body;

      const payment = await Payment.findOne({ reference: paymentReference });
      if (!payment) {
          return res.status(404).json({ message: 'Payment not found' });
      }

      if (payment.status !== 'successful') {
          // Mock payment verification process
          payment.status = 'successful';
          await payment.save();
      }

      const student = await Student.findOne({ userId: payment.userId });
      if (student) {
          student.studentStatus = 'active';
          student.matricNumber = generateMatricNumber();
          await student.save();
      }

      const application = await Application.findOne({ userId: payment.userId });
      if (application) {
          application.status = 'done';
          await application.save();
      }

      res.status(200).json({ message: 'Student verified and matriculated successfully' });
  } catch (error) {
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
  rejectApplication,
  acceptApplication,
  reviseUserApplication,
  updateUserApplication,
  updateApplication,
  applicationFeeInit,
  payForApplication,
  acceptanceFeeInit,
  payForAcceptance,
  verifyApplicationPayment,
  verifyAcceptancePayment,
  generateMatric,
  verifyFirstTuition,
}

export default applicationController