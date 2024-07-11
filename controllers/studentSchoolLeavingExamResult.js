// controllers/studentSchoolLeavingExamResultController.js
import db from '../models/index.js';
const sequelize = db.sequelize;
const StudentSchoolLeavingExamResult = sequelize.models.StudentSchoolLeavingExamResult;

const createStudentSchoolLeavingExamResult = async (req, res) => {
  try {
    const result = await StudentSchoolLeavingExamResult.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentSchoolLeavingExamResult = async (req, res) => {
  try {
    const result = await StudentSchoolLeavingExamResult.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudentSchoolLeavingExamResult = async (req, res) => {
  try {
    const [updated] = await StudentSchoolLeavingExamResult.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Result not found' });
    }
    const updatedResult = await StudentSchoolLeavingExamResult.findByPk(req.params.id);
    res.json(updatedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudentSchoolLeavingExamResult = async (req, res) => {
  try {
    const deleted = await StudentSchoolLeavingExamResult.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const studentSchoolLeavingExamResultController = {
    createStudentSchoolLeavingExamResult,
    getStudentSchoolLeavingExamResult,
    updateStudentSchoolLeavingExamResult,
    deleteStudentSchoolLeavingExamResult
};

export default studentSchoolLeavingExamResultController;