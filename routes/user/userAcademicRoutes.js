import express from 'express';
import { 
  getCourseById,
  listCoursesForProgram
} from '../controllers/CourseController';
import { 
  getFacultyProgramById,
  listProgramsForFaculty
} from '../controllers/FacultyProgramController';
import { 
  getFacultyById,
  listFaculties
} from '../controllers/FacultyController';

const router = express.Router();

// User can view courses
router.get('/courses/:id', getCourseById);
router.get('/programs/:programId/courses', listCoursesForProgram);

// User can view programs
router.get('/programs/:id', getFacultyProgramById);
router.get('/faculties/:facultyId/programs', listProgramsForFaculty);

// User can view faculties
router.get('/faculties/:id', getFacultyById);
router.get('/faculties', listFaculties);

export default router;
