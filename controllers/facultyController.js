import mongoose from 'mongoose';
import Faculty from '../models/faculty.js'; // Make sure to replace with the correct path to your Faculty model

export const createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).send(faculty);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      const message = `The ${field} '${value}' already exists.`;
      return res.status(400).send({ message });
    }
    res.status(400).send(error);
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).send({ message: 'Faculty not found' });
    }
    res.send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getActiveFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findOne({ _id: id, facultyStatus: "active"});
    if (!faculty) {
      return res.status(401).json({ message: "Unknown Faculty" });
    }
    res.send(faculty);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);
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
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).send({ message: 'Faculty not found' });
    }
    res.status(200).send({ message: 'Faculty deleted successfully', faculty });
  } catch (error) {
    res.status(400).send({ message: 'Error deleting faculty', error });
  }
};

export const listAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.send(faculties);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listAllActiveFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({ facultyStatus: "active"});
    res.send(faculties);
  } catch (error) {
    res.status(400).send(error);
  }
};

const facultyController = {
  createFaculty,
  getFacultyById,
  getActiveFacultyById,
  updateFaculty,
  deleteFaculty,
  listAllFaculties,
  listAllActiveFaculties
};

export default facultyController;
