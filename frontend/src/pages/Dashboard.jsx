import { useState, useEffect } from 'react'
import { gradeService, studentService } from '../services/api'
import { Users, BookOpen, TrendingUp, AlertCircle, ClipboardCheck, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGrades: 0,
    activeStudents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [gradesRes, studentsRes] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
      ])

      setStats({
        totalStudents: studentsRes.data.count,
        totalGrades: gradesRes.data.count,
        activeStudents: studentsRes.data.data.filter((s) => s.active).length,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Resumen general del sistema de asistencia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Estudiantes */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Estudiantes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Grados */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grados</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalGrades}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Estudiantes Activos */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.activeStudents}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/attendance"
            className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <ClipboardCheck className="text-blue-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Tomar Asistencia</p>
              <p className="text-sm text-gray-600">
                Registrar asistencia del día
              </p>
            </div>
          </Link>

          <Link
            to="/students"
            className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <Users className="text-green-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">
                Gestionar Estudiantes
              </p>
              <p className="text-sm text-gray-600">
                Agregar o editar estudiantes
              </p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <BarChart3 className="text-purple-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Ver Reportes</p>
              <p className="text-sm text-gray-600">
                Estadísticas y análisis
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-3 p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
            <AlertCircle className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Alertas</p>
              <p className="text-sm text-gray-600">
                0 estudiantes con ausencias recurrentes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
