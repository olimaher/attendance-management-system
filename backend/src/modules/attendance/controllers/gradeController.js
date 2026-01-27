const gradeService = require('../services/gradeService');

class GradeController {
  // GET /api/grades - Listar todos los grados
  async getAllGrades(req, res, next) {
    try {
      const grades = await gradeService.getAllGrades();
      res.json({
        success: true,
        data: grades,
        count: grades.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/grades/:id - Obtener un grado por ID
  async getGradeById(req, res, next) {
    try {
      const { id } = req.params;
      const grade = await gradeService.getGradeById(id);
      
      if (!grade) {
        return res.status(404).json({
          success: false,
          error: 'Grado no encontrado',
        });
      }

      res.json({
        success: true,
        data: grade,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/grades - Crear nuevo grado
  async createGrade(req, res, next) {
    try {
      const grade = await gradeService.createGrade(req.body);
      res.status(201).json({
        success: true,
        data: grade,
        message: 'Grado creado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/grades/:id - Actualizar grado
  async updateGrade(req, res, next) {
    try {
      const { id } = req.params;
      const grade = await gradeService.updateGrade(id, req.body);
      res.json({
        success: true,
        data: grade,
        message: 'Grado actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/grades/:id - Eliminar grado (soft delete)
  async deleteGrade(req, res, next) {
    try {
      const { id } = req.params;
      const grade = await gradeService.deleteGrade(id);
      res.json({
        success: true,
        data: grade,
        message: 'Grado desactivado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GradeController();
