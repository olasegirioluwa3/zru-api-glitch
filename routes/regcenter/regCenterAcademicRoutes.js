import express from 'express';
import facultyController from '../../controllers/facultyController.js';
import courseController from '../../controllers/courseController.js';
import facultyProgramController from '../../controllers/facultyProgramController.js';

const router = express.Router();
export default function regCenterAcademicRoutes(app, io, sequelize) {
  // User can view courses
  router.get('/courses/:id', courseController.getCourseById);
  router.get('/programs/:programId/courses', courseController.listCoursesForProgram);

  // User can view programs
  router.get('/programs/:id', facultyProgramController.getFacultyProgramById);
  router.get('/faculties/:facultyId/programs', facultyProgramController.listProgramsForFaculty);

  // User can view faculties
  router.get('/faculties/:id', facultyController.getFacultyById);
  router.get('/faculties', facultyController.listFaculties);
  
  app.use('/api/regcenter', router);
}
