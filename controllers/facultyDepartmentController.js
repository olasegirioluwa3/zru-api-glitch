import FacultyDepartment from '../models/facultydepartment.js'; // Make sure to replace with the correct path to your Department model
import Faculty from '../models/faculty.js';

const createDepartment = async (req, res) => {
  try {
    const department = new FacultyDepartment(req.body);
    await department.save();
    res.status(201).send(department);
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

const getDepartmentById = async (req, res) => {
  try {
    const department = await FacultyDepartment.findById(req.params.id)
    .populate('facultyId', 'facultyName facultyName facultyStatus');
    
    if (!department) {
      return res.status(404).send({ message: 'Department not found' });
    }
    res.send(department);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getActiveDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await FacultyDepartment.findOne({ _id: id, departmentStatus: "active" })
    .populate('facultyId', 'facultyName facultyName facultyStatus');

    if (!department) {
      return res.status(404).send({ message: 'Department not found or not active' });
    }
    res.send(department);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await FacultyDepartment.findById(req.params.id);
    if (!department) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => department[key] = req.body[key]);
    await department.save();
    res.send(department);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await FacultyDepartment.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).send({ message: 'Department not found' });
    }
    res.status(200).send({ message: 'Department deleted successfully', department });
  } catch (error) {
    res.status(400).send({ message: 'Error deleting department', error });
  }
};

const listAllDepartments = async (req, res) => {
  try {
    const departments = await FacultyDepartment.find();
    
    console.log(departments);
    res.send(departments);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listAllActiveDepartments = async (req, res) => {
  try {
    const departments = await FacultyDepartment.find({ departmentStatus: "active" })
    .populate('facultyId', 'facultyName facultyName facultyStatus');
    
    res.send(departments);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listDepartmentsForFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(401).json({ message: "Unknown faculty" });
    }
    const departments = await FacultyDepartment.find({ facultyId })
    .populate('facultyId', 'facultyName facultyName facultyStatus');
    
    return res.status(200).json(departments);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listActiveDepartmentsForActiveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findOne({ _id: facultyId, facultyStatus: "active" });
    
    if (!faculty) {
      return res.status(401).json({ message: "Unknown faculty" });
    }
    
    const departments = await FacultyDepartment.find({ facultyId, departmentStatus: "active" })
    .populate('facultyId', 'facultyName facultyName facultyStatus');
    
    return res.status(200).json(departments);
  } catch (error) {
    res.status(400).send(error);
  }
};

const facultyDepartmentController = {
  createDepartment,
  getDepartmentById,
  getActiveDepartmentById,
  updateDepartment,
  deleteDepartment,
  listAllDepartments,
  listAllActiveDepartments,
  listDepartmentsForFaculty,
  listActiveDepartmentsForActiveFaculty
};

export default facultyDepartmentController;