import express from 'express';
import { 
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  listCoursesForProgram
} from '../controllers/CourseController';
import { 
  createFacultyProgram,
  getFacultyProgramById,
  updateFacultyProgram,
  deleteFacultyProgram,
  listProgramsForFaculty
} from '../controllers/FacultyProgramController';
import { 
  createFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
  listFaculties
} from '../controllers/FacultyController';
import { 
  allocateCourse,
  getCourseAllocationById,
  updateCourseAllocation,
  deleteCourseAllocation,
  listCourseAllocationsForProgram
} from '../controllers/CourseAllocationController';
import { 
  addFacultyMember,
  getFacultyMemberById,
  updateFacultyMember,
  removeFacultyMember,
  listMembersForFaculty
} from '../controllers/FacultyMemberController';

const router = express.Router();

// Admin can manage courses
router.post('/courses', createCourse);
router.get('/courses/:id', getCourseById);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.get('/programs/:programId/courses', listCoursesForProgram);

// Admin can manage faculty programs
router.post('/programs', createFacultyProgram);
router.get('/programs/:id', getFacultyProgramById);
router.put('/programs/:id', updateFacultyProgram);
router.delete('/programs/:id', deleteFacultyProgram);
router.get('/faculties/:facultyId/programs', listProgramsForFaculty);

// Admin can manage faculties
router.post('/faculties', createFaculty);
router.get('/faculties/:id', getFacultyById);
router.put('/faculties/:id', updateFaculty);
router.delete('/faculties/:id', deleteFaculty);
router.get('/faculties', listFaculties);

// Admin can manage course allocations
router.post('/course-allocations', allocateCourse);
router.get('/course-allocations/:id', getCourseAllocationById);
router.put('/course-allocations/:id', updateCourseAllocation);
router.delete('/course-allocations/:id', deleteCourseAllocation);
router.get('/programs/:programId/course-allocations', listCourseAllocationsForProgram);

// Admin can manage faculty members
router.post('/faculty-members', addFacultyMember);
router.get('/faculty-members/:id', getFacultyMemberById);
router.put('/faculty-members/:id', updateFacultyMember);
router.delete('/faculty-members/:id', removeFacultyMember);
router.get('/faculties/:facultyId/faculty-members', listMembersForFaculty);

export default router;
