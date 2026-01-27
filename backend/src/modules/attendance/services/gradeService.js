const prisma = require('../../../config/database');

class GradeService {
  // Obtener todos los grados activos
  async getAllGrades() {
    return await prisma.grade.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  // Obtener grado por ID
  async getGradeById(id) {
    return await prisma.grade.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // Crear nuevo grado
  async createGrade(data) {
    return await prisma.grade.create({
      data: {
        code: data.code,
        name: data.name,
        displayOrder: data.displayOrder,
        description: data.description,
        active: data.active ?? true,
      },
    });
  }

  // Actualizar grado
  async updateGrade(id, data) {
    return await prisma.grade.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.name && { name: data.name }),
        ...(data.displayOrder && { displayOrder: data.displayOrder }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });
  }

  // Eliminar grado (soft delete)
  async deleteGrade(id) {
    return await prisma.grade.update({
      where: { id: parseInt(id) },
      data: { active: false },
    });
  }
}

module.exports = new GradeService();
