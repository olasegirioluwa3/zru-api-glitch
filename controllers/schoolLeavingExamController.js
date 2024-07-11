// controllers/schoolLeavingExamController.js
import db from '../models/index.js';
const sequelize = db.sequelize;
const SchoolLeavingExam = sequelize.models.SchoolLeavingExam;
const SchoolLeavingExamSubject = sequelize.models.SchoolLeavingExamSubject;
const SchoolLeavingExamGrade = sequelize.models.SchoolLeavingExamGrade;

// Existing functions...

const createSchoolLeavingExam = async (req, res) => {
  try {
    const exam = await SchoolLeavingExam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchoolLeavingExam = async (req, res) => {
  try {
    const exam = await SchoolLeavingExam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSchoolLeavingExam = async (req, res) => {
  try {
    const [updated] = await SchoolLeavingExam.update(req.body, {
      where: { sleId: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    const updatedExam = await SchoolLeavingExam.findByPk(req.params.id);
    res.json(updatedExam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSchoolLeavingExam = async (req, res) => {
  try {
    const deleted = await SchoolLeavingExam.destroy({
      where: { sleId: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchoolLeavingExamGrades = async (req, res) => {
  try {
    const grades = await SchoolLeavingExamGrade.findAll({
      where: { sleId: req.params.id }
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchoolLeavingExamSubjects = async (req, res) => {
  try {
    const subjects = await SchoolLeavingExamSubject.findAll({
      where: { sleId: req.params.id }
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const schoolLeavingExamController = {
    createSchoolLeavingExam,
    getSchoolLeavingExam,
    updateSchoolLeavingExam,
    deleteSchoolLeavingExam,
    getSchoolLeavingExamGrades,
    getSchoolLeavingExamSubjects
};

export default schoolLeavingExamController;