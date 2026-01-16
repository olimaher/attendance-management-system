# 📚 Sistema de Gestión de Asistencia Estudiantil

Sistema modular para el registro y seguimiento de asistencia de estudiantes de 4to y 5to grado.

## 🚀 Características

- ✅ Registro rápido de asistencia diaria
- 📊 Reportes semanales y mensuales
- 🔔 Alertas automáticas por ausencias recurrentes
- 📈 Visualización de datos con gráficos
- 🔄 Edición de registros de asistencia
- 💾 Exportación de datos

## 🛠️ Stack Tecnológico

### Frontend
- React 18 + Vite
- React Router v6
- Recharts (gráficos)
- TailwindCSS
- Axios

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL 15

### DevOps
- Docker + Docker Compose
- WSL2 (Ubuntu)

## 📋 Requisitos Previos

- WSL2 con Ubuntu
- Docker Desktop para Windows
- Node.js 18+ (se instalará en los contenedores)
- Git

## 🏗️ Estructura del Proyecto
```
attendance-management-system/
├── frontend/          # Aplicación React
├── backend/           # API REST con Express
├── database/          # Scripts SQL e inicialización
├── docs/              # Documentación adicional
├── docker-compose.yml # Orquestación de servicios
└── start.sh           # Script de inicio
```

## 🚀 Instalación y Uso

### Primera vez (Setup)
```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd attendance-management-system

# Dar permisos al script de inicio
chmod +x start.sh

# Iniciar el sistema
./start.sh
```

### Uso diario
```bash
# Iniciar
./start.sh

# Detener
docker-compose down
```

### Acceso a la aplicación

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000
- **Base de datos:** localhost:5432

## 📖 Documentación

Ver carpeta `docs/` para documentación detallada:
- Arquitectura del sistema
- Guía de desarrollo
- Esquema de base de datos

## 🤝 Contribución

Este es un proyecto educativo. Para sugerencias o mejoras, crear un issue.

## 📝 Licencia

MIT License

## 👨‍💻 Autor

[Tu Nombre] - [Tu GitHub]

---

**Versión:** 1.0.0  
**Estado:** En desarrollo
