import { Faculty } from '../models';

export const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) {
      return res.status(404).send();
    }
    res.send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => faculty[key] = req.body[key]);
    await faculty.save();
    res.send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) {
      return res.status(404).send();
    }
    await faculty.destroy();
    res.send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.findAll();
    res.send(faculties);
  } catch (error) {
    res.status(400).send(error);
  }
};
