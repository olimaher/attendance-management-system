const prisma = require('../../../config/database');

class StudentService {
  // Obtener todos los estudiantes con información de grado
  async getAllStudents() {
    return await prisma.student.findMany({
      where: { active: true },
      include: {
        grade: true,
      },
      orderBy: [
        { grade: { displayOrder: 'asc' } },
        { name: 'asc' },
      ],
    });
  }

  // Obtener estudiante por ID
  async getStudentById(id) {
    return await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        grade: true,
      },
    });
  }

  // Obtener estudiantes por grado
  async getStudentsByGrade(gradeId) {
    return await prisma.student.findMany({
      where: {
        gradeId: parseInt(gradeId),
        active: true,
      },
      include: {
        grade: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // Crear nuevo estudiante
  async createStudent(data) {
    // Verificar que el grado existe
    const grade = await prisma.grade.findUnique({
      where: { id: parseInt(data.gradeId) },
    });

    if (!grade) {
      throw new Error('El grado especificado no existe');
    }

    return await prisma.student.create({
      data: {
        name: data.name,
        gradeId: parseInt(data.gradeId),
        active: data.active ?? true,
      },
      include: {
        grade: true,
      },
    });
  }

  // Actualizar estudiante
  async updateStudent(id, data) {
    // Si se está cambiando el grado, verificar que existe
    if (data.gradeId) {
      const grade = await prisma.grade.findUnique({
        where: { id: parseInt(data.gradeId) },
      });

      if (!grade) {
        throw new Error('El grado especificado no existe');
      }
    }

    return await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.gradeId && { gradeId: parseInt(data.gradeId) }),
        ...(data.active !== undefined && { active: data.active }),
      },
      include: {
        grade: true,
      },
    });
  }

  // Eliminar estudiante (soft delete)
  async deleteStudent(id) {
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });
  }
}

module.exports = new StudentService();
