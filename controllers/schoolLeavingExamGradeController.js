// controllers/schoolLeavingExamGradeController.js
import db from '../models/index.js';
const sequelize = db.sequelize;
const SchoolLeavingExamGrade = sequelize.models.SchoolLeavingExamGrade;

const createSchoolLeavingExamGrade = async (req, res) => {
  try {
    const grade = await SchoolLeavingExamGrade.create(req.body);
    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchoolLeavingExamGrade = async (req, res) => {
  try {
    const grade = await SchoolLeavingExamGrade.findByPk(req.params.id);
    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSchoolLeavingExamGrade = async (req, res) => {
  try {
    const [updated] = await SchoolLeavingExamGrade.update(req.body, {
      where: { slegId: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    const updatedGrade = await SchoolLeavingExamGrade.findByPk(req.params.id);
    res.json(updatedGrade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSchoolLeavingExamGrade = async (req, res) => {
  try {
    const deleted = await SchoolLeavingExamGrade.destroy({
      where: { slegId: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const schoolLeavingExamGradeController = {
    createSchoolLeavingExamGrade,
    getSchoolLeavingExamGrade,
    updateSchoolLeavingExamGrade,
    deleteSchoolLeavingExamGrade,
};

export default schoolLeavingExamGradeController;