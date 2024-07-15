import StudentResult from '../models/studentresult.js';

// Create a new StudentResult
const createStudentResult = async (req, res) => {
    try {
        const studentResult = new StudentResult(req.body);
        await studentResult.save();
        res.status(201).json(studentResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all StudentResults
const getAllStudentResults = async (req, res) => {
    try {
        const studentResults = await StudentResult.find().populate('mcId').populate('studentId');
        res.status(200).json(studentResults);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single StudentResult by ID
const getStudentResultById = async (req, res) => {
    try {
        const studentResult = await StudentResult.findById(req.params.id).populate('mcId').populate('studentId');
        if (!studentResult) {
            return res.status(404).json({ message: 'StudentResult not found' });
        }
        res.status(200).json(studentResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a StudentResult by ID
const updateStudentResult = async (req, res) => {
    try {
        const studentResult = await StudentResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!studentResult) {
            return res.status(404).json({ message: 'StudentResult not found' });
        }
        res.status(200).json(studentResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a StudentResult by ID
const deleteStudentResult = async (req, res) => {
    try {
        const studentResult = await StudentResult.findByIdAndDelete(req.params.id);
        if (!studentResult) {
            return res.status(404).json({ message: 'StudentResult not found' });
        }
        res.status(200).json({ message: 'StudentResult deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const studentResultController = {
    createStudentResult,
    getAllStudentResults,
    getStudentResultById,
    updateStudentResult,
    deleteStudentResult,
};

export default studentResultController;