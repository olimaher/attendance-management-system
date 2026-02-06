import { useState, useEffect } from 'react'
import { gradeService } from '../../services/api'

function StudentForm({ student, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    gradeId: '',
  })
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadGrades()
    if (student) {
      setFormData({
        name: student.name,
        gradeId: student.gradeId,
      })
    }
  }, [student])

  const loadGrades = async () => {
    try {
      const response = await gradeService.getAll()
      setGrades(response.data.data)
    } catch (error) {
      console.error('Error loading grades:', error)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.gradeId) {
      newErrors.gradeId = 'Debe seleccionar un grado'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({
        name: formData.name.trim(),
        gradeId: parseInt(formData.gradeId),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="label">
          Nombre del Estudiante <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ingrese el nombre completo"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Grado */}
      <div>
        <label className="label">
          Grado <span className="text-red-500">*</span>
        </label>
        <select
          className={`input-field ${errors.gradeId ? 'border-red-500' : ''}`}
          value={formData.gradeId}
          onChange={(e) =>
            setFormData({ ...formData, gradeId: e.target.value })
          }
          disabled={loading}
        >
          <option value="">Seleccione un grado</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>
        {errors.gradeId && (
          <p className="text-red-500 text-sm mt-1">{errors.gradeId}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={loading}
        >
          {loading ? 'Guardando...' : student ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

export default StudentForm
