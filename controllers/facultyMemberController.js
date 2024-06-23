import { FacultyMember } from '../models';

export const addFacultyMember = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.create(req.body);
    res.status(201).send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getFacultyMemberById = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findByPk(req.params.id);
    if (!facultyMember) {
      return res.status(404).send();
    }
    res.send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateFacultyMember = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findByPk(req.params.id);
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

export const removeFacultyMember = async (req, res) => {
  try {
    const facultyMember = await FacultyMember.findByPk(req.params.id);
    if (!facultyMember) {
      return res.status(404).send();
    }
    await facultyMember.destroy();
    res.send(facultyMember);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listMembersForFaculty = async (req, res) => {
  try {
    const members = await FacultyMember.findAll({ where: { facultyId: req.params.facultyId } });
    res.send(members);
  } catch (error) {
    res.status(400).send(error);
  }
};
