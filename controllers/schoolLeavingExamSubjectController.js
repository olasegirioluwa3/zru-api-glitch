// controllers/schoolLeavingExamSubjectController.js
import db from '../models/index.js';
const sequelize = db.sequelize;
const SchoolLeavingExamSubject = sequelize.models.SchoolLeavingExamSubject;

export const createSchoolLeavingExamSubject = async (req, res) => {
  try {
    const subject = await SchoolLeavingExamSubject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchoolLeavingExamSubject = async (req, res) => {
  try {
    const subject = await SchoolLeavingExamSubject.findByPk(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchoolLeavingExamSubject = async (req, res) => {
  try {
    const [updated] = await SchoolLeavingExamSubject.update(req.body, {
      where: { slesId: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    const updatedSubject = await SchoolLeavingExamSubject.findByPk(req.params.id);
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSchoolLeavingExamSubject = async (req, res) => {
  try {
    const deleted = await SchoolLeavingExamSubject.destroy({
      where: { slesId: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const schoolLeavingExamSubjectController = {
    createSchoolLeavingExamSubject,
    getSchoolLeavingExamSubject,
    updateSchoolLeavingExamSubject,
    deleteSchoolLeavingExamSubject
};

export default schoolLeavingExamSubjectController;