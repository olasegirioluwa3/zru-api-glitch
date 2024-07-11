// controllers/admissionTestSubjectController.js
import db from '../models/index.js';
const AdmissionTestSubject = db.sequelize.models.admissiontestsubject;

const createAdmissionTestSubject = async (req, res) => {
  try {
    const admissionTestSubject = await AdmissionTestSubject.create(req.body);
    res.status(201).send(admissionTestSubject);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAdmissionTestSubjectById = async (req, res) => {
  try {
    const admissionTestSubject = await AdmissionTestSubject.findByPk(req.params.id);
    if (!admissionTestSubject) {
      return res.status(404).send();
    }
    res.send(admissionTestSubject);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAdmissionTestSubject = async (req, res) => {
  try {
    const admissionTestSubject = await AdmissionTestSubject.findByPk(req.params.id);
    if (!admissionTestSubject) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => admissionTestSubject[key] = req.body[key]);
    await admissionTestSubject.save();
    res.send(admissionTestSubject);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAdmissionTestSubject = async (req, res) => {
  try {
    const admissionTestSubject = await AdmissionTestSubject.findByPk(req.params.id);
    if (!admissionTestSubject) {
      return res.status(404).send();
    }
    await admissionTestSubject.destroy();
    res.send(admissionTestSubject);
  } catch (error) {
    res.status(400).send(error);
  }
};

const admissionTestSubjectController = {
    createAdmissionTestSubject,
    getAdmissionTestSubjectById,
    updateAdmissionTestSubject,
    deleteAdmissionTestSubject
};

export default admissionTestSubjectController;