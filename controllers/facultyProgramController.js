import FacultyProgram from '../models/facultyprogram.js'; // Make sure to replace with the correct path to your FacultyProgram model
import FacultyDepartment from '../models/facultydepartment.js';
import Faculty from '../models/Faculty.js';

const createDepartmentProgram = async (req, res) => {
  try {
    const department = await FacultyDepartment.findById(req.body.departmentId);
    if (!department) {
      return res.status(401).json({ message: "Unknown department" });
    }
    const facultyDepartmentProgram = new FacultyProgram(req.body);
    await facultyDepartmentProgram.save();
    return res.status(201).send(facultyDepartmentProgram);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getDepartmentProgramById = async (req, res) => {
  try {
    const departmentProgram = await FacultyProgram.findById(req.params.id);
    if (!departmentProgram) {
      return res.status(404).send();
    }
    return res.status(200).json(departmentProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getActiveDepartmentProgramById = async (req, res) => {
  try {
    const departmentProgram = await FacultyProgram.findOne({ _id: req.params.id, programStatus: "active" });
    if (!departmentProgram) {
      return res.status(404).send();
    }
    return res.status(200).json(departmentProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateDepartmentProgram = async (req, res) => {
  try {
    const departmentProgram = await FacultyProgram.findById(req.params.id);
    if (!departmentProgram) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => departmentProgram[key] = req.body[key]);
    await departmentProgram.save();
    return res.status(200).json(departmentProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteDepartmentProgram = async (req, res) => {
  try {
    const departmentProgram = await FacultyProgram.findByIdAndDelete(req.params.id);
    if (!departmentProgram) {
      return res.status(404).send({ message: 'Program not found' });
    }
    return res.status(200).send({ message: 'Program deleted successfully', departmentProgram });
  } catch (error) {
    res.status(400).send({ message: 'Error deleting program', error });
  }
};

const listAllPrograms = async (req, res) => {
  try {
    const departmentProgram = await FacultyProgram.find({});
    res.send(departmentProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listAllActivePrograms = async (req, res) => {
  try {
    const departmentProgram = await FacultyProgram.find({programStatus: "active"});
    res.send(departmentProgram);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listProgramsForDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const facultyDepartment = await FacultyDepartment.findById(departmentId);
    if (!facultyDepartment) {
      return res.status(401).json({ message: "Unknown Department" });
    }
    const programs = await FacultyProgram.find({ departmentId: req.params.departmentId });
    return res.status(200).json(programs);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listActiveProgramsForActiveDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const facultyDepartment = await FacultyDepartment.findOne({ _id: departmentId, departmentStatus: "active" });
    if (!facultyDepartment) {
      return res.status(401).json({ message: "Unknown Department" });
    }
    const programs = await FacultyProgram.find({ departmentId: departmentId, programStatus: "active" });
    return res.status(200).json(programs);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listProgramsForFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
     console.log(facultyId);
    // Verify the faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Unknown faculty" });
    }

    console.log(faculty);
    // Get departments for the faculty
    const departments = await FacultyDepartment.find({ facultyId: facultyId }).select('_id');
    if (departments.length === 0) {
      return res.status(200).json([]); // No departments, return empty array
    }

    const departmentIds = departments.map(department => department._id);

    // Get programs for the departments
    const programs = await FacultyProgram.find({ departmentId: { $in: departmentIds } });
    return res.status(200).json(programs);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listActiveProgramsForActiveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    // Verify the faculty exists
    const faculty = await Faculty.findOne({_id: facultyId, facultyStatus: "active"});
    if (!faculty) {
      return res.status(404).json({ message: "Unknown faculty" });
    }

    console.log(faculty);
    // Get departments for the faculty
    const departments = await FacultyDepartment.find({ facultyId: facultyId, departmentStatus: "active" }).select('_id');
    if (departments.length === 0) {
      return res.status(200).json([]); // No departments, return empty array
    }

    const departmentIds = departments.map(department => department._id);

    // Get programs for the departments
    const programs = await FacultyProgram.find({ departmentId: { $in: departmentIds }, programStatus: "active" });
    return res.status(200).json(programs);
  } catch (error) {
    res.status(400).send(error);
  }
};

const facultyProgramController = {
    createDepartmentProgram,
    getDepartmentProgramById,
    getActiveDepartmentProgramById,
    updateDepartmentProgram,
    deleteDepartmentProgram,
    listAllPrograms,
    listAllActivePrograms,
    listProgramsForDepartment,
    listActiveProgramsForActiveDepartment,
    listProgramsForFaculty,
    listActiveProgramsForActiveFaculty
};

export default facultyProgramController;