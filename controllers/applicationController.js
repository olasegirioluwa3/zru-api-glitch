import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const sequelize = db.sequelize;
const User = sequelize.models.user;
const Application = sequelize.models.application;
import email from "../utils/email.js";
const { sendEmail } = email;
const domain = process.env.APP_WEBSITE_URL || "localhost:3000";

const register = async (req, res, data) => {
  try {
    const newAplication = new Application(data);
    if (await newAplication.save(data)) {
      res.status(201).json({ message: "Application started successfully, please, continue." });
    } else {
      res.status(401).json({ message: "Registration failed, try again" });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ message: "Application already exists" });
    } else {
      res.status(500).json({ message: "Registration failed on C" });
    }
  }
};

const regCenterController = {
  register
};

export default regCenterController;
