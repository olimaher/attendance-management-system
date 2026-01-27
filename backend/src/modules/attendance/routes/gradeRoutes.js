const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Rutas de Grades
router.get('/', gradeController.getAllGrades.bind(gradeController));
router.get('/:id', gradeController.getGradeById.bind(gradeController));
router.post('/', gradeController.createGrade.bind(gradeController));
router.put('/:id', gradeController.updateGrade.bind(gradeController));
router.delete('/:id', gradeController.deleteGrade.bind(gradeController));

module.exports = router;
