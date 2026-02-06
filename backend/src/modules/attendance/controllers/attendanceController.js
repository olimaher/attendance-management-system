const attendanceService = require('../services/attendanceService');

class AttendanceController {
  // GET /api/attendances/date/:date
  async getByDate(req, res, next) {
    try {
      const { date } = req.params;
      const attendances = await attendanceService.getByDate(date);
      res.json({
        success: true,
        data: attendances,
        count: attendances.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/attendances/student/:studentId
  async getByStudent(req, res, next) {
    try {
      const { studentId } = req.params;
      const { startDate, endDate } = req.query;
      const attendances = await attendanceService.getByStudent(
        studentId,
        startDate,
        endDate
      );
      res.json({
        success: true,
        data: attendances,
        count: attendances.length,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/attendances
  async create(req, res, next) {
    try {
      const attendance = await attendanceService.create(req.body);
      res.status(201).json({
        success: true,
        data: attendance,
        message: 'Asistencia registrada exitosamente',
      });
    } catch (error) {
      if (error.message === 'El estudiante no existe') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes('Ya existe un registro')) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      next(error);
    }
  }

  // PUT /api/attendances/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const attendance = await attendanceService.update(id, req.body);
      res.json({
        success: true,
        data: attendance,
        message: 'Asistencia actualizada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/attendances/:id
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await attendanceService.delete(id);
      res.json({
        success: true,
        message: 'Asistencia eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/attendances/upsert
  async upsert(req, res, next) {
    try {
      const attendance = await attendanceService.upsert(req.body);
      res.json({
        success: true,
        data: attendance,
        message: 'Asistencia guardada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/attendances/summary
  async getSummary(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'Se requieren startDate y endDate',
        });
      }

      const summary = await attendanceService.getSummary(startDate, endDate);
      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttendanceController();
