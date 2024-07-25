import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import encrypt from '../utils/encrypt.js';
import email from '../utils/email.js';

const { generateToken } = encrypt;
const { sendEmail } = email;
import User from "../models/user.js";
import RegCenter from "../models/regcenter.js";


const domain = process.env.APP_WEBSITE_URL || 'localhost:3000';

const register = async (req, res, data) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    // Generate an email verification token
    const token = generateToken();
    data.emailVerificationToken = token;

    // Construct the verification link
    const verifyLink = `${domain}/portal/regcenter/auth/email-verify/${token}`;
    const emailText = `To verify your account email, click on the following link: ${verifyLink}`;

    // Create a new registration center
    const newRegCenter = new RegCenter(data);
    await newRegCenter.save();

    // Send verification email
    await sendEmail(data.email, 'Activate your account', emailText);

    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    // console.error(error);

    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    } else if (error.code === 11000) {
      // Handle duplicate key errors
      return res.status(400).json({ message: 'Email or Business Username already exists' });
    } else if (error.name === 'MongoError') {
      // Handle other MongoDB errors
      return res.status(500).json({ message: 'Database error', details: error.message });
    } else {
      // Handle all other errors
      return res.status(500).json({ message: 'Registration failed, try again', details: error.message });
    }
  }
};

const login = async (req, res, data) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const regCenter = await RegCenter.findOne({ 'email': email });


    if (!regCenter) {
      return res.status(401).json({ message: 'Record not found' });
    } else if (regCenter.emailVerificationStatus !== 'activated') {
      return res.status(401).json({
        message: 'Account not activated! Please, check your email for verification link',
      });
    }

    const passwordMatch = await bcrypt.compare(password, regCenter.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign(
      { id: regCenter.id, role: 'regcenter' },
      process.env.APP_SECRET_KEY,
      { expiresIn: '100h' }
    );

    res.status(200).json({ token, user: { id: regCenter.id, email, role: 'regcenter' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verifyEmail = async (req, res, data) => {
  try {
    const { emailVerificationToken } = data;
    console.log(data);
    const regcenter = await RegCenter.findOneAndUpdate(
      { emailVerificationToken },
      { $set: { emailVerificationToken: "", emailVerificationStatus: "activated" } },
      { new: true }
    );

    if (!regcenter) {
      return res.status(401).json({ message: 'Invalid reset token' });
    }

    const link = `${domain}/login`;
    const emailText = `Account verified successfully, click on the following link to login: ${link}`;

    if (await sendEmail(regcenter.email, 'Account verified successfully', emailText)) {
      await regcenter.save();
      res.status(200).json({
        status: 'success',
        message: 'Account email verified successfully, proceed to login',
        regcenter,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

async function forgotPassword(req, res, data) {
  try {
    const { email } = data;
    const regcenter = await RegCenter.findOne({ email: email });

    if (!regcenter) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const token = generateToken();
    regcenter.resetPasswordToken = token;
    regcenter.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    const resetLink = `${domain}/portal/regcenter/auth/resetpassword/${token}`;
    const emailText = `To reset your password, click on the following link: ${resetLink}`;

    if (await sendEmail(email, 'Password Reset', emailText)) {
      await regcenter.save();
      res.status(200).send({
        status: 'success',
        message: 'Password reset link sent successfully!',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send password reset instructions' });
  }
}

async function verifyAccountEmail(req, res, data) {
  try {
    const { emailVerificationToken } = data;
    const user = await User.findOne({ where: { emailVerificationToken } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid reset token' });
    }

    user.emailVerificationToken = '';
    user.emailVerificationStatus = 'activated';

    const link = `${domain}/portal/regcenter`;
    const emailText = `Account verified successfully, click on the following link to login: ${link}`;

    if (await sendEmail(user.email, 'Account verified successfully', emailText)) {
      await user.save();
      res.status(200).json({
        status: 'success',
        message: 'Account email verified successfully, proceed to login',
        user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}

async function resetPasswordInit(req, res, data) {
  try {
    const { resetPasswordToken } = data;
    console.log(resetPasswordToken);
    const regcenter = await RegCenter.findOne({ resetPasswordToken: resetPasswordToken });

    if (!regcenter) {
      return res.status(401).json({ message: 'Invalid reset token' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Reset Email Token is Valid',
      email: regcenter.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}

async function resetPasswordFinal(req, res, data) {
  try {
    const { resetPasswordToken, password } = data;
    const regcenter = await RegCenter.findOne({ resetPasswordToken });

    if (!regcenter) {
      return res.status(401).json({ message: 'Invalid reset token' });
    }

    if (regcenter.resetPasswordExpires && regcenter.resetPasswordExpires < Date.now()) {
      return res.status(401).json({ message: 'Reset token has expired! Please, try again.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    regcenter.password = hashedPassword;

    regcenter.resetPasswordToken = '';
    regcenter.resetPasswordExpires = '';
    regcenter.emailVerificationToken = '';
    regcenter.emailVerificationStatus = 'activated';

    const link = `${domain}/portal/regcenter`;
    const emailText = `Reset password successfully, click on the following link to login: ${link}`;

    if (await sendEmail(regcenter.email, 'Reset Password Successfully', emailText)) {
      await regcenter.save();
      res.status(200).json({
        status: 'success',
        message: 'Password reset was successful',
        email: regcenter.email,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}

async function resetPassword(req, res) {
  try {
    const userId = req.user._d;
    const { currentPassword, newPassword } = req.body;

    const user = await RegCenter.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}

const listCandidates = async (req, res, data) => {
  try {
    const candidates = await User.findAll({ where: { regCenterId: req.regcenter.id } });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(400).send(error);
  }
};

const viewCandidate = async (req, res, data) => {
  try {
    const candidate = await User.findOne({ where: { id: req.params.id, regCenterId: req.regcenter.id } });
    if (!candidate) {
      return res.status(404).send();
    }
    res.send(candidate);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateCandidate = async (req, res, data) => {
  try {
    const updates = Object.keys(req.body);
    const candidate = await User.findOne({ where: { id: req.params.id, regCenterId: req.regcenter.id } });

    if (!candidate) {
      return res.status(404).send({ message: 'Candidate not found' });
    }

    updates.forEach(update => candidate[update] = req.body[update]);
    await candidate.save();

    res.send(candidate);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listApplications = async (req, res, data) => {
  try {
    const applications = await Application.findAll({ where: { regCenterId: req.regCenter.id } });
    res.send(applications);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateApplication = async (req, res, data) => {
  try {
    const application = await Application.findOne({ where: { id: req.params.id, regCenterId: req.regCenter.id } });

    if (!application || application.isAccepted() || application.isRejected()) {
      return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => application[update] = req.body[update]);
    await application.save();

    res.send(application);
  } catch (error) {
    res.status(400).send(error);
  }
};

const withdraw = async (req, res, data) => {
  try {
    const { amount } = req.body;

    if (req.regCenter.balance < amount) {
      return res.status(400).send({ error: 'Insufficient funds' });
    }

    await Transaction.create({ amount, transactionType: 'debit', regCenterId: req.regCenter.id });
    req.regCenter.balance -= amount;
    await req.regCenter.save();

    res.send({ message: 'Withdrawal successful' });
  } catch (error) {
    res.status(400).send(error);
  }
};

const regCenterController = {
  register,
  login,
  verifyEmail,
  verifyAccountEmail,
  forgotPassword,
  resetPassword,
  resetPasswordInit,
  resetPasswordFinal,
  listCandidates,
  viewCandidate,
  updateCandidate,
  listApplications,
  updateApplication,
  withdraw,
};

export default regCenterController;
