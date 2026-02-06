import { useState, useEffect } from 'react'
import { studentService } from '../services/api'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import StudentForm from '../components/students/StudentForm'

function Students() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [searchTerm, students])

  const loadStudents = async () => {
    try {
      const response = await studentService.getAll()
      setStudents(response.data.data)
    } catch (error) {
      console.error('Error loading students:', error)
      alert('Error al cargar estudiantes')
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students)
      return
    }

    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(filtered)
  }

  const handleAddStudent = async (data) => {
    setActionLoading(true)
    try {
      await studentService.create(data)
      await loadStudents()
      setShowAddModal(false)
      alert('Estudiante agregado exitosamente')
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Error al agregar estudiante')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditStudent = async (data) => {
    setActionLoading(true)
    try {
      await studentService.update(selectedStudent.id, data)
      await loadStudents()
      setShowEditModal(false)
      setSelectedStudent(null)
      alert('Estudiante actualizado exitosamente')
    } catch (error) {
      console.error('Error updating student:', error)
      alert('Error al actualizar estudiante')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteStudent = async () => {
    setActionLoading(true)
    try {
      await studentService.delete(selectedStudent.id)
      await loadStudents()
      setShowDeleteDialog(false)
      setSelectedStudent(null)
      alert('Estudiante eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Error al eliminar estudiante')
    } finally {
      setActionLoading(false)
    }
  }

  const openEditModal = (student) => {
    setSelectedStudent(student)
    setShowEditModal(true)
  }

  const openDeleteDialog = (student) => {
    setSelectedStudent(student)
    setShowDeleteDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando estudiantes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Estudiantes
          </h1>
          <p className="text-gray-600 mt-2">
            {students.length} estudiantes registrados
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Agregar Estudiante</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="card">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? 'No se encontraron estudiantes'
                      : 'No hay estudiantes registrados'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {student.grade.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {student.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(student)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(student)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar */}
      <Modal
        isOpen={showAddModal}
        onClose={() => !actionLoading && setShowAddModal(false)}
        title="Agregar Estudiante"
      >
        <StudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={showEditModal}
        onClose={() => !actionLoading && setShowEditModal(false)}
        title="Editar Estudiante"
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleEditStudent}
          onCancel={() => {
            setShowEditModal(false)
            setSelectedStudent(null)
          }}
        />
      </Modal>

      {/* Dialog Eliminar */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !actionLoading && setShowDeleteDialog(false)}
        onConfirm={handleDeleteStudent}
        title="Eliminar Estudiante"
        message={`¿Está seguro de que desea eliminar a ${selectedStudent?.name}? Esta acción no se puede deshacer.`}
        loading={actionLoading}
      />
    </div>
  )
}

export default Students
