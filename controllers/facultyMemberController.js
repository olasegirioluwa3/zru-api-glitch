import FacultyDepartment from '../models/facultydepartment.js';
import FacultyMember from '../models/facultymember.js';
import User from '../models/user.js';

const addDepartmentMember = async (req, res) => {
  try {
    const { userId, departmentId } = req.body;
    const department = await FacultyDepartment.findById(departmentId);
    if (!department) {
      return res.status(401).json({ message: "Unknown Department" });
    }
    console.log(department);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unknown user" });
    }
    console.log(user);
    
    const memberExist = await FacultyMember.findOne({ userId });
    if (memberExist) {
      return res.status(401).json({ message: "User is already a member" });
    }
    console.log(memberExist);
    
    const facultyMember = new FacultyMember(req.body);
    await facultyMember.save();
    res.status(201).send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getDepartmentMemberById = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).send();
    }
    res.send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateDepartmentMember = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).send();
    }
    Object.keys(req.body).forEach(key => facultyMember[key] = req.body[key]);
    await facultyMember.save();
    res.send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

const removeDepartmentMember = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).send();
    }
    await facultyMember.remove();
    res.send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listAllDepartmentMember = async (req, res) => {
  try {
    const members = await FacultyMember.find({});
    res.send(members);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listMembersForDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const department = await FacultyDepartment.findById(departmentId);
    if (!department) {
      return res.status(401).json({ message: "Unknown department" });
    }
    const members = await FacultyMember.find({ departmentId });
    return res.send(members);
  } catch (error) {
    res.status(400).send(error);
  }
};

const facultyMemberController = {
    addDepartmentMember,
    getDepartmentMemberById,
    updateDepartmentMember,
    removeDepartmentMember,
    listAllDepartmentMember,
    listMembersForDepartment
};

export default facultyMemberController;
