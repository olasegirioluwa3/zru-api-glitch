import Application from '../models/application.js';
import User from '../models/user.js';
import FacultyProgram from '../models/facultyprogram.js';

// Create a new application
const createApplication = async (req, res) => {
  const { userId, programId, courseName, entryType, applicationDetails } = req.body;
  try {
    const user = await User.findById(userId);
    const program = await FacultyProgram.findById(programId);

    if (!user || !program) {
      return res.status(400).json({ message: 'Invalid user or program' });
    }

    const application = new Application({
      userId,
      programId,
      courseName,
      entryType,
      applicationDetails,
      applicationStatus: 'pending',
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific application by ID
const getApplicationById = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('programId', 'programName');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an application status
const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { applicationStatus } = req.body;
  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.applicationStatus = applicationStatus;
    await application.save();
    res.status(200).json({ message: 'Application status updated successfully', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'firstName lastName email')
      .populate('programId', 'programName');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an application
const deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await application.remove();
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const applicationController = {
  createApplication,
  getApplicationById,
  updateApplicationStatus,
  getAllApplications,
  deleteApplication
};

export default applicationController;