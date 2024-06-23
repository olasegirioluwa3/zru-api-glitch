import { Course } from '../models';

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send();
    }
    res.send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => course[key] = req.body[key]);
    await course.save();
    res.send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).send();
    }
    await course.destroy();
    res.send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listCoursesForProgram = async (req, res) => {
  try {
    const courses = await Course.findAll({ where: { programId: req.params.programId } });
    res.send(courses);
  } catch (error) {
    res.status(400).send(error);
  }
};
