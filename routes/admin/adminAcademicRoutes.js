import express from 'express';
import authenticateToken from '../../middlewares/auth.admin.middleware.js';
import facultyController from '../../controllers/facultyController.js';
import facultyDepartmentController from '../../controllers/facultyDepartmentController.js'; 
import courseAllocationController from '../../controllers/courseAllocationController.js';
import courseController from '../../controllers/courseController.js';
import facultyProgramController from '../../controllers/facultyProgramController.js';
import facultyMemberController from '../../controllers/facultyMemberController.js';

const router = express.Router();
export default function adminAcademicRoutes(app, io, sequelize) {
    // Admin can manage courses
    router.post('/courses', authenticateToken, courseController.createCourse);
    router.get('/courses/:id', authenticateToken, courseController.getCourseById);
    router.put('/courses/:id', authenticateToken, courseController.updateCourse);          
    router.delete('/courses/:id', authenticateToken, courseController.deleteCourse);
    router.get('/programs/:programId/courses', authenticateToken, courseController.listCoursesForProgram);
    
    // Admin can manage faculty programs
    router.post('/programs', authenticateToken, facultyProgramController.createDepartmentProgram);
    router.get('/programs/:id', authenticateToken, facultyProgramController.getDepartmentProgramById);
    router.put('/programs/:id', authenticateToken, facultyProgramController.updateDepartmentProgram);
    router.delete('/programs/:id', authenticateToken, facultyProgramController.deleteDepartmentProgram);
    router.get('/programs', authenticateToken, facultyProgramController.listAllPrograms);
    router.get('/departments/:departmentId/programs', authenticateToken, facultyProgramController.listProgramsForDepartment);
    router.get('/faculties/:facultyId/programs', authenticateToken, facultyProgramController.listProgramsForFaculty);

    // Admin can manage faculty departments
    router.post('/departments', authenticateToken, facultyDepartmentController.createDepartment);
    router.get('/departments/:id', authenticateToken, facultyDepartmentController.getDepartmentById);
    router.put('/departments/:id', authenticateToken, facultyDepartmentController.updateDepartment);
    router.delete('/departments/:id', authenticateToken, facultyDepartmentController.deleteDepartment);
    router.get('/departments', authenticateToken, facultyDepartmentController.listAllDepartments);
    router.get('/faculties/:facultyId/departments', authenticateToken, facultyDepartmentController.listDepartmentsForFaculty);

    // Admin can manage faculties
    router.post('/faculties', authenticateToken, facultyController.createFaculty);
    router.get('/faculties/:id', authenticateToken, facultyController.getFacultyById);
    router.put('/faculties/:id', authenticateToken, facultyController.updateFaculty);
    router.delete('/faculties/:id', authenticateToken, facultyController.deleteFaculty);
    router.get('/faculties', authenticateToken, facultyController.listAllFaculties);

    // Admin can manage course allocations
    router.post('/course-allocations', authenticateToken, courseAllocationController.allocateCourse);
    router.get('/course-allocations/:id', authenticateToken, courseAllocationController.getCourseAllocationById);
    router.put('/course-allocations/:id',authenticateToken, courseAllocationController.updateCourseAllocation);
    router.delete('/course-allocations/:id', authenticateToken, courseAllocationController.deleteCourseAllocation);
    router.get('/course-allocations', authenticateToken, courseAllocationController.listCourseAllocations);
    router.get('/programs/:programId/course-allocations', authenticateToken, courseAllocationController.listCourseAllocationsForProgram);

    // Admin can manage faculty members
    router.post('/faculty-members', authenticateToken, facultyMemberController.addDepartmentMember);
    router.get('/faculty-members/:id', authenticateToken, facultyMemberController.getDepartmentMemberById);
    router.put('/faculty-members/:id', authenticateToken, facultyMemberController.updateDepartmentMember);
    router.delete('/faculty-members/:id', authenticateToken, facultyMemberController.removeDepartmentMember);
    router.get('/faculty-members', authenticateToken, facultyMemberController.listAllDepartmentMember);
    router.get('/faculties/:departmentId/faculty-members', authenticateToken, facultyMemberController.listMembersForDepartment);

    app.use('/api/admin', router);
}