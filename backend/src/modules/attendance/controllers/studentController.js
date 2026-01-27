const studentService = require('../services/studentService');

class StudentController {
  // GET /api/students - Listar todos los estudiantes
  async getAllStudents(req, res, next) {
    try {
      const students = await studentService.getAllStudents();
      res.json({
        success: true,
        data: students,
        count: students.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:id - Obtener un estudiante por ID
  async getStudentById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          error: 'Estudiante no encontrado',
        });
      }

      res.json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/grade/:gradeId - Obtener estudiantes por grado
  async getStudentsByGrade(req, res, next) {
    try {
      const { gradeId } = req.params;
      const students = await studentService.getStudentsByGrade(gradeId);
      res.json({
        success: true,
        data: students,
        count: students.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/students - Crear nuevo estudiante
  async createStudent(req, res, next) {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        data: student,
        message: 'Estudiante creado exitosamente',
      });
    } catch (error) {
      if (error.message === 'El grado especificado no existe') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      next(error);
    }
  }

  // PUT /api/students/:id - Actualizar estudiante
  async updateStudent(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentService.updateStudent(id, req.body);
      res.json({
        success: true,
        data: student,
        message: 'Estudiante actualizado exitosamente',
      });
    } catch (error) {
      if (error.message === 'El grado especificado no existe') {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      next(error);
    }
  }

  // DELETE /api/students/:id - Eliminar estudiante (soft delete)
  async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentService.deleteStudent(id);
      res.json({
        success: true,
        data: student,
        message: 'Estudiante desactivado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
