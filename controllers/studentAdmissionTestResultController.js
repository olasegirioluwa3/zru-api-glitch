// controllers/studentAdmissionTestResultController.js
import db from '../models/index.js';
const StudentAdmissionTestResult = db.sequelize.models.studentadmissiontestresult;

const createStudentAdmissionTestResult = async (req, res) => {
  try {
    const studentAdmissionTestResult = await StudentAdmissionTestResult.create(req.body);
    res.status(201).send(studentAdmissionTestResult);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getStudentAdmissionTestResultById = async (req, res) => {
  try {
    const studentAdmissionTestResult = await StudentAdmissionTestResult.findByPk(req.params.id);
    if (!studentAdmissionTestResult) {
      return res.status(404).send();
    }
    res.send(studentAdmissionTestResult);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateStudentAdmissionTestResult = async (req, res) => {
  try {
    const studentAdmissionTestResult = await StudentAdmissionTestResult.findByPk(req.params.id);
    if (!studentAdmissionTestResult) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => studentAdmissionTestResult[key] = req.body[key]);
    await studentAdmissionTestResult.save();
    res.send(studentAdmissionTestResult);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteStudentAdmissionTestResult = async (req, res) => {
  try {
    const studentAdmissionTestResult = await StudentAdmissionTestResult.findByPk(req.params.id);
    if (!studentAdmissionTestResult) {
      return res.status(404).send();
    }
    await studentAdmissionTestResult.destroy();
    res.send(studentAdmissionTestResult);
  } catch (error) {
    res.status(400).send(error);
  }
};

const studentAdmissionTestResultController = {
  createStudentAdmissionTestResult,
  getStudentAdmissionTestResultById,
  updateStudentAdmissionTestResult,
  deleteStudentAdmissionTestResult
};

export default studentAdmissionTestResultController;