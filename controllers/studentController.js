const Student = require('../models/student.js');

// Create a new student
const createStudent = async (req, res) => {
  const { userId, programId, applicationId, courseName, matricNumber, courseLevel, studentStatus } = req.body;

  try {
    const newStudent = new Student({
      userId,
      programId,
      applicationId,
      courseName,
      matricNumber,
      courseLevel,
      studentStatus,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId programId applicationId');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id).populate('userId programId applicationId');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a student by ID
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { courseName, matricNumber, courseLevel, studentStatus } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { courseName, matricNumber, courseLevel, studentStatus },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student by ID
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const studentController = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

export default studentController;