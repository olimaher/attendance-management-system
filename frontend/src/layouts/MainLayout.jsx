import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, Users, ClipboardCheck, BarChart3 } from 'lucide-react'

function MainLayout() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-primary-600 text-white'
      : 'text-gray-700 hover:bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-gray-900">
                Sistema de Asistencia
              </span>
            </div>

            {/* Menu */}
            <div className="flex space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive(
                  '/'
                )}`}
              >
                <Home size={20} />
                <span>Inicio</span>
              </Link>

              <Link
                to="/students"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive(
                  '/students'
                )}`}
              >
                <Users size={20} />
                <span>Estudiantes</span>
              </Link>

              <Link
                to="/attendance"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive(
                  '/attendance'
                )}`}
              >
                <ClipboardCheck size={20} />
                <span>Asistencia</span>
              </Link>

              <Link
                to="/reports"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive(
                  '/reports'
                )}`}
              >
                <BarChart3 size={20} />
                <span>Reportes</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
