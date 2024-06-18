import bcrypt from "bcryptjs";
import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const sequelize = db.sequelize;
const User = sequelize.models.user;
const UserAccess = sequelize.models.useraccess;
const ServiceAccess = sequelize.models.serviceaccess;
import sendEmail from "../utils/email.js";
import generateToken from "../utils/encrypt.js";
const domain = process.env.APP_WEBSITE_URL || "localhost:3000";

async function invite(req, res, data) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).send({ status: "failed", error: 'Unknown user' });
    }

    const serviceaccess = await ServiceAccess.findByPk(data.saId);
    if (!serviceaccess) {
      return res.status(400).send({ status: "failed", error: 'Unknown service access' });
    }

    const useraccess = await UserAccess.findOne({where: {userId: user.id, saId: data.saId, role: "Admin"}})
    if (!useraccess) {
      return res.status(400).send({ status: "failed", error: 'You are not privilegde to invite user' });
    }

    if (!await User.emailExist(data.email)){
      // create an account for the email
      data.password = "&AreYouDoingWell1.";
      const token = generateToken();
      
      const verifyLink = `${domain}/account/email-verify/${token}`;
      const emailText = `To verify your account email, click on the following link: ${verifyLink}, default password: ${data.password}`;
      
      data.emailVerificationToken = token;
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      
      const newUser = new User(data);
      if (await newUser.save(data)) {
        await sendEmail(data.email, "Invitation and Activate your account", emailText);
        data.userId = newUser.id;
        const newUserAccess = new UserAccess(data);
        console.log(data);
        if (await newUserAccess.save(data)) {
          return res.status(201).json({ message: "Registration successful" });
        }
      } else {
        return res.status(401).json({ message: "Registration failed, try again" });
      }
    } else {
      console.log("email already exist, check useraccess");
      const newUser = await User.findOne({where: {email: data.email}});
      if (!newUser) {
        return res.status(400).send({ status: "failed", error: 'You are not privilegde to invite user' });
      }
      const useraccess = await UserAccess.findOne({where: {userId: newUser.id}});
      if (useraccess) {
        return res.status(400).send({ status: "failed", error: 'User Access already have granted' });
      }
      const newAccess = {};
      newAccess.userId = newUser.id;
      newAccess.saId = serviceaccess.id;
      newAccess.inviteBy = user.id;
      newAccess.role = data.role;

      const newUserAccess = new UserAccess(newAccess);
      if (await newUserAccess.save(newAccess)) {
        const verifyLink = `${domain}/auth/login`;
        const emailText = `To accept invite, login by clicking on the following link: ${verifyLink}`;
        await sendEmail(data.email, "Invitation request", emailText);
        return res.status(201).json({ message: "Registration successful" });
      }
    }
    // check if user have admin access to service
    res.status(401).json({ message: "Registration failed after, try again" });
  } catch (error) {
    console.error(error.message);
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      console.log(error);
      res.status(500).json({ message: "Registration failed on C" });
    }
  }
}

async function getAll(req, res, data) {
  try {
    const useraccess = await UserAccess.findAll({where:{userId:data.userId}});
    if (!useraccess){
      return res.status(401).json({ message: 'No User Access was found, try again' });
    } else {
      res.status(201).json({ status: "success", message: "Registration successful", useraccess });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Get UserAccess failed on C" });
  }
}

async function approve(req, res, data) {
  try {
    // Check if user has access
    const userAccess = await UserAccess.findOne({ where: { saId: data.saId, userId: req.user.id } });
    if (!userAccess) {
      return res.status(401).json({ message: 'No User Access was found, please try again' });
    }

    // Update user access status
    userAccess.status = 'Active';
    userAccess.acceptDate = new Date();
    const savedUserAccess = await userAccess.save();

    if (savedUserAccess) {
      return res.status(201).json({ message: 'UserAccess Activated successfully', status: 'success' });
    } else {
      return res.status(401).json({ message: 'UserAccess Activation failed, please try again' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'UserAccess Approve failed on C' });
  }
}


const userAccessController = {
    getAll,
    invite,
    approve
};

export default userAccessController;