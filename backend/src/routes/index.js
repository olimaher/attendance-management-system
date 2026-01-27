const express = require('express');
const router = express.Router();

// Importar rutas de módulos
const gradeRoutes = require('../modules/attendance/routes/gradeRoutes');
const studentRoutes = require('../modules/attendance/routes/studentRoutes');

// Montar rutas
router.use('/grades', gradeRoutes);
router.use('/students', studentRoutes);

module.exports = router;
