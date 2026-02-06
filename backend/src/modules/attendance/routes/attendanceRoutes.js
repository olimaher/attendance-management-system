const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Rutas de Attendances
router.get('/date/:date', attendanceController.getByDate.bind(attendanceController));
router.get('/student/:studentId', attendanceController.getByStudent.bind(attendanceController));
router.get('/summary', attendanceController.getSummary.bind(attendanceController));
router.post('/', attendanceController.create.bind(attendanceController));
router.post('/upsert', attendanceController.upsert.bind(attendanceController));
router.put('/:id', attendanceController.update.bind(attendanceController));
router.delete('/:id', attendanceController.delete.bind(attendanceController));

module.exports = router;
