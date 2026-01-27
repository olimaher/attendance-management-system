const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON en requests

// ==========================================
// RUTAS DE PRUEBA
// ==========================================
app.get('/', (req, res) => {
  res.json({
    message: '🎓 API Sistema de Gestión de Asistencia',
    version: '1.0.0',
    status: 'running',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ==========================================
// IMPORTAR RUTAS (Próximo paso)
// ==========================================
// TODO: Agregar rutas de módulos aquí

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// ==========================================
// MANEJO DE ERRORES
// ==========================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
  console.log('');
});
