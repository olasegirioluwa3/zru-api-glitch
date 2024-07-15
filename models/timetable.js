import mongoose from 'mongoose';
import CourseAllocation from '../../courseallocation/models/courseallocation.model';
import Session from '../../session/models/session.model';

const timeTableSchema = new mongoose.Schema({
  caId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseAllocation',
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  dayoftheweek: {
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    default: 'Mon',
  },
}, {
  timestamps: true,
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);
export default TimeTable;
