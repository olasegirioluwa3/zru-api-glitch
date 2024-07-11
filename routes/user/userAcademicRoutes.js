import express from 'express';
import authenticateToken from '../../middlewares/auth.user.middleware.js';
import facultyController from '../../controllers/facultyController.js';
import courseController from '../../controllers/courseController.js';
import facultyProgramController from '../../controllers/facultyProgramController.js';
import facultyDepartmentController from '../../controllers/facultyDepartmentController.js';
import courseAllocationController from '../../controllers/courseAllocationController.js';

const router = express.Router();

export default function userAcademicRoutes(app, io, sequelize) {
    // User can view courses
    router.get('/courses/:id', authenticateToken, courseController.getActiveCourseById);
    router.get('/programs/:programId/courses', authenticateToken, courseController.listActiveCoursesForProgram);

    // User can view programs
    router.get('/programs/:id', authenticateToken, facultyProgramController.getActiveDepartmentProgramById);
    router.get('/programs', authenticateToken, facultyProgramController.listAllActivePrograms);
    router.get('/departments/:departmentId/programs', authenticateToken, facultyProgramController.listActiveProgramsForActiveDepartment);
    router.get('/faculties/:facultyId/programs', authenticateToken, facultyProgramController.listActiveProgramsForActiveFaculty);
    
    // User can view faculties
    router.get('/faculties/:id', authenticateToken, facultyController.getActiveFacultyById);
    router.get('/faculties', authenticateToken, facultyController.listAllActiveFaculties);
    
    // User can manage course allocations
    router.get('/course-allocations/:id', authenticateToken, courseAllocationController.getCourseAllocationById);
    router.get('/course-allocations', authenticateToken, courseAllocationController.listCourseAllocations);
    router.get('/programs/:programId/course-allocations', authenticateToken, courseAllocationController.listCourseAllocationsForProgram);
    
    // User can manage faculty departments
    router.get('/departments/:id', authenticateToken, facultyDepartmentController.getActiveDepartmentById);
    router.get('/departments', authenticateToken, facultyDepartmentController.listAllActiveDepartments);
    router.get('/faculties/:facultyId/departments', authenticateToken, facultyDepartmentController.listActiveDepartmentsForActiveFaculty);

    app.use('/api/user', router);
}