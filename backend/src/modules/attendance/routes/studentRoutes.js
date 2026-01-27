const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Rutas de Students
router.get('/', studentController.getAllStudents.bind(studentController));
router.get('/:id', studentController.getStudentById.bind(studentController));
router.get('/grade/:gradeId', studentController.getStudentsByGrade.bind(studentController));
router.post('/', studentController.createStudent.bind(studentController));
router.put('/:id', studentController.updateStudent.bind(studentController));
router.delete('/:id', studentController.deleteStudent.bind(studentController));

module.exports = router;
