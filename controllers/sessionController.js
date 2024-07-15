import { connect } from 'mongoose';

import Session from '../models/session.js';

// Create a new session
const createSession = async (req, res) => {
  const { sessionName, sessionStart, sessionEnd, sessionDescription, sessionStatus } = req.body;

  try {
    const newSession = new Session({
      sessionName,
      sessionStart,
      sessionEnd,
      sessionDescription,
      sessionStatus,
    });

    await newSession.save();
    res.status(201).json({ message: 'Session created successfully', session: newSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all that user can view
const getAllSessionsByUser = async (req, res) => {
    try {
        const sessions = await Session.find({
            sessionStatus: 'active'
        });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single session by ID
const getSessionById = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a session by ID
const updateSession = async (req, res) => {
  const { id } = req.params;
  const { sessionName, sessionStart, sessionEnd, sessionDescription, sessionStatus } = req.body;

  try {
    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { sessionName, sessionStart, sessionEnd, sessionDescription, sessionStatus },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session updated successfully', session: updatedSession });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a session by ID
const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sessionController = {
  createSession,
  getAllSessions,
  getAllSessionsByUser,
  getSessionById,
  updateSession,
  deleteSession,
};

export default sessionController;