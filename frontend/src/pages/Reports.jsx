import { useState, useEffect } from 'react'
import { attendanceService, studentService } from '../services/api'
import { Calendar, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

function Reports() {
  const [startDate, setStartDate] = useState(() => {
    const date = startOfMonth(new Date())
    return format(date, 'yyyy-MM-dd')
  })
  const [endDate, setEndDate] = useState(() => {
    const date = endOfMonth(new Date())
    return format(date, 'yyyy-MM-dd')
  })
  const [summary, setSummary] = useState(null)
  const [attendances, setAttendances] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [weeklyAlerts, setWeeklyAlerts] = useState([])
  const [monthlyAlerts, setMonthlyAlerts] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const studentsRes = await studentService.getAll()
      setStudents(studentsRes.data.data)
      await loadReportData()
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const loadReportData = async () => {
    try {
      const summaryRes = await attendanceService.getSummary(startDate, endDate)
      setSummary(summaryRes.data.data)

      const attendancesPromises = []
      const currentDate = new Date(startDate + 'T00:00:00')
      const end = new Date(endDate + 'T00:00:00')

      while (currentDate <= end) {
        const dateStr = format(currentDate, 'yyyy-MM-dd')
        attendancesPromises.push(attendanceService.getByDate(dateStr))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const attendancesResults = await Promise.all(attendancesPromises)
      const allAttendances = attendancesResults.flatMap(res => res.data.data)
      setAttendances(allAttendances)

      calculateAlerts(allAttendances)
    } catch (error) {
      console.error('Error loading report data:', error)
    }
  }

  const calculateAlerts = (attendancesData) => {
    const absencesByStudent = {}

    // Usar una fecha fija real de hoy
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()
    const now = new Date(year, month, day)

    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    console.log('=== CALCULANDO ALERTAS ===')
    console.log('Fecha hoy:', format(now, 'yyyy-MM-dd'))
    console.log('Semana actual:', format(weekStart, 'yyyy-MM-dd'), 'a', format(weekEnd, 'yyyy-MM-dd'))
    console.log('Mes actual:', format(monthStart, 'yyyy-MM-dd'), 'a', format(monthEnd, 'yyyy-MM-dd'))
    console.log('Total asistencias a revisar:', attendancesData.length)

    attendancesData.forEach(att => {
      if (att.status === 'absent') {
        // Parsear fecha correctamente
        const dateString = att.date.split('T')[0] // Obtener solo YYYY-MM-DD
        const attDate = new Date(dateString + 'T00:00:00')

        console.log(`Procesando ausencia: ${att.student.name}, fecha raw: ${att.date}, fecha parseada: ${format(attDate, 'yyyy-MM-dd')}`)

        if (!absencesByStudent[att.studentId]) {
          absencesByStudent[att.studentId] = {
            student: att.student,
            weekAbsences: [],
            monthAbsences: [],
          }
        }

        // Verificar semana
        if (attDate >= weekStart && attDate <= weekEnd) {
          console.log(`  ✓ Está en semana actual (${format(weekStart, 'yyyy-MM-dd')} a ${format(weekEnd, 'yyyy-MM-dd')})`)
          absencesByStudent[att.studentId].weekAbsences.push(attDate)
        } else {
          console.log(`  ✗ NO está en semana actual (${format(attDate, 'yyyy-MM-dd')} vs ${format(weekStart, 'yyyy-MM-dd')}-${format(weekEnd, 'yyyy-MM-dd')})`)
        }

        // Verificar mes
        if (attDate >= monthStart && attDate <= monthEnd) {
          console.log(`  ✓ Está en mes actual`)
          absencesByStudent[att.studentId].monthAbsences.push(attDate)
        }
      }
    })

    const weekly = Object.values(absencesByStudent)
      .filter(item => item.weekAbsences.length >= 2)
      .map(item => ({
        student: item.student,
        count: item.weekAbsences.length,
        type: 'weekly',
        reason: item.weekAbsences.length === 2
          ? '2 ausencias esta semana'
          : `${item.weekAbsences.length} ausencias esta semana`,
      }))
      .sort((a, b) => b.count - a.count)

    const monthly = Object.values(absencesByStudent)
      .filter(item => item.monthAbsences.length >= 3)
      .map(item => ({
        student: item.student,
        count: item.monthAbsences.length,
        type: 'monthly',
        reason: `${item.monthAbsences.length} ausencias este mes`,
      }))
      .sort((a, b) => b.count - a.count)

    console.log('Alertas semanales encontradas:', weekly.length)
    weekly.forEach(a => console.log(`  - ${a.student.name}: ${a.count} ausencias`))

    console.log('Alertas mensuales encontradas:', monthly.length)
    monthly.forEach(a => console.log(`  - ${a.student.name}: ${a.count} ausencias`))

    setWeeklyAlerts(weekly)
    setMonthlyAlerts(monthly)
  }

  const getAttendanceByGrade = () => {
    const byGrade = {}

    attendances.forEach(att => {
      const gradeName = att.student.grade.name
      if (!byGrade[gradeName]) {
        byGrade[gradeName] = { present: 0, absent: 0 }
      }
      if (att.status === 'present') {
        byGrade[gradeName].present++
      } else {
        byGrade[gradeName].absent++
      }
    })

    return Object.entries(byGrade).map(([name, data]) => ({
      name,
      Presente: data.present,
      Ausente: data.absent,
    }))
  }

  const getPieData = () => {
    if (!summary) return []
    return [
      { name: 'Presente', value: summary.present, color: '#10b981' },
      { name: 'Ausente', value: summary.absent, color: '#ef4444' },
    ]
  }

  const getAbsentStudents = () => {
    return attendances
      .filter(att => att.status === 'absent')
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
      })
  }

  const handleSearch = () => {
    loadReportData()
  }

  const setQuickRange = async (range) => {
    const today = new Date()
    let start, end

    switch (range) {
      case 'today':
        start = end = today
        break
      case 'week':
        start = startOfWeek(today, { weekStartsOn: 1 })
        end = endOfWeek(today, { weekStartsOn: 1 })
        break
      case 'month':
        start = startOfMonth(today)
        end = endOfMonth(today)
        break
      default:
        return
    }

    const newStartDate = format(start, 'yyyy-MM-dd')
    const newEndDate = format(end, 'yyyy-MM-dd')

    setStartDate(newStartDate)
    setEndDate(newEndDate)

    try {
      const summaryRes = await attendanceService.getSummary(newStartDate, newEndDate)
      setSummary(summaryRes.data.data)

      const attendancesPromises = []
      const currentDate = new Date(newStartDate + 'T00:00:00')
      const endDateObj = new Date(newEndDate + 'T00:00:00')

      while (currentDate <= endDateObj) {
        const dateStr = format(currentDate, 'yyyy-MM-dd')
        attendancesPromises.push(attendanceService.getByDate(dateStr))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const attendancesResults = await Promise.all(attendancesPromises)
      const allAttendances = attendancesResults.flatMap(res => res.data.data)
      setAttendances(allAttendances)

      calculateAlerts(allAttendances)
    } catch (error) {
      console.error('Error loading quick range data:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Cargando reportes...</div>
      </div>
    )
  }

  const attendancePercentage = summary?.total > 0
    ? ((summary.present / summary.total) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="text-gray-600 mt-2">Análisis de asistencia y alertas</p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Fecha Inicio</label>
            <input
              type="date"
              className="input-field"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Fecha Fin</label>
            <input
              type="date"
              className="input-field"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button onClick={handleSearch} className="btn-primary w-full">
              Buscar
            </button>
          </div>

          <div className="flex items-end space-x-2">
            <button onClick={() => setQuickRange('today')} className="btn-secondary text-sm px-2 flex-1">
              Hoy
            </button>
            <button onClick={() => setQuickRange('week')} className="btn-secondary text-sm px-2 flex-1">
              Semana
            </button>
            <button onClick={() => setQuickRange('month')} className="btn-secondary text-sm px-2 flex-1">
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summary?.total || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Presentes</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {summary?.present || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ausentes</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {summary?.absent || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">% Asistencia</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {attendancePercentage}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asistencia por Grado */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Asistencia por Grado
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getAttendanceByGrade()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Presente" fill="#10b981" />
              <Bar dataKey="Ausente" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución Presente vs Ausente */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución General
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPieData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de Estudiantes Ausentes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Estudiantes Ausentes en el Período
          </h3>
          <span className="text-sm text-gray-600">
            {getAbsentStudents().length} estudiante(s)
          </span>
        </div>

        {getAbsentStudents().length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No hay ausencias registradas en este período</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getAbsentStudents().map((absence, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {absence.student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {absence.student.grade.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {absence.date ? format(new Date(absence.date.split('T')[0] + 'T00:00:00'), "dd 'de' MMMM", { locale: es }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {absence.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alertas */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            ⚠️ Alertas de Ausencias Recurrentes
          </h3>
          <div className="flex space-x-4 text-sm">
            <span className="text-orange-600 font-medium">
              {weeklyAlerts.length} esta semana
            </span>
            <span className="text-red-600 font-medium">
              {monthlyAlerts.length} mensuales
            </span>
          </div>
        </div>

        {weeklyAlerts.length === 0 && monthlyAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No hay alertas de ausencias recurrentes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Alertas Semanales */}
            {weeklyAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-orange-600 mb-3 flex items-center">
                  <span className="bg-orange-100 px-2 py-1 rounded">
                    ALERTAS SEMANALES (2+ ausencias esta semana)
                  </span>
                </h4>
                <div className="space-y-2">
                  {weeklyAlerts.map((alert) => (
                    <div
                      key={`weekly-${alert.student.id}`}
                      className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="text-orange-600" size={24} />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {alert.student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {alert.student.grade.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">
                          {alert.count}
                        </p>
                        <p className="text-xs text-gray-600">{alert.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alertas Mensuales */}
            {monthlyAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center">
                  <span className="bg-red-100 px-2 py-1 rounded">
                    ALERTAS MENSUALES (3+ ausencias en el período)
                  </span>
                </h4>
                <div className="space-y-2">
                  {monthlyAlerts.map((alert) => (
                    <div
                      key={`monthly-${alert.student.id}`}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="text-red-600" size={24} />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {alert.student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {alert.student.grade.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          {alert.count}
                        </p>
                        <p className="text-xs text-gray-600">{alert.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports