import mongoose from 'mongoose';
import CourseAllocation from '../models/courseallocation.js'; // Make sure to replace with the correct path to your CourseAllocation model
import Course from '../models/course.js';
import FacultyDepartment from '../models/facultydepartment.js';
import FacultyProgram from '../models/facultyprogram.js';

const allocateCourse = async (req, res) => {
  try {
    const { courseId, programId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Unknown course" });
    }

    const department = await FacultyProgram.findById(programId);
    if (!department) {
      return res.status(404).json({ message: "Unknown department" });
    }

    const courseAllocated = await CourseAllocation.findOne({ courseId: courseId, programId: programId });
    if (courseAllocated) {
      return res.status(401).json({ message: "Course already allocated to program" });
    }

    const courseAllocation = new CourseAllocation(req.body);
    await courseAllocation.save();
    res.status(201).send(courseAllocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCourseAllocationById = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.findById(req.params.id);
    if (!courseAllocation) {
      return res.status(404).send();
    }
    res.send(courseAllocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateCourseAllocation = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.findById(req.params.id);
    if (!courseAllocation) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => courseAllocation[key] = req.body[key]);
    await courseAllocation.save();
    res.send(courseAllocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteCourseAllocation = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.findByIdAndDelete(req.params.id);
    if (!courseAllocation) {
      return res.status(404).send({ message: 'CourseAllocation not found' });
    }
    res.status(200).send({ message: 'courseAllocation deleted successfully', courseAllocation });
  } catch (error) {
    res.status(400).send(error);
  }
};

const listCourseAllocationsForProgram = async (req, res) => {
  try {
    const courseAllocations = await CourseAllocation.find({ programId: req.params.programId });
    res.send(courseAllocations);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listCourseAllocationsForActiveProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await FacultyProgram.findOne({ _id: programId, programStatus: "active" });
    if (!program) {
      return res.status(404).send({ message: 'Program not found' });
    }
    const courseAllocations = await CourseAllocation.find({ programId: req.params.programId });
    res.send(courseAllocations);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listCourseAllocations = async (req, res) => {
  try {
    const courseAllocations = await CourseAllocation.find();
    res.send(courseAllocations);
  } catch (error) {
    res.status(400).send(error);
  }
};

const courseAllocationController = {
  allocateCourse,
  getCourseAllocationById,
  updateCourseAllocation,
  deleteCourseAllocation,
  listCourseAllocations,
  listCourseAllocationsForProgram,
  listCourseAllocationsForActiveProgram
};

export default courseAllocationController;
