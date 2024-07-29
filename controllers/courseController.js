import Course from '../models/course.js'; // Make sure to replace with the correct path to your Course model
import FacultyProgram from '../models/facultyprogram.js'; // Make sure to replace with the correct path to your FacultyProgram model

const createCourse = async (req, res) => {
  try {
    const { programId, courseCode } = req.body;
    const program = await FacultyProgram.findById(programId);
    if (!program) {
      return res.status(401).json({ message: "Unknown program" });
    }
    const courseExist = await Course.findOne({ courseCode, programId });
    if (courseExist) {
      return res.status(401).json({ message: "Course with the course code already created for the program" });
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    .populate('programId', 'programName programCode programCourse degreeType programDuration graduationRequirements programStatus');
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }
    res.send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getActiveCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id, courseStatus: "active" })
    .populate('programId', 'programName programCode programCourse degreeType programDuration graduationRequirements programStatus');
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }
    res.send(course);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
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

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send({ message: 'Course not found' });
    }
    return res.status(200).send({ message: 'Course deleted successfully', course });
  } catch (error) {
    res.status(400).send(error);
  }
};

const listCoursesForProgram = async (req, res) => {
  try {
    const courses = await Course.find({ programId: req.params.programId })
    .populate('programId', 'programName programCode programCourse degreeType programDuration graduationRequirements programStatus');
    res.send(courses);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listActiveCoursesForProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const departmentProgram = await FacultyProgram.find({ _id: programId, programStatus: "active" });
    if (!departmentProgram) {
      return res.status(404).send({ message: 'Program not found' });
    }
    const courses = await Course.find({ programId: programId, courseStatus: "active" })
    .populate('programId', 'programName programCode programCourse degreeType programDuration graduationRequirements programStatus');
    res.send(courses);
  } catch (error) {
    res.status(400).send(error);
  }
};

const courseController = {
  createCourse,
  getCourseById,
  getActiveCourseById,
  updateCourse,
  deleteCourse,
  listCoursesForProgram,
  listActiveCoursesForProgram
};

export default courseController;
