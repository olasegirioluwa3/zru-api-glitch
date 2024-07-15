import MyCourse from '../models/mycourse.js';

// Create a new MyCourse
const createMyCourse = async (req, res) => {
    try {
        const myCourse = new MyCourse(req.body);
        await myCourse.save();
        res.status(201).json(myCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all MyCourses
const getAllMyCourses = async (req, res) => {
    try {
        const myCourses = await MyCourse.find().populate('courseId').populate('studentId');
        res.status(200).json(myCourses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single MyCourse by ID
const getMyCourseById = async (req, res) => {
    try {
        const myCourse = await MyCourse.findById(req.params.id).populate('courseId').populate('studentId');
        if (!myCourse) {
            return res.status(404).json({ message: 'MyCourse not found' });
        }
        res.status(200).json(myCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a MyCourse by ID
const updateMyCourse = async (req, res) => {
    try {
        const myCourse = await MyCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!myCourse) {
            return res.status(404).json({ message: 'MyCourse not found' });
        }
        res.status(200).json(myCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a MyCourse by ID
const deleteMyCourse = async (req, res) => {
    try {
        const myCourse = await MyCourse.findByIdAndDelete(req.params.id);
        if (!myCourse) {
            return res.status(404).json({ message: 'MyCourse not found' });
        }
        res.status(200).json({ message: 'MyCourse deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const myCourseController = {
    createMyCourse,
    getAllMyCourses,
    getMyCourseById,
    updateMyCourse,
    deleteMyCourse,
};

export default myCourseController;