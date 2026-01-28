import { useState, useEffect } from 'react'
import { gradeService, studentService } from './services/api'

function App() {
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [gradesRes, studentsRes] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
      ])
      setGrades(gradesRes.data.data)
      setStudents(studentsRes.data.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🎓 Sistema de Gestión de Asistencia
        </h1>

        {/* Grados */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Grados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="p-4 bg-primary-50 rounded-lg text-center"
              >
                <div className="text-lg font-semibold text-primary-700">
                  {grade.name}
                </div>
                <div className="text-sm text-gray-600">{grade.code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Estudiantes */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">
            Estudiantes ({students.length})
          </h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {student.grade.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
