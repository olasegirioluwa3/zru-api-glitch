import { CourseAllocation } from '../models';

export const allocateCourse = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.create(req.body);
    res.status(201).send(courseAllocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getCourseAllocationById = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.findByPk(req.params.id);
    if (!courseAllocation) {
      return res.status(404).send();
    }
    res.send(courseAllocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateCourseAllocation = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.findByPk(req.params.id);
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

export const deleteCourseAllocation = async (req, res) => {
  try {
    const courseAllocation = await CourseAllocation.findByPk(req.params.id);
    if (!courseAllocation) {
      return res.status(404).send();
    }
    await courseAllocation.destroy();
    res.send(courseAllocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listCourseAllocationsForProgram = async (req, res) => {
  try {
    const courseAllocations = await CourseAllocation.findAll({ where: { programId: req.params.programId } });
    res.send(courseAllocations);
  } catch (error) {
    res.status(400).send(error);
  }
};
