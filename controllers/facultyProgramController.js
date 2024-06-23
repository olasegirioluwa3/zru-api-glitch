import { FacultyProgram } from '../models';

export const createFacultyProgram = async (req, res) => {
  try {
    const facultyProgram = await FacultyProgram.create(req.body);
    res.status(201).send(facultyProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getFacultyProgramById = async (req, res) => {
  try {
    const facultyProgram = await FacultyProgram.findByPk(req.params.id);
    if (!facultyProgram) {
      return res.status(404).send();
    }
    res.send(facultyProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateFacultyProgram = async (req, res) => {
  try {
    const facultyProgram = await FacultyProgram.findByPk(req.params.id);
    if (!facultyProgram) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => facultyProgram[key] = req.body[key]);
    await facultyProgram.save();
    res.send(facultyProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteFacultyProgram = async (req, res) => {
  try {
    const facultyProgram = await FacultyProgram.findByPk(req.params.id);
    if (!facultyProgram) {
      return res.status(404).send();
    }
    await facultyProgram.destroy();
    res.send(facultyProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listProgramsForFaculty = async (req, res) => {
  try {
    const programs = await FacultyProgram.findAll({ where: { facultyId: req.params.facultyId } });
    res.send(programs);
  } catch (error) {
    res.status(400).send(error);
  }
};
