// controllers/admissionTestController.js
import db from '../models/index.js';
const AdmissionTest = db.sequelize.models.admissiontest;

const createAdmissionTest = async (req, res) => {
  try {
    const admissionTest = await AdmissionTest.create(req.body);
    res.status(201).send(admissionTest);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAdmissionTestById = async (req, res) => {
  try {
    const admissionTest = await AdmissionTest.findByPk(req.params.id, {
      include: [{ model: db.sequelize.models.admissiontestsubject }]
    });
    if (!admissionTest) {
      return res.status(404).send();
    }
    res.send(admissionTest);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateAdmissionTest = async (req, res) => {
  try {
    const admissionTest = await AdmissionTest.findByPk(req.params.id);
    if (!admissionTest) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => admissionTest[key] = req.body[key]);
    await admissionTest.save();
    res.send(admissionTest);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAdmissionTest = async (req, res) => {
  try {
    const admissionTest = await AdmissionTest.findByPk(req.params.id);
    if (!admissionTest) {
      return res.status(404).send();
    }
    await admissionTest.destroy();
    res.send(admissionTest);
  } catch (error) {
    res.status(400).send(error);
  }
};


const admissionTestController = {
    createAdmissionTest,
    getAdmissionTestById,
    updateAdmissionTest,
    deleteAdmissionTest
};

export default admissionTestController;