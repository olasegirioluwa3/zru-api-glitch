import email from "../utils/email.js";
const { sendEmail } = email;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js"; // Adjust path based on your project structure
import RegCenter from "../models/regcenter.js"; // Adjust path based on your project structure
import validateUserData from "../middlewares/validator/userValidator.js";
import dotenv from "dotenv";
dotenv.config();

const domain = process.env.APP_WEBSITE_URL || "localhost:3000";

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

async function registerUser(req, res, data) {
  try {
    if (data.centerSlug && data.centerSlug !== '') {
      const regcenter = await RegCenter.findOne({ centerSlug: data.centerSlug });
      if (!regcenter) {
        return res.status(401).json({ message: "Registration Center looks invalid, try again" });
      } else {
        data.regCenterId = regcenter._id;
      }
    }
    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash password with a cost factor of 10
    data.password = hashedPassword;
    const token = generateToken();
    data.emailVerificationToken = token;

    const verifyLink = `${domain}/account/email-verify/${token}`;
    const emailText = `To verify your account email, click on the following link: ${verifyLink}`;

    const newUser = new User(data);
    await newUser.save();

    await sendEmail(data.email, "Activate your account", emailText);

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error.message);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email or Username already exists" });
    } else {
      res.status(500).json({ message: "Registration failed", error: error });
    }
  }
}

async function loginUser(req, res, data) {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Record not found" });
    } else if (user.emailVerificationStatus !== "activated") {
      return res.status(401).json({
        message: "Account not activated! Please, check your email for verification link",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.APP_SECRET_KEY,
      { expiresIn: "100h" }
    );

    res.status(200).json({ token, user: { id: user._id, email, role: "user" } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getMyProfile(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, bio } = req.body;

    const user = await User.findByIdAndUpdate(userId, { firstName, lastName, bio });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

async function updateProfilePicture(req, res) {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No profile picture uploaded" });
    }

    const user = await User.findByIdAndUpdate(userId, { profilePicture: req.file.path });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
}

async function updateCoverPicture(req, res) {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No cover picture uploaded" });
    }

    const user = await User.findByIdAndUpdate(userId, { coverPicture: req.file.path });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Cover picture updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update cover picture" });
  }
}

async function getUserByUsername(req, res) {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
}

async function forgotPassword(req, res, data) {
  try {
    const { email } = data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    const resetLink = `${domain}/account/new-password/${token}`;
    const emailText = `To reset your password, click on the following link: ${resetLink}`;

    await user.save();

    await sendEmail(email, "Password Reset", emailText);

    res.status(200).send({
      status: "success",
      message: "Password reset link sent successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send password reset instructions" });
  }
}

async function verifyAccountEmail(req, res, data) {
  try {
    const { emailVerificationToken } = data;
    const user = await User.findOneAndUpdate(
      { emailVerificationToken },
      { $set: { emailVerificationToken: "", emailVerificationStatus: "activated" } },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid reset token" });
    }

    const link = `${domain}/login`;
    const emailText = `Account verified successfully, click on the following link to login: ${link}`;

    await sendEmail(user.email, "Account verified successfully", emailText);

    res.status(200).json({
      status: "success",
      message: "Account email verified successfully, proceed to login",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

async function resetPasswordInit(req, res, data) {
  try {
    const { resetPasswordToken } = data;
    const user = await User.findOne({ resetPasswordToken });

    if (!user) {
      return res.status(401).json({ message: "Invalid reset token" });
    }

    res.status(200).json({
      status: "success",
      message: "Reset Email Token is Valid",
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

async function resetPasswordFinal(req, res, data) {
  try {
    const { resetPasswordToken, password } = data;
    const user = await User.findOne({ resetPasswordToken });

    if (!user) {
      return res.status(401).json({ message: "Invalid reset token" });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res
        .status(401)
        .json({ message: "Reset token has expired! Please, try again." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = "";
    user.emailVerificationToken = "";
    user.emailVerificationStatus = "activated";

    const link = `${domain}/account/signin`;
    const emailText = `Reset password successfully, click on the following link to login: ${link}`;

    await sendEmail(user.email, "Reset Password Successfully", emailText);

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset was successful",
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

async function resetPassword(req, res) {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
}

async function verifyResetToken(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    const issuedAt = decodedToken.iat;
    const expirationTime = 60 * 60 * 24; // 24 hours in seconds
    const isExpired = Date.now() / 1000 > issuedAt + expirationTime;

    if (isExpired) {
      return false;
    }

    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

const userController = {
  registerUser,
  loginUser,
  getProfile,
  getMyProfile,
  updateProfile,
  updateProfilePicture,
  updateCoverPicture,
  getUserByUsername,
  forgotPassword,
  verifyAccountEmail,
  resetPasswordInit,
  resetPasswordFinal,
  resetPassword,
  verifyResetToken,
};

export default userController;
