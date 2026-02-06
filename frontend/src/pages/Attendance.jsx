import { useState, useEffect } from 'react'
import { studentService, attendanceService, gradeService } from '../services/api'
import { Check, X, ChevronRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

function Attendance() {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
  const [selectedGrade, setSelectedGrade] = useState('')
  const [attendances, setAttendances] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [selectedGrade])

  useEffect(() => {
    loadExistingAttendances()
  }, [selectedDate])

  const loadData = async () => {
    try {
      setLoading(true)
      const [studentsRes, gradesRes] = await Promise.all([
        selectedGrade 
          ? studentService.getByGrade(selectedGrade)
          : studentService.getAll(),
        gradeService.getAll(),
      ])
      
      setStudents(studentsRes.data.data.filter(s => s.active))
      setGrades(gradesRes.data.data)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const loadExistingAttendances = async () => {
    try {
      const response = await attendanceService.getByDate(selectedDate)
      const attendanceMap = {}
      response.data.data.forEach(att => {
        attendanceMap[att.studentId] = {
          id: att.id,
          status: att.status,
          notes: att.notes,
        }
      })
      setAttendances(attendanceMap)
    } catch (error) {
      console.error('Error loading attendances:', error)
    }
  }

  const handleAttendance = async (status) => {
    if (currentIndex >= students.length) return

    const student = students[currentIndex]
    setSaving(true)

    try {
      const data = {
        studentId: student.id,
        date: selectedDate,
        status,
        notes: null,
      }

      await attendanceService.upsert(data)
      
      setAttendances({
        ...attendances,
        [student.id]: { status, notes: null },
      })

      // Avanzar al siguiente estudiante
      if (currentIndex < students.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Error al guardar asistencia')
    } finally {
      setSaving(false)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < students.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const getProgress = () => {
    // Contar solo asistencias de estudiantes filtrados actuales
    const recordedInCurrentFilter = students.filter(
      s => attendances[s.id]
    ).length
  
    return students.length > 0 
      ? (recordedInCurrentFilter / students.length) * 100 
      : 0
  }

  const getRecordedCount = () => {
    // Contar solo asistencias de estudiantes filtrados actuales
    return students.filter(s => attendances[s.id]).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">
          No hay estudiantes registrados
          {selectedGrade && ' en este grado'}
        </p>
      </div>
    )
  }

  const currentStudent = students[currentIndex]
  const currentAttendance = attendances[currentStudent?.id]
  const nextStudent = students[currentIndex + 1]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Tomar Asistencia</h1>
        <p className="text-gray-600 mt-2">
          {format(new Date(selectedDate + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha */}
          <div>
            <label className="label">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                className="input-field pl-10"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setCurrentIndex(0)
                }}
              />
            </div>
          </div>

          {/* Grado */}
          <div>
            <label className="label">Filtrar por Grado</label>
            <select
              className="input-field"
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value)
                setCurrentIndex(0)
              }}
            >
              <option value="">Todos los grados</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progreso */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progreso: {getRecordedCount()} / {students.length} estudiantes
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(getProgress())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Estudiante Actual */}
      <div className="card">
        <div className="text-center space-y-6">
          {/* Info Estudiante */}
          <div>
            <div className="text-sm text-gray-500 mb-2">
              Estudiante {currentIndex + 1} de {students.length}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStudent.name}
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              {currentStudent.grade.name}
            </p>
          </div>

          {/* Estado Actual */}
          {currentAttendance && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50">
              <span className="text-blue-700 font-medium">
                Ya registrado: {currentAttendance.status === 'present' ? '✓ Presente' : '✗ Ausente'}
              </span>
            </div>
          )}

          {/* Botones */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAttendance('present')}
              disabled={saving}
              className="flex items-center justify-center space-x-3 py-6 px-8 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={32} />
              <span className="text-xl font-semibold">Presente</span>
            </button>

            <button
              onClick={() => handleAttendance('absent')}
              disabled={saving}
              className="flex items-center justify-center space-x-3 py-6 px-8 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={32} />
              <span className="text-xl font-semibold">Ausente</span>
            </button>
          </div>

          {/* Navegación */}
          <div className="flex justify-between pt-4">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex === students.length - 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>

          {/* Próximo Estudiante */}
          {nextStudent && (
            <div className="flex items-center justify-center space-x-2 text-gray-500 pt-4 border-t">
              <span>Siguiente:</span>
              <span className="font-medium">{nextStudent.name}</span>
              <span className="text-sm">({nextStudent.grade.name})</span>
              <ChevronRight size={16} />
            </div>
          )}

          {/* Completado */}
          {currentIndex === students.length - 1 && currentAttendance && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ Todos los estudiantes han sido registrados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Attendance
