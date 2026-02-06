const prisma = require('../../../config/database');

class AttendanceService {
  // Obtener asistencias de una fecha específica
  async getByDate(date) {
    return await prisma.attendance.findMany({
      where: { date: new Date(date) },
      include: {
        student: {
          include: {
            grade: true,
          },
        },
      },
      orderBy: [
        { student: { grade: { displayOrder: 'asc' } } },
        { student: { name: 'asc' } },
      ],
    });
  }

  // Obtener asistencias por estudiante
  async getByStudent(studentId, startDate, endDate) {
    const where = {
      studentId: parseInt(studentId),
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  // Crear registro de asistencia
  async create(data) {
    // Verificar que el estudiante existe
    const student = await prisma.student.findUnique({
      where: { id: parseInt(data.studentId) },
    });

    if (!student) {
      throw new Error('El estudiante no existe');
    }

    // Verificar si ya existe registro para este estudiante en esta fecha
    const existing = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: parseInt(data.studentId),
          date: new Date(data.date),
        },
      },
    });

    if (existing) {
      throw new Error('Ya existe un registro de asistencia para este estudiante en esta fecha');
    }

    return await prisma.attendance.create({
      data: {
        studentId: parseInt(data.studentId),
        date: new Date(data.date),
        status: data.status,
        notes: data.notes,
      },
      include: {
        student: {
          include: {
            grade: true,
          },
        },
      },
    });
  }

  // Actualizar asistencia
  async update(id, data) {
    return await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        student: {
          include: {
            grade: true,
          },
        },
      },
    });
  }

  // Eliminar asistencia
  async delete(id) {
    return await prisma.attendance.delete({
      where: { id: parseInt(id) },
    });
  }

  // Crear o actualizar asistencia (upsert)
  async upsert(data) {
    const studentId = parseInt(data.studentId);
    const date = new Date(data.date);

    return await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId,
          date,
        },
      },
      update: {
        status: data.status,
        notes: data.notes,
      },
      create: {
        studentId,
        date,
        status: data.status,
        notes: data.notes,
      },
      include: {
        student: {
          include: {
            grade: true,
          },
        },
      },
    });
  }

  // Obtener resumen de asistencias por rango de fechas
  async getSummary(startDate, endDate) {
    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    const summary = {
      total: attendances.length,
      present: attendances.filter(a => a.status === 'present').length,
      absent: attendances.filter(a => a.status === 'absent').length,
    };

    return summary;
  }
}

module.exports = new AttendanceService();
